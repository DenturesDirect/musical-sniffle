
import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { SiteConfig, DEFAULT_CONFIG } from '@/types';

const DATA_DIR = join(process.cwd(), 'data');
const CONFIG_FILE = join(DATA_DIR, 'site-config.json');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await mkdir(DATA_DIR, { recursive: true });
    } catch (e) {
        // Ignore if exists
    }
}

export async function GET() {
    try {
        await ensureDataDir();
        try {
            const fileContent = await readFile(CONFIG_FILE, 'utf-8');
            const config = JSON.parse(fileContent);
            return NextResponse.json(config);
        } catch (readError) {
            // If file doesn't exist or is invalid, return default and write it
            await writeFile(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
            return NextResponse.json(DEFAULT_CONFIG);
        }
    } catch (error) {
        console.error('Failed to load config:', error);
        return NextResponse.json(DEFAULT_CONFIG);
    }
}

export async function POST(request: NextRequest) {
    try {
        const newConfig: SiteConfig = await request.json();

        await ensureDataDir();
        await writeFile(CONFIG_FILE, JSON.stringify(newConfig, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to save config:', error);
        return NextResponse.json({ success: false, message: 'Failed to save configuration' }, { status: 500 });
    }
}
