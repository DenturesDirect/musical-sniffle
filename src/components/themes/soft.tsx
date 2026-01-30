
import { SiteConfig } from "@/types";
import { Nunito, Great_Vibes } from "next/font/google";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Heart } from 'lucide-react';

const bodyFont = Nunito({ subsets: ["latin"] });
const scriptFont = Great_Vibes({ weight: "400", subsets: ["latin"] });

export default function SoftLayout({ config }: { config: SiteConfig }) {
    return (
        <div className={cn("min-h-screen bg-rose-50 text-slate-800 selection:bg-rose-200 selection:text-rose-900", bodyFont.className)}>

            {/* Soft Nav */}
            <nav className="fixed w-full z-50 bg-rose-50/80 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className={cn("text-3xl text-rose-500", scriptFont.className)}>
                        {config.profile.name}
                    </div>
                    <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                        <a href="#about" className="hover:text-rose-500 transition-colors">About</a>
                        <a href="#gallery" className="hover:text-rose-500 transition-colors">Photos</a>
                        <a href="#services" className="hover:text-rose-500 transition-colors">Services</a>
                        <a href="#contact" className="hover:text-rose-500 transition-colors">Contact</a>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <header className="pt-32 pb-20 px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                        {config.gallery[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={config.gallery[0].url} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                            <div className="w-full h-full bg-rose-200 flex items-center justify-center text-rose-400">
                                <Heart size={48} />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h1 className={cn("text-5xl md:text-7xl text-rose-900", scriptFont.className)}>
                            {config.profile.name}
                        </h1>
                        <p className="text-xl text-rose-700 italic font-light">{config.profile.tagline}</p>
                    </div>

                    <div className="pt-8">
                        <a href="#contact" className="bg-rose-400 hover:bg-rose-500 text-white px-8 py-3 rounded-full shadow-lg shadow-rose-200 transition-all transform hover:scale-105 inline-block font-semibold">
                            Send Me a Message
                        </a>
                    </div>
                </div>
            </header>

            {/* Bio Section */}
            <section id="about" className="py-20 px-6 bg-white rounded-t-[3rem] shadow-sm">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div className="inline-block p-3 bg-rose-100 rounded-full text-rose-500 mb-4">
                        <Heart size={24} fill="currentColor" />
                    </div>
                    <h2 className={cn("text-4xl text-rose-900", scriptFont.className)}>About Me</h2>
                    <p className="text-lg leading-relaxed text-slate-600 font-light">
                        {config.profile.bio}
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-6 text-sm text-slate-500">
                        <div className="bg-rose-50 p-4 rounded-2xl">
                            <span className="block text-rose-400 text-xs uppercase tracking-wider mb-1">Location</span>
                            {config.profile.location}
                        </div>
                        <div className="bg-rose-50 p-4 rounded-2xl">
                            <span className="block text-rose-400 text-xs uppercase tracking-wider mb-1">Availability</span>
                            {config.availability.status}
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Scatter */}
            <section id="gallery" className="py-20 px-6 bg-rose-50">
                <h2 className={cn("text-4xl text-center text-rose-900 mb-12", scriptFont.className)}>My Photos</h2>
                <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8">
                    {config.gallery.slice(1).map((img, i) => (
                        <div key={img.id} className={cn(
                            "w-64 aspect-[3/4] p-3 bg-white shadow-lg transform transition-transform hover:scale-105 hover:z-10 rounded-sm",
                            i % 2 === 0 ? "rotate-2" : "-rotate-2"
                        )}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} className="w-full h-full object-cover" alt="" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Services Cards */}
            <section id="services" className="py-20 px-6 bg-white rounded-[3rem] my-12 mx-4 shadow-sm">
                <div className="max-w-4xl mx-auto">
                    <h2 className={cn("text-4xl text-center text-rose-900 mb-16", scriptFont.className)}>Experiences</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {config.services.map((service) => (
                            <div key={service.id} className="bg-rose-50 p-8 rounded-3xl border border-rose-100 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-rose-900">{service.name}</h3>
                                    <span className="text-rose-500 font-bold bg-white px-3 py-1 rounded-full text-sm shadow-sm">{service.rate}</span>
                                </div>
                                <p className="text-slate-600 mb-4 font-light">{service.description}</p>
                                {service.duration && (
                                    <div className="text-xs text-rose-400 font-bold uppercase tracking-wide">
                                        Includes: {service.duration}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="py-20 px-6 text-center bg-rose-100/50">
                <div className="max-w-md mx-auto space-y-6">
                    <h2 className={cn("text-3xl text-rose-900", scriptFont.className)}>Let's Connect</h2>
                    <p className="text-slate-600">
                        I check my messages daily. Please be respectful and clear in your initial communication.
                    </p>
                    <a href={`mailto:${config.profile.contactEmail}`} className="block text-xl font-medium text-rose-600 hover:text-rose-700">
                        {config.profile.contactEmail}
                    </a>
                    <div className="pt-8 text-xs text-rose-300">
                        &copy; {config.profile.name}
                    </div>
                </div>
            </footer>
        </div>
    );
}
