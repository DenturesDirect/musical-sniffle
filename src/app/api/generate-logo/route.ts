import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
            { error: 'OpenAI API key not configured' },
            { status: 500 }
        );
    }

    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `A professional, minimalist logo for a high-end service provider. ${prompt}. Vector style, simple lines, white background.`,
            n: 1,
            size: "1024x1024",
            response_format: "url",
        });

        const imageUrl = response.data[0].url;

        return NextResponse.json({ url: imageUrl });
    } catch (error: any) {
        console.error('Error generating logo:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate logo' },
            { status: 500 }
        );
    }
}
