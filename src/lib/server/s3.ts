import { S3Client } from '@aws-sdk/client-s3';
import { S3_ENDPOINT, S3_KEY, S3_REGION, S3_SECRET } from '$env/static/private';

export const client = new S3Client({
	region: S3_REGION,
	credentials: {
		accessKeyId: S3_KEY,
		secretAccessKey: S3_SECRET
	},
	endpoint: S3_ENDPOINT
});
