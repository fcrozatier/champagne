import type { PageServerLoad } from './$types';
import { driver } from '$lib/server/neo4j';
import { makeCreators } from '$lib/server/fixtures';
import { dev } from '$app/environment';

export const load: PageServerLoad = async () => {
	if (!dev) return;

	const session = driver.session();
	const creatorsData = makeCreators(5);

	try {
		await session.executeWrite((tx) => {
			return tx.run(
				`
	UNWIND $creatorsData as data
	MATCH (s:Seq)
	WITH data, s
  CREATE (u:User:Creator {email: data.email})-[:CREATED]->(e:Entry {title: data.title, description: data.description, link: data.link, entry: data.entry, number: toInteger(data.number)})
	SET e.points = 1, u.token = randomUUID()
  `,
				{
					creatorsData
				}
			);
		});
		await session.executeWrite((tx) => {
			return tx.run(
				`
	MATCH (s:Seq)
	SET s.value = size($creatorsData)
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
