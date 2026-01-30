'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MdOutlineShoppingCart, MdSupervisorAccount } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";

export default function StorySection() {
    const milestones = [
        {
            title: 'About Us',
            subtitle: 'THE BEGINNING',
            description: 'Awal mulanya UB Merch & Creative yang telah didirikan pada tahun 2019 adalah hasil inisiasi kerjasama antara BUNA UB, Mahasiswa, dan Alumni UB. Kemudian, secara resmi tercantum dalam Peraturan Rektor Universitas Brawijaya Nomor 66 Tahun 2020 tentang Struktur Organisasi dan Tata Kerja Badan Usaha Non Akademik. Beberapa produk yang dijual merupakan produk merchandise dan souvenir seperti t-shirt, hoodie, jaket, tas, tumbler, mug dan produk lainnya. Sedangkan untuk produk kreatif, melayani pembuatan berbagai macam jasa seperti pembuatan video profil, virtual tour, dokumentasi, foto produk, desain logo, branding dan jasa lainnya.',
            align: 'left'
        },
        {
            title: 'Visi & Misi',
            subtitle: 'OUR DIRECTION',
            type: 'vision-mission',
            vision: {
                title: 'VISI',
                content: 'Menjadi role model unit bisnis Badan Usaha Non Akademik Universitas Brawijaya (BUNA UB) yang kreatif, profesional, mandiri, dan berorientasi strategi jangka panjang.'
            },
            mission: {
                title: 'MISI',
                items: [
                    {
                        icon: 'service',
                        title: 'Pelayanan Terbaik',
                        description: 'Memberikan pelayanan terbaik kepada pelanggan dan rekan bisnis'
                    },
                    {
                        icon: 'quality',
                        title: 'Produk Berkualitas',
                        description: 'Memberikan produk yang berkualitas untuk memenuhi kebutuhan pelanggan'
                    },
                    {
                        icon: 'professional',
                        title: 'Profesional',
                        description: 'Menjaga komitmen untuk selalu memberikan solusi, pelayanan dan kualitas terbaik kepada pelanggan dan rekan bisnis'
                    }
                ]
            }
        }
    ];

    // Icon component function
    const getIcon = (iconType: string) => {
        switch (iconType) {
            case 'service':
                return <MdOutlineShoppingCart className="w-12 h-12" />;
            case 'quality':
                return <GrStatusGood className="w-12 h-12" />;
            case 'professional':
                return <MdSupervisorAccount className="w-12 h-12" />;
            default:
                return null;
        }
    };

    return (
        <section className="py-32 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-[10px] font-black uppercase tracking-[0.5em] text-ub-gold mb-4 block"
                        >
                            History & Philosophy
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.9] tracking-tighter"
                        >
                            A JOURNEY OF <br />
                            <span className="italic font-serif font-normal text-ub-navy">Excellence.</span>
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="max-w-md text-gray-500 font-medium leading-relaxed"
                    >
                        Pelayanan Terbaik dan Produk Berkualitas
                        UB Merchandise & Creative berkomitmen memberikan layanan terbaik sesuai kebutuhan Anda. Jangan ragu, kami siap membantu!
                    </motion.p>
                </div>

                {/* Asymmetric Content Grid */}
                <div className="space-y-32">
                    {milestones.map((milestone, index) => (
                        <div key={index}>
                            {milestone.type === 'vision-mission' ? (
                                // Vision & Mission Cards Layout
                                <div className="space-y-12">
                                    {/* Section Title */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        className="text-center space-y-4"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                                            {milestone.subtitle}
                                        </span>
                                        <h3 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                                            {milestone.title}
                                        </h3>
                                    </motion.div>

                                    <div className="space-y-16">
                                        {/* Vision Card */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="group relative bg-gradient-to-br from-ub-navy to-ub-dark-navy rounded-[2.5rem] p-10 overflow-hidden max-w-4xl mx-auto"
                                        >
                                            {/* Decorative Elements */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-ub-gold/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

                                            <div className="relative z-10 space-y-6">
                                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-ub-gold/20 border border-ub-gold/30 rounded-full">
                                                    <div className="w-2 h-2 bg-ub-gold rounded-full animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ub-gold">
                                                        {milestone.vision.title}
                                                    </span>
                                                </div>

                                                <p className="text-xl text-white/90 leading-relaxed font-medium">
                                                    {milestone.vision.content}
                                                </p>
                                            </div>
                                        </motion.div>

                                        {/* Mission Section - Full Width Dark Background */}
                                        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-[2.5rem] overflow-hidden">
                                            {/* Background Pattern */}
                                            <div className="absolute inset-0 opacity-5">
                                                <div className="absolute inset-0" style={{
                                                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.3) 1px, transparent 0)',
                                                    backgroundSize: '48px 48px'
                                                }} />
                                            </div>

                                            <div className="relative z-10 space-y-12">
                                                {/* Mission Title */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    className="text-center"
                                                >
                                                    <h4 className="text-4xl md:text-5xl font-black text-white mb-2">
                                                        {milestone.mission.title}
                                                    </h4>
                                                </motion.div>

                                                {/* Mission Cards Grid */}
                                                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                                    {milestone.mission.items.map((item, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, y: 30 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.3 + idx * 0.15 }}
                                                            className="group text-center space-y-6"
                                                        >
                                                            {/* Icon Container */}
                                                            <div className="flex justify-center">
                                                                <div className="relative">
                                                                    <div className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center text-white group-hover:border-ub-gold/50 transition-all duration-500 group-hover:scale-110">
                                                                        {getIcon(item.icon)}
                                                                    </div>
                                                                    {/* Glow effect */}
                                                                    <div className="absolute inset-0 rounded-full bg-ub-gold/0 group-hover:bg-ub-gold/20 blur-xl transition-all duration-500" />
                                                                </div>
                                                            </div>

                                                            {/* Title */}
                                                            <h5 className="text-xl font-black text-white group-hover:text-ub-gold transition-colors">
                                                                {item.title}
                                                            </h5>

                                                            {/* Description */}
                                                            <p className="text-gray-400 leading-relaxed font-medium group-hover:text-gray-300 transition-colors">
                                                                {item.description}
                                                            </p>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // About Us Layout (existing)
                                <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 lg:gap-24`}>
                                    {/* Image Placeholder/Graphic */}
                                    <motion.div
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        className="relative flex-1 aspect-[4/5] w-full"
                                    >
                                        <div className="absolute inset-0 bg-gray-100 rounded-[3rem] overflow-hidden">
                                            <Image
                                                src="/images/reusable/Ub merch.jpg"
                                                alt="UB Merch Story"
                                                fill
                                                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-ub-navy/10 mix-blend-multiply" />
                                        </div>
                                    </motion.div>

                                    {/* Text Content */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        className="flex-1 space-y-6"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                                            {milestone.subtitle}
                                        </span>
                                        <h3 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                                            {milestone.title}
                                        </h3>
                                        <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                            {milestone.description}
                                        </p>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
