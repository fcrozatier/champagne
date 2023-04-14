import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { registrationOpen } from '$lib/utils';
import { driver } from '$lib/server/neo4j';
import { Neo4jError } from 'neo4j-driver';
import { RegistrationSchema, validateForm } from '$lib/server/validation';
import { sendRegistrationEmail } from '$lib/server/email';
import sharp from 'sharp';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3_KEY, S3_SECRET } from '$env/static/private';
import { dev } from '$app/environment';

const client = new S3Client({
	region: 'fra1',
	credentials: {
		accessKeyId: S3_KEY,
		secretAccessKey: S3_SECRET
	},
	endpoint: 'https://fra1.digitaloceanspaces.com'
});

sharp.cache(false);

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

					const { thumbnail, ...restData } = validation.data;
					const thumbnailKey = Buffer.from(restData.link).toString('base64') + '.webp';
					console.log('thumbnailKey:', thumbnailKey);

					const params = {
						users,
						...restData,
						thumbnailKey
					};

					await session.executeWrite((tx) => {
						tx.run(
							`
					MATCH (n:Entry)
					WHERE n.category = $params.category
					WITH count(n) as number
					CREATE (entry:Entry {title: $params.title, description: $params.description, category: $params.category, link: $params.link, thumbnail: $params.thumbnailKey})
					SET entry.number = number
					WITH *
					UNWIND $params.users AS creator
					MERGE (:User:Creator {email: creator.email, token: creator.token})-[:CREATED]->(entry)
					`,
							{ params }
						);
					});

					if (!restData.link.includes('youtube.com')) {
						if (!thumbnail) {
							return fail(400, { thumbnailRequired: true });
						}

						const input = await thumbnail.arrayBuffer();
						const output = await sharp(input)
							.resize({
								width: 640,
								height: 360
							})
							.toFormat('webp')
							.toBuffer();

						const command = new PutObjectCommand({
							Bucket: 'some3',
							Key: thumbnailKey,
							Body: output,
							ACL: 'public-read'
						});
						await client.send(command);
					}
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
				if (!dev) {
					try {
						for (const user of users) {
							await sendRegistrationEmail(user.email, user.token);
						}
					} catch (error) {
						console.error('Cannot send email');
					}
				}
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
