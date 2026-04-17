import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { SiteConfig, DEFAULT_CONFIG } from '../types';

// Reuse the config logic, but making it more robust accessible here
export function getS3Config() {
    const config: any = {
        region: process.env.AWS_REGION || 'auto',
        endpoint: process.env.AWS_ENDPOINT_URL_S3 || process.env.S3_ENDPOINT,
        bucket: process.env.AWS_BUCKET_NAME || process.env.BUCKET_NAME || process.env.S3_BUCKET || '',
        publicUrl: process.env.PUBLIC_BUCKET_URL
            || (process.env.BUCKET_NAME ? `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com` : undefined)
    };

    // Only provide credentials if they exist in env AND are not placeholders, otherwise let S3Client resolve them (e.g. from ~/.aws/credentials)
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && !process.env.AWS_ACCESS_KEY_ID.includes('REPLACE_WITH')) {
        config.credentials = {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        };
    } else if (process.env.ACCESS_KEY && process.env.SECRET_KEY && !process.env.ACCESS_KEY.includes('REPLACE_WITH')) {
        config.credentials = {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        };
    }

    return config;
}

const s3Config = getS3Config();
const client = new S3Client({
    region: s3Config.region,
    endpoint: s3Config.endpoint,
    credentials: s3Config.credentials,
    forcePathStyle: true
});

const BUCKET = s3Config.bucket;

import { promises as fs } from 'fs';
import path from 'path';

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
        console.warn(`Profile ${profileId} not found in S3 (or S3 auth failed). Attempting local fallback.`);

        // Fallback to local file system
        try {
            // Try specific profile file or default site-config.json
            const localPath = profileId === 'default'
                ? path.join(process.cwd(), 'data', 'site-config.json')
                : path.join(process.cwd(), 'data', `${profileId}.json`);

            const fileContent = await fs.readFile(localPath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (fsError) {
            console.warn(`Local fallback failed for ${profileId}, returning default constant.`, fsError);
            return DEFAULT_CONFIG;
        }
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
