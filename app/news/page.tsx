import type { Metadata } from 'next';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import NewsHero from '@/components/news/NewsHero';
import { getPublicArticles } from '@/app/actions/news';

export const metadata: Metadata = {
    title: 'Berita & Update - UB Merchandise',
    description: 'Dapatkan informasi terbaru tentang produk, event, dan update dari UB Merchandise. Berita terkini seputar merchandise resmi Universitas Brawijaya.',
    keywords: 'UB Merch News, Berita UB, Update Produk, Event Merchandise',
};

// Pastikan data yang ditampilkan selalu baru
export const dynamic = 'force-dynamic';

export default async function NewsPage() {
    const articles = await getPublicArticles();

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <NewsHero />

            {/* Articles List Section */}
            <section className="py-20 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <span className="text-ub-navy font-bold tracking-widest text-sm uppercase mb-2 block">Our Stories</span>
                            <h2 className="text-4xl md:text-5xl font-black text-ub-navy">
                                LATEST <span className="text-ub-gold italic font-serif">NEWS</span>
                            </h2>
                        </div>
                        <p className="text-gray-500 max-w-md text-sm md:text-base leading-relaxed text-balance">
                            Temukan cerita inspiratif, berita terkini, dan informasi eksklusif seputar ekosistem UB Merchandise.
                        </p>
                    </div>

                    {/* Articles Grid */}
                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {articles.map((article) => (
                                <Link 
                                    href={`/news/${article.slug}`} 
                                    key={article.id}
                                    className="group flex flex-col bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                                >
                                    {/* Article Image */}
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                        {article.imageUrl ? (
                                            <img
                                                src={article.imageUrl}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                                <span className="text-xs font-bold tracking-widest uppercase">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-ub-navy text-[10px] font-black tracking-widest uppercase rounded-xl shadow-sm">
                                                {article.category || 'News'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Article Content */}
                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                            <Calendar className="w-3 h-3" /> 
                                            {new Date(article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>

                                        <h3 className="text-xl font-black text-ub-navy leading-tight mb-4 group-hover:text-ub-gold transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>

                                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6 flex-1">
                                            {article.excerpt || 'Baca selengkapnya mengenai berita ini di halaman artikel...'}
                                        </p>

                                        <div className="flex items-center gap-2 text-ub-gold text-[10px] font-black uppercase tracking-[0.2em] mt-auto">
                                            Read Article
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Belum ada artikel yang dipublikasikan.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
