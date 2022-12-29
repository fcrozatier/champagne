import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { registrationOpen } from '$lib/utils';
import { driver } from '$lib/noe4j.server';

const entries = ['video', 'non-video'];
const users = ['creator', 'judge'];

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			if (!registrationOpen()) {
				return fail(422, { invalid: true });
			}

			const values = await request.formData();
			const user = values.get('user');
			const email = values.get('email');
			const entry = values.get('entry');
			const link = values.get('link');
			const rules = values.get('rules');

			if (!user || typeof user !== 'string' || !users.includes(user)) {
				return fail(400, { userInvalid: true });
			}

			if (!email || typeof email !== 'string') {
				return fail(400, { emailInvalid: true });
			}

			if (!rules) {
				return fail(400, { rulesInvalid: true });
			}

			if (user === 'creator') {
				if (!entry || typeof entry !== 'string' || !entries.includes(entry)) {
					return fail(400, { entryInvalid: true });
				}

				if (!link || typeof link !== 'string') {
					return fail(400, { linkInvalid: true });
				}
			}

			const session = driver.session();

			// Prevent duplicate data
			const res = await session.executeRead((tx) => {
				return tx.run(
					`
				MATCH (n)
				WHERE n.email = $email
				OR n.link = $link
				RETURN n.email AS email, n.link AS link
				`,
					{
						email,
						link: link ?? ''
					}
				);
			});

			for (const record of res.records) {
				if (record.get('email') === email) {
					return fail(400, { emailExists: true });
				}
				if (user === 'creator' && record.get('link') === link) {
					return fail(400, { linkExists: true });
				}
			}

			// Save data
			const token = crypto.randomUUID();
			if (user === 'creator') {
				await session.executeWrite((tx) => {
					return tx.run(
						`
					CREATE (:Creator {email: $email, token: $token})-[:CREATED]->(:Entry {link: $link, entry: $entry})
					`,
						{
							email,
							token,
							link,
							entry
						}
					);
				});
			} else {
				await session.executeWrite((tx) => {
					return tx.run(
						`
					CREATE (:Judge {email: $email, token: $token})
					`,
						{
							email,
							token
						}
					);
				});
			}
			await session.close();

			// TODO send mail

			return { success: true, email };
		} catch (error) {
			console.log(error);
			return fail(500, { invalid: true });
		}
	}
};
