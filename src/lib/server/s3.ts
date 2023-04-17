import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3_ENDPOINT, S3_KEY, S3_REGION, S3_SECRET } from '$env/static/private';
import sharp from 'sharp';

const client = new S3Client({
	region: S3_REGION,
	credentials: {
		accessKeyId: S3_KEY,
		secretAccessKey: S3_SECRET
	},
	endpoint: S3_ENDPOINT
});

export async function saveThumbnail(thumbnail: File, key: string) {
	const input = await thumbnail.arrayBuffer();
	const output = await sharp(input)
		.resize({
			width: 640,
			height: 360
		})
		.toFormat('webp')
		.toBuffer();

	const thumbnailKey = Buffer.from(key).toString('base64') + '.webp';

	const command = new PutObjectCommand({
		Bucket: 'some3',
		Key: thumbnailKey,
		Body: output,
		ACL: 'public-read'
	});

	await client.send(command);
}
