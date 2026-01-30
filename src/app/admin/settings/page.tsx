'use client';

import { useSiteConfig } from '@/context/site-config';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ThemeVariant } from '@/types';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function SettingsPage() {
    const { config, setTheme } = useSiteConfig();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Theme & Settings</h1>
                <p className="text-slate-500">Choose the visual style of your website.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {THEMES.map((theme) => {
                    const isActive = config.theme === theme.id;
                    return (
                        <div
                            key={theme.id}
                            onClick={() => setTheme(theme.id)}
                            className={cn(
                                "relative cursor-pointer rounded-xl border-2 p-6 transition-all hover:border-purple-400",
                                isActive ? "border-purple-600 bg-purple-50/50" : "border-transparent bg-white shadow-sm"
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-slate-900">{theme.name}</h3>
                                    <p className="text-sm text-slate-500">{theme.description}</p>
                                </div>
                                <div className={cn("h-6 w-6 rounded-full", theme.color)} />
                            </div>

                            {isActive && (
                                <div className="absolute top-4 right-4">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white">
                                        <Check size={14} />
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-100">
                <h3 className="font-semibold text-yellow-800 mb-2">Publishing</h3>
                <p className="text-sm text-yellow-700 mb-4">
                    Your site is generated based on the settings above. In a real deployment, you would click &quot;Deploy&quot; here.
                </p>
                <Button disabled>Deploy to Production (Coming Soon)</Button>
            </div>
        </div>
    );
}
