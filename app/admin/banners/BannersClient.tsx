'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Image as ImageIcon, Plus, Trash2, Check, X,
    Eye, EyeOff, Loader2, AlertCircle,
    ExternalLink, Save,
} from 'lucide-react';
import {
    createBanner, deleteBanner, toggleBannerStatus,
} from '@/app/actions/banners';

type Banner = {
    id: string;
    title: string;
    subtitle: string | null;
    imageUrl: string;
    linkUrl: string | null;
    linkLabel: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
};

interface BannersClientProps {
    initialBanners: Banner[];
}

type FormMode = 'create' | 'idle';

export default function BannersClient({ initialBanners }: BannersClientProps) {
    const [banners, setBanners] = useState<Banner[]>(initialBanners);
    const [mode, setMode] = useState<FormMode>('idle');
    const [isPending, startTransition] = useTransition();

    // Form state
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [linkLabel, setLinkLabel] = useState('');
    const [sortOrder, setSortOrder] = useState('0');
    const [isActive, setIsActive] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const resetForm = () => {
        setTitle(''); setSubtitle(''); setLinkUrl(''); setLinkLabel('');
        setSortOrder('0'); setIsActive(true); setImageFile(null); setImagePreview(null);
        setError(''); setSuccessMsg('');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreate = () => {
        setError('');
        if (!title.trim()) return setError('Judul banner wajib diisi.');
        if (!imageFile) return setError('Gambar banner wajib diupload.');

        const fd = new FormData();
        fd.set('title', title.trim());
        fd.set('subtitle', subtitle.trim());
        fd.set('linkUrl', linkUrl.trim());
        fd.set('linkLabel', linkLabel.trim());
        fd.set('isActive', String(isActive));
        fd.set('sortOrder', sortOrder);
        fd.append('image', imageFile);

        startTransition(async () => {
            const result = await createBanner(fd);
            if (result?.error) {
                setError(result.error);
            } else {
                setSuccessMsg('Banner berhasil dibuat!');
                resetForm();
                setMode('idle');
                // Refresh banners by re-fetching (optimistic isn't needed, server revalidates)
                window.location.reload();
            }
        });
    };

    const handleToggle = (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            await toggleBannerStatus(id, currentStatus);
            setBanners((prev) =>
                prev.map((b) => b.id === id ? { ...b, isActive: !currentStatus } : b)
            );
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm('Hapus banner ini?')) return;
        startTransition(async () => {
            await deleteBanner(id);
            setBanners((prev) => prev.filter((b) => b.id !== id));
        });
    };

    return (
        <div className="space-y-10 animate-fade-in py-2">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-[2px] bg-ub-gold" />
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Content</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Banner <span className="text-white/10">/</span> Management
                    </h1>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-2">
                        {banners.length} banner • {banners.filter(b => b.isActive).length} aktif
                    </p>
                </div>
                {mode === 'idle' ? (
                    <button
                        onClick={() => setMode('create')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-ub-gold hover:bg-ub-gold/90 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-ub-gold/10 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Banner
                    </button>
                ) : (
                    <button
                        onClick={() => { setMode('idle'); resetForm(); }}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all"
                    >
                        <X className="h-4 w-4" />
                        Batal
                    </button>
                )}
            </div>

            {/* Success/Error messages */}
            <AnimatePresence>
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4"
                    >
                        <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{successMsg}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Form */}
            <AnimatePresence>
                {mode === 'create' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="bg-[#001a33] rounded-[40px] border border-ub-gold/20 p-8 space-y-6"
                    >
                        <h2 className="text-sm font-black text-ub-gold uppercase tracking-[0.2em]">
                            Buat Banner Baru
                        </h2>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl px-5 py-3"
                                >
                                    <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left: fields */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white uppercase tracking-widest">Judul *</label>
                                    <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                                        placeholder="ENTER BANNER TITLE..."
                                        className="w-full px-5 py-3 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white uppercase tracking-widest">Subtitle</label>
                                    <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)}
                                        placeholder="OPTIONAL SUBTITLE..."
                                        className="w-full px-5 py-3 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold outline-none transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white uppercase tracking-widest">Link URL</label>
                                        <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full px-5 py-3 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-bold tracking-wide focus:ring-2 focus:ring-ub-gold outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white uppercase tracking-widest">Label Tombol</label>
                                        <input type="text" value={linkLabel} onChange={e => setLinkLabel(e.target.value)}
                                            placeholder="SHOP NOW"
                                            className="w-full px-5 py-3 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white uppercase tracking-widest">Urutan</label>
                                        <input type="number" min="0" value={sortOrder} onChange={e => setSortOrder(e.target.value)}
                                            className="w-full px-5 py-3 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black focus:ring-2 focus:ring-ub-gold outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white uppercase tracking-widest">Status</label>
                                        <button type="button" onClick={() => setIsActive(v => !v)}
                                            className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-ub-gold/10 border-ub-gold/30 text-ub-gold' : 'bg-white/5 border-white/5 text-gray-500'}`}
                                        >
                                            {isActive ? 'Aktif' : 'Draft'}
                                            <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center ${isActive ? 'bg-ub-gold border-ub-gold' : 'bg-white/5 border-white/10'}`}>
                                                {isActive && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Image upload */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-white uppercase tracking-widest">Gambar Banner *</label>
                                <div className="relative border-2 border-dashed border-white/10 rounded-[24px] overflow-hidden hover:border-ub-gold transition-all group cursor-pointer"
                                    style={{ minHeight: '200px' }}>
                                    <input type="file" accept="image/*" onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" style={{ minHeight: '200px' }} />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full py-16 gap-4">
                                            <div className="p-4 bg-white/5 group-hover:bg-white/10 rounded-2xl transition-colors">
                                                <ImageIcon className="h-8 w-8 text-gray-700 group-hover:text-ub-gold" />
                                            </div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Upload Gambar</p>
                                            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">PNG, JPG, WEBP (Rec: 1920×600)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                            <button onClick={() => { setMode('idle'); resetForm(); }}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                            >
                                Batal
                            </button>
                            <button onClick={handleCreate} disabled={isPending}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-ub-gold hover:bg-ub-gold/90 disabled:opacity-50 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-ub-gold/20"
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {isPending ? 'Menyimpan...' : 'Simpan Banner'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Banners List */}
            {banners.length === 0 ? (
                <div className="bg-[#001a33] rounded-[40px] border border-white/5 p-20 text-center">
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-ub-gold/20 blur-3xl rounded-full" />
                        <ImageIcon className="h-24 w-24 text-ub-gold mx-auto relative z-10" />
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase mb-4">
                        Belum Ada Banner
                    </h3>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                        Klik &ldquo;Tambah Banner&rdquo; untuk membuat banner pertama
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {banners.map((banner, idx) => (
                        <motion.div
                            key={banner.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`bg-[#001a33] rounded-[32px] border overflow-hidden transition-all ${banner.isActive ? 'border-white/5' : 'border-white/5 opacity-60'}`}
                        >
                            <div className="flex flex-col lg:flex-row">
                                {/* Image preview */}
                                <div className="lg:w-72 flex-shrink-0 bg-black/20 min-h-[140px] relative overflow-hidden">
                                    {banner.imageUrl ? (
                                        <img src={banner.imageUrl} alt={banner.title}
                                            className="w-full h-full object-cover"
                                            style={{ minHeight: '140px' }}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full min-h-[140px]">
                                            <ImageIcon className="h-12 w-12 text-gray-700" />
                                        </div>
                                    )}
                                    {/* Status badge on image */}
                                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${banner.isActive ? 'bg-emerald-500/80 text-white' : 'bg-gray-800/80 text-gray-400'}`}>
                                        {banner.isActive ? 'Aktif' : 'Draft'}
                                    </div>
                                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                        #{banner.sortOrder}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-white uppercase tracking-tight">
                                            {banner.title}
                                        </h3>
                                        {banner.subtitle && (
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                {banner.subtitle}
                                            </p>
                                        )}
                                        {banner.linkUrl && (
                                            <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-[9px] font-black text-ub-gold uppercase tracking-widest hover:underline"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                {banner.linkLabel || banner.linkUrl}
                                            </a>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleToggle(banner.id, banner.isActive)}
                                            disabled={isPending}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${banner.isActive
                                                ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20'
                                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                                }`}
                                        >
                                            {banner.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                            {banner.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(banner.id)}
                                            disabled={isPending}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
