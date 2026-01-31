import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { SiteConfig, DEFAULT_CONFIG } from '@/types';

// Reuse the config logic, but making it more robust accessible here
export function getS3Config() {
    return {
        region: process.env.AWS_REGION || 'auto',
        endpoint: process.env.AWS_ENDPOINT_URL_S3 || process.env.S3_ENDPOINT,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
        bucket: process.env.BUCKET_NAME || process.env.AWS_BUCKET_NAME,
    };
}

const s3Config = getS3Config();
const client = new S3Client({
    region: s3Config.region,
    endpoint: s3Config.endpoint,
    credentials: s3Config.credentials,
    forcePathStyle: true
});

const BUCKET = s3Config.bucket;

export async function loadConfig(profileId: string = 'default'): Promise<SiteConfig> {
    const key = `profiles/${profileId}.json`;
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET,
            Key: key,
        });
        const response = await client.send(command);
        if (!response.Body) throw new Error("No body");

        const str = await response.Body.transformToString();
        return JSON.parse(str);
    } catch (e) {
        console.warn(`Profile ${profileId} not found in S3, returning default.`);
        // If not found, return default (and maybe save it? No, explicit save is better)
        return DEFAULT_CONFIG;
    }
}

export async function saveConfig(profileId: string, config: SiteConfig): Promise<void> {
    const key = `profiles/${profileId}.json`;
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: JSON.stringify(config, null, 2),
        ContentType: 'application/json',
    });
    await client.send(command);
}

export async function listProfiles(): Promise<string[]> {
    try {
        const command = new ListObjectsV2Command({
            Bucket: BUCKET,
            Prefix: 'profiles/',
        });
        const response = await client.send(command);

        if (!response.Contents) return [];

        return response.Contents
            .map(c => c.Key)
            .filter((k): k is string => !!k)
            .map(k => k.replace('profiles/', '').replace('.json', ''));
    } catch (e) {
        console.error("Error listing profiles:", e);
        return [];
    }
}
