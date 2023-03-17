import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { registrationOpen } from '$lib/utils';
import { driver } from '$lib/server/neo4j';
import { Neo4jError } from 'neo4j-driver';
import { categories } from '$lib/categories';
import { z } from 'zod';
import { EmailSchema, UrlSchema } from '$lib/server/validation';

export const load: PageServerLoad = async () => {
	if (!registrationOpen()) {
		throw error(403, 'The registration phase is not open');
	}
};

const CheckboxSchema = z.literal('on', {
	errorMap: () => {
		return { message: 'Must be checked' };
	}
});

const JudgeSchema = z.object({
	userType: z.literal('judge'),
	email: EmailSchema,
	rules: CheckboxSchema
});

const CreatorSchema = z.object({
	userType: z.literal('creator'),
	email: EmailSchema,
	others: z.string().transform((val, ctx) => {
		const parsed = z.array(z.string().email()).safeParse(JSON.parse(val));

		if (!parsed.success) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Invalid email'
			});
			return z.NEVER;
		}
		return parsed.data;
	}),
	category: z.enum(categories),
	title: z.string().trim().nonempty({ message: 'Title cannot be empty' }),
	description: z
		.string()
		.trim()
		.min(10, { message: 'Description too short' })
		.max(500, { message: 'Description too long' }),
	link: UrlSchema,
	rules: CheckboxSchema
});

const RegistrationSchema = z.discriminatedUnion('userType', [JudgeSchema, CreatorSchema]);

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			if (!registrationOpen()) {
				return fail(422, { invalid: true });
			}
			const formData = await request.formData();

			const form = {
				userType: formData.get('user'),
				email: formData.get('email'),
				others: formData.get('others'),
				category: formData.get('category'),
				title: formData.get('title'),
				description: formData.get('description'),
				link: formData.get('link'),
				rules: formData.get('rules')
			};

			const validation = RegistrationSchema.safeParse(form);

			if (!validation.success) {
				return fail(400, validation.error.format());
			}

			const users = [{ email: validation.data.email, token: crypto.randomUUID() }];

			// Save data
			const session = driver.session();

			try {
				if (validation.data.userType === 'creator') {
					validation.data.others.forEach((x) =>
						users.push({ email: x, token: crypto.randomUUID() })
					);

					const params = {
						users,
						...validation.data
					};

					await session.executeWrite((tx) => {
						tx.run(
							`
					MATCH (n:Entry)
					WHERE n.category = $category
					WITH count(n) as number
					CREATE (entry:Entry {title: $title, description: $description, category: $category, link: $link})
					SET entry.number = number
					WITH *
					UNWIND $users AS creator
					MERGE (:User:Creator {email: creator.email, token: creator.token})-[:CREATED]->(entry)
					`,
							params
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

				// TODO send mail
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
