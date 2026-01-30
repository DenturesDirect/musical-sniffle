'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Image, Calendar, Settings, FileText, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/profile', label: 'Profile & Bio', icon: User },
    { href: '/admin/services', label: 'Services', icon: FileText },
    { href: '/admin/gallery', label: 'Gallery', icon: Image },
    { href: '/admin/availability', label: 'Availability', icon: Calendar },
    { href: '/admin/rewrite', label: 'AI Rewriter', icon: FileText },
    { href: '/admin/settings', label: 'Theme & Settings', icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col">
            <div className="mb-8 px-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    SP Builder
                </h1>
                <p className="text-xs text-slate-400">Admin Console</p>
            </div>

            <nav className="space-y-1 flex-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm',
                                isActive
                                    ? 'bg-purple-600 text-white font-medium'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            )}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-4 border-t border-slate-800">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-white text-sm"
                >
                    <ExternalLink size={18} />
                    View Live Site
                </Link>
            </div>
        </aside>
    );
}
