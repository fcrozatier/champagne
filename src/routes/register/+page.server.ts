import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { registrationOpen } from '$lib/utils';
import { driver } from '$lib/server/neo4j';
import { Neo4jError } from 'neo4j-driver';
import { categories } from '$lib/categories';
import { isStringArray } from '$lib/types';

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
			const others = values.get('others');
			const category = values.get('category');
			const title = values.get('title');
			const description = values.get('description');
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

			const creators: { email: string; token: string }[] = [];
			if (user === 'creator') {
				if (!others || typeof others !== 'string') {
					return fail(400, { othersInvalid: true });
				}

				let otherContributors: string[];
				try {
					otherContributors = JSON.parse(others);
				} catch (error) {
					return fail(400, { othersInvalid: true });
				}

				if (!isStringArray(otherContributors)) {
					return fail(400, { othersInvalid: true });
				}

				if (new Set([...otherContributors, email]).size !== otherContributors.length + 1) {
					return fail(400, { duplicateEmails: true });
				}
				[email, ...otherContributors].forEach((x) =>
					creators.push({ email: x, token: crypto.randomUUID() })
				);
				if (!category || typeof category !== 'string' || !categories.includes(category)) {
					return fail(400, { categoryInvalid: true });
				}

				if (!title || typeof title !== 'string') {
					return fail(400, { titleInvalid: true });
				}

				if (!description || typeof description !== 'string') {
					return fail(400, { descriptionInvalid: true });
				}
				if (description.length > 500) {
					return fail(400, { descriptionTooLong: true });
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
						tx.run(
							`
					MATCH (s:Seq) WHERE s.category = $category
					WITH s.value as seq
					CREATE (entry:Entry $entryProps)
					SET entry.number = seq, entry.points = 1
					WITH *
					UNWIND $creators AS creator
					MERGE (:User:Creator {email: creator.email, token: creator.token})-[:CREATED]->(entry)
					RETURN seq
					`,
							{
								category,
								creators,
								entryProps: {
									category,
									title,
									description,
									link
								}
							}
						);
						// Increment the sequence by 1 after creating the entry.
						tx.run(
							`
							MATCH (s:Seq) WHERE s.category = $category
							WITH s
							CALL apoc.atomic.add(s, 'value', 1, 10)
							YIELD newValue
							RETURN newValue
							`,
							{
								category
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

				// TODO send mail
				console.log(`Hello,... you're link is /vote/${token}`);
				return { success: true, email };
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
