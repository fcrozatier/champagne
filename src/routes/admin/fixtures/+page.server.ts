import type { PageServerLoad } from './$types';
import { driver } from '$lib/server/neo4j';
import { creatorsData } from '$lib/server/fixtures';
import { dev } from '$app/environment';

export const load: PageServerLoad = async () => {
	if (!dev) return;
	const session = driver.session();

	try {
		await session.executeWrite((tx) => {
			return tx.run(
				`
	UNWIND $creatorsData as creatorData
	MATCH (s:Seq)
	CALL apoc.atomic.add(s, 'value', 1, 10)
	YIELD newValue as seq
  CREATE (u:User:Creator {email: creatorData.email})-[:CREATED]->(e:Entry {title: creatorData.title, description: creatorData.description, link: creatorData.link, entry: creatorData.entry})
	SET e.number = seq, e.points = 1, u.token = randomUUID()
	RETURN u, e
  `,
				{
					creatorsData
				}
			);
		});

		return { success: true };
	} catch (error) {
		console.log('could add fixtures', error);
		return { success: false };
	} finally {
		session.close();
	}
};
