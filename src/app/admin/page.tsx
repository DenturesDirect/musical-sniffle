'use client';

import { useSiteConfig } from '@/context/site-config';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Plus, Check, ChevronDown, User } from 'lucide-react';

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
    const { config, currentProfileId, switchProfile } = useSiteConfig();
    const [profiles, setProfiles] = useState<string[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newProfileName, setNewProfileName] = useState('');
    const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setIsLoadingProfiles(true);
        try {
            const res = await fetch('/api/profiles');
            if (res.ok) {
                const data = await res.json();
                setProfiles(data.profiles || []);
            }
        } catch (error) {
            console.error('Failed to fetch profiles', error);
        } finally {
            setIsLoadingProfiles(false);
        }
    };

    const handleCreateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProfileName.trim()) return;

        const id = newProfileName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        await switchProfile(id); // This will effectively create it on first save or we can rely on implicit creation
        // However, switchProfile just loads. We need to ensure it's saved.
        // Actually, loadConfig for a new ID will fallback to default, then we can save.
        // Let's reload profiles list after a short delay or just add it to local state
        setProfiles(prev => [...prev, id]);
        setNewProfileName('');
        setIsCreating(false);
    };

    return (
        <div className="space-y-6">
            {/* Client Switcher Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Client Selection</h2>
                        <p className="text-sm text-slate-500">Select which site you are currently editing.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative group">
                            <select
                                value={currentProfileId}
                                onChange={(e) => switchProfile(e.target.value)}
                                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 min-w-[200px]"
                            >
                                {profiles.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>

                        <button
                            onClick={() => setIsCreating(!isCreating)}
                            className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                            title="Create New Client"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {isCreating && (
                    <form onSubmit={handleCreateProfile} className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <input
                            type="text"
                            placeholder="Client Name (e.g. Smith)"
                            value={newProfileName}
                            onChange={(e) => setNewProfileName(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!newProfileName.trim()}
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium"
                        >
                            Cancel
                        </button>
                    </form>
                )}
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500">Managing site for <span className="font-semibold text-slate-900">{config.profile.name}</span> ({currentProfileId})</p>
                </div>
                <div className="flex gap-2">
                    <a href={`/demo?profile=${currentProfileId}`} target="_blank" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        View Live Site
                    </a>
                </div>
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
                    <Link href={`/admin/profile`} className="block p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white rounded-md shadow-sm text-slate-500">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-medium">Edit Profile</h3>
                                <p className="text-sm text-slate-500">Update bio, contact, and settings.</p>
                            </div>
                        </div>
                    </Link>
                    <Link href={`/admin/gallery`} className="block p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white rounded-md shadow-sm text-slate-500">
                                <Check className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-medium">Manage Photos</h3>
                                <p className="text-sm text-slate-500">Upload or remove gallery images.</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
