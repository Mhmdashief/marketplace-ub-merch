import type { Metadata } from 'next';
import ContactForm from '../components/contact/ContactForm';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa6';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Hubungi Kami - UB Merchandise',
    description: 'Hubungi UB Merchandise untuk pertanyaan, custom order, atau kerjasama. Tim kami siap membantu Anda dengan layanan customer service terbaik.',
    keywords: 'Kontak UB Merch, Hubungi UB Merch, Customer Service, WhatsApp, Email',
};

export default function ContactPage() {
    const contactInfo = [
        {
            icon: MapPin,
            title: 'Alamat',
            details: [
                'Gedung Utara Asrama Mahasiswa',
                'GOR Pertamina Universitas Brawijaya',
                'Jl. Veteran, Ketawanggede, Lowokwaru',
                'Kota Malang, Jawa Timur 65145'
            ],
            link: 'https://www.google.com/maps/place/UB+Merchandise+and+Creative+(UB+Merch)/@-7.9536039,112.6160368,17z/data=!3m1!4b1!4m6!3m5!1s0x2e78836e862eafbf:0x1919d544dfddb2d7!8m2!3d-7.9536039!4d112.6160368!16s%2Fg%2F11kqg2bkj7',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: Phone,
            title: 'Telepon',
            details: ['+62 821-2666-7575'],
            link: 'tel:+6282126667575',
            color: 'from-green-500 to-green-600'
        },
        {
            icon: Mail,
            title: 'Email',
            details: [
                'hello@ubmerch.id',
                'marketing@ubmerch.id',
                'ubmerch@ub.ac.id'
            ],
            link: 'mailto:hello@ubmerch.id',
            color: 'from-purple-500 to-purple-600'
        },
        {
            icon: Clock,
            title: 'Jam Operasional',
            details: [
                'Senin - Jumat: 09:00 - 17:00',
                'Sabtu: 09:00 - 15:00',
                'Minggu & Libur: Tutup'
            ],
            color: 'from-orange-500 to-red-500'
        }
    ];

    const socialMedia = [
        {
            name: 'Instagram',
            icon: Instagram,
            url: 'https://www.instagram.com/ubmerch.id/',
            color: 'hover:bg-pink-600',
            username: '@ubmerch.id'
        },
        {
            name: 'TikTok',
            icon: FaTiktok,
            url: 'https://www.tiktok.com/@ubmerch.id',
            color: 'hover:bg-black',
            username: '@ubmerch.id'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: 'https://www.facebook.com/ubmerch.official',
            color: 'hover:bg-blue-600',
            username: 'UB Merch Official'
        },
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            url: 'https://wa.me/6282126667575',
            color: 'hover:bg-green-600',
            username: '+62 821-2666-7575'
        }
    ];

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-ub-navy via-ub-dark-navy to-black text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(212, 175, 55, 0.15) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Hubungi <span className="text-gradient-gold bg-gradient-to-r from-ub-gold via-yellow-400 to-ub-light-gold bg-clip-text text-transparent">Kami</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Kami siap membantu menjawab pertanyaan dan melayani kebutuhan merchandise Anda
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-ub-gold rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-ub-gold rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
            </section>

            {/* Contact Info Grid */}
            <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {contactInfo.map((info, index) => (
                            <div
                                key={index}
                                className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-ub-gold"
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                                    <info.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-xl text-ub-navy mb-3">{info.title}</h3>
                                {info.link ? (
                                    <a
                                        href={info.link}
                                        target={info.link.startsWith('http') ? '_blank' : undefined}
                                        rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="text-gray-600 hover:text-ub-gold transition-colors"
                                    >
                                        {info.details.map((detail, idx) => (
                                            <p key={idx} className="text-sm mb-1">{detail}</p>
                                        ))}
                                    </a>
                                ) : (
                                    info.details.map((detail, idx) => (
                                        <p key={idx} className="text-gray-600 text-sm mb-1">{detail}</p>
                                    ))
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Main Content: Form + Map */}
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <ContactForm />

                        {/* Map & Social Media */}
                        <div className="space-y-8">
                            {/* Map */}
                            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 h-96">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.4175647886437!2d112.61603681477605!3d-7.953603894288598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78836e862eafbf%3A0x1919d544dfddb2d7!2sUB%20Merchandise%20and%20Creative%20(UB%20Merch)!5e0!3m2!1sen!2sid!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="UB Merch Location"
                                />
                            </div>

                            {/* Social Media */}
                            <div className="bg-gradient-to-br from-ub-navy to-ub-dark-navy rounded-3xl shadow-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-6">Ikuti Kami</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {socialMedia.map((social, index) => (
                                        <Link
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`group flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl ${social.color} transition-all duration-300 hover:scale-105`}
                                        >
                                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                <social.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-semibold text-sm">{social.name}</p>
                                                <p className="text-gray-300 text-xs truncate">{social.username}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Response Banner */}
                            <div className="bg-gradient-to-r from-ub-gold to-ub-light-gold rounded-3xl p-6 text-center shadow-lg">
                                <p className="text-ub-navy font-bold text-lg mb-2">
                                    🚀 Respon Cepat Dijamin!
                                </p>
                                <p className="text-ub-dark-navy text-sm">
                                    Tim kami akan merespons dalam waktu maksimal 2 jam di hari kerja
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Preview Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-ub-navy mb-4">
                        Punya Pertanyaan?
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Lihat FAQ kami untuk jawaban cepat atas pertanyaan umum
                    </p>
                    <Link
                        href="/faq"
                        className="inline-flex items-center gap-2 bg-ub-navy text-white font-bold px-8 py-4 rounded-2xl hover:bg-ub-dark-navy transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                        Lihat FAQ
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </main>
    );
}
