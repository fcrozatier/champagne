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
			return tx.run<{ n: Entry; reason: string; email: string }>(
				`
				MATCH (n:Entry)<-[f:FLAG]-(u:User)
				RETURN n, f.reason as reason, u.email as email LIMIT 100
      `
			);
		});

		const flagged = [];
		for (const row of res.records) {
			const entry = row.get('n');
			const reason = row.get('reason');
			const email = row.get('email');
			flagged.push({ link: entry.properties.link, title: entry.properties.title, reason, email });
		}

		return { flagged };
	} catch (error) {
		return { error: true };
	} finally {
		await session.close();
	}
};

export const actions: Actions = {
	ignore: async ({ request }) => {
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
				WHERE n.link = $link AND u.email = $email
        DELETE f
      `,
					{ link: validation.data.link, email: validation.data.email }
				);
			});
			return { unflag: true };
		} catch (error) {
			return fail(400, { unflagError: true });
		} finally {
			await session.close();
		}
	},
	remove: async ({ request }) => {
		const validation = await validateForm(request, FlagForm);
		if (!validation.success) {
			return fail(400, { unflagError: true });
		}

		const session = driver.session();

		try {
			await session.executeWrite((tx) => {
				return tx.run(
					`
				MATCH (n:Entry)-[:FEEDBACK]->(f:Feedback)
				WHERE n.link = $link
				DETACH DELETE n
				DETACH DELETE f
      `,
					{ link: validation.data.link }
				);
			});
			return { flag: true };
		} catch (error) {
			return fail(400, { flagError: true });
		} finally {
			await session.close();
		}
	}
};
