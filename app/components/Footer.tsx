import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTiktok, FaWhatsapp, FaFacebookF } from 'react-icons/fa6';
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
                                <Link href="https://wa.me/6282126667575" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Hubungi Kami
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
                        <h3 className="font-bold text-lg mb-6 text-white">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-400 text-sm leading-relaxed">
                                    <a href="https://www.google.com/maps/place/UB+Merchandise+and+Creative+(UB+Merch)/@-7.9536039,112.6160368,17z/data=!3m1!4b1!4m6!3m5!1s0x2e78836e862eafbf:0x1919d544dfddb2d7!8m2!3d-7.9536039!4d112.6160368!16s%2Fg%2F11kqg2bkj7?entry=ttu&g_ep=EgoyMDI2MDEyMS4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D"
                                        className="hover:text-white transition-colors"
                                    >Gedung Utara Asrama Mahasiswa,GOR Pertamina Universitas Brawijaya Jl. Veteran No.Depan, Ketawanggede, Lowokwaru, Malang City, East Java 65145
                                    </a>
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">
                                    +62 82126667575
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">
                                    <a
                                        href="mailto:hello@ubmerch.id"
                                        className="hover:text-white transition-colors duration-200"
                                    >
                                        hello@ubmerch.id
                                    </a>
                                    <br />

                                    <a
                                        href="mailto:marketing@ubmerch.id"
                                        className="hover:text-white transition-colors duration-200"
                                    >
                                        marketing@ubmerch.id
                                    </a>
                                    <br />

                                    <a
                                        href="mailto:ubmerch@ub.ac.id"
                                        className="hover:text-white transition-colors duration-200"
                                    >
                                        ubmerch@ub.ac.id
                                    </a>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Marketplace Shortcuts Section */}
                <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 mb-12 border border-white/5 relative overflow-hidden group/marketplace">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent)] opacity-0 group-hover/marketplace:opacity-100 transition-opacity duration-1000"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-bold text-white mb-2">Tersedia di Marketplace</h3>
                            <p className="text-gray-400">Belanja koleksi pilihan kami lebih mudah & aman di platform favorit Anda</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6">
                            <Link
                                href="https://shopee.co.id/ubmerchandise"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/shopee flex items-center justify-center bg-white h-20 px-10 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(238,77,45,0.25)] relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-orange-50 group-hover/shopee:bg-white transition-colors"></div>
                                <Image
                                    src="/images/reusable/shopee.png"
                                    alt="Shopee UB Merch"
                                    width={160}
                                    height={60}
                                    className="h-10 w-auto object-contain relative z-10 transition-transform duration-500 group-hover/shopee:scale-110"
                                />
                            </Link>

                            <Link
                                href="https://www.tokopedia.com/ubmerchandise/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/tokopedia flex items-center justify-center bg-white h-20 px-10 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(3,172,14,0.25)] relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-green-50 group-hover/tokopedia:bg-white transition-colors"></div>
                                <Image
                                    src="/images/reusable/tokopedia.png"
                                    alt="Tokopedia UB Merch"
                                    width={160}
                                    height={60}
                                    className="h-10 w-auto object-contain relative z-10 transition-transform duration-500 group-hover/tokopedia:scale-110"
                                />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 my-8"></div>

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Copyright */}
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        © {currentYear} UB Merchandise. All rights reserved.
                    </p>

                    {/* Social Media */}
                    <div className="flex items-center space-x-4">
                        <a
                            href="https://www.instagram.com/ubmerch.id/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-110"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="https://www.facebook.com/ubmerch.official"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-110"
                            aria-label="Facebook"
                        >
                            <FaFacebookF className="w-5 h-5" />
                        </a>
                        <a
                            href="https://www.tiktok.com/@ubmerch.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-110"
                            aria-label="TikTok"
                        >
                            <FaTiktok className="w-5 h-5" />
                        </a>

                        <a
                            href="https://wa.me/6282126667575"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-110"
                            aria-label="WhatsApp"
                        >
                            <FaWhatsapp className="w-5 h-5" />
                        </a>


                    </div>
                </div>
            </div>
        </footer>
    );
}

