import { driver } from '$lib/server/neo4j';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const session = driver.session();

	try {
		const res = await session.executeRead((tx) => {
			return tx.run(`
          MATCH (D:Diameter)
          RETURN D.value as diameter
        `);
		});

		let diameter = null;
		if (res?.records?.length) {
			diameter = res.records[0].get('diameter').toInt();
		}

		return { diameter };
	} finally {
		session.close();
	}
};

let ID: 'diameter' | 'rank';
export const actions: Actions = {
	compute_diameter: async () => {
		ID = 'diameter';
		const session = driver.session();

		try {
			// Compute the diameter of the graph as the longest shortest path
			// Then save the value in a Diameter Node
			const res = await session.executeWrite((tx) => {
				return tx.run(`
          MATCH (n:Entry)
          WITH collect(n) AS nodes
          UNWIND nodes as a
          UNWIND nodes as b
          WITH a,b
          WHERE id(a) < id(b)
          MATCH path=shortestPath((a)-[*]-(b))
          WITH length(path) AS diameter
          ORDER BY diameter DESC
          LIMIT 1
					MERGE (D:Diameter)
					SET D.value = diameter
					RETURN diameter
        `);
			});

			const diameter = res.records[0].get('diameter').toInt();
			return { ID, diameter };
		} finally {
			session.close();
		}
	},
	rank: async () => {
		ID = 'rank';

		const session = driver.session();

		try {
			// Saves the subgraph of entries and votes as 'network' for the PageRank
			await session.executeWrite((tx) => {
				return tx.run(`
          CALL gds.graph.project('network','Entry','LOSES_TO')
        `);
			});

			// Performs the PageRank
			const res = await session.executeWrite((tx) => {
				return tx.run(`
          CALL gds.pageRank.stream('votesNetwork')
					YIELD nodeId, score
					WITH gds.util.asNode(nodeId) as node, score
					RETURN node.title AS title, node.link as link, score
					ORDER BY score DESC, title ASC
					LIMIT 2
        `);
			});

			const ranking = [];
			for (const row of res.records) {
				ranking.push({ title: row.get('title'), link: row.get('link'), score: row.get('score') });
			}

			return { ID, ranking };
		} finally {
			session.close();
		}
	}
};
