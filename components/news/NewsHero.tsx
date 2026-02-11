'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Newspaper, TrendingUp } from 'lucide-react';

export default function NewsHero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-ub-navy overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Modern Gradient Blobs */}
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[70%] bg-gradient-to-br from-ub-gold/20 to-transparent rounded-full blur-[120px] mix-blend-screen opacity-60" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] bg-gradient-to-tr from-blue-600/20 to-transparent rounded-full blur-[100px] mix-blend-screen opacity-50" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-20">

                    {/* Left Content - Main Title */}
                    <div className="max-w-4xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tight mb-2"
                        >
                            NEWS & <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ub-gold via-yellow-400 to-orange-400 italic font-serif">
                                IMPACT
                            </span>
                        </motion.h1>
                    </div>

                    {/* Right Content - Description & Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="lg:max-w-sm pb-4"
                    >
                        <p className="text-gray-400 text-lg leading-relaxed mb-8 border-l-2 border-ub-gold/30 pl-6">
                            Menjelajahi cerita di balik setiap karya, inovasi produk terbaru, dan bagaimana UB Merch berkontribusi nyata bagi masyarakat.
                        </p>

                        <div className="flex items-center gap-6 pl-6">
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-ub-gold to-transparent animate-pulse" />
            </motion.div>
        </section>
    );
}
