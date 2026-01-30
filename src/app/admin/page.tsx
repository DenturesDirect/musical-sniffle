'use client';

import { useSiteConfig } from '@/context/site-config';
import Link from 'next/link';
import { Card } from '@/components/ui/card'; // I'll need to create a simple Card component or inline it if I don't use shadcn
// I'll inline the card style for now to avoid dependency hell if I haven't set up shadcn fully.

function StatCard({ title, value, subtext }: { title: string; value: string | number; subtext?: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
        </div>
    );
}

export default function AdminDashboard() {
    const { config } = useSiteConfig();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Welcome back, {config.profile.name}.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Current Theme"
                    value={config.theme.charAt(0).toUpperCase() + config.theme.slice(1)}
                    subtext="Active design variant"
                />
                <StatCard
                    title="Services Listed"
                    value={config.services.length}
                    subtext="Active offerings"
                />
                <StatCard
                    title="Gallery Images"
                    value={config.gallery.length}
                    subtext="Photos uploaded"
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <Link href="/admin/profile" className="block p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                        <h3 className="font-medium">Edit Profile</h3>
                        <p className="text-sm text-slate-500 mb-3">Update your bio and contact info.</p>
                    </Link>
                    <Link href="/admin/gallery" className="block p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                        <h3 className="font-medium">Manage Photos</h3>
                        <p className="text-sm text-slate-500 mb-3">Upload or remove gallery images.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
