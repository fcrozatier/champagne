import { driver } from '$lib/server/neo4j';
import { fail, type Actions } from '@sveltejs/kit';
import { EmailSchema, validateSchema } from '$lib/server/validation';

export const actions: Actions = {
	resend_link: async ({ request }) => {
		const validation = await validateSchema(request, EmailSchema);

		if (!validation.success) {
			return fail(400, { emailInvalid: true });
		}

		const session = driver.session();

		try {
			// Find user
			const user = await session.executeRead((tx) => {
				return tx.run(
					`
				MATCH (u:User)
				WHERE u.email = $email
				RETURN u.token AS token
			`,
					{
						email: validation.data
					}
				);
			});

			if (!user?.records?.length) {
				return fail(400, { emailInvalid: true });
			} else {
				const token = user.records[0].get('token');
				// TODO email
				console.log(`Your personal link is /vote/${token}`);
				return { success: true };
			}
		} catch (error) {
			console.log(error);
			return fail(400, { error: true });
		} finally {
			session.close();
		}
	}
};
