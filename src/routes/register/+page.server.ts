import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { registrationOpen } from '$lib/utils';
import { driver } from '$lib/noe4j.server';
import { Neo4jError } from 'neo4j-driver';

const entries = ['video', 'non-video'];
const users = ['creator', 'judge'];

export const load: PageServerLoad = async () => {
	if (!registrationOpen()) {
		throw error(403, 'The registration phase is not open');
	}
};

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

			// Save data
			const session = driver.session();

			try {
				const token = crypto.randomUUID();

				if (user === 'creator') {
					await session.executeWrite((tx) => {
						return tx.run(
							`
					CREATE (:User:Creator {email: $email, token: $token})-[:CREATED]->(:Entry {link: $link, entry: $entry})
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
					CREATE (:User:Judge {email: $email, token: $token})
					`,
							{
								email,
								token
							}
						);
					});
				}
			} catch (error) {
				if (
					error instanceof Neo4jError &&
					error.code === 'Neo.ClientError.Schema.ConstraintValidationFailed'
				) {
					console.log(error.message);

					if (error.message.includes('email')) {
						return fail(422, { emailExists: true });
					} else if (error.message.includes('link')) {
						return fail(422, { linkExists: true });
					}
				}
			} finally {
				await session.close();
			}

			// TODO send mail

			return { success: true, email };
		} catch (error) {
			console.log(error);
			return fail(500, { invalid: true });
		}
	}
};
