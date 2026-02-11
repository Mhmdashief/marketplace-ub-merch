'use client';

import { motion } from 'framer-motion';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import { Instagram, Facebook, ArrowRight } from 'lucide-react';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa6';

export default function ContactContent() {
    const socialMedia = [
        { icon: Instagram, url: 'https://instagram.com/ubmerch.id', label: 'Instagram' },
        { icon: FaTiktok, url: 'https://tiktok.com/@ubmerch.id', label: 'TikTok' },
        { icon: FaWhatsapp, url: 'https://wa.me/6282126667575', label: 'WhatsApp' },
        { icon: Facebook, url: 'https://facebook.com/ubmerch.official', label: 'Facebook' },
    ];

    return (
        <div className="bg-white">
            {/* Info Cards Section */}
            <section className="pb-12 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <ContactInfo />
                </div>
            </section>

            {/* Main Form & Interactive Elements */}
            <section className="py-24 bg-gray-50 overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#003366 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                />

                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-start">

                        {/* Left Side: Text & Socials */}
                        <div className="space-y-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl md:text-5xl font-black text-ub-navy mb-8 tracking-tight italic pr-12 leading-[1.1]">
                                    TELL US MORE <br />
                                    ABOUT YOUR <br />
                                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-ub-gold to-yellow-500 pr-6 pb-2">AWESOME IDEAS</span>
                                </h2>
                                <p className="text-xl text-gray-500 leading-relaxed max-w-md">
                                    Gunakan form di samping untuk mulai bercerita. Kami biasanya merespon kurang dari 24 jam.
                                </p>
                            </motion.div>

                            {/* Social Interactive Links - Redesigned */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-400 border-l-2 border-ub-gold pl-4">
                                    Follow our journey
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {socialMedia.map((social, idx) => (
                                        <motion.a
                                            key={idx}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="group flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 transition-all duration-300 hover:border-ub-navy/20 hover:shadow-xl hover:shadow-ub-navy/5"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center transition-colors group-hover:bg-ub-navy">
                                                    <social.icon className="w-5 h-5 text-ub-navy transition-colors group-hover:text-white" />
                                                </div>
                                                <span className="font-bold text-ub-navy tracking-tight">{social.label}</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                                                <ArrowRight className="w-4 h-4 text-ub-gold" />
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Map Preview Image or Stylized Element */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative rounded-[2.5rem] overflow-hidden group shadow-2xl h-64 md:h-80"
                            >
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.4175647886437!2d112.61603681477605!3d-7.953603894288598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78836e862eafbf%3A0x1919d544dfddb2d7!2sUB%20Merchandise%20and%20Creative%20(UB%20Merch)!5e0!3m2!1sen!2sid!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: 'grayscale(1) contrast(1.2) invert(0.1)' }}
                                    allowFullScreen
                                    loading="lazy"
                                    className="scale-110 group-hover:scale-100 transition-transform duration-700 group-hover:filter-none"
                                />
                                <div className="absolute inset-0 bg-ub-navy/20 pointer-events-none group-hover:bg-transparent transition-colors" />
                                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Our Location</p>
                                        <p className="text-ub-navy font-bold">Malang, Indonesia</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-ub-navy text-white flex items-center justify-center">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Side: Contact Form */}
                        <div className="relative pt-8 lg:pt-0">
                            <ContactForm />
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
