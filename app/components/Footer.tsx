import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* About Section */}
                    <div className="space-y-6">
                        <Image
                            src="/images/reusable/Logo Ub Merch.png"
                            alt="UB Merch Logo"
                            width={140}
                            height={48}
                            className="h-12 w-auto brightness-0 invert"
                        />
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Official merchandise store Universitas Brawijaya. Tunjukkan kebanggaanmu sebagai bagian dari keluarga besar UB!
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Semua Produk
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Syarat & Ketentuan
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white">Customer Service</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Hubungi Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Pengiriman
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Pengembalian
                                </Link>
                            </li>
                            <li>
                                <Link href="/track" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Lacak Pesanan
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white">Kontak</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-400 text-sm leading-relaxed">
                                    Jl. Veteran, Malang, Jawa Timur 65145
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">
                                    +62 341 551611
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">
                                    merch@ub.ac.id
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 my-8"></div>

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Copyright */}
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        © {currentYear} UB Merch. All rights reserved. Universitas Brawijaya.
                    </p>

                    {/* Social Media */}
                    <div className="flex items-center space-x-4">
                        <a
                            href="https://facebook.com/ubofficial"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-110"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a
                            href="https://instagram.com/ubofficial"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-110"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="https://twitter.com/ubofficial"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-110"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
