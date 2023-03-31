import { driver, type Entry, type UserProperties } from '$lib/server/neo4j';
import { toNativeTypes, voteOpen } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { PUBLIC_RATE_LIMIT } from '$env/static/public';
import { FlagSchema, validateForm } from '$lib/server/validation';

interface AssignedEntries {
	n1: Entry;
	n2: Entry;
}

export const load: PageServerLoad = async (event) => {
	const { token } = await event.parent();
	if (!voteOpen()) {
		throw redirect(302, `/vote/${token}`);
	}
	const { category } = event.params;

	const session = driver.session();

	try {
		// Find already assigned entries
		// in the current category (if any)
		const prev = await session.executeRead((tx) => {
			return tx.run<AssignedEntries>(
				`
				MATCH (n1:Entry)-[r:ASSIGNED]-(n2:Entry)
				WHERE r.userToken = $token AND n1.category = $category AND n2.category = $category
				RETURN r, n1, n2
				LIMIT 1
      `,
				{
					token,
					category
				}
			);
		});

		if (prev?.records[0]?.has('r')) {
			const row = prev.records[0];

			// Return previously assigned entries
			return {
				entries: [toNativeTypes(row.get('n1').properties), toNativeTypes(row.get('n2').properties)]
			};
		}

		// Otherwise try to assign new entries from :NOT_ASSIGNED ones
		// in the current category
		// not created by user
		// not flagged by user
		const notAssigned = await session.executeWrite((tx) => {
			return tx.run<AssignedEntries>(
				`
				MATCH (u:User)
				WHERE u.token = $token
				OPTIONAL MATCH (u:User)-[:FLAG]->(n:Entry)
				WITH u, n
				MATCH (u1:Creator)-[:CREATED]->(n1:Entry)-[r:NOT_ASSIGNED]-(n2:Entry)<-[:CREATED]-(u2:Creator)
				WHERE n1.category = $category
				AND n2.category = $category
				AND NOT u1.token = $token
				AND NOT u2.token = $token
				AND (n IS NULL OR NOT n1 = n)
				AND (n IS NULL OR NOT n2 = n)
				WITH r, n1, n2
				LIMIT 1
				DELETE r
				MERGE (n1)-[:ASSIGNED {userToken: $token, timestamp: timestamp()}]->(n2)
        RETURN n1, n2
      `,
				{
					token,
					category
				}
			);
		});

		if (notAssigned?.records[0]?.has('r')) {
			const row = notAssigned.records[0];

			// Return new assigned entries
			return {
				entries: [toNativeTypes(row.get('n1').properties), toNativeTypes(row.get('n2').properties)]
			};
		}

		// If we cannot find a pair of :NOT_ASSIGNED entries to compare, we are past the first round, and now duplicating votes to increase reliability.
		// Try to find entries with only :Step number of relations (:LOSES_TO+:ASSIGNED)
		// in the current category
		// not created by user
		// not flagged (confirmed) at a previous stage
		// not flagged (unconfirmed) by user
		// not already voted for by user
		const duplicate = await session.executeWrite((tx) => {
			return tx.run<AssignedEntries>(
				`
				MATCH (s:Step)
				WHERE s.category = $category
				WITH s.value AS step
				MATCH (u:User)
				WHERE u.token = $token
				OPTIONAL MATCH (u:User)-[:FLAG]->(n:Entry)
				WITH u, n, step
				MATCH (u1:Creator)-[:CREATED]->(n1:Entry)-[r]-(n2:Entry)<-[:CREATED]-(u2:Creator)
				WHERE n1.category = $category
				AND n2.category = $category
				AND NOT u1.token = u.token
				AND NOT u2.token = u.token
				AND (n IS NULL OR NOT n1 = n)
				AND (n IS NULL OR NOT n2 = n)
				AND n1.flagged IS NULL
				AND n2.flagged IS NULL
				AND NOT r.userToken = $token
				WITH n1, n2, count(r) AS rel, step
				WHERE rel = step
				WITH n1, n2
				LIMIT 1
				MERGE (n1)-[:ASSIGNED {userToken: $token, timestamp: timestamp()}]->(n2)
        RETURN n1, n2
      `,
				{
					token,
					category
				}
			);
		});

		if (duplicate?.records[0]?.has('r')) {
			const row = duplicate.records[0];

			// Return new assigned entries
			return {
				entries: [toNativeTypes(row.get('n1').properties), toNativeTypes(row.get('n2').properties)]
			};
		}

		// If we cannot find an entry with s:Step number of relations then the graph is regular,
		// We can increase the step in the category and start again
		await session.executeWrite((tx) => {
			return tx.run(
				`
				MATCH (s:Step)
				WHERE s.category = $category
				CALL apoc.atomic.add(s, 'value', 1)
				YIELD oldValue, newValue
				RETURN newValue
				`,
				{ category }
			);
		});

		return await load(event);
	} catch (error) {
		console.log(error);
		throw error;
	} finally {
		session.close();
	}
};

