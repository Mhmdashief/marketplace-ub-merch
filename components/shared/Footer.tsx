'use client';

import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTiktok, FaWhatsapp, FaFacebookF } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/auth');
    const isAdminPage = pathname?.startsWith('/admin');

    if (isAuthPage || isAdminPage) return null;

    return (
        <footer className="bg-black text-white border-t border-gray-900">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">

                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">

                    {/* Brand Info (takes 5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <Image
                            src="/images/reusable/Logo Ub Merch.png"
                            alt="UB Merch Logo"
                            width={150}
                            height={50}
                            className="h-10 w-auto brightness-0 invert"
                        />
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Official merchandise store Universitas Brawijaya. Tunjukkan kebanggaanmu sebagai bagian dari keluarga besar UB!
                        </p>

                        <div className="flex items-center space-x-3 pt-2">
                            <a
                                href="https://www.instagram.com/ubmerch.id/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-105"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a
                                href="https://www.facebook.com/ubmerch.official"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-105"
                                aria-label="Facebook"
                            >
                                <FaFacebookF className="w-4 h-4" />
                            </a>
                            <a
                                href="https://www.tiktok.com/@ubmerch.id"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-105"
                                aria-label="TikTok"
                            >
                                <FaTiktok className="w-4 h-4" />
                            </a>
                            <a
                                href="https://wa.me/6282126667575"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-105"
                                aria-label="WhatsApp"
                            >
                                <FaWhatsapp className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="lg:col-span-3">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-gray-400">Quick Action</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                                    Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="/merchandise" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                                    Semua Produk
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                                    FAQ / Bantuan
                                </Link>
                            </li>
                            <li>
                                <a href="https://wa.me/6282126667575" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                                    Hubungi Kami
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info  */}
                    <div className="lg:col-span-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-gray-400">Kontak Resmi</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-4 h-4 text-ub-gold flex-shrink-0 mt-1" />
                                <span className="text-gray-400 text-sm leading-relaxed">
                                    <a href="https://www.google.com/maps/place/UB+Merchandise+and+Creative+(UB+Merch)/@-7.9536039,112.6160368,17z/data=!3m1!4b1!4m6!3m5!1s0x2e78836e862eafbf:0x1919d544dfddb2d7!8m2!3d-7.9536039!4d112.6160368!16s%2Fg%2F11kqg2bkj7?entry=ttu&g_ep=EgoyMDI2MDEyMS4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition-colors"
                                    >
                                        Gedung Utara Asrama Mahasiswa, GOR Pertamina Universitas Brawijaya, Malang
                                    </a>
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-ub-gold flex-shrink-0" />
                                <span className="text-gray-400 text-sm hover:text-white transition-colors">
                                    <a href="https://wa.me/6282126667575" target="_blank" rel="noopener noreferrer">
                                        +62 821 2666 7575
                                    </a>
                                </span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Mail className="w-4 h-4 text-ub-gold flex-shrink-0 mt-1" />
                                <div className="text-gray-400 text-sm space-y-1">
                                    <a href="mailto:hello@ubmerch.id" className="block hover:text-white transition-colors">
                                        hello@ubmerch.id
                                    </a>
                                    <a href="mailto:marketing@ubmerch.id" className="block hover:text-white transition-colors">
                                        marketing@ubmerch.id
                                    </a>
                                    <a href="mailto:ubmerch@ub.ac.id" className="block hover:text-white transition-colors">
                                        ubmerch@ub.ac.id
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <p className="text-gray-500 text-xs text-center md:text-left">
                        © {currentYear} UB Merchandise. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
