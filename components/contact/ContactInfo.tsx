'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const infoItems = [
    {
        icon: Mail,
        title: 'EMAIL',
        details: [
            { label: 'General Inquiry', value: 'hello@ubmerch.id', isEmail: true },
            { label: 'Marketing & CRM', value: 'marketing@ubmerch.id', isEmail: true },
            { label: 'Business & Office', value: 'ubmerch@ub.ac.id', isEmail: true }
        ],
        desc: 'Our team typically responds within 24 hours.'
    },
    {
        icon: Phone,
        title: 'WHATSAPP',
        details: [
            { label: 'Customer Support', value: '+62 821 2666 7575', link: 'https://wa.me/6282126667575' },
            { label: 'Operational Hours', value: '09.00 - 17.00 WIB', isStatic: true }
        ],
        desc: 'Available for quick chat and fast response.'
    },
    {
        icon: MapPin,
        title: 'OUR OFFICE',
        details: [
            { label: 'Main Studio', value: 'Universitas Brawijaya', isStatic: true },
            { label: 'City / Location', value: 'Malang, Jawa Timur', link: 'https://www.google.com/maps/place/UB+Merchandise+and+Creative+(UB+Merch)/' }
        ],
        desc: 'Visit us for creative discussions & gallery.'
    }
];

export default function ContactInfo() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:items-stretch">
            {infoItems.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: index * 0.15 }}
                    className="group relative h-full flex flex-col bg-[#0b1221] rounded-[3rem] p-10 transition-all duration-700 border border-white/5 hover:border-ub-gold/40 hover:shadow-[0_40px_100px_-20px_rgba(184,142,47,0.15)] overflow-hidden"
                >
                    {/* Artistic Background Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ub-gold/20 rounded-full blur-[80px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    {/* Subtle Internal Glow */}
                    <div className="absolute -inset-24 bg-ub-gold/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="relative z-10 flex-grow flex flex-col">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center mb-12 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-ub-gold group-hover:border-ub-gold">
                            <item.icon className="w-7 h-7 text-ub-gold transition-colors duration-500 group-hover:text-ub-navy" />
                        </div>

                        <span className="block text-[10px] font-black tracking-[0.4em] text-ub-gold mb-6 opacity-60 group-hover:opacity-100 transition-opacity uppercase">
                            {item.title}
                        </span>

                        <div className="space-y-6 mb-10">
                            {item.details.map((detail: any, dIdx: number) => (
                                <div key={dIdx} className="group/detail">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 group-hover/detail:text-gray-400 transition-colors">
                                        {detail.label}
                                    </p>
                                    {detail.isStatic ? (
                                        <p className="text-white font-bold text-lg md:text-xl tracking-tight leading-tight">
                                            {detail.value}
                                        </p>
                                    ) : (
                                        <a
                                            href={detail.isEmail ? `mailto:${detail.value}` : detail.link}
                                            target={detail.isEmail ? undefined : "_blank"}
                                            rel={detail.isEmail ? undefined : "noopener noreferrer"}
                                            className="text-white hover:text-ub-gold font-bold text-lg md:text-xl tracking-tight leading-tight transition-all relative inline-block break-words"
                                        >
                                            {detail.value}
                                            <span className="absolute left-0 bottom-0 w-0 h-px bg-ub-gold transition-all duration-300 group-hover/detail:w-full" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto">
                            <p className="text-gray-500 group-hover:text-gray-400 transition-colors text-xs font-medium leading-relaxed italic border-l-2 border-white/10 pl-4 group-hover:border-ub-gold/40 text-balance">
                                {item.desc}
                            </p>
                        </div>
                    </div>

                    {/* Background Numbering */}
                    <div className="absolute -bottom-6 -right-4 text-9xl font-black text-white/[0.02] group-hover:text-ub-gold/[0.04] transition-all duration-1000 select-none pointer-events-none group-hover:scale-110">
                        {index + 1}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
