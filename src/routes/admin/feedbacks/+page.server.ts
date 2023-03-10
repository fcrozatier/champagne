import type { Actions } from './$types';
import { driver, type Feedback } from '$lib/server/neo4j';
import { toNativeTypes } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const session = driver.session();

	try {
		// Get feedbacks
		const res = await session.executeRead((tx) => {
			return tx.run<{ f: Feedback }>(
				`
				MATCH (f:Feedback)
				WHERE f.validated IS NULL
				RETURN f LIMIT 25
      `
			);
		});

		const feedbacks = [];
		for (const row of res.records) {
			const entry = row.get('f');
			feedbacks.push(toNativeTypes(entry.properties));
		}

		return {
			feedbacks
		};
	} catch (error) {
		return { success: false };
	} finally {
		session.close();
	}
};

export const actions: Actions = {
	validate: async ({ request }) => {
		const data = await request.formData();
		const token = data.get('token');

		if (!token || typeof token !== 'string') {
			return fail(400, { error: true });
		}

		const session = driver.session();

		try {
			await session.executeWrite((tx) => {
				return tx.run(
					`
				MATCH (f:Feedback)
				WHERE f.token = $token
				SET f.validated = True
      `,
					{ token }
				);
			});
			return { success: true };
		} catch (error) {
			return fail(400, { error: true });
		} finally {
			session.close();
		}
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const token = data.get('token');

		if (!token || typeof token !== 'string') {
			return fail(400, { error: true });
		}

		const session = driver.session();

		try {
			await session.executeWrite((tx) => {
				return tx.run(
					`
				MATCH (f:Feedback)
				WHERE f.token = $token
				DETACH DELETE f
      `,
					{ token }
				);
			});
			return { success: true };
		} catch (error) {
			return fail(400, { error: true });
		} finally {
			session.close();
		}
	}
};
