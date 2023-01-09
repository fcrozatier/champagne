import { driver, type Entry } from '$lib/server/neo4j';
import { toNativeTypes } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

interface AssignedEntries {
	n1: Entry;
	n2: Entry;
}

export const load: PageServerLoad = async ({ params, cookies }) => {
	const { token } = params;

	cookies.set('token', token, {
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

		if (user.records.length === 0) {
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

		if (prev.records.length !== 0 && prev.records[0].has('r')) {
			const row = prev.records[0];

			// Return previously assigned entries
			return {
				entries: [toNativeTypes(row.get('n1').properties), toNativeTypes(row.get('n2').properties)]
			};
		}

		// Assign entries
		const assigned = await session.executeWrite((tx) => {
			// Find two entries not created by user,
			// not related yet
			// not flagged
			// who are a given number appart (depends on the step)
			// limit to one such pair
			// and assign the comparison to user
			return tx.run<AssignedEntries>(
				`
        MATCH (u1:Creator)-[:CREATED]->(n1:Entry), (n2:Entry)<-[:CREATED]-(u2:Creator)
				WHERE NOT (n1)--(n2)
				AND NOT u1.token = $token
				AND NOT u2.token = $token
				AND n1.flaggedBy IS NULL
				AND n2.flaggedBy IS NULL
				AND n1.number = n2.number + 1
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

		if (assigned.records.length !== 0) {
			const row = assigned.records[0];
			return {
				entries: [toNativeTypes(row.get('n1').properties), toNativeTypes(row.get('n2').properties)]
			};
		}
	} catch (error) {
		console.log(error);
	} finally {
		session.close();
	}

	return { token };
};

export const actions: Actions = {
	flag: async ({ request, cookies }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const flagged = data.get('flagged');

		if (!flagged || typeof flagged !== 'string') {
			return fail(400, { flagFail: true });
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
				return { flagFail: true };
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
			return { flagSuccess: true };
		} catch (error) {
			return fail(400, { flagFail: true });
		} finally {
			session.close();
		}
	}
};
