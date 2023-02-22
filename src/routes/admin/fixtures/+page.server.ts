import type { PageServerLoad } from './$types';
import { driver } from '$lib/server/neo4j';
import { makeCreators } from '$lib/server/fixtures';
import { dev } from '$app/environment';
import { categories } from '$lib/categories';

export const load: PageServerLoad = async () => {
	if (!dev) return;

	const session = driver.session();
	const creatorsData = makeCreators(5);

	try {
		await session.executeWrite((tx) => {
			return tx.run(
				`
	UNWIND $creatorsData as data
	WITH data
  CREATE (u:User:Creator {email: data.email})-[:CREATED]->(e:Entry {title: data.title, description: data.description, category: data.category, link: data.link, number: toInteger(data.number)})
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
	MATCH (s:Seq) WHERE s.category = $category
	SET s.value = size($creatorsData)
  `,
				{
					category: categories[0],
					creatorsData
				}
			);
		});

		return { success: true };
	} catch (error) {
		console.log("couldn't add fixtures", error);
		return { success: false };
	} finally {
		session.close();
	}
};
