import type { PageServerLoad } from './$types';
import { driver } from '$lib/noe4j.server';

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

		return { success: true };
	} catch (error) {
		console.log(error);
		return { success: false };
	} finally {
		session.close();
	}
};