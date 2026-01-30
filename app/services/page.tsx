import type { Metadata } from 'next';
import ServicesHero from '../components/services/ServicesHero';
import ServiceCard from '../components/services/ServiceCard';
import { Package, Palette, Truck, HeadphonesIcon, Users, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Layanan Kami - UB Merchandise',
    description: 'Jelajahi berbagai layanan yang kami tawarkan: custom merchandise, desain grafis, pengiriman cepat, dan layanan pelanggan terbaik untuk kebutuhan merchandise Anda.',
    keywords: 'Layanan UB Merch, Custom Merchandise, Desain Grafis, Pengiriman, Customer Service',
};

export default function ServicesPage() {
    const services = [
        {
            icon: Package,
            title: 'Custom Merchandise',
            description: 'Wujudkan ide kreatifmu dengan layanan custom merchandise. Kami siap membantu memproduksi merchandise eksklusif untuk kebutuhan pribadi atau organisasi.',
            features: [
                'Minimum order mulai dari 10 pcs',
                'Berbagai pilihan produk (hoodie, kaos, tote bag, dll)',
                'Konsultasi desain gratis',
                'Quality control ketat',
                'Garansi kepuasan 100%'
            ],
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: Palette,
            title: 'Desain Grafis',
            description: 'Tim desainer profesional kami siap membantu mewujudkan konsep desain impianmu menjadi merchandise yang memukau dan berkelas.',
            features: [
                'Desain original dan kreatif',
                'Revisi unlimited hingga puas',
                'File desain resolusi tinggi',
                'Mockup visual produk',
                'Konsultasi branding'
            ],
            color: 'from-purple-500 to-purple-600'
        },
        {
            icon: Truck,
            title: 'Pengiriman Cepat',
            description: 'Sistem logistik terpercaya dengan jaminan pengiriman tepat waktu ke seluruh Indonesia. Pesananmu akan sampai dengan aman dan cepat.',
            features: [
                'Pengiriman ke seluruh Indonesia',
                'Tracking real-time',
                'Packaging aman dan rapi',
                'Free ongkir untuk pembelian tertentu',
                'Asuransi pengiriman tersedia'
            ],
            color: 'from-green-500 to-green-600'
        },
        {
            icon: HeadphonesIcon,
            title: 'Customer Support 24/7',
            description: 'Tim customer service kami siap membantu menjawab pertanyaan dan menyelesaikan kebutuhanmu kapan saja. Kepuasan pelanggan adalah prioritas kami.',
            features: [
                'Respon cepat via WhatsApp',
                'Konsultasi produk gratis',
                'After-sales service terbaik',
                'Panduan lengkap perawatan produk',
                'Penanganan komplain profesional'
            ],
            color: 'from-red-500 to-red-600'
        },
        {
            icon: Users,
            title: 'Kerjasama Institusi',
            description: 'Program khusus untuk organisasi, himpunan, dan fakultas di lingkungan UB. Dapatkan harga spesial dan benefit eksklusif.',
            features: [
                'Harga khusus untuk bulk order',
                'Sistem pembayaran fleksibel',
                'Dedicated account manager',
                'Prioritas produksi',
                'Event sponsorship tersedia'
            ],
            color: 'from-yellow-500 to-orange-500'
        },
        {
            icon: ShieldCheck,
            title: 'Garansi Kualitas',
            description: 'Setiap produk dijamin kualitasnya. Kami hanya menggunakan bahan premium dan proses produksi berstandar tinggi.',
            features: [
                'Bahan berkualitas premium',
                'Quality control berlapis',
                'Garansi produk cacat',
                'Sertifikasi produk',
                'Return & exchange policy jelas'
            ],
            color: 'from-indigo-500 to-indigo-600'
        }
    ];

    return (
        <main className="min-h-screen">
            <ServicesHero />

            {/* Services Grid Section */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-ub-navy mb-4">
                            Yang Kami Tawarkan
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-ub-gold to-ub-light-gold mx-auto mb-6 rounded-full" />
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Layanan komprehensif untuk memenuhi semua kebutuhan merchandise Anda
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <ServiceCard key={index} {...service} index={index} />
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-20 text-center">
                        <div className="bg-gradient-to-r from-ub-navy to-ub-dark-navy rounded-3xl p-12 shadow-2xl">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Siap Memulai Proyekmu?
                            </h3>
                            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                                Hubungi tim kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <a
                                    href="https://wa.me/6282126667575"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-ub-gold hover:bg-ub-light-gold text-ub-navy font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    Hubungi via WhatsApp
                                </a>
                                <a
                                    href="mailto:marketing@ubmerch.id"
                                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-ub-navy font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Email Kami
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
