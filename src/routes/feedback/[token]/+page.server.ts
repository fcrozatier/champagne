import { driver } from '$lib/server/neo4j';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { token } = event.params;

	const session = driver.session();

	try {
		// Find user's feedbacks
		const res = await session.executeRead((tx) => {
			return tx.run(
				`
				MATCH (u:User)-[:CREATED]->(:Entry)-[:FEEDBACK]->(f:Feedback)
				WHERE u.token = $token
				RETURN f.value as feedback
      `,
				{
					token
				}
			);
		});

		if (!res?.records?.length) {
			return { invalidToken: true };
		}

		const feedbacks: string[] = [];

		for (const row of res.records) {
			feedbacks.push(row.get('feedback') as string);
		}

		return { feedbacks };
	} catch (error) {
		console.log(error);
		throw error;
	} finally {
		session.close();
	}
};
