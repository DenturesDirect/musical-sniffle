import Link from "next/link";
import { ThemeVariant } from "@/types";

const THEMES: { id: ThemeVariant; name: string; description: string; color: string }[] = [
    {
        id: 'luxury',
        name: 'Luxury / High-End',
        description: 'Dark or neutral palette, elegant typography, editorial layout.',
        color: 'bg-zinc-900 text-zinc-50'
    },
    {
        id: 'bold',
        name: 'Bold / Confident',
        description: 'High contrast, strong typography, personality-forward.',
        color: 'bg-indigo-600 text-white'
    },
    {
        id: 'soft',
        name: 'Soft / GFE',
        description: 'Light colors, warm tone, intimate feel.',
        color: 'bg-rose-100 text-rose-900 border-rose-200'
    },
    {
        id: 'minimal',
        name: 'Discreet / Minimal',
        description: 'Clean, privacy-first, minimal visuals.',
        color: 'bg-gray-50 text-gray-900 border-gray-200 border'
    },
];

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Choose a Theme</h1>
                <p className="text-xl text-slate-600">
                    Explore different styles for your escort site. Click a card below to view a live demo.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                {THEMES.map((theme) => (
                    <Link key={theme.id} href={`/demo/${theme.id}`} className="block group">
                        <div className={`
                            relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-between transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl shadow-md
                            ${theme.color}
                        `}>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">{theme.name}</h3>
                                <p className="opacity-80">{theme.description}</p>
                            </div>
                            <div className="mt-auto self-end">
                                <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm font-medium text-sm transition-colors group-hover:bg-white/30">
                                    View Demo &rarr;
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="text-center mt-12">
                <Link href="/" className="text-slate-500 hover:text-slate-900 font-medium">
                    &larr; Back to Home
                </Link>
            </div>
        </div>
    );
}
