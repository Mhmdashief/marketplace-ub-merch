'use client';

import ServicesHero from './ServicesHero';
import ServiceCard from './ServiceCard';
import { motion } from 'framer-motion';

export default function ServicesContent() {
    // Array Services dengan Layout Config (Bento Grid)
    const services = [
        {
            iconName: 'Palette',
            title: 'Design & Creative',
            description: 'Transformasi ide kreatif Anda menjadi visual yang memukau dan memorable. Tim desainer profesional kami siap mewujudkan konsep desain yang sesuai dengan identitas brand Anda.',
            features: [
                'Graphic Design & Visual Identity',
                'UI/UX Design',
                'Marketing Collateral',
                'Packaging Design'
            ],
            gradient: 'from-purple-600 to-blue-600',
            className: 'md:col-span-2' // Changed from row-span-2 to just col-span-2
        },
        {
            iconName: 'Package',
            title: 'Product Development',
            description: 'Kembangkan produk merchandise berkualitas premium dari konsep hingga produksi massal.',
            features: [
                'Custom Merchandise',
                'Prototyping',
                'Quality Control',
                'Sustainable Options'
            ],
            gradient: 'from-blue-600 to-cyan-500',
            className: 'md:col-span-1'
        },
        {
            iconName: 'Sparkles',
            title: 'Branding Strategy',
            description: 'Bangun identitas brand yang kuat dan konsisten untuk memenangkan hati pasar.',
            features: [
                'Brand Identity',
                'Market Positioning',
                'Brand Voice',
                'Rebranding'
            ],
            gradient: 'from-pink-600 to-rose-500',
            className: 'md:col-span-1'
        },
        {
            iconName: 'PenTool',
            title: 'Logo Design',
            description: 'Logo profesional yang menjadi wajah dan fondasi visual identity brand Anda.',
            features: [
                'Original Concept',
                'Vector Files',
                'Usage Guidelines',
                'Brand Mark'
            ],
            gradient: 'from-amber-500 to-orange-600',
            className: 'md:col-span-1'
        },
        {
            iconName: 'Video',
            title: 'Video Profile',
            description: 'Ceritakan kisah brand Anda melalui video sinematik yang menggugah emosi audience.',
            features: [
                'Corporate Video',
                'Cinematic Storytelling',
                'Color Grading',
                'Motion Graphics'
            ],
            gradient: 'from-teal-600 to-emerald-600',
            className: 'md:col-span-2' // Wide Card
        },
        {
            iconName: 'Camera',
            title: 'Photo Company Profile',
            description: 'Dokumentasi visual profesional untuk aset perusahaan Anda.',
            features: [
                'Corporate Headshots',
                'Facility Photos',
                'Product Photography',
                'High-Res Delivery'
            ],
            gradient: 'from-indigo-600 to-violet-600',
            className: 'md:col-span-1'
        },
        {
            iconName: 'Calendar',
            title: 'Event Documentation',
            description: 'Abadikan setiap momen berharga event Anda dengan sempurna.',
            features: [
                'Photo & Video Cover',
                'Live Streaming',
                'Highlight Reel',
                'Drone Shot'
            ],
            gradient: 'from-cyan-600 to-blue-600',
            className: 'md:col-span-1'
        },
        {
            iconName: 'Globe',
            title: 'Website Development',
            description: 'Website modern yang performant dan SEO-friendly untuk bisnis Anda.',
            features: [
                'Custom Design',
                'Responsive Layout',
                'SEO Optimization',
                'CMS Integration'
            ],
            gradient: 'from-slate-700 to-slate-900',
            className: 'md:col-span-1'
        },
    ];

    return (
        <main className="min-h-screen bg-white">
            <ServicesHero />

            {/* Marquee Text Section - Minimalist Version */}
            <section className="py-4 bg-ub-navy overflow-hidden border-y border-white/10">
                <div className="relative flex overflow-x-hidden group opacity-80">
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: "-50%" }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="flex whitespace-nowrap gap-12"
                    >
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex gap-12 items-center">
                                <span className="text-lg md:text-xl font-medium text-white/40 tracking-[0.2em] uppercase">
                                    Creative • Innovative • Professional • Reliable • Strategic • Dynamic • Authentic • Premium •
                                </span>
                                <span className="text-lg md:text-xl font-medium text-white/40 tracking-[0.2em] uppercase">
                                    Creative • Innovative • Professional • Reliable • Strategic • Dynamic • Authentic • Premium •
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Bento Grid Services Section */}
            <section id="services" className="py-24 bg-white relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#003366 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />

                <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <ServiceCard key={index} {...service} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Minimalist CTA */}
            <section className="py-32 bg-white flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-5xl md:text-7xl font-black text-ub-navy mb-8 tracking-tighter">
                    READY TO <br />
                    COLLABORATE?
                </h2>
                <p className="text-xl text-gray-500 max-w-2xl mb-12">
                    Mari bicarakan ide besar Anda. Tim kami siap mengubah visi menjadi realita dengan standar kualitas tertinggi.
                </p>
                <a
                    href="https://wa.me/6282126667575"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative px-12 py-5 bg-ub-navy text-white font-bold rounded-full overflow-hidden transition-all hover:scale-105"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Start Project
                        <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            →
                        </motion.span>
                    </span>
                    <div className="absolute inset-0 bg-ub-gold transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
                </a>
            </section>
        </main>
    );
}
