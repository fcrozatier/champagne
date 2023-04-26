import { driver } from '$lib/server/neo4j';
import { error, fail } from '@sveltejs/kit';
import { categories } from '$lib/config';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import type { Integer } from 'neo4j-driver';
import { EdgesSchema } from '$lib/server/validation';

export const load: PageServerLoad = async ({ parent }) => {
	const { isAdmin } = await parent();
	if (!isAdmin) {
		throw error(401, 'Not authorized');
	}

	const session = driver.session();

	try {
		const data = await session.executeRead((tx) => {
			return tx.run<{ category: string; count: Integer }>(
				`
				UNWIND $categories as category
				MATCH (n:Entry)
				WHERE n.category = category
				RETURN category, count(n) as count
			`,
				{
					categories
				}
			);
		});

		const judges = await session.executeRead((tx) => {
			return tx.run<{ judges: Integer }>(
				`
				MATCH (n:Judge)
				RETURN count(n) as judges
			`
			);
		});

		const pairings = await session.executeRead((tx) => {
			return tx.run<{ graph: Integer }>(
				`
				MATCH (n:Graph)
				RETURN n
			`
			);
		});

		const analytics = [];
		for (const row of data.records) {
			analytics.push({ category: row.get('category'), count: row.get('count').toNumber() });
		}

		return {
			analytics,
			pairings: pairings.records.length > 0,
			judges: judges.records[0].get('judges').toNumber()
		};
	} finally {
		session.close();
	}
};

export const actions: Actions = {
	pairing: async ({ request }) => {
		const data = await request.formData();

		const edges = data.get('edges');
		if (!edges || typeof edges !== 'string') {
			return fail(400);
		}

		const validation = EdgesSchema.safeParse(JSON.parse(edges));
		if (!validation.success) {
			return fail(400, validation.error.flatten());
		}

		const session = driver.session();

		try {
			await session.executeWrite((tx) => {
				return tx.run(
					`
		      UNWIND $data as graph
					WITH graph.category as category, graph.edges as edges
					UNWIND edges as edge
					MATCH (n:Entry), (m:Entry)
					WHERE n.category = category
					AND m.category = category
					AND n.number = edge[0]
					AND m.number = edge[1]
					MERGE (n)-[:NOT_ASSIGNED]->(m)
		    `,
					{
						data: validation.data
					}
				);
			});
			await session.executeWrite((tx) => {
				return tx.run(
					`
					MERGE (n:Graph)
		    `,
					{
						data: validation.data
					}
				);
			});

			return { success: true };
		} catch (e) {
			console.error(e);
			return fail(400);
		} finally {
			session.close();
		}
	}
};
