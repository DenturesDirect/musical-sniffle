
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { text, tone } = await request.json();

        if (!text) {
            return NextResponse.json({ success: false, message: 'No text provided' }, { status: 400 });
        }

        // Mock AI response for now
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

        let rewritten = text;
        if (tone === 'professional') {
            rewritten = `[Professional Polish]: ${text} - This text has been refined to sound more elegant and sophisticated, maintaining high discretion.`;
        } else if (tone === 'warm') {
            rewritten = `[Warm & Inviting]: ${text} - This version focuses on building a connection and sounding approachable yet exclusive.`;
        } else {
            rewritten = `[Polished]: ${text} - Improved clarity and flow.`;
        }

        return NextResponse.json({ success: true, rewritten });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Rewrite failed' }, { status: 500 });
    }
}
