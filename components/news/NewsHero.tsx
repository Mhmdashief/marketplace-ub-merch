'use client';

import { motion } from 'framer-motion';

export default function NewsHero() {
    return (
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-white border-b border-gray-100 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-black text-ub-navy leading-[1.1] tracking-tight mb-6"
                    >
                        Cerita, Tren <span className="font-serif italic font-medium text-gray-400 mx-1">&</span> Inspirasi Dari Official UB Merchandise
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl"
                    >
                        Sumber informasi resmi, liputan acara eksklusif, dan cerita di balik karya-karya terbaru dari ekosistem UB Merchandise.
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
