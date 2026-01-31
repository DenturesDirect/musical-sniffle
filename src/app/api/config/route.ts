import { NextRequest, NextResponse } from 'next/server';
import { loadConfig, saveConfig } from '@/lib/s3-config';
import { SiteConfig } from '@/types';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const profileId = searchParams.get('profile') || 'default';

    try {
        const config = await loadConfig(profileId);
        return NextResponse.json(config);
    } catch (error) {
        console.error('Error loading config:', error);
        return NextResponse.json({ error: 'Failed to load config' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const profileId = searchParams.get('profile') || 'default';

    try {
        const config: SiteConfig = await request.json();
        await saveConfig(profileId, config);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving config:', error);
        return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
    }
}
