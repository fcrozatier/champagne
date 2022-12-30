import { driver } from '$lib/server/neo4j';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { token } = params;

	const session = driver.session();

	try {
		// Find user
		const res = await session.executeRead((tx) => {
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

		if (res.records.length === 0) {
			return { userNotFound: true };
		}

		// Assign entries
		await session.executeRead((tx) => {
			return tx.run(
				`
        MATCH (n1:Entry), (n2:Entry)
        WHERE NOT (n1)--(n2)
        AND n1.number = n2.number + 1
        CREATE (n1)-[:ASSIGNED {userToken: $token, timestamp: timestamp()}]->(n2)
        RETURN n1, n2
      `,
				{
					token
				}
			);
		});
	} catch (error) {
		console.log(error);
	} finally {
		session.close();
	}

	return { token };
};
