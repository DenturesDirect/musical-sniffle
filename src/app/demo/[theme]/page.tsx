import { ThemeVariant, DEFAULT_CONFIG } from "@/types";
import ThemeRenderer from "@/components/themes/renderer";

// Ensure static generation for known themes
export function generateStaticParams() {
    return [
        { theme: 'luxury' },
        { theme: 'bold' },
        { theme: 'soft' },
        { theme: 'minimal' },
    ];
}

export default async function ThemeDemoPage({ params }: { params: Promise<{ theme: string }> }) {
    const { theme } = await params;

    // Create a config object with the requested theme
    // We use the default config as a base, but override the theme
    const demoConfig = {
        ...DEFAULT_CONFIG,
        theme: theme as ThemeVariant,
    };

    return <ThemeRenderer config={demoConfig} />;
}
