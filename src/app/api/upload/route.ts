
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { getS3Config } from '@/lib/s3-config';

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        // Configuration check
        const config = getS3Config();
        if (!config.credentials.accessKeyId || !config.credentials.secretAccessKey || !config.bucket) {
            console.error("Missing S3 configuration");
            console.log("Config state:", {
                hasKey: !!config.credentials.accessKeyId,
                hasSecret: !!config.credentials.secretAccessKey,
                bucket: config.bucket
            });
            // Fallback for local dev if S3 not configured? 
            // For now, fail to force proper setup.
            return NextResponse.json({ success: false, message: 'Server storage configuration missing' }, { status: 500 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const filename = `${uniqueSuffix}-${originalName}`;

        // Init S3 Client
        const client = new S3Client({
            region: config.region,
            endpoint: config.endpoint,
            credentials: config.credentials,
            forcePathStyle: true // Needed for many compatible S3 providers
        });

        // Upload
        const command = new PutObjectCommand({
            Bucket: config.bucket,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
            ACL: 'public-read', // Request public access if bucket allows
        });

        await client.send(command);

        // Construct URL
        // If a public URL base is provided, use it. Otherwise, use endpoint/bucket/file style or virtual host style.
        let fileUrl = '';
        if (config.publicUrl) {
            // Remove trailing slash if present
            const baseUrl = config.publicUrl.endsWith('/') ? config.publicUrl.slice(0, -1) : config.publicUrl;
            fileUrl = `${baseUrl}/${filename}`;
        } else {
            // Fallback construction (highly dependent on provider)
            fileUrl = `${config.endpoint}/${config.bucket}/${filename}`;
        }

        return NextResponse.json({ success: true, url: fileUrl, id: uniqueSuffix });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            success: false,
            message: 'Upload failed',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
