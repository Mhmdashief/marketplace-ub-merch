'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import {
    ArrowLeft, Upload, X, Star, Zap,
    TrendingUp, ShieldCheck, Heart, Save, ChevronDown, Check, AlertCircle, Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { updateProduct } from '@/app/actions/products';
import { PRODUCT_CATEGORIES } from '@/app/constant/product-categories';

const SHOWCASE_LABELS = [
    { name: 'Featured Product', icon: <Star className="h-4 w-4" />, color: 'ub-gold' },
    { name: 'New Arrivals', icon: <Zap className="h-4 w-4" />, color: 'blue-400' },
    { name: 'Best Sellers', icon: <TrendingUp className="h-4 w-4" />, color: 'emerald-400' },
    { name: 'Exclusive Showcase', icon: <ShieldCheck className="h-4 w-4" />, color: 'purple-400' },
    { name: 'Koleksi Pilihan', icon: <Heart className="h-4 w-4" />, color: 'rose-400' },
];

interface ProductData {
    id: string;
    name: string;
    description: string;
    stock: number;
    regularPrice: number;
    discountPrice: number | null;
    category: string;
    isActive: boolean;
    images?: string[];
}

export default function EditProductForm({ product }: { product: ProductData }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form state — seeded from server-fetched product data
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [category, setCategory] = useState(product.category);
    const [stock, setStock] = useState(String(product.stock));
    const [regularPrice, setRegularPrice] = useState(String(product.regularPrice));
    const [discountPrice, setDiscountPrice] = useState(
        product.discountPrice != null ? String(product.discountPrice) : ''
    );
    const [isActive, setIsActive] = useState(product.isActive);

    // Image state
    const [newImages, setNewImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(product.images ?? []);

    // UI state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewImages((prev) => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeNewImage = (index: number) =>
        setNewImages((prev) => prev.filter((_, i) => i !== index));

    const removeExistingImage = (index: number) =>
        setExistingImages((prev) => prev.filter((_, i) => i !== index));

    // ── Core submit logic (no event param so it can be called from both
    //    the native form's onSubmit AND the header/sidebar button's onClick)
    const doSubmit = () => {
        setError('');
        setSuccess(false);

        if (!name.trim()) { setError('Nama produk wajib diisi.'); return; }
        if (!description.trim()) { setError('Deskripsi wajib diisi.'); return; }
        if (!category) { setError('Pilih kategori produk.'); return; }
        if (!regularPrice || Number(regularPrice) <= 0) { setError('Harga reguler harus lebih dari 0.'); return; }
        if (Number(stock) < 0) { setError('Stok tidak boleh negatif.'); return; }

        const fd = new FormData();
        fd.set('name', name.trim());
        fd.set('description', description.trim());
        fd.set('category', category);
        fd.set('regularPrice', regularPrice);
        fd.set('discountPrice', discountPrice);
        fd.set('stock', stock);
        fd.set('isActive', String(isActive));

        newImages.forEach((file) => fd.append('images', file));
        existingImages.forEach((url) => fd.append('keptImages', url));

        startTransition(async () => {
            const result = await updateProduct(product.id, fd);
            if (result?.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                setTimeout(() => router.push('/admin/products'), 1500);
            }
        });
    };

    // Wrapper for <form onSubmit> — prevents default page reload
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        doSubmit();
    };

    return (
        <div className="space-y-10 py-6 pb-20 px-4 md:px-8 bg-[#000d1a] min-h-screen">

            {/* ── Header ────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            href="/admin/products"
                            className="p-2 bg-white/5 hover:bg-ub-gold hover:text-white rounded-xl transition-all mr-2 border border-white/5"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">
                            Inventory
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Edit <span className="text-white/10">/</span> Product
                    </h1>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-2">
                        ID: {product.id}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={doSubmit}
                    disabled={isPending}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-ub-gold hover:bg-ub-gold/90 disabled:opacity-50 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-ub-gold/10 active:scale-95"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            {/* ── Feedback banners ─────────────────────────────────── */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl px-6 py-4"
                    >
                        <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">{error}</p>
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4"
                    >
                        <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                            Produk berhasil diperbarui! Mengalihkan ke daftar produk...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Form ─────────────────────────────────────────────── */}
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* LEFT column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Basic Info */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6">
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">
                            Basic Information
                        </h2>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">
                                Nama Produk *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="MASUKKAN NAMA PRODUK..."
                                className="w-full px-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">
                                Deskripsi *
                            </label>
                            <textarea
                                rows={6}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="TULIS DESKRIPSI PRODUK..."
                                className="w-full px-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all resize-none outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category dropdown */}
                            <div className="space-y-2" ref={dropdownRef}>
                                <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">
                                    Kategori *
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen((o) => !o)}
                                        className={`w-full flex items-center justify-between px-6 py-4 bg-black/20 border ${isDropdownOpen ? 'border-ub-gold' : 'border-white/5'} rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-left`}
                                    >
                                        <span className={!category ? 'text-gray-600' : 'text-white'}>
                                            {category || 'PILIH KATEGORI'}
                                        </span>
                                        <ChevronDown
                                            className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180 text-ub-gold' : ''}`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 8 }}
                                                className="absolute z-50 w-full mt-2 bg-[#001a33] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                                            >
                                                <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                                                    {PRODUCT_CATEGORIES.map((cat) => (
                                                        <button
                                                            key={cat}
                                                            type="button"
                                                            onClick={() => {
                                                                setCategory(cat);
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${category === cat
                                                                ? 'bg-ub-gold text-white'
                                                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                                }`}
                                                        >
                                                            {cat}
                                                            {category === cat && <Check className="h-3 w-3" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Stock */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">
                                    Jumlah Stok *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-colors duration-500" />
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] relative z-10">
                            Harga
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">
                                    Harga Normal (IDR) *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-white">Rp</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={regularPrice}
                                        onChange={(e) => setRegularPrice(e.target.value)}
                                        placeholder="0"
                                        className="w-full pl-14 pr-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">
                                    Harga Diskon (Opsional)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-400">Rp</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={discountPrice}
                                        onChange={(e) => setDiscountPrice(e.target.value)}
                                        placeholder="0"
                                        className="w-full pl-14 pr-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-emerald-500 transition-all text-emerald-400 placeholder:text-emerald-700 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6">
                        <div>
                            <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-1">
                                Gambar Produk
                            </h2>
                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                                Gambar baru akan ditambahkan. Hapus gambar lama dengan klik tombol ×.
                            </p>
                        </div>

                        {/* Upload area */}
                        <div className="border-2 border-dashed border-white/5 rounded-[32px] p-12 flex flex-col items-center justify-center hover:border-ub-gold hover:bg-white/5 transition-all cursor-pointer relative group">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                            />
                            <div className="p-4 bg-white/5 group-hover:bg-white/10 rounded-2xl mb-4 transition-colors">
                                <Upload className="h-8 w-8 text-gray-700 group-hover:text-ub-gold" />
                            </div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">
                                Upload Gambar Baru
                            </p>
                            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-2">
                                PNG, JPG, WEBP — max 10 MB per file
                            </p>
                        </div>

                        {/* Existing images */}
                        {existingImages.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    Gambar Tersimpan ({existingImages.length})
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {existingImages.map((src, idx) => (
                                        <div
                                            key={`exist-${idx}`}
                                            className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 group/img"
                                        >
                                            <img
                                                src={src}
                                                alt={`Gambar ${idx + 1}`}
                                                className="w-full h-full object-cover group-hover/img:scale-110 transition-all duration-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(idx)}
                                                className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New images preview */}
                        {newImages.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    Gambar Baru ({newImages.length})
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {newImages.map((file, idx) => (
                                        <div
                                            key={`new-${idx}`}
                                            className="relative aspect-square rounded-2xl overflow-hidden border border-ub-gold/30 group/img"
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${idx + 1}`}
                                                className="w-full h-full object-cover group-hover/img:scale-110 transition-all duration-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(idx)}
                                                className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            <div className="absolute bottom-0 left-0 right-0 bg-ub-gold/80 text-white text-[8px] font-black uppercase tracking-widest text-center py-1">
                                                Baru
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT column */}
                <div className="space-y-8">
                    {/* Showcase labels */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl p-8 border border-white/5">
                        <h2 className="text-sm font-black text-ub-gold uppercase tracking-[0.2em] mb-8">
                            Label Showcase
                        </h2>
                        <div className="space-y-3">
                            {SHOWCASE_LABELS.map(({ name: labelName, icon, color }) => (
                                <label
                                    key={labelName}
                                    className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl cursor-pointer transition-all border border-white/5"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 bg-${color}/10 rounded-lg text-${color}`}>
                                            {icon}
                                        </div>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                            {labelName}
                                        </span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded-lg accent-ub-gold cursor-pointer"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="bg-[#001a33] rounded-[40px] border border-white/5 p-8 space-y-6">
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">
                            Status Publikasi
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsActive((v) => !v)}
                            className="flex items-center gap-4 w-full text-left group"
                        >
                            <div
                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isActive
                                    ? 'bg-ub-gold border-ub-gold shadow-lg shadow-ub-gold/20'
                                    : 'bg-white/5 border-white/10 group-hover:border-ub-gold/40'
                                    }`}
                            >
                                {isActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-white uppercase tracking-widest">
                                    {isActive ? 'Aktif / Dipublikasikan' : 'Draft / Tidak Tampil'}
                                </p>
                                <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest italic">
                                    {isActive
                                        ? 'Produk terlihat oleh semua pengunjung.'
                                        : 'Produk disembunyikan dari halaman publik.'}
                                </p>
                            </div>
                        </button>
                    </div>

                    {/* Save button */}
                    <button
                        type="button"
                        onClick={doSubmit}
                        disabled={isPending}
                        className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-ub-gold hover:bg-ub-gold/90 disabled:opacity-50 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-ub-gold/10 active:scale-95"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.25); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.5); }
            `}</style>
        </div>
    );
}
