import type { Actions } from './$types';
import { driver, type Entry } from '$lib/server/neo4j';
import { toNativeTypes } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { UrlSchema } from '$lib/server/validation';

export const load: PageServerLoad = async () => {
	const session = driver.session();

	try {
		// Get flagged entries
		const res = await session.executeRead((tx) => {
			return tx.run<{ n: Entry }>(
				`
				MATCH (n:Entry)
				WHERE n.flaggedBy IS NOT NULL AND n.flagged IS NULL
				RETURN n LIMIT 25
      `
			);
		});

		const flagged = [];
		for (const row of res.records) {
			const entry = row.get('n');
			flagged.push(toNativeTypes(entry.properties));
		}

		return {
			flagged
		};
	} catch (error) {
		return { success: false };
	} finally {
		session.close();
	}
};

export const actions: Actions = {
	unflag: async ({ request }) => {
		const formData = await request.formData();
		const link = formData.get('link');
		const validation = UrlSchema.safeParse(link);

		if (!validation.success) {
			return fail(400, { unflagError: true });
		}

		const session = driver.session();

		try {
			await session.executeWrite((tx) => {
				return tx.run(
					`
				MATCH (n:Entry)
				WHERE n.link = $link
        REMOVE n.flaggedBy, n.flagReason
				RETURN n
      `,
					{ link: validation.data }
				);
			});
			return { unflag: true };
		} catch (error) {
			return fail(400, { unflagError: true });
		} finally {
			session.close();
		}
	},
	flag: async ({ request }) => {
		const formData = await request.formData();
		const link = formData.get('link');
		const validation = UrlSchema.safeParse(link);

		if (!validation.success) {
			return fail(400, { unflagError: true });
		}

		const session = driver.session();

		try {
			await session.executeWrite((tx) => {
				return tx.run(
					`
				MATCH (n:Entry)
				WHERE n.link = $link
        SET n.flagged = True
				RETURN n
      `,
					{ link: validation.data }
				);
			});
			return { flag: true };
		} catch (error) {
			return fail(400, { flagError: true });
		} finally {
			session.close();
		}
	}
};
