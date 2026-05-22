'use client';

import { useState, useTransition } from 'react';
import { ArrowLeft, Upload, X, Save, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateArticle } from '@/app/actions/news';

interface ArticleData {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    category: string | null;
    isActive: boolean;
    imageUrl: string | null;
}

export default function EditNewsForm({ article }: { article: ArticleData }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [title, setTitle] = useState(article.title);
    const [excerpt, setExcerpt] = useState(article.excerpt || '');
    const [content, setContent] = useState(article.content);
    const [category, setCategory] = useState(article.category || '');
    const [isActive, setIsActive] = useState(article.isActive);
    const [newImage, setNewImage] = useState<File | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(article.imageUrl);
    const [removeImage, setRemoveImage] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const isValidType = file.type === 'image/png' || file.type === 'image/webp';
            const isValidSize = file.size <= 1 * 1024 * 1024; // 1MB
            
            if (!isValidType) {
                setError('Format file hanya boleh PNG atau WebP.');
            } else if (!isValidSize) {
                setError('Ukuran file maksimal 1 MB.');
            } else {
                setError('');
                setNewImage(file);
                setRemoveImage(false);
            }
        }
    };

    const handleRemoveImage = () => { setNewImage(null); setExistingImageUrl(null); setRemoveImage(true); };

    const doSubmit = () => {
        setError('');
        if (!title.trim() || !content.trim()) return setError('Judul dan konten utama wajib diisi.');

        const formData = new FormData();
        formData.set('title', title.trim());
        formData.set('excerpt', excerpt.trim());
        formData.set('content', content.trim());
        formData.set('category', category.trim());
        formData.set('isActive', String(isActive));
        formData.set('removeImage', String(removeImage));
        if (newImage) formData.append('image', newImage);

        startTransition(async () => {
            const result = await updateArticle(article.id, formData);
            if (result?.error) { setError(result.error); }
            else { setSuccess(true); setTimeout(() => router.push('/admin/news'), 1500); }
        });
    };

    return (
        <div className="space-y-10 animate-fade-in py-6 pb-20 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin/news" className="p-2 bg-white/5 hover:bg-ub-gold hover:text-white rounded-xl transition-all mr-2 border border-white/5">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Content</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Edit <span className="text-white/10">/</span> Berita
                    </h1>
                </div>
                <button type="button" onClick={doSubmit} disabled={isPending}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-ub-gold hover:bg-ub-gold/90 disabled:opacity-50 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-ub-gold/10 active:scale-95">
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                </button>
            </div>

            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-[11px] font-black uppercase tracking-widest">{error}</p>
                </div>
            )}
            {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-[11px] font-black uppercase tracking-widest">Konten berhasil diperbarui!</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6">
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Informasi Konten</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Judul *</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                                    placeholder="MASUKKAN JUDUL..."
                                    className="w-full px-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Ringkasan (Excerpt)</label>
                                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3}
                                    placeholder="RINGKASAN SINGKAT..."
                                    className="w-full px-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black tracking-wider focus:ring-2 focus:ring-ub-gold transition-all outline-none resize-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Konten Lengkap *</label>
                                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={18}
                                    placeholder="TULIS KONTEN DI SINI..."
                                    className="w-full px-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-xs tracking-wide focus:ring-2 focus:ring-ub-gold transition-all outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-8">
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6">
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Pengaturan</h2>

                        {/* No longer showing Type Selector as we only use BERITA */}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Kategori</label>
                            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)}
                                placeholder="KATEGORI..."
                                className="w-full px-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Status Publikasi</label>
                            <button type="button" onClick={() => setIsActive(!isActive)}
                                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all border ${
                                    isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400'
                                }`}>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isActive ? 'PUBLISHED' : 'DRAFT'}</span>
                                <div className={`w-8 h-4 rounded-full transition-colors relative ${isActive ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                                    <div className={`absolute top-0.5 bottom-0.5 w-3 bg-white rounded-full transition-all ${isActive ? 'right-0.5' : 'left-0.5'}`} />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6">
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Cover Image</h2>
                        <div className="border-2 border-dashed border-white/5 rounded-[32px] p-8 flex flex-col items-center justify-center hover:border-ub-gold hover:bg-white/5 transition-all cursor-pointer relative group text-center">
                            <input type="file" accept="image/png, image/webp" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageChange} />
                            {!newImage && !existingImageUrl ? (
                                <>
                                    <div className="p-4 bg-white/5 group-hover:bg-white/10 rounded-2xl mb-4 transition-colors">
                                        <Upload className="h-8 w-8 text-gray-700 group-hover:text-ub-gold" />
                                    </div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Click to Upload</p>
                                    <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-2">PNG, WebP — Maks 1 MB</p>
                                </>
                            ) : (
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                                    <img src={newImage ? URL.createObjectURL(newImage) : existingImageUrl!}
                                        alt="Preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={(e) => { e.preventDefault(); handleRemoveImage(); }}
                                        className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg z-20">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
