import type { Metadata } from 'next';
import { Calendar, ArrowRight, Heart, Share2 } from 'lucide-react';
import NewsHero from '../components/news/NewsHero';

const csrActivities = [
    {
        id: 1,
        category: 'Social Impact',
        title: 'Gerakan Hati: Peduli Banjir Sumatra',
        date: '9 Januari 2025',
        location: 'Sumatra Barat',
        description: 'UB Merch bersama Civitas Akademika Universitas Brawijaya menggalang solidaritas untuk saudara kita yang terdampak bencana banjir di Sumatra. Sebuah langkah kecil untuk membasuh duka dan membangun kembali harapan.',
        image: '/images/CSR/Charity Sumatra.jpeg',
        videoUrl: 'https://www.instagram.com/reel/DTSimhegfb4/embed',
        stats: [
            { label: 'Relawan', value: 'Solidaritas' },
            { label: 'Bantuan', value: 'Logistik' },
        ]
    }
];

export const metadata: Metadata = {
    title: 'Berita & Update - UB Merchandise',
    description: 'Dapatkan informasi terbaru tentang produk, event, dan update dari UB Merchandise. Berita terkini seputar merchandise resmi Universitas Brawijaya.',
    keywords: 'UB Merch News, Berita UB, Update Produk, Event Merchandise',
};

export default function NewsPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <NewsHero />

            {/* CSR & Social Impact Section - Dynamic & Scalable */}
            <section className="py-20 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <span className="text-ub-navy font-bold tracking-widest text-sm uppercase mb-2 block">Our Responsibility</span>
                            <h2 className="text-4xl md:text-5xl font-black text-ub-navy">
                                JEJAK <span className="text-ub-gold italic font-serif">KEBAIKAN</span>
                            </h2>
                        </div>
                        <p className="text-gray-500 max-w-md text-sm md:text-base leading-relaxed text-balance">
                            Kami percaya bahwa bisnis bukan hanya tentang profit, tapi juga tentang seberapa besar kami bisa memberi arti bagi lingkungan sekitar.
                        </p>
                    </div>

                    {/* CSR Content Render */}
                    <div className="space-y-24">
                        {csrActivities.map((activity, index) => (
                            <div key={activity.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center group`}>

                                {/* Visual Side (Video & Image) */}
                                <div className="w-full lg:w-1/2 relative">
                                    <div className="relative z-10 w-full aspect-video lg:aspect-square max-w-xl mx-auto lg:mx-0">
                                        {/* Back Image Card */}
                                        <div className="absolute top-0 right-0 w-[90%] h-[90%] bg-gray-200 rounded-[2rem] lg:rounded-[3rem] overflow-hidden rotate-6 group-hover:rotate-3 transition-transform duration-700 shadow-2xl">
                                            <div className="absolute inset-0 bg-ub-navy/20 mix-blend-multiply z-10" />
                                            <img
                                                src={activity.image}
                                                alt={activity.title}
                                                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                                            />
                                        </div>

                                        {/* Front Video Card */}
                                        <div className="absolute bottom-0 left-0 w-[50%] sm:w-[55%] aspect-[9/16] bg-black rounded-[1.5rem] lg:rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-white overflow-hidden transform -translate-y-4 lg:translate-y-0 group-hover:-translate-y-4 transition-transform duration-500">
                                            <iframe
                                                src={activity.videoUrl}
                                                className="w-full h-full object-cover"
                                                allowFullScreen
                                                scrolling="no"
                                                title={`${activity.title} Video`}
                                            />
                                        </div>

                                        {/* Decorative Circle */}
                                        <div className="absolute -bottom-10 -left-10 w-24 h-24 lg:w-32 lg:h-32 border border-ub-gold/30 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                            <div className="w-2 h-2 bg-ub-gold rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Text Content Side */}
                                <div className="w-full lg:w-1/2 space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="px-4 py-1 bg-ub-navy/5 text-ub-navy text-xs font-bold tracking-widest uppercase rounded-full">
                                                {activity.category}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                                                <Calendar className="w-3 h-3" /> {activity.date}
                                            </span>
                                        </div>

                                        <h3 className="text-3xl lg:text-5xl font-black text-ub-navy leading-[1.1]">
                                            {activity.title}
                                        </h3>
                                    </div>

                                    <p className="text-lg text-gray-500 leading-relaxed">
                                        {activity.description}
                                    </p>

                                    {/* Stats / Highlights */}
                                    <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-100">
                                        {activity.stats?.map((stat, idx) => (
                                            <div key={idx}>
                                                <h4 className="text-2xl font-black text-ub-gold mb-1">{stat.value}</h4>
                                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <a
                                            href="https://www.instagram.com/reel/DTSimhegfb4/?igsh=eW1hbHBwcWNpNnpq"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <button className="flex items-center gap-2 text-ub-navy font-bold hover:gap-4 transition-all group/btn">
                                                Lihat Dokumentasi Lengkap
                                                <ArrowRight className="w-5 h-5 text-ub-gold group-hover/btn:text-ub-navy transition-colors" />
                                            </button>
                                        </a>
                                        <div className="flex items-center gap-2">
                                            <a href="https://www.instagram.com/ubmerch.id?igsh=dXAyZXg1bjRibWxt">
                                                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-ub-navy hover:text-white hover:border-ub-navy transition-all">
                                                    <Heart className="w-4 h-4" />
                                                </button>
                                            </a>
                                            <a href="https://www.instagram.com/ubmerch.id?igsh=dXAyZXg1bjRibWxt">
                                                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-ub-navy hover:text-white hover:border-ub-navy transition-all">
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
