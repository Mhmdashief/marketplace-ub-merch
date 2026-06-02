'use client';

import { motion } from 'framer-motion';

export default function ValuesSection() {
    const values = [
        {
            title: 'EXCELLENCE',
            description: 'Unwavering commitment to superior quality and master craftsmanship in every detail.',
            gradient: 'from-[#C5A059] to-[#8E6E36]'
        },
        {
            title: 'PASSION',
            description: 'Driven by the profound love for Universitas Brawijaya and its enduring traditions.',
            gradient: 'from-gray-800 to-black'
        },
        {
            title: 'INNOVATION',
            description: 'Pioneering new aesthetics while preserving the core identity of our academic heritage.',
            gradient: 'from-ub-navy to-ub-dark-navy'
        },
        {
            title: 'INTEGRITY',
            description: 'Building trust through absolute transparency and dedicated service to our community.',
            gradient: 'from-gray-900 to-black'
        }
    ];

    return (
        <section className="py-32 bg-[#050505] relative overflow-hidden">
            {/* Ambient Light Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-ub-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-24">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] font-black uppercase tracking-[0.6em] text-ub-gold mb-6 block"
                    >
                        Core Pillars
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-white tracking-tighter"
                    >
                        OUR <span className="italic font-serif font-normal text-gray-500">Foundation.</span>
                    </motion.h2>
                </div>

                {/* Values Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative h-[400px] bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 overflow-hidden hover:bg-white/[0.04] transition-all duration-700"
                        >
                            {/* Card Glow */}
                            <div className={`absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />

                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="mb-auto">
                                    <h3 className="text-2xl font-black text-white tracking-tight mb-4 group-hover:text-ub-gold transition-colors">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-500 font-medium leading-relaxed group-hover:text-gray-400 transition-colors">
                                        {value.description}
                                    </p>
                                </div>

                                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                        Pillar 0{index + 1}
                                    </span>
                                    <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-ub-gold transition-colors" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
