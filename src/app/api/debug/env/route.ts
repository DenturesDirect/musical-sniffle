import { NextResponse } from 'next/server';

export async function GET() {
    // Return only the KEYS of environment variables to be safe-ish
    // logging them to see what Railway is injecting
    const keys = Object.keys(process.env).sort();

    // Filter for likely storage candidates
    const relevantKeys = keys.filter(k =>
        k.startsWith('AWS') ||
        k.startsWith('S3') ||
        k.startsWith('R2') ||
        k.startsWith('MINIO') ||
        k.includes('BUCKET') ||
        k.includes('ACCESS_KEY') ||
        k.includes('SECRET') ||
        k.includes('URL')
    );

    return NextResponse.json({
        allKeys: keys,
        relevantKeys: relevantKeys,
        // Check specific standard ones
        checks: {
            hasAwsAccess: !!process.env.AWS_ACCESS_KEY_ID,
            hasAccessKey: !!process.env.ACCESS_KEY,
            hasBucket: !!process.env.AWS_BUCKET_NAME || !!process.env.BUCKET_NAME,
        }
    });
}
