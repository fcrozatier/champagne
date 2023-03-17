import type { Actions } from './$types';
import { driver, type Feedback } from '$lib/server/neo4j';
import { toNativeTypes } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { TokenSchema } from '$lib/server/validation';

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
		const formData = await request.formData();
		const token = formData.get('token');
		const validation = TokenSchema.safeParse(token);

		if (!validation.success) {
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
					{ token: validation.data }
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
		const formData = await request.formData();
		const token = formData.get('token');
		const validation = TokenSchema.safeParse(token);

		if (!validation.success) {
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
					{ token: validation.data }
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
