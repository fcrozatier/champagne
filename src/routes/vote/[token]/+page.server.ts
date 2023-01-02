import { driver, type Entry } from '$lib/server/neo4j';
import { toNativeTypes } from '$lib/utils';
import type { PageServerLoad } from './$types';

interface AssignedEntries {
	n1: Entry;
	n2: Entry;
}

export const load: PageServerLoad = async ({ params, cookies }) => {
	const { token } = params;

	const session = driver.session();

	try {
		// Find user and his already assigned entries
		const res = await session.executeRead((tx) => {
			return tx.run(
				`
				MATCH (u:User)
				WHERE u.token = $token
				MATCH (n1)-[r:ASSIGNED]-(n2)
				WHERE r.userToken = $token
				RETURN u, r, n1, n2
				LIMIT 1
      `,
				{
					token
				}
			);
		});

		if (res.records.length === 0) {
			return { userNotFound: true };
		} else if (res.records[0].has('r')) {
			const row = res.records[0];
			console.log('already assigned');
			// Return previously assigned entries
			return {
				entries: [toNativeTypes(row.get('n1').properties), toNativeTypes(row.get('n2').properties)]
			};
		}

		cookies.set('token', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
			maxAge: 1000 * 60 * 60 * 24 * 30
		});

		// Assign entries
		const assigned = await session.executeWrite((tx) => {
			// Find two entries not created by user,
			// not related yet
			// who are a given number appart (depends on the step)
			// limit to one such pair
			// and assign the comparison to user
			return tx.run<AssignedEntries>(
				`
        MATCH (u1:Creator)-[:CREATED]->(n1:Entry), (n2:Entry)<-[:CREATED]-(u2:Creator)
				WHERE NOT (n1)--(n2)
				AND NOT u1.token = $token
				AND NOT u2.token = $token
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
