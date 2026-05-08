'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import {
    Search, Edit2, Trash2, Eye, Check, Image as ImageIcon,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { deleteArticle, bulkDeleteArticles, toggleArticleStatus } from '@/app/actions/news';
import { AnimatePresence, motion } from 'framer-motion';

interface Article {
    id: string;
    title: string;
    slug: string;
    category: string | null;
    contentType: 'BERITA' | 'ARTIKEL';
    author: string;
    isActive: boolean;
    createdAt: Date;
    hasImage: boolean;
    imageUrl: string | null;
}

interface Props {
    articles: Article[];
    initialSearch: string;
    initialCategory: string;
}

export default function NewsTable({ articles, initialSearch, initialCategory }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(initialSearch);
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`);
            });
        }, 350);
        return () => clearTimeout(timer);
    }, [search, pathname, router]);

    const toggleSelect = (id: string) =>
        setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

    const toggleSelectAll = () =>
        setSelected(selected.length === articles.length ? [] : articles.map((p) => p.id));

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus artikel ini secara permanen?')) return;
        startTransition(async () => {
            await deleteArticle(id);
        });
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Hapus ${selected.length} artikel terpilih?`)) return;
        startTransition(async () => {
            await bulkDeleteArticles(selected);
            setSelected([]);
        });
    };

    const handleToggleStatus = async (id: string, isActive: boolean) => {
        startTransition(async () => {
            await toggleArticleStatus(id, isActive);
        });
    };

    return (
        <div className={`transition-opacity ${isPending ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
            {/* SEARCH */}
            <div className="bg-[#001a33] rounded-3xl border border-white/5 shadow-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="SEARCH ARTICLE TITLE..."
                        className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-[0.1em] text-white placeholder:text-gray-600 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* BULK ACTION BAR */}
            <AnimatePresence>
                {selected.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-[#D4AF37] text-white p-4 rounded-2xl flex items-center justify-between shadow-2xl shadow-[#D4AF37]/20 mb-6"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Check className="h-4 w-4" strokeWidth={3} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">
                                {selected.length} Articles Selected
                            </span>
                        </div>
                        <button
                            onClick={handleBulkDelete}
                            className="text-[10px] font-black uppercase tracking-widest bg-black/20 hover:bg-black/40 px-6 py-2.5 rounded-xl transition-colors border border-white/10"
                        >
                            Delete Permanently
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TABLE */}
            <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto p-4">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr>
                                <th className="px-6 py-4">
                                    <div
                                        onClick={toggleSelectAll}
                                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${selected.length === articles.length && articles.length > 0
                                            ? 'bg-[#D4AF37] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
                                            : 'bg-white/5 border-white/10 hover:border-[#D4AF37]/40'
                                            }`}
                                    >
                                        {selected.length === articles.length && articles.length > 0 && (
                                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
                                        )}
                                    </div>
                                </th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Title</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-4 text-gray-600">
                                            <ImageIcon className="h-10 w-10" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">No articles found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                articles.map((article) => (
                                    <tr key={article.id} className="group transition-all">
                                        <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors rounded-l-3xl border-y border-l border-white/5">
                                            <div
                                                onClick={() => toggleSelect(article.id)}
                                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${selected.includes(article.id)
                                                    ? 'bg-[#D4AF37] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-110'
                                                    : 'bg-white/5 border-white/10 group-hover:border-[#D4AF37]/40'
                                                    }`}
                                            >
                                                {selected.includes(article.id) && (
                                                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-8 py-6 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors border-y border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 bg-black/40 rounded-xl flex items-center justify-center border border-white/5 overflow-hidden shadow-sm group-hover:border-[#D4AF37]/30 transition-colors flex-shrink-0">
                                                    {article.imageUrl ? (
                                                        <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="h-5 w-5 text-gray-700" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white uppercase italic group-hover:text-[#D4AF37] transition-colors tracking-tight">
                                                        {article.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                                            article.contentType === 'BERITA'
                                                                ? 'bg-blue-900/40 text-blue-400 border border-blue-500/20'
                                                                : 'bg-amber-900/40 text-amber-400 border border-amber-500/20'
                                                        }`}>
                                                            {article.contentType}
                                                        </span>
                                                        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">
                                                            {article.category || 'No Category'} <span className="text-white/10 mx-1">|</span> {article.author}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-6 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors border-y border-white/5">
                                            <button
                                                onClick={() => handleToggleStatus(article.id, article.isActive)}
                                                className={`text-[9px] font-black px-3 py-1.5 rounded-lg tracking-widest uppercase cursor-pointer transition-all hover:scale-105 ${article.isActive
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                                    : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10'
                                                    }`}
                                                title="Klik untuk toggle status"
                                            >
                                                {article.isActive ? 'PUBLISHED' : 'DRAFT'}
                                            </button>
                                        </td>

                                        <td className="px-8 py-6 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors border-y border-white/5">
                                            <span className="text-xs font-black font-mono text-gray-400">
                                                {new Date(article.createdAt).toLocaleDateString('id-ID')}
                                            </span>
                                        </td>

                                        <td className="px-8 py-6 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors rounded-r-3xl border-y border-r border-white/5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/news/${article.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2.5 bg-black/20 hover:bg-white/10 text-gray-500 hover:text-white rounded-xl transition-all border border-white/5 inline-flex"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/news/${article.id}/edit`}
                                                    className="p-2.5 bg-black/20 hover:bg-[#D4AF37]/10 text-gray-500 hover:text-[#D4AF37] rounded-xl transition-all border border-white/5 inline-flex"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    className="p-2.5 bg-black/20 hover:bg-rose-500/10 text-gray-500 hover:text-rose-500 rounded-xl transition-all border border-white/5"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 bg-black/20 flex items-center justify-between border-t border-white/5">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        Showing {articles.length} entries
                    </p>
                </div>
            </div>

        </div>
    );
}
