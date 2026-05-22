import { getArticleBySlug, getRecentArticles } from '@/app/actions/news';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft, Tag, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) return { title: 'Artikel Tidak Ditemukan - UB Merch' };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ubmerch.co.id';
    const imageUrl = article.imageUrl
        ? `${baseUrl}${article.imageUrl}`
        : `${baseUrl}/images/reusable/Logo Ub Merch.png`;

    return {
        title: `${article.title} - UB Merchandise`,
        description: article.excerpt || article.title,
        openGraph: {
            title: `${article.title} - UB Merchandise`,
            description: article.excerpt || article.title,
            images: [{ url: imageUrl, width: 1200, height: 630, alt: article.title }],
            type: 'article',
            locale: 'id_ID',
            publishedTime: article.createdAt.toISOString(),
            modifiedTime: article.updatedAt.toISOString(),
        },
        twitter: {
            card: 'summary_large_image',
            title: `${article.title} - UB Merchandise`,
            description: article.excerpt || article.title,
            images: [imageUrl],
        },
    };
}

export default async function ArticleDetailPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const [article, recentArticles] = await Promise.all([
        getArticleBySlug(slug),
        getRecentArticles(slug, 5),
    ]);

    if (!article) notFound();



    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
                    <Link href="/" className="hover:text-ub-navy transition-colors">Beranda</Link>
                    <span>/</span>
                    <Link href="/news" className="hover:text-ub-navy transition-colors">News</Link>
                    <span>/</span>
                    <span className="text-ub-navy font-semibold line-clamp-1">{article.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* MAIN CONTENT*/}
                    <div className="lg:col-span-2">
                        {/* Hero Image */}
                        {article.imageUrl && (
                            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-200 mb-8 shadow-xl">
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />

                            </div>
                        )}

                        {/* Article Header */}
                        <header className="mb-8">


                            <h1 className="text-2xl sm:text-4xl font-black text-ub-navy leading-tight mb-6 uppercase">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-gray-400 pb-6 border-b border-gray-200">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(article.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </div>
                                {article.category && (
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5" />
                                        {article.category}
                                    </div>
                                )}
                            </div>

                            {article.excerpt && (
                                <p className="text-base text-gray-600 leading-relaxed mt-6 italic border-l-4 border-ub-gold pl-5 font-medium whitespace-pre-wrap">
                                    {article.excerpt}
                                </p>
                            )}
                        </header>

                        {/* Article Content */}
                        <div
                            className="prose prose-base max-w-none whitespace-pre-wrap text-gray-600
                                prose-headings:font-black prose-headings:text-ub-navy 
                                prose-p:text-gray-600 prose-p:leading-relaxed
                                prose-a:text-ub-gold prose-a:no-underline hover:prose-a:underline 
                                prose-img:rounded-2xl prose-img:shadow-lg
                                prose-strong:text-ub-navy
                                prose-blockquote:border-l-ub-gold prose-blockquote:text-gray-500"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Footer nav */}
                        <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between gap-4 flex-wrap">
                            <Link
                                href="/news"
                                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ub-navy hover:text-ub-gold transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke News
                            </Link>
                        </div>
                    </div>

                    {/*  SIDEBAR */}
                    <aside className="space-y-8">
                        {/* Recent Articles */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden sticky top-28">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                                <div className="w-1 h-5 bg-ub-navy rounded-full" />
                                <h2 className="text-sm font-black text-ub-navy uppercase tracking-widest">
                                    Berita Terbaru
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {recentArticles.length === 0 ? (
                                    <p className="text-xs text-gray-400 text-center py-8 px-6">Belum ada artikel lain</p>
                                ) : (
                                    recentArticles.map((a) => (
                                        <Link
                                            key={a.id}
                                            href={`/news/${a.slug}`}
                                            className="flex gap-4 p-4 hover:bg-gray-50 transition-colors group"
                                        >
                                            {/* Thumbnail */}
                                            <div className="flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden bg-gray-100">
                                                {a.imageUrl ? (
                                                    <img
                                                        src={a.imageUrl}
                                                        alt={a.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-[8px] text-gray-400 font-bold uppercase">No Img</span>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Info */}
                                            <div className="flex-1 min-w-0">

                                                <p className="text-[11px] font-black text-ub-navy leading-tight line-clamp-2 group-hover:text-ub-gold transition-colors">
                                                    {a.title}
                                                </p>
                                                <p className="text-[9px] text-gray-400 font-semibold mt-1">
                                                    {new Date(a.createdAt).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'long', year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>

                            <div className="px-6 py-4 border-t border-gray-50">
                                <Link
                                    href="/news"
                                    className="block text-center text-[10px] font-black uppercase tracking-widest text-ub-gold hover:text-ub-navy transition-colors"
                                >
                                    Lihat Semua →
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
