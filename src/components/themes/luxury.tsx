
import { SiteConfig } from "@/types";
import { Playfair_Display, Inter } from "next/font/google";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const serifFn = Playfair_Display({ subsets: ["latin"] });
const sansFn = Inter({ subsets: ["latin"] });

// Luxury Theme: Dark mode, Gold accents, Serif headings
export default function LuxuryLayout({ config }: { config: SiteConfig }) {
    return (
        <div className={cn("min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-900 selection:text-white", sansFn.className)}>
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className={cn("text-2xl font-bold tracking-wider text-amber-500", serifFn.className)}>
                        {config.profile.name.toUpperCase()}
                    </div>
                    <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-neutral-400">
                        <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
                        <a href="#gallery" className="hover:text-amber-400 transition-colors">Gallery</a>
                        <a href="#rates" className="hover:text-amber-400 transition-colors">Experience</a>
                        <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <header className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {config.gallery[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={config.gallery[0].url}
                            alt="Hero"
                            className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-[2s]"
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 text-center space-y-6 max-w-2xl px-4">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-amber-500 uppercase tracking-[0.3em] text-sm"
                    >
                        {config.profile.tagline}
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className={cn("text-5xl md:text-7xl font-bold leading-tight", serifFn.className)}
                    >
                        {config.profile.name}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="pt-8"
                    >
                        <a
                            href="#contact"
                            className="inline-block border border-amber-600 px-8 py-3 text-sm uppercase tracking-widest hover:bg-amber-600/10 transition-colors"
                        >
                            Inquire Availability
                        </a>
                    </motion.div>
                </div>
            </header>

            {/* About */}
            <section id="about" className="py-24 px-6 md:px-12 bg-neutral-900">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="prose prose-invert prose-lg prose-p:font-light prose-p:text-neutral-300">
                        <h2 className={cn("text-3xl font-normal text-amber-500 mb-6", serifFn.className)}>About Me</h2>
                        <p className="whitespace-pre-line">{config.profile.bio}</p>
                        <div className="mt-8 pt-8 border-t border-white/5 space-y-2 text-sm text-neutral-400">
                            <p><span className="text-white uppercase tracking-wider">Location:</span> {config.profile.location}</p>
                            <p><span className="text-white uppercase tracking-wider">Status:</span>
                                <span className={cn("ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                    config.availability.status === 'available' ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400")}>
                                    {config.availability.status === 'available' ? 'Available' : 'Unavailable'}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="relative aspect-[3/4] md:translate-y-12">
                        {config.gallery[1] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={config.gallery[1].url}
                                alt="About"
                                className="w-full h-full object-cover shadow-2xl shadow-black/50"
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-600">No Image</div>
                        )}
                        <div className="absolute -inset-4 border border-amber-800/20 -z-10" />
                    </div>
                </div>
            </section>

            {/* Services */}
            <section id="rates" className="py-24 px-6 md:px-12">
                <div className="max-w-3xl mx-auto space-y-16">
                    <h2 className={cn("text-4xl text-center font-normal text-white", serifFn.className)}>
                        <span className="italic text-amber-600">Private</span> Experiences
                    </h2>

                    <div className="space-y-12">
                        {config.services.map((service) => (
                            <div key={service.id} className="group relative border-b border-white/10 pb-8">
                                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
                                    <h3 className={cn("text-2xl text-neutral-200", serifFn.className)}>{service.name}</h3>
                                    <div className="text-amber-500 font-mono text-lg">{service.rate}</div>
                                </div>
                                {service.duration && <p className="text-xs uppercase tracking-wider text-neutral-500 mb-4">{service.duration}</p>}
                                <p className="text-neutral-400 font-light max-w-lg">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section id="gallery" className="py-24 bg-black">
                <div className="px-4">
                    <h2 className={cn("text-3xl text-center mb-16 text-neutral-400 font-thin tracking-widest", serifFn.className)}>GALLERY</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 max-w-7xl mx-auto">
                        {config.gallery.slice(2).map((img) => (
                            <div key={img.id} className="aspect-[2/3] relative group overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        {config.gallery.length <= 2 && (
                            <p className="col-span-full text-center text-neutral-600">More images coming soon.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="py-24 px-6 bg-neutral-900 border-t border-white/5">
                <div className="max-w-xl mx-auto text-center space-y-8">
                    <h2 className={cn("text-3xl font-normal text-white", serifFn.className)}>Contact & Booking</h2>
                    <p className="text-neutral-400 font-light">
                        Please include the date, time, and nature of your inquiry. I appreciate discretion and politeness.
                    </p>

                    <div className="space-y-4 pt-4">
                        <a href={`mailto:${config.profile.contactEmail}`} className="block text-xl text-amber-500 hover:text-amber-400 transition-colors">
                            {config.profile.contactEmail}
                        </a>
                        {config.profile.contactPhone && (
                            <p className="text-lg text-neutral-300">{config.profile.contactPhone}</p>
                        )}
                        {config.profile.whatsapp && (
                            <p className="text-sm text-neutral-500 uppercase tracking-widest">WhatsApp available</p>
                        )}
                    </div>

                    <div className="pt-12 text-xs text-neutral-700 uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} {config.profile.name}. All rights reserved.
                    </div>
                </div>
            </section>
        </div>
    );
}
