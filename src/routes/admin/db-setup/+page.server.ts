import type { PageServerLoad } from './$types';
import { driver } from '$lib/server/neo4j';
import { categories } from '$lib/categories';

export const load: PageServerLoad = async () => {
	const session = driver.session();
	try {
		// For NodeRank pairing graph: which nodes should be compared? Starts with i and i + 1
		await session.executeWrite((tx) => {
			return tx.run(`
				MERGE (s:Step)
				ON CREATE
					SET s.value = 1
      `);
		});

		// Uniqueness
		await session.executeWrite((tx) => {
			return tx.run(`
				CREATE CONSTRAINT StepUnique
				IF NOT EXISTS
				FOR (s:Step)
				REQUIRE s.value IS UNIQUE;
      `);
		});

		await session.executeWrite((tx) => {
			return tx.run(`
				CREATE CONSTRAINT UserEmailUnique
				IF NOT EXISTS
				FOR (user:User)
				REQUIRE user.email IS UNIQUE;
      `);
		});

		await session.executeWrite((tx) => {
			return tx.run(`
				CREATE CONSTRAINT EntryLinkUnique
				IF NOT EXISTS
				FOR (entry:Entry)
				REQUIRE entry.link IS UNIQUE;
      `);
		});

		// Indexes
		await session.executeWrite((tx) => {
			return tx.run(`
				CREATE INDEX UserTokenIndex
				IF NOT EXISTS
				FOR (user:User)
				ON user.token;
      `);
		});

		await session.executeWrite((tx) => {
			return tx.run(`
				CREATE INDEX EntryNumberIndex
				IF NOT EXISTS
				FOR (entry:Entry)
				ON entry.number;
      `);
		});

		// Sequence for counting entries and updating their number
		for (const category of categories) {
			await session.executeWrite((tx) => {
				return tx.run(
					`
					MERGE (s:Seq {category:$category})
					ON CREATE
						SET s.value = 0
				`,
					{
						category
					}
				);
			});
		}

		// Background job: periodically (hourly) remove stale assigned comparisons (more than 24h old)
		await session.executeWrite((tx) => {
			return tx.run(`
				CALL apoc.periodic.repeat(
				"remove-stale-assignments",
					"MATCH ()-[r:ASSIGNED]->() WHERE r.timestamp < timestamp() - 1000 * 60 * 30 DELETE r",
					60 * 5
				);
      `);
		});

		return { success: true };
	} catch (error) {
		console.log(error);
		return { success: false };
	} finally {
		session.close();
	}
};
