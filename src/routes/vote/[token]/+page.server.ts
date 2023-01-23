import { driver, type Entry, type UserProperties } from '$lib/server/neo4j';
import { toNativeTypes } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { PUBLIC_VOTES_DELTA } from '$env/static/public';
import { Neo4jError } from 'neo4j-driver';

interface AssignedEntries {
	n1: Entry;
	n2: Entry;
}

export const load = (async (event) => {
	const { token } = event.params;

	event.cookies.set('token', token, {
		path: '/',
		maxAge: 1000 * 60 * 60 * 24 * 30 // 1 month
	});

	const session = driver.session();

	try {
		// Find user
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
			return { userNotFound: true };
		}

		// Find already assigned entries (if any)
		const prev = await session.executeRead((tx) => {
			return tx.run(
				`
				MATCH (n1:Entry)-[r:ASSIGNED]-(n2:Entry)
				WHERE r.userToken = $token
				RETURN r, n1, n2
				LIMIT 1
      `,
				{
					token
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

		// Otherwise assign new entries
		const assigned = await session.executeWrite((tx) => {
			// Grab a step number and the graph size (not necessarily the latest step: this allows user1 to start step k while user2 can still rank entries at step k-1)
			// But still try older steps first (by id) to ensure the graph is regular (no relations missing at step k-1).
			// Then find two entries not created by this user,
			// not related yet (assigned or ranked)
			// not flagged
			// who are a given number apart based on the step (for NodeRank graph)
			// limit to one such pair
			// and assign the comparison to user
			return tx.run<AssignedEntries>(
				`
				MATCH (s:Step), (seq:Seq)
				WITH s.value as step, seq.value as size
				ORDER BY id(s)
        MATCH (u1:Creator)-[:CREATED]->(n1:Entry), (n2:Entry)<-[:CREATED]-(u2:Creator)
				WHERE NOT (n1)--(n2)
				AND NOT u1.token = $token
				AND NOT u2.token = $token
				AND n1.flaggedBy IS NULL
				AND n2.flaggedBy IS NULL
				AND n1.number = (n2.number + step) % size
				WITH n1, n2
				LIMIT 1
				CREATE (n1)-[:ASSIGNED {userToken: $token, timestamp: timestamp()}]->(n2)
        RETURN n1, n2
				LIMIT 1
				`,
				{
					token
				}
			);
		});

		if (assigned?.records?.length) {
			const row = assigned.records[0];
			return {
				entries: [toNativeTypes(row.get('n1').properties), toNativeTypes(row.get('n2').properties)]
			};
		} else {
			// If we cannot find a pair of entries to compare, we've exhausted the pairings for the current step of the algorithm. Two possibilities :
			// 1. stop the vote if there are enough steps
			// 2. create a new step with value not already listed (see uniqueness constraints)

			const steps = await session.executeRead((tx) => {
				return tx.run(`
				MATCH (s:Step), (seq:Seq)
				RETURN count(s) as count, seq.value / 2 as max_rounds
				`);
			});
			// There is always at least one Step node provided by /admin/db-setup
			const count = steps.records[0].get('count').toInt() as number;
			// There cannot be more than N/2 steps since at this stage we have a complete graph
			const maxRounds = steps.records[0].get('max_rounds').toInt() as number;

			if (count >= maxRounds) {
				return { stopVote: true };
			}

			// Find the graph size and the last step in the sequence
			// Create a new step with value given by the random strategy (see https://github.com/fcrozatier/NodeRank#conclusion)
			await session.executeWrite((tx) => {
				return tx.run(`
				MATCH (s:Seq), (current:Step)
				WHERE NOT (current)-->(:Step)
				WITH s.value as size, current
				CREATE (current)-[:NEXT]->(newStep:Step {value: 1 + toInteger(rand() * size / 2)})
				`);
			});

			// Now that there is a new step in the algorithm let's try again to find entries to compare
			await load(event);
		}
	} catch (error) {
		console.log(error);

		if (
			error instanceof Neo4jError &&
			error.code === 'Neo.ClientError.Schema.ConstraintValidationFailed'
		) {
			// If we couldn't create a new step because the random value is already another Step value then reload the page to re-toss and try again
			if (error.message.includes('Step') && error.message.includes('value')) {
				await load(event);
			}
		}
	} finally {
		session.close();
	}

	return { token };
}) satisfies PageServerLoad;

let id: 'FLAG' | 'VOTE';

export const actions: Actions = {
	flag: async ({ request, cookies }) => {
		id = 'FLAG';
		const token = cookies.get('token');
		const data = await request.formData();
		const flagged = data.get('flagged');

		if (!flagged || typeof flagged !== 'string') {
			return fail(400, { id, flagFail: true });
		}

		const session = driver.session();

		try {
			// Find user
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

			if (user.records.length === 0) {
				return fail(400, { id, flagFail: true });
			}

			// Flag entry and remove assignment
			await session.executeWrite((tx) => {
				return tx.run(
					`
				MATCH (e:Entry)-[r:ASSIGNED]-(:Entry)
				WHERE e.link = $link AND r.userToken = $token
				SET e.flaggedBy = $token
				DELETE r
			`,
					{
						link: flagged,
						token
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
	vote: async ({ request, cookies }) => {
		id = 'VOTE';
		const token = cookies.get('token');

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

			// Find user
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

			if (user.records.length === 0) {
				return fail(400, { id, voteFail: true });
			} else {
				// Rate limit : as least PUBLIC_VOTES_DELTA minutes between two votes
				const row = user.records[0];
				const u = toNativeTypes(row.get('u').properties) as UserProperties;

				if (u.lastVote) {
					const now = Date.now();
					const lastVote = Date.parse(u.lastVote);

					if (now - lastVote < 1000 * 60 * parseInt(PUBLIC_VOTES_DELTA)) {
						return fail(422, { id, rateLimitError: true });
					}
				}
			}

			// Make sure vote was assigned, take vote into account and remove assignment
			const vote = await session.executeWrite((tx) => {
				return tx.run(
					`
				MATCH (e1:Entry)-[a:ASSIGNED]-(e2:Entry)
				WHERE e1.number = $losingEntryNumber AND a.userToken = $token AND e2.number = $winningEntryNumber
				DELETE a
				CREATE (f1:Feedback {userToken: $token})<-[:FEEDBACK]-(e1)-[r:LOSES_TO {userToken: $token, timestamp: timestamp()}]->(e2)-[:FEEDBACK]->(f2:Feedback {userToken: $token})
				SET f1.value = $losingFeedback, f2.value = $winningFeedback
				RETURN r
			`,
					{
						token,
						losingEntryNumber,
						winningEntryNumber,
						losingFeedback,
						winningFeedback
					}
				);
			});

			if (vote.records.length !== 0) {
				// The vote was recorded so save lastVote time
				await session.executeWrite((tx) => {
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
			}

			return { id, voteSuccess: true };
		} catch (error) {
			console.log(error);
			return fail(400, { id, voteFail: true });
		} finally {
			session.close();
		}
	}
};
