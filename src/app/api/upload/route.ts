
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Helper to check environment variables
function getS3Config() {
    // Railway provides REMOTE_STORAGE_URL in the format:
    // https://KEY:SECRET@ENDPOINT/BUCKET
    // But sometimes it provides separate vars. We'll support both, prioritizing standard AWS vars.

    // Fallback: Try to parse REMOTE_STORAGE_URL if AWS keys aren't explicitly set
    /* 
       Note: A robust implementation would parse the complex connection string if needed.
       For now, we assume standard AWS variables are populated by the user or Railway's new S3 integration.
       Railway S3 service usually exposes:
       - AWS_ACCESS_KEY_ID
       - AWS_SECRET_ACCESS_KEY
       - AWS_REGION (often "us-east-1" or "auto")
       - AWS_ENDPOINT_URL_S3 (or similar)
       - BUCKET_NAME
     */

    return {
        region: process.env.AWS_REGION || 'auto',
        endpoint: process.env.AWS_ENDPOINT_URL_S3 || process.env.S3_ENDPOINT,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
        bucket: process.env.BUCKET_NAME || process.env.AWS_BUCKET_NAME,
        publicUrl: process.env.PUBLIC_BUCKET_URL
            || (process.env.BUCKET_NAME ? `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com` : undefined)
    };
}

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
