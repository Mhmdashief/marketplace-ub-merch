'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const partners = [
    { name: 'Fakultas Ekonomi dan Bisnis', logo: '/images/reusable/feb.png' },
    { name: 'Fakultas Hukum', logo: '/images/reusable/fh.png' },
    { name: 'Fakultas Ilmu Administrasi', logo: '/images/reusable/fia.png' },
    { name: 'Fakultas Ilmu Bisnis', logo: '/images/reusable/fib.png' },
    { name: 'Fakultas Ilmu Kesehatan', logo: '/images/reusable/fikes.png' },
    { name: 'Fakultas Ilmu Sosial dan Ilmu Politik', logo: '/images/reusable/fisip.png' },
    { name: 'Fakultas Kedokteran', logo: '/images/reusable/fk.png' },
    { name: 'Fakultas Kedokteran Hewan', logo: '/images/reusable/fkh.png' },
    { name: 'Fakultas Pertanian', logo: '/images/reusable/fp.png' },
    { name: 'Fakultas Perikanan dan Ilmu Kelautan', logo: '/images/reusable/fpik.png' },
    { name: 'Fakultas Teknologi Pertanian', logo: '/images/reusable/ftp.png' },
    { name: 'Fakultas Vokasi', logo: '/images/reusable/vokasi.png' },
    { name: 'Universitas Brawijaya', logo: '/images/reusable/ub.png' },
    { name: 'Bank BTN', logo: '/images/reusable/btn.png' },
];

export default function PartnerMarqueeOnly() {
    const duplicatedPartners = [...partners, ...partners];

    return (
        <section className="py-20 bg-white overflow-hidden">
            {/* Elegant Header Section */}
            <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="text-blue-600 font-medium tracking-widest uppercase text-xs mb-3 block">
                        Collaboration
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif italic text-gray-900 mb-4">
                        Our Trusted Partners
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-gray-200"></div>
                        <p className="text-gray-500 font-light italic">
                            Bekerja sama untuk memberikan yang terbaik
                        </p>
                        <div className="h-[1px] w-12 bg-gray-200"></div>
                    </div>
                </motion.div>
            </div>

            <div className="relative flex overflow-hidden">
                {/* Gradient Overlay */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                <motion.div
                    className="flex whitespace-nowrap items-center"
                    animate={{
                        x: ["0%", "-50%"]
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 80,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedPartners.map((partner, index) => (
                        <div
                            key={`${partner.name}-${index}`}
                            className="mx-4 md:mx-8 flex-shrink-0"
                        >
                            <div className="relative h-50 w-50 md:h-72 md:w-72">
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    fill
                                    className="object-contain transition-all duration-300 cursor-pointer hover:scale-110"
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}