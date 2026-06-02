'use client';

import { useState, useTransition } from 'react';
import {
    ArrowLeft, Upload, X, Star, Zap,
    TrendingUp, ShieldCheck, Heart, Save, Check, AlertCircle, Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createProduct, getProductCategories } from '@/app/actions/products';
import { useEffect } from 'react';
import { upsertMarketplaceLinks } from '@/app/actions/marketplace';
import MarketplaceLinksManager, { type LinkEntry } from '@/components/admin/MarketplaceLinksManager';



// Map showcase label names → formData key
const SHOWCASE_LABELS = [
    { name: 'Featured Product', key: 'isFeatured', icon: <Star className="h-4 w-4" />, color: 'ub-gold' },
    { name: 'New Arrivals', key: 'isNewArrival', icon: <Zap className="h-4 w-4" />, color: 'blue-400' },
    { name: 'Best Sellers', key: 'isBestSeller', icon: <TrendingUp className="h-4 w-4" />, color: 'emerald-400' },
    { name: 'Exclusive Showcase', key: 'isExclusiveShowcase', icon: <ShieldCheck className="h-4 w-4" />, color: 'purple-400' },
    { name: 'Koleksi Pilihan', key: 'isKoleksiPilihan', icon: <Heart className="h-4 w-4" />, color: 'rose-400' },
] as const;

type ShowcaseKey = typeof SHOWCASE_LABELS[number]['key'];

