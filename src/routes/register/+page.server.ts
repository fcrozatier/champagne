import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { registrationOpen } from '$lib/utils';
import { driver } from '$lib/server/neo4j';
import { Neo4jError } from 'neo4j-driver';
import { RegistrationSchema, validateForm } from '$lib/server/validation';
import { mg } from '$lib/server/email';
import { DOMAIN } from '$env/static/private';

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

			const validation = await validateForm(request, RegistrationSchema);

			if (!validation.success) {
				return fail(400, validation.error.flatten());
			}

			const users = [{ email: validation.data.email, token: crypto.randomUUID() }];

			// Save data
			const session = driver.session();

			try {
				if (validation.data.userType === 'creator') {
					const others = validation.data.others;
					others.forEach((x) => users.push({ email: x, token: crypto.randomUUID() }));

					const params = {
						users,
						...validation.data
					};

					await session.executeWrite((tx) => {
						tx.run(
							`
					MATCH (n:Entry)
					WHERE n.category = $params.category
					WITH count(n) as number
					CREATE (entry:Entry {title: $params.title, description: $params.description, category: $params.category, link: $params.link})
					SET entry.number = number
					WITH *
					UNWIND $params.users AS creator
					MERGE (:User:Creator {email: creator.email, token: creator.token})-[:CREATED]->(entry)
					`,
							{ params }
						);
					});
				} else {
					await session.executeWrite((tx) => {
						return tx.run(
							`
							UNWIND $users AS judge
							CREATE (:User:Judge {email: judge.email, token: judge.token})
					`,
							{
								users
							}
						);
					});
				}

				try {
					for (const user of users) {
						await mg.messages.create(DOMAIN, {
							from: 'SoME3 <fred@samples.mailgun.org>',
							to: user.email,
							subject: 'SoME3 ',
							text: 'hello'
						});
					}
				} catch (error) {
					console.error('Cannot send email');
				}
				console.log(`Hello,... you're link is /vote/`);
				return {
					success: true,
					user: users.length === 1 ? users[0] : { email: '', token: '' }
				};
			} catch (error) {
				if (
					error instanceof Neo4jError &&
					error.code === 'Neo.ClientError.Schema.ConstraintValidationFailed'
				) {
					console.log(error.message);

					if (error.message.includes('email')) {
						const [firstQuote, lastQuote] = [...error.message.matchAll(/'/g)].map(
							(x) => x.index as number
						);
						const duplicateEmail = error.message.slice(firstQuote + 1, lastQuote);
						return fail(422, { emailExists: duplicateEmail });
					} else if (error.message.includes('link')) {
						return fail(422, { linkExists: true });
					}
				}
				console.log(error);
				return fail(500, { invalid: true });
			} finally {
				await session.close();
			}
		} catch (error) {
			console.log(error);
			return fail(500, { invalid: true });
		}
	}
};
