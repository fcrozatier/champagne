import type { PageServerLoad } from './$types';
import { driver } from '$lib/server/neo4j';

export const load: PageServerLoad = async () => {
	const session = driver.session();
	try {
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

		// Sequence for entries
		await session.executeWrite((tx) => {
			return tx.run(`
				MERGE (s:Seq)
				ON CREATE
					SET s.value = 0
      `);
		});

		// Background job: periodically (hourly) remove stale assigned comparisons (more than 24h old)
		await session.executeWrite((tx) => {
			return tx.run(`
				CALL apoc.periodic.repeat(
				"remove-stale-assignements",
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
