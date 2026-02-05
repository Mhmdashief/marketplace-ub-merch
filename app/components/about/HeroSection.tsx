'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HeroSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section ref={containerRef} className="relative h-[90vh] flex items-center overflow-hidden bg-black">
            {/* Background Image with Parallax */}
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <Image
                    src="/images/reusable/Ub merch.jpg"
                    alt="UB Merch Collection"
                    fill
                    className="object-cover opacity-60 grayscale-[20%] hover:grayscale-0 transition-all duration-1000 scale-110"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-none tracking-tighter">
                            Pusat Koleksi Otentik <br />
                            <span className="text-gradient-gold bg-gradient-to-r from-ub-gold via-yellow-400 to-ub-light-gold bg-clip-text text-transparent">
                                Bumi Brawijaya
                            </span>
                        </h1>

                        <p className="text-xl md:text-lg text-gray-300 max-w-2xl leading-relaxed font-medium">
                            UB Merch & Creative adalah unit bisnis Badan Usaha Non Akademik Universitas Brawijaya (BUNA UB) bidang produk merchandise resmi Universitas Brawijaya dengan kualitas dan pelayanan terbaik.
                        </p>

                        <div className="flex items-center gap-8 pt-8 border-t border-white/10">
                            <div>
                                <p className="text-3xl font-black text-white">1967</p>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">ESTABLISHED</p>
                            </div>
                            <div className="w-[1px] h-12 bg-white/10" />
                            <div>
                                <p className="text-3xl font-black text-white">50K+</p>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">LEGACY PIECES</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Discover</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-ub-gold to-transparent" />
            </motion.div>
        </section >
    );
}