export default function NewProductPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('9999');
    const [regularPrice, setRegularPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [images, setImages] = useState<File[]>([]);


    // Showcase flags state
    const [showcaseFlags, setShowcaseFlags] = useState<Record<ShowcaseKey, boolean>>({
        isFeatured: false,
        isNewArrival: false,
        isBestSeller: false,
        isExclusiveShowcase: false,
        isKoleksiPilihan: false,
    });

    // Marketplace links state
    const [marketplaceLinks, setMarketplaceLinks] = useState<LinkEntry[]>([]);
    const [existingCategories, setExistingCategories] = useState<string[]>([]);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Load dynamic categories on mount
    useEffect(() => {
        getProductCategories().then(setExistingCategories).catch(console.error);
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(file => {
                const isValidType = file.type === 'image/png' || file.type === 'image/webp';
                const isValidSize = file.size <= 1 * 1024 * 1024; // 1MB
                
                if (!isValidType) {
                    setError('Format file hanya boleh PNG atau WebP.');
                } else if (!isValidSize) {
                    setError('Ukuran file maksimal 1 MB.');
                }
                
                return isValidType && isValidSize;
            });
            
            if (validFiles.length > 0) {
                setError('');
                setImages((prev) => [...prev, ...validFiles]);
            }
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleFlag = (key: ShowcaseKey) => {
        setShowcaseFlags(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setError('');

        if (!name.trim()) return setError('Nama produk wajib diisi.');
        if (!description.trim()) return setError('Deskripsi wajib diisi.');
        if (!category) return setError('Pilih kategori produk.');
        if (!regularPrice || Number(regularPrice) <= 0) return setError('Harga reguler harus lebih dari 0.');
        if (!stock || Number(stock) < 0) return setError('Stok tidak boleh negatif.');

        const formData = new FormData();

        formData.set('name', name.trim());
        formData.set('description', description.trim());
        formData.set('category', category);
        formData.set('regularPrice', regularPrice);
        formData.set('discountPrice', discountPrice || '');
        formData.set('stock', stock);
        formData.set('isActive', String(isActive));

        // Showcase flags
        (Object.keys(showcaseFlags) as ShowcaseKey[]).forEach(key => {
            formData.set(key, String(showcaseFlags[key]));
        });



        images.forEach((file) => {
            formData.append('images', file);
        });

        startTransition(async () => {
            const result = await createProduct(formData);

            if (result?.error) {
                setError(result.error);
            } else if (result?.productId) {
                // Simpan marketplace links setelah produk created
                if (marketplaceLinks.length > 0) {
                    await upsertMarketplaceLinks(result.productId, marketplaceLinks);
                }
                setSuccess(true);
                setTimeout(() => router.push('/admin/products'), 1500);
            }
        });
    };

    return (
        <div className="space-y-10 animate-fade-in py-6 pb-20 px-4 md:px-0">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin/products" className="p-2 bg-white/5 hover:bg-ub-gold hover:text-white rounded-xl transition-all mr-2 border border-white/5">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Inventory</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Add <span className="text-white/10">/</span> New Product
                    </h1>
                </div>

                <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={isPending}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-ub-gold hover:bg-ub-gold/90 disabled:opacity-50 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-ub-gold/10 active:scale-95 group"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isPending ? 'Publishing...' : 'Publish Product'}
                </button>
            </div>

            {/* Error / Success Banner */}
            <AnimatePresence>
                {error && (
                    <motion.div
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
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4"
                    >
                        <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Produk berhasil dipublikasikan! Mengalihkan...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* LEFT: Product Details */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Basic Info */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6">
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Basic Information</h2>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Product Name *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="ENTER PRODUCT NAME EX: UB OFFICIAL HOODIE..."
                                className="w-full px-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Description *</label>
                            <textarea
                                rows={6}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="WRITE A COMPELLING PRODUCT DESCRIPTION..."
                                className="w-full px-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all resize-none outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Category Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Category *</label>
                                <input
                                    type="text"
                                    list="category-suggestions"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value.toUpperCase())}
                                    placeholder="SELECT OR TYPE CATEGORY..."
                                    className="w-full px-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all outline-none"
                                />
                                <datalist id="category-suggestions">
                                    {existingCategories.map((cat) => (
                                        <option key={cat} value={cat} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-colors duration-500" />
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-4 relative z-10">Pricing Strategy</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Regular Price (IDR) *</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-white">Rp</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={regularPrice}
                                        onChange={(e) => setRegularPrice(e.target.value)}
                                        placeholder="0"
                                        className="w-full pl-14 pr-6 text-white py-4 bg-black/20 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Discount Price (Optional)</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-white">Rp</span>
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

                    {/* Media Upload */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6">
                        <div>
                            <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Product Assets</h2>
                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Upload gambar produk (PNG, WebP — maks 1 MB)</p>
                        </div>
                        <div className="border-2 border-dashed border-white/5 rounded-[32px] p-12 flex flex-col items-center justify-center hover:border-ub-gold hover:bg-white/5 transition-all cursor-pointer relative group">
                            <input type="file" multiple accept="image/png, image/webp" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                            <div className="p-4 bg-white/5 group-hover:bg-white/10 rounded-2xl mb-4 transition-colors">
                                <Upload className="h-8 w-8 text-gray-700 group-hover:text-ub-gold" />
                            </div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Drag & Drop or Click to Upload</p>
                            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-2">PNG, WebP — Maks 1 MB per file</p>
                        </div>

                        {images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                                {images.map((file, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 group/img">
                                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover group-hover/img:scale-110 transition-all duration-500" />
                                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Labels & Availability */}
                <div className="space-y-8">
                    {/* Marketplace Links */}
                    <MarketplaceLinksManager
                        initialLinks={marketplaceLinks}
                        onChange={setMarketplaceLinks}
                    />



                    {/* Showcase Labels */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl p-8 border border-white/5 relative overflow-hidden">
                        <h2 className="text-sm font-black text-ub-gold uppercase tracking-[0.2em] mb-2">Showcase Labels</h2>
                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-6">Tentukan di seksi mana produk ini tampil di homepage</p>
                        <div className="space-y-3">
                            {SHOWCASE_LABELS.map(({ name: labelName, key, icon }) => {
                                const isChecked = showcaseFlags[key];
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => toggleFlag(key)}
                                        className={`w-full flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all border ${isChecked
                                            ? 'bg-ub-gold/10 border-ub-gold/30'
                                            : 'bg-white/5 hover:bg-white/10 border-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg transition-colors ${isChecked ? 'bg-ub-gold/20 text-ub-gold' : 'bg-white/5 text-gray-500'}`}>
                                                {icon}
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isChecked ? 'text-white' : 'text-gray-400'}`}>
                                                {labelName}
                                            </span>
                                        </div>
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${isChecked
                                            ? 'bg-ub-gold border-ub-gold shadow-lg shadow-ub-gold/20'
                                            : 'bg-white/5 border-white/10'
                                            }`}>
                                            {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="bg-[#001a33] rounded-[40px] border border-white/5 p-8 space-y-6">
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Availability</h2>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div
                                onClick={() => setIsActive(!isActive)}
                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${isActive
                                    ? 'bg-ub-gold border-ub-gold shadow-lg shadow-ub-gold/20'
                                    : 'bg-white/5 border-white/10 hover:border-ub-gold/40'
                                    }`}
                            >
                                {isActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black text-white uppercase tracking-widest">Publish Immediately</span>
                                <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest italic leading-tight">Product will be visible to all users.</span>
                            </div>
                        </label>
                    </div>

                    {/* Submit button */}
                    <button
                        type="button"
                        onClick={() => handleSubmit()}
                        disabled={isPending}
                        className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-ub-gold hover:bg-ub-gold/90 disabled:opacity-50 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-ub-gold/10 active:scale-95"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isPending ? 'Publishing...' : 'Publish Product'}
                    </button>
                </div>
            </form>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.2); border-radius: 10px; }
            `}</style>
        </div>
    );
}