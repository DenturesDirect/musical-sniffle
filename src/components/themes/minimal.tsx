
'use client';

import { SiteConfig } from "@/types";
import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const monoFont = Space_Grotesk({ subsets: ["latin"] });

export default function MinimalLayout({ config }: { config: SiteConfig }) {
    return (
        <div className={cn("min-h-screen bg-white text-black selection:bg-black selection:text-white", monoFont.className)}>
            {/* Side Nav (Desktop) / Top (Mobile) */}
            <div className="md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:border-r border-black p-8 flex flex-col justify-between z-50 bg-white border-b md:border-b-0">
                <div>
                    <h1 className="text-xl font-bold uppercase tracking-tight mb-2">{config.profile.name}</h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-8">{config.profile.tagline}</p>

                    <nav className="flex flex-col gap-2 text-sm uppercase tracking-wider">
                        <a href="#intro" className="hover:underline decoration-1 underline-offset-4">Introduction</a>
                        <a href="#services" className="hover:underline decoration-1 underline-offset-4">Services</a>
                        <a href="#gallery" className="hover:underline decoration-1 underline-offset-4">Visuals</a>
                        <a href="#contact" className="hover:underline decoration-1 underline-offset-4">Contact</a>
                    </nav>
                </div>

                <div className="hidden md:block text-xs text-gray-400 space-y-1">
                    <p>{config.profile.location}</p>
                    <p>{config.availability.status}</p>
                </div>
            </div>

            <main className="md:ml-64">
                {/* Intro */}
                <section id="intro" className="min-h-[80vh] flex flex-col justify-end p-8 md:p-16 border-b border-black">
                    <div className="max-w-2xl">
                        <p className="text-2xl md:text-4xl leading-tight font-light text-gray-800">
                            {config.profile.bio}
                        </p>
                    </div>
                </section>

                {/* Services Table */}
                <section id="services" className="border-b border-black">
                    <div className="grid grid-cols-1 divide-y divide-black">
                        <div className="p-4 bg-gray-50 text-xs uppercase tracking-widest border-b border-black">
                            Offerings
                        </div>
                        {config.services.map((service) => (
                            <div key={service.id} className="grid md:grid-cols-4 group hover:bg-gray-50 transition-colors">
                                <div className="p-8 md:col-span-1 font-bold uppercase border-b md:border-b-0 md:border-r border-black/10">
                                    {service.name}
                                </div>
                                <div className="p-8 md:col-span-2 border-b md:border-b-0 md:border-r border-black/10 text-gray-600 text-sm">
                                    {service.description}
                                </div>
                                <div className="p-8 md:col-span-1 font-mono text-right md:text-left">
                                    {service.rate}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Gallery Grid */}
                <section id="gallery" className="border-b border-black">
                    <div className="p-4 bg-gray-50 text-xs uppercase tracking-widest border-b border-black">
                        Visual Record
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-black">
                        {config.gallery.map((img) => (
                            <div key={img.id} className="aspect-square relative grayscale hover:grayscale-0 transition-all">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img.url} className="w-full h-full object-cover" alt="" />
                            </div>
                        ))}
                        {Array.from({ length: Math.max(0, 6 - config.gallery.length) }).map((_, i) => (
                            <div key={i} className="aspect-square flex items-center justify-center text-xs text-gray-300 font-mono">
                                [EMPTY_SLOT]
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact */}
                <section id="contact" className="p-8 md:p-32 bg-black text-white">
                    <div className="max-w-2xl space-y-12">
                        <h2 className="text-sm font-mono text-gray-500 uppercase">:: Initialize Contact Protocol</h2>
                        <div className="space-y-4">
                            <a href={`mailto:${config.profile.contactEmail}`} className="block text-3xl md:text-5xl hover:text-gray-400 transition-colors break-all">
                                {config.profile.contactEmail}
                            </a>
                            {config.profile.contactPhone && (
                                <p className="text-xl text-gray-400 font-mono">{config.profile.contactPhone}</p>
                            )}
                        </div>

                        <div className="pt-24 grid grid-cols-2 gap-8 border-t border-gray-800 text-xs text-gray-500 font-mono">
                            <div>
                                STATUS: {config.availability.status.toUpperCase()}
                            </div>
                            <div className="text-right">
                                ID: {config.id}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
