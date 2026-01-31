import { NextRequest, NextResponse } from 'next/server';
import { listProfiles, saveConfig } from '@/lib/s3-config';
import { DEFAULT_CONFIG } from '@/types';

export async function GET() {
    try {
        const profiles = await listProfiles();
        return NextResponse.json({ profiles });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to list profiles' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name } = await request.json();
        if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

        // sanitize
        const profileId = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');

        // Create new profile with default config
        await saveConfig(profileId, {
            ...DEFAULT_CONFIG,
            profile: { ...DEFAULT_CONFIG.profile, name: name } // Init with provided name
        });

        return NextResponse.json({ success: true, profileId });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
    }
}
