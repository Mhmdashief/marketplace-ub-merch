'use client';

import { motion } from 'framer-motion';

export default function ServicesHero() {
    return (
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-ub-navy via-ub-dark-navy to-black">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(212, 175, 55, 0.15) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                        Layanan <span className="text-gradient-gold bg-gradient-to-r from-ub-gold via-yellow-400 to-ub-light-gold bg-clip-text text-transparent">Kami</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Solusi Merchandise Lengkap untuk Kebutuhan Pribadi dan Institusi
                    </p>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-ub-gold rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-ub-gold rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </section>
    );
}
