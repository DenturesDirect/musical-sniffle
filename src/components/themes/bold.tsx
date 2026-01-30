
import { SiteConfig } from "@/types";
import { Oswald, Open_Sans } from "next/font/google"; // Oswald for headers, Open Sans for body
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const headerFont = Oswald({ subsets: ["latin"] });
const bodyFont = Open_Sans({ subsets: ["latin"] });

export default function BoldLayout({ config }: { config: SiteConfig }) {
    return (
        <div className={cn("min-h-screen bg-white text-slate-900 selection:bg-indigo-500 selection:text-white", bodyFont.className)}>

            {/* Heavy Nav */}
            <nav className="fixed w-full z-50 bg-white border-b-4 border-black">
                <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
                    <div className={cn("text-3xl font-bold uppercase tracking-tighter bg-black text-white px-2 py-1 transform -skew-x-12", headerFont.className)}>
                        {config.profile.name}
                    </div>
                    <div className="hidden md:flex gap-6 font-bold uppercase text-sm tracking-wide">
                        <a href="#about" className="hover:bg-black hover:text-white px-4 py-2 transition-all">About</a>
                        <a href="#gallery" className="hover:bg-black hover:text-white px-4 py-2 transition-all">Gallery</a>
                        <a href="#rates" className="hover:bg-black hover:text-white px-4 py-2 transition-all">Rates</a>
                        <a href="#contact" className="hover:bg-black hover:text-white px-4 py-2 transition-all">Contact</a>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <header className="pt-20 min-h-screen flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-indigo-600 text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <h1 className={cn("text-6xl md:text-8xl font-black uppercase leading-[0.8]", headerFont.className)}>
                            {config.profile.tagline.split(' ').map((word, i) => (
                                <span key={i} className="block">{word}</span>
                            ))}
                        </h1>
                        <p className="text-xl md:text-2xl font-bold max-w-md border-l-4 border-black pl-4">
                            {config.profile.bio.slice(0, 100)}...
                        </p>
                        <a href="#contact" className="inline-block bg-black text-white font-bold uppercase tracking-widest px-8 py-4 hover:translate-x-2 hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                            Book Now
                        </a>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply opacity-50" />
                    <div className="absolute top-10 right-10 text-9xl font-black text-indigo-700 opacity-20 pointer-events-none">X</div>
                </div>
                <div className="w-full md:w-1/2 relative bg-slate-900 border-l-4 border-black">
                    {config.gallery[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={config.gallery[0].url} className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500" alt="" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl font-black">IMAGE</div>
                    )}
                </div>
            </header>

            {/* Stats / Info Bar */}
            <div className="bg-black text-white py-12 border-y-4 border-indigo-600">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h3 className="text-indigo-500 font-bold uppercase tracking-widest mb-2">Location</h3>
                        <p className={cn("text-4xl font-bold", headerFont.className)}>{config.profile.location}</p>
                    </div>
                    <div>
                        <h3 className="text-indigo-500 font-bold uppercase tracking-widest mb-2">Availability</h3>
                        <p className={cn("text-4xl font-bold", headerFont.className)}>{config.availability.status}</p>
                    </div>
                    <div>
                        <h3 className="text-indigo-500 font-bold uppercase tracking-widest mb-2">Contact</h3>
                        <p className={cn("text-xl font-bold truncate px-4", headerFont.className)}>{config.profile.contactEmail}</p>
                    </div>
                </div>
            </div>

            {/* Gallery Strip */}
            <section id="gallery" className="py-24 overflow-hidden">
                <div className="flex gap-4 overflow-x-auto pb-8 px-4 no-scrollbar">
                    {config.gallery.slice(1).map((img, i) => (
                        <div key={img.id} className="min-w-[300px] md:min-w-[400px] aspect-[3/4] border-4 border-black relative group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} className="w-full h-full object-cover" alt="" />
                            <div className="absolute bottom-0 left-0 bg-white border-t-4 border-r-4 border-black p-2 font-bold text-xl">
                                0{i + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Services Grid */}
            <section id="rates" className="py-24 px-4 bg-slate-100">
                <div className="max-w-5xl mx-auto">
                    <h2 className={cn("text-6xl font-black uppercase mb-16 text-center text-slate-900", headerFont.className)}>Services<span className="text-indigo-600">.</span></h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {config.services.map((service, i) => (
                            <div key={service.id} className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(79,70,229,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className={cn("text-3xl font-bold uppercase", headerFont.className)}>{service.name}</h3>
                                    <span className="bg-black text-white px-3 py-1 font-bold">{service.rate}</span>
                                </div>
                                <p className="font-medium text-slate-600 border-l-4 border-indigo-200 pl-4 mb-4">{service.description}</p>
                                <div className="text-right text-sm font-black uppercase text-indigo-600">{service.duration}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-black text-white py-24 text-center">
                <h2 className={cn("text-[10vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 opacity-20 select-none", headerFont.className)}>
                    {config.profile.name}
                </h2>
                <div className="-mt-12 relative z-10">
                    <a href={`mailto:${config.profile.contactEmail}`} className="inline-block bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white font-bold text-2xl px-12 py-6 uppercase tracking-widest transition-colors border-4 border-transparent hover:border-indigo-600">
                        Get In Touch
                    </a>
                </div>
            </footer>
        </div>
    );
}