let id: 'FLAG' | 'VOTE';

export const actions: Actions = {
	flag: async ({ request, locals }) => {
		id = 'FLAG';

		const validation = await validateForm(request, FlagSchema);
		if (!validation.success) {
			console.log(validation.error.flatten());
			return fail(400, { id, flagFail: true });
		}

		const session = driver.session();

		try {
			// Flag entry and remove assignment
			await session.executeWrite((tx) => {
				return tx.run(
					`
				MATCH (u:User)
				WHERE u.token = $token
				WITH u
				MATCH (n1:Entry)-[r:ASSIGNED]-(n2:Entry)
				WHERE n1.link = $link AND r.userToken = $token
				SET n1.flaggedBy = $token, n1.flagReason = $reason
				DELETE r
				MERGE (u)-[:FLAG]->(n1)-[:NOT_ASSIGNED]->(n2)
			`,
					{
						link: validation.data.link,
						reason: validation.data.reason,
						token: locals.token
					}
				);
			});
			return { id, flagSuccess: true };
		} catch (error) {
			return fail(400, { id, flagFail: true });
		} finally {
			session.close();
		}
	},
	vote: async ({ request, locals, params }) => {
		id = 'VOTE';
		const token = locals.token;
		const { category } = params;

		const data = await request.formData();
		const entryNumberA = data.get('entry-0');
		const entryNumberB = data.get('entry-1');
		const feedbackA = data.get('feedback-0');
		const feedbackB = data.get('feedback-1');
		const choice = data.get('choice');

		if (
			!entryNumberA ||
			!entryNumberB ||
			!feedbackA ||
			!feedbackB ||
			!choice ||
			typeof entryNumberA !== 'string' ||
			typeof entryNumberB !== 'string' ||
			typeof feedbackA !== 'string' ||
			typeof feedbackB !== 'string' ||
			typeof choice !== 'string'
		) {
			return fail(400, { id, voteFail: true });
		}

		const session = driver.session();

		try {
			// Should the arrow go from A to B ?
			const AToB = choice === entryNumberB;
			const losingEntryNumber = AToB ? +entryNumberA : +entryNumberB;
			const winningEntryNumber = AToB ? +entryNumberB : +entryNumberA;
			const losingFeedback = AToB ? feedbackA : feedbackB;
			const winningFeedback = AToB ? feedbackB : feedbackA;

			// Rate limit : as least PUBLIC_RATE_LIMIT minutes between two votes
			const user = await session.executeRead((tx) => {
				return tx.run(
					`
				MATCH (u:User)
				WHERE u.token = $token
				RETURN u
			`,
					{
						token
					}
				);
			});

			if (!user?.records?.length) {
				return fail(400, { id, voteFail: true });
			} else {
				const row = user.records[0];
				const u = toNativeTypes(row.get('u').properties) as UserProperties;

				if (u.lastVote) {
					const now = Date.now();
					const lastVote = Date.parse(u.lastVote);

					if (now - lastVote < 1000 * 60 * parseInt(PUBLIC_RATE_LIMIT)) {
						return fail(422, { id, rateLimitError: true });
					}
				}
			}

			// Make sure vote was assigned, take vote into account and remove assignment
			await session.executeWrite((tx) => {
				tx.run(
					`
				MATCH (e1:Entry)-[a:ASSIGNED]-(e2:Entry)
				WHERE e1.number = $losingEntryNumber AND e1.category = $category
				AND e2.number = $winningEntryNumber AND e2.category = $category
				AND a.userToken = $token
				DELETE a
				CREATE (f1:Feedback {userToken: $token})<-[:FEEDBACK]-(e1)-[r:LOSES_TO {userToken: $token, timestamp: timestamp()}]->(e2)-[:FEEDBACK]->(f2:Feedback {userToken: $token})
				SET f1.value = $losingFeedback, f2.value = $winningFeedback
				RETURN r
			`,
					{
						category,
						token,
						losingEntryNumber,
						winningEntryNumber,
						losingFeedback,
						winningFeedback
					}
				);

				// The vote was recorded so save lastVote time
				return tx.run(
					`
				MATCH (u:User)
				WHERE u.token = $token
				SET u.lastVote = datetime()
				RETURN u
			`,
					{
						token
					}
				);
			});

			return { id, voteSuccess: true };
		} catch (error) {
			console.log(error);
			return fail(400, { id, voteFail: true });
		} finally {
			session.close();
		}
	}
};
