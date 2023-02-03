import { driver } from '$lib/server/neo4j';
import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { isAdmin } = await parent();
	if (!isAdmin) {
		throw error(401, 'Not authorized');
	}
};

export const actions: Actions = {
	rank: async () => {
		const session = driver.session();

		try {
			// Checks whether the subgraph projection already exists
			const projection = await session.executeRead((tx) => {
				return tx.run(`
          CALL gds.graph.exists('network')
					YIELD graphName, exists
					RETURN exists
        `);
			});

			if (!projection.records[0].get('exists')) {
				// Saves the subgraph of Entries and Votes as 'network' for the PageRank
				await session.executeWrite((tx) => {
					return tx.run(`
          CALL gds.graph.project('network','Entry','LOSES_TO')
					`);
				});
			}

			// Performs the PageRank
			const res = await session.executeWrite((tx) => {
				return tx.run(`
          CALL gds.pageRank.stream('network')
					YIELD nodeId, score
					WITH gds.util.asNode(nodeId) as node, score
					RETURN node.title AS title, node.link as link, score
					ORDER BY score DESC, title ASC
					LIMIT 100
        `);
			});

			const ranking = [];
			for (const row of res.records) {
				ranking.push({
					title: row.get('title') as string,
					link: row.get('link') as string,
					score: row.get('score') as number
				});
			}

			return { ranking };
		} finally {
			session.close();
		}
	}
};
