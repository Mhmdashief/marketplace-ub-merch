import type { Metadata } from 'next';
import NewsGrid from '../components/news/NewsGrid';

export const metadata: Metadata = {
    title: 'Berita & Update - UB Merchandise',
    description: 'Dapatkan informasi terbaru tentang produk, event, dan update dari UB Merchandise. Berita terkini seputar merchandise resmi Universitas Brawijaya.',
    keywords: 'UB Merch News, Berita UB, Update Produk, Event Merchandise',
};

export default function NewsPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
                        Berita & <span className="text-gradient-gold bg-gradient-to-r from-ub-gold via-yellow-400 to-ub-light-gold bg-clip-text text-transparent">Update</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Tetap terhubung dengan berita terbaru, peluncuran produk, dan event spesial dari UB Merch
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-ub-gold rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-ub-gold rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
            </section>

            {/* News Grid Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filter/Category Section (Optional for future) */}
                    <div className="mb-12 flex flex-wrap gap-3 justify-center">
                        {['Semua', 'Produk Baru', 'Event', 'Kolaborasi', 'Sustainability', 'Tips & Trik'].map((category) => (
                            <button
                                key={category}
                                className={`px-6 py-2 rounded-full transition-all duration-300 ${category === 'Semua'
                                    ? 'bg-ub-navy text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <NewsGrid />
                </div>
            </section>
        </main>
    );
}
