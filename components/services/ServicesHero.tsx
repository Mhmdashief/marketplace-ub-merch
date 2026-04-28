'use client';

import { motion } from 'framer-motion';

export default function ServicesHero() {
    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center bg-white overflow-hidden pt-20">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-ub-gold/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-ub-navy/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="block text-ub-navy font-bold tracking-widest uppercase text-sm mb-6">
                        Our Expertise
                    </span>
                    <h1 className="text-5xl sm:text-6xl md:text-9xl font-black text-ub-navy tracking-tighter leading-[0.9] mb-12">
                        CRAFTING <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-ub-gold to-yellow-500">
                            EXCELLENCE.
                        </span>
                    </h1>
                </motion.div>

                <div className="grid md:grid-cols-12 gap-8 items-end">
                    <div className="md:col-span-5 md:col-start-8">
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium"
                        >
                            Kami memadukan kreativitas visual dengan strategi bisnis untuk menghadirkan solusi merchandise dan branding yang tidak hanya indah, tapi juga berdampak.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="mt-12 w-full h-[1px] bg-gray-200"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
