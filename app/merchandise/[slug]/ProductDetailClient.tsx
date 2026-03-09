'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShieldCheck, Truck, ShoppingCart, ArrowRight, Zap, Package, Info } from 'lucide-react';
import { useCart } from '@/components/shared/ShoppingCart';



interface ProductDetail {
    id: string;
    name: string;
    slug: string;
    description: string;
    stock: number;
    regularPrice: number;
    discountPrice: number | null;
    category: string;
    isActive: boolean;
    images: string[];
    rating: number;
    sales: number;
    price: number;
    image: string;
    sizes?: string | null;
    promotion?: {
        name: string;
        endAt: Date;
        discountValue: number;
        discountType: 'PERCENTAGE' | 'FIXED';
    } | null;
}

export default function ProductDetailClient({ product }: { product: ProductDetail }) {
    const router = useRouter();
    const { addToCart } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
    const [activeImage, setActiveImage] = useState(0);

    const handleAddToCart = () => {
        if (hasSizes && !selectedSize) {
            alert('Silakan pilih ukuran terlebih dahulu');
            return;
        }
        addToCart({
            id: product.id,
            name: product.name,
            price: effectiveDisplayPrice,
            image: images[0],
            quantity: quantity,
            size: selectedSize,
        });
    };

    // Buy Now: go to /checkout with direct-purchase params (does NOT touch cart)
    const handleBuyNow = () => {
        if (hasSizes && !selectedSize) {
            alert('Silakan pilih ukuran terlebih dahulu');
            return;
        }
        const params = new URLSearchParams({
            directProductId: product.id,
            qty: String(quantity),
            ...(selectedSize ? { size: selectedSize } : {}),
        });
        router.push(`/checkout?${params.toString()}`);
    };


    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const displayPrice = product.discountPrice ?? product.regularPrice;
    const originalPrice = product.discountPrice ? product.regularPrice : null;
    const discountPercent = originalPrice
        ? Math.round((1 - displayPrice / originalPrice) * 100)
        : null;

    const images = product.images?.length > 0 ? product.images : [product.image];

    // Parse sizes config from DB (supports all legacy formats)
    const sizesConfig = (() => {
        if (!product.sizes) return null;
        try {
            const parsed = JSON.parse(product.sizes);
            // Very old: { enabled, type, values: string[] }
            if (Array.isArray(parsed.values)) {
                return {
                    enabled: parsed.enabled ?? false,
                    type: parsed.type ?? 'clothing',
                    sizes: (parsed.values as string[]).map((v: string) => ({
                        value: v, regularPrice: 0, discountPrice: null,
                    })),
                };
            }
            // Previous: { enabled, type, sizes: [{value, priceDiff}] }
            if (parsed.sizes?.[0]?.priceDiff !== undefined) {
                return {
                    enabled: parsed.enabled ?? false,
                    type: parsed.type ?? 'clothing',
                    sizes: parsed.sizes.map((s: { value: string; priceDiff: number }) => ({
                        value: s.value, regularPrice: 0, discountPrice: null,
                    })),
                };
            }
            // Current: { enabled, type, sizes: [{value, regularPrice, discountPrice}] }
            return parsed as {
                enabled: boolean;
                type: string;
                sizes: { value: string; regularPrice: number; discountPrice: number | null }[];
            };
        } catch { return null; }
    })();
    const hasSizes = sizesConfig?.enabled && (sizesConfig.sizes?.length ?? 0) > 0;

    // Effective price based on selected size
    // Effective price based on selected size
    const selectedSizeEntry = sizesConfig?.sizes?.find((s: { value: string; regularPrice: number; discountPrice: number | null }) => s.value === selectedSize);

    // Base prices for reference
    const baseReg = product.regularPrice;
    const baseDisc = product.discountPrice;

    // Determine regular and discount price for the current selection
    let currentReg = baseReg;
    let currentDisc = baseDisc;

    if (selectedSizeEntry) {
        if (selectedSizeEntry.regularPrice > 0) {
            currentReg = selectedSizeEntry.regularPrice;
            // If custom regular price is set, only use custom discount price
            currentDisc = selectedSizeEntry.discountPrice;
        } else {
            // Use base regular price, and custom or base discount price
            currentReg = baseReg;
            currentDisc = selectedSizeEntry.discountPrice !== null
                ? selectedSizeEntry.discountPrice
                : baseDisc;
        }
    }

    // Final prices to display
    const effectiveDisplayPrice = currentDisc ?? currentReg;
    const effectiveOriginalPrice = currentDisc !== null ? currentReg : null;

    // Discount badge percentage
    const effectiveDiscountPct = effectiveOriginalPrice
        ? Math.round((1 - effectiveDisplayPrice / effectiveOriginalPrice) * 100)
        : (baseDisc ? Math.round((1 - baseDisc / baseReg) * 100) : null);


    return (

        <div className="min-h-screen bg-white pb-20">
            {/* Top Navigation */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link href="/merchandise" className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors group">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Collection</span>
                    </Link>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Visual Section */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-[4/5] bg-[#F9F9F9] rounded-[2rem] sm:rounded-[3rem] overflow-hidden group shadow-2xl shadow-black/5">
                            <Image
                                src={images[activeImage] || '/images/reusable/placeholder.png'}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
                                <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/90 backdrop-blur-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-black rounded-lg sm:rounded-xl border border-white/50 shadow-sm">
                                    Official Archive
                                </span>
                            </div>
                            {product.stock <= 0 && (
                                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                                    <div className="px-6 py-3 bg-black text-white text-sm font-black uppercase tracking-widest rounded-2xl flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        <span>Stok Habis</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Strip (if multiple images) */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-black shadow-lg' : 'border-transparent opacity-50 hover:opacity-80'}`}
                                    >
                                        <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Information Section */}
                    <div className="lg:col-span-5 flex flex-col pt-4">
                        {/* Promotion / Action Banner */}
                        {(effectiveDiscountPct != null && effectiveDiscountPct > 0) && (
                            <div className="relative overflow-hidden bg-gradient-to-r from-ub-navy to-ub-dark-navy rounded-3xl p-6 mb-10 group shadow-lg">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <Zap className="w-16 h-16 text-white fill-current" />
                                </div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white text-lg font-black tracking-tight uppercase italic">
                                            {product.promotion?.name || 'SPECIAL PRICE'}
                                        </h3>
                                        <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1">
                                            {product.promotion
                                                ? `Ends: ${new Date(product.promotion.endAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}`
                                                : `Save ${effectiveDiscountPct}% from normal price`}
                                        </p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                                        <span className="text-2xl font-black text-white">-{effectiveDiscountPct}%</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Category */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">{product.category}</span>
                        </div>

                        {/* Product Name */}
                        <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-[1.1] mb-6 sm:mb-8 uppercase italic">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="flex flex-col gap-2 mb-8">
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="text-4xl sm:text-5xl font-black text-black tracking-tighter italic">
                                    {formatPrice(effectiveDisplayPrice * quantity)}
                                </span>
                                {effectiveDiscountPct != null && effectiveDiscountPct > 0 && (
                                    <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] sm:text-[11px] font-black rounded-lg">
                                        {effectiveDiscountPct}% OFF
                                    </span>
                                )}
                            </div>
                            {effectiveOriginalPrice != null && (
                                <span className="text-gray-400 text-sm sm:text-base font-medium line-through decoration-rose-500/30 decoration-2">
                                    {formatPrice(effectiveOriginalPrice * quantity)}
                                </span>
                            )}
                        </div>

                        {/* Stok Info */}
                        <div className="flex items-center gap-2 mb-8 px-4 py-3 bg-gray-50 rounded-2xl">
                            <Info className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                {product.stock > 0 ? `${product.stock} unit tersedia` : 'Stok Habis'}
                            </span>
                        </div>

                        {/* Product Options */}
                        <div className="space-y-10 mb-12">
                            {hasSizes && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            {sizesConfig!.type === 'inch' ? 'Pilih Ukuran (Inch)' : 'Pilih Ukuran'}
                                        </span>
                                        <button className="text-[10px] font-black text-ub-navy uppercase tracking-widest hover:underline underline-offset-4">
                                            Size Guide
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {sizesConfig!.sizes.map((entry: { value: string; regularPrice: number; discountPrice: number | null }) => {
                                            return (
                                                <button
                                                    key={entry.value}
                                                    onClick={() => setSelectedSize(entry.value === selectedSize ? null : entry.value)}
                                                    className={`flex flex-col items-center justify-center min-w-[60px] h-16 px-3 rounded-2xl text-xs font-black transition-all gap-0.5 ${selectedSize === entry.value
                                                        ? 'bg-black text-white shadow-xl shadow-black/20 ring-4 ring-black/5'
                                                        : 'bg-white text-gray-500 border border-gray-100 hover:border-black hover:text-black'
                                                        }`}
                                                >
                                                    <span>{entry.value}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {!selectedSize && (
                                        <p className="mt-3 text-[9px] font-bold text-rose-400 uppercase tracking-widest">
                                            ⚠ Silakan pilih ukuran sebelum membeli
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Quantity */}
                            <div>
                                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Quantity</span>
                                <div className="inline-flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-black transition-colors text-lg font-bold"
                                        disabled={product.stock <= 0}
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center text-sm font-black text-black">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-black transition-colors text-lg font-bold"
                                        disabled={product.stock <= 0}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-4 mb-12">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                    className="group py-6 bg-white text-black border-2 border-black text-[11px] font-black uppercase tracking-[0.3em] rounded-[2rem] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={product.stock <= 0}
                                    className="group py-6 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl hover:bg-ub-navy transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Buy Now
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-6 pt-12 border-t border-gray-100">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-black">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] text-black font-bold uppercase tracking-widest mb-1">Pengiriman Cepat</h4>
                                    <p className="text-[10px] text-black font-black">Dikirim 3-5 hari kerja ke seluruh Indonesia.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-black">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] text-black font-bold uppercase tracking-widest mb-1">Produk Resmi</h4>
                                    <p className="text-[10px] text-black font-black">100% merchandise original berlisensi UB.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Tabs */}
                <div className="mt-32 border-t border-gray-100 pt-16 max-w-4xl">
                    <div className="flex gap-12 mb-12 overflow-x-auto pb-4">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`text-[12px] font-black uppercase tracking-[0.3em] pb-4 transition-all whitespace-nowrap ${activeTab === 'description' ? 'text-black border-b-2 border-black' : 'text-gray-300 border-b-2 border-transparent hover:text-gray-500'}`}
                        >
                            Deskripsi Produk
                        </button>
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`text-[12px] font-black uppercase tracking-[0.3em] pb-4 transition-all whitespace-nowrap ${activeTab === 'specs' ? 'text-black border-b-2 border-black' : 'text-gray-300 border-b-2 border-transparent hover:text-gray-500'}`}
                        >
                            Spesifikasi
                        </button>
                    </div>

                    <div className="animate-in fade-in duration-500">
                        {activeTab === 'description' ? (
                            <div className="space-y-6">
                                <p className="text-xl text-gray-600 leading-relaxed font-medium italic">
                                    {product.description || 'A masterpiece of university pride, this item embodies the enduring spirit and excellence of Universitas Brawijaya.'}
                                </p>
                                <p className="text-gray-500 leading-relaxed border-l-4 border-ub-gold pl-8 py-2">
                                    Bagian dari koleksi resmi Brawijaya Heritage — merayakan komitmen institusi terhadap keunggulan akademik dan warisan komunitas.
                                </p>
                            </div>
                        ) : (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                {['Material: Premium Quality', 'Authentic UB Licensed Product', 'Care: Cold Wash Recommended', 'Origin: Official UB Merchandise Workshop'].map((spec, i) => (
                                    <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                                        <div className="w-2 h-2 bg-ub-gold rounded-full" />
                                        {spec}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </main>


            {/* Fixed Bottom Action Bar (Mobile Only) */}
            <div className="fixed bottom-0 inset-x-0 z-[60] bg-white/80 backdrop-blur-2xl border-t border-gray-100 p-4 pb-8 flex items-center justify-between gap-4 lg:hidden animate-in slide-in-from-bottom duration-500">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Price</span>
                    <span className="text-lg font-black text-black tracking-tighter italic leading-none">
                        {formatPrice(effectiveDisplayPrice * quantity)}
                    </span>
                </div>
                <div className="flex gap-2 flex-grow max-w-[200px]">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="flex-1 h-12 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center active:scale-95 disabled:opacity-40"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleBuyNow}
                        disabled={product.stock <= 0}
                        className="flex-[2] h-12 bg-ub-navy text-white text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center active:scale-95 disabled:opacity-40"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}
