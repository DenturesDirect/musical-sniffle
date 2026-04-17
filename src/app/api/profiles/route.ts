import { NextResponse } from 'next/server';
import { listProfiles } from '@/lib/s3-config';

export async function GET() {
    try {
        const profiles = await listProfiles();
        return NextResponse.json({ profiles });
    } catch (error) {
        console.error('Error listing profiles:', error);
        return NextResponse.json({ error: 'Failed to list profiles' }, { status: 500 });
    }
}
