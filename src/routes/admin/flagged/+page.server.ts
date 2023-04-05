import type { Actions } from './$types';
import { driver, type Entry } from '$lib/server/neo4j';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { FlagForm, validateForm } from '$lib/server/validation';

export const load: PageServerLoad = async () => {
	const session = driver.session();

	try {
		// Get flagged entries
		const res = await session.executeRead((tx) => {
			return tx.run<{ n: Entry; reason: string; token: string }>(
				`
				MATCH (n:Entry)<-[f:FLAG]-(u:User)
				WHERE n.flagged IS NULL
				RETURN n, f.reason as reason, u.token as token  LIMIT 25
      `
			);
		});

		const flagged = [];
		for (const row of res.records) {
			const entry = row.get('n');
			const reason = row.get('reason');
			const token = row.get('token');
			flagged.push({ link: entry.properties.link, title: entry.properties.title, reason, token });
		}

		return {
			flagged
		};
	} catch (error) {
		return { error: true };
	} finally {
		session.close();
	}
};

export const actions: Actions = {
	unflag: async ({ request }) => {
		const validation = await validateForm(request, FlagForm);
		if (!validation.success) {
			return fail(400, { unflagError: true });
		}

		const session = driver.session();

		try {
			await session.executeWrite((tx) => {
				return tx.run(
					`
				MATCH (n:Entry)<-[f:FLAG]-(u:User)
				WHERE n.link = $link AND u.token = $userToken
        DELETE f
      `,
					{ link: validation.data.link, userToken: validation.data.userToken }
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
		const validation = await validateForm(request, FlagForm);
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
					{ link: validation.data.link }
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
