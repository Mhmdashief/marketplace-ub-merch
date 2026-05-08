import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAdminArticles } from '@/app/actions/news';
import NewsTable from './NewsTable';

interface PageProps {
    searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function NewsPage({ searchParams }: PageProps) {
    const { search, category } = await searchParams;

    const articles = await getAdminArticles(search, category);

    return (
        <div className="space-y-10 py-6 px-4 md:px-8 bg-[#000d1a] min-h-screen">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-[2px] bg-[#D4AF37]" />
                        <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">
                            Content
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        News <span className="text-white/10">/</span> Articles
                    </h1>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-2">
                        {articles.length} articles published
                    </p>
                </div>

                <Link
                    href="/admin/news/new"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-[#D4AF37]/10 active:scale-95 group"
                >
                    <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                    Create Article
                </Link>
            </div>

            {/* TABLE */}
            <NewsTable
                articles={articles}
                initialSearch={search ?? ''}
                initialCategory={category ?? 'ALL'}
            />
        </div>
    );
}
