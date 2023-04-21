import { fail, type Actions } from '@sveltejs/kit';
import { EmailForm, SwapSchema, validateForm } from '$lib/server/validation';
import { driver, type Entry } from '$lib/server/neo4j';
import { toNativeTypes, YOUTUBE_EMBEDDABLE } from '$lib/utils';
import { saveThumbnail } from '$lib/server/s3';
import { Neo4jError } from 'neo4j-driver';

let ID: 'find' | 'swap';

export const actions = {
	find: async ({ request }) => {
		ID = 'find';
		const validation = await validateForm(request, EmailForm);

		if (!validation.success) {
			return fail(400, { ...validation.error.flatten() });
		}

		// Save data
		const session = driver.session();

		try {
			const entry = await session.executeRead((tx) => {
				return tx.run<{ e: Entry }>(
					`
					MATCH (n:Creator)-[:CREATED]->(e:Entry)
					WHERE n.email = $email
					RETURN e
					`,
					{ email: validation.data.email }
				);
			});

			if (entry?.records?.[0]?.length) {
				return { entry: toNativeTypes(entry.records[0].get('e').properties) };
			}
			return fail(400, { creatorNotFound: true });
		} catch (error) {
			console.log(error);
			return fail(500, { invalid: true });
		} finally {
			await session.close();
		}
	},
	swap: async ({ request }) => {
		ID = 'swap';
		const validation = await validateForm(request, SwapSchema);

		if (!validation.success) {
			return fail(400, { ID, ...validation.error.flatten() });
		}

		// Save data
		const session = driver.session();

		try {
			const { thumbnail, ...restData } = validation.data;
			const thumbnailKey = Buffer.from(restData.link).toString('base64') + '.webp';
			console.log('thumbnailKey:', thumbnailKey);

			const params = {
				...restData,
				thumbnailKey
			};

			await session.executeWrite((tx) => {
				tx.run(
					`
					MATCH (u:Creator)-[:CREATED]->(n:Entry)
					WHERE u.email = $params.email
					CREATE (entry:Entry {title: $params.title, description: $params.description, category: $params.category, link: $params.link, thumbnail: $params.thumbnailKey})
					SET entry.number = n.number
					WITH n, entry
					MATCH (v:Creator)-[:CREATED]->(n)
					OPTIONAL MATCH (n)-[r:NOT_ASSIGNED|ASSIGNED|LOSES_TO]-(m:Entry)
					DETACH DELETE n
					MERGE (v)-[:CREATED]->(entry)
					MERGE (entry)-[:NOT_ASSIGNED]->(m)
					`,
					{ params }
				);
			});

			if (!YOUTUBE_EMBEDDABLE.test(restData.link)) {
				if (!thumbnail) {
					return fail(400, { thumbnailRequired: true });
				}

				await saveThumbnail(thumbnail, thumbnailKey);
			}
		} catch (error) {
			if (
				error instanceof Neo4jError &&
				error.code === 'Neo.ClientError.Schema.ConstraintValidationFailed'
			) {
				console.log(error.message);

				if (error.message.includes('link')) {
					return fail(422, { linkExists: true });
				}
			}
			console.log(error);
			return fail(500, { invalid: true });
		} finally {
			await session.close();
		}
	}
} satisfies Actions;
