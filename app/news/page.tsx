import type { Metadata } from 'next';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
        <main className="min-h-screen bg-white">
            {/* Elegant Typography Hero */}
            <NewsHero />

            {/* Articles Section */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                            {articles.map((article) => (
                                <Link
                                    href={`/news/${article.slug}`}
                                    key={article.id}
                                    className="group flex flex-col"
                                >
                                    {/* Ultra Clean Image Container */}
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 rounded-2xl mb-6">
                                        {article.imageUrl ? (
                                            <Image
                                                src={article.imageUrl}
                                                alt={article.title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-xs text-gray-300 font-bold uppercase tracking-widest">No Image</span>
                                            </div>
                                        )}
                                        {/* Minimal Category Badge */}
                                        {article.category && (
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-ub-navy text-[10px] font-black tracking-widest uppercase rounded-md shadow-sm">
                                                    {article.category}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Typography-focused Content */}
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-3 text-gray-600 text-xs font-semibold mb-3">
                                            <time>{new Date(article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-black text-ub-navy leading-tight mb-4 group-hover:text-ub-gold transition-colors">
                                            {article.title}
                                        </h3>

                                        <p className="text-gray-700 leading-relaxed line-clamp-2 mb-6">
                                            {article.excerpt || 'Baca selengkapnya mengenai berita ini di halaman artikel...'}
                                        </p>

                                        <div className="inline-flex items-center gap-2 text-ub-navy text-xs font-black uppercase tracking-widest mt-auto group-hover:gap-4 transition-all">
                                            Read Article
                                            <ArrowRight className="w-4 h-4 text-ub-gold" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 mb-6 flex items-center justify-center">
                                <Calendar className="w-12 h-12 text-gray-200 stroke-[1.5]" />
                            </div>
                            <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest mb-2">Belum Ada Berita</h3>
                            <p className="text-gray-400">Konten terbaru akan segera dipublikasikan.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
