'use client';

import { motion } from 'framer-motion';

export default function ContactHero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-white overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-gradient-to-br from-ub-gold/10 to-transparent rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[50%] bg-gradient-to-tr from-ub-navy/5 to-transparent rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.3em] uppercase bg-ub-navy text-white rounded-full">
                                Contact Us
                            </span>
                            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-ub-navy leading-[1.1] tracking-tight mb-8 italic pr-4 md:pr-12">
                                LET&apos;S START <br />
                                A <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-ub-gold to-yellow-500 pr-2 md:pr-8 pb-2">PROJECT</span>
                            </h1>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="md:max-w-xs pb-4"
                    >
                        <p className="text-xl text-gray-700 leading-relaxed italic border-l-2 border-ub-gold pl-6">
                            Kami percaya setiap kolaborasi besar dimulai dengan satu percakapan sederhana. Mari wujudkan ide Anda.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
