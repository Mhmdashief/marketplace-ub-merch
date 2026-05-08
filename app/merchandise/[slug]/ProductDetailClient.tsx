'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck, Truck, ArrowRight, Zap, Package, Info, ExternalLink, Loader2 } from 'lucide-react';

interface ProductDetail {
    id: string;
    name: string;
    slug: string;
    description: string;
    stock: number;
    regularPrice: number;
    discountPrice: number | null;
    category: string | null;
    isActive: boolean;
    images: string[];
    rating: number;
    sales: number;
    price: number;
    image: string;
    sizes?: string | null;
    marketplaceLinks?: {
        id: string;
        platform: string;
        url: string;
        isActive: boolean;
    }[];
    promotion?: {
        name: string;
        endAt: Date;
        discountValue: number;
        discountType: 'PERCENTAGE' | 'FIXED';
    } | null;
}

export default function ProductDetailClient({ product }: { product: ProductDetail }) {
    const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
    const [activeImage, setActiveImage] = useState(0);
    const [redirectingLinkId, setRedirectingLinkId] = useState<string | null>(null);



    const handleMarketplaceClick = async (link: { id: string; platform: string; url: string }) => {
        setRedirectingLinkId(link.id);
        try {
            const res = await fetch('/api/track-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    platform: link.platform,
                    marketplaceLinkId: link.id,
                }),
            });
            const data = await res.json();
            if (data.url) {
                window.open(data.url, '_blank');
            } else {
                window.open(link.url, '_blank');
            }
        } catch (err) {
            console.error('Track click failed', err);
            window.open(link.url, '_blank');
        } finally {
            setRedirectingLinkId(null);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const effectiveDisplayPrice = product.discountPrice ?? product.regularPrice;
    const effectiveOriginalPrice = product.discountPrice !== null ? product.regularPrice : null;

    const effectiveDiscountPct = effectiveOriginalPrice
        ? Math.round((1 - effectiveDisplayPrice / effectiveOriginalPrice) * 100)
        : null;

    const images = product.images?.length > 0 ? product.images : [product.image];
    const activeLinks = product.marketplaceLinks?.filter(l => l.isActive) || [];

    const getPlatformColor = (platform: string) => {
        switch (platform.toUpperCase()) {
            case 'TOKOPEDIA': return 'bg-[#00AA5B] hover:bg-[#008f4c] text-white';
            case 'SHOPEE': return 'bg-[#EE4D2D] hover:bg-[#d74224] text-white';
            case 'LAZADA': return 'bg-[#F36F21] hover:bg-[#e06117] text-white';
            case 'TIKTOK_SHOP': return 'bg-black hover:bg-gray-800 text-white';
            case 'BUKALAPAK': return 'bg-[#E31E52] hover:bg-[#c91847] text-white';
            default: return 'bg-ub-navy hover:bg-ub-dark-navy text-white';
        }
    };

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
                        {/* Authentic Heritage Badge */}
                        <div className="relative w-full overflow-hidden bg-gray-50/80 rounded-3xl p-6 mb-8 border border-gray-100 group transition-all duration-500 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-ub-gold/20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-ub-gold/5 rounded-full blur-3xl group-hover:bg-ub-gold/10 transition-colors duration-500" />
                            <div className="relative flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500 text-ub-gold">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-[11px] font-black text-black uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                                        Official Brawijaya Merchandise
                                        {product.promotion && (
                                            <span className="bg-ub-gold text-white px-2 py-0.5 rounded-md text-[8px] animate-pulse">
                                                {product.promotion.name}
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed max-w-[280px]">
                                        Produk berlisensi resmi. Kualitas terjamin dengan standar premium Universitas Brawijaya.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">{product.category}</span>
                        </div>

                        <div className="flex items-start justify-between gap-6 mb-6 sm:mb-8">
                            <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-[1.1] uppercase italic">
                                {product.name}
                            </h1>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col gap-2 mb-8">
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="text-4xl sm:text-5xl font-black text-black tracking-tighter italic">
                                    {formatPrice(effectiveDisplayPrice)}
                                </span>
                                {effectiveDiscountPct != null && effectiveDiscountPct > 0 && (
                                    <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] sm:text-[11px] font-black rounded-lg">
                                        {effectiveDiscountPct}% OFF
                                    </span>
                                )}
                            </div>
                            {effectiveOriginalPrice != null && (
                                <span className="text-gray-400 text-sm sm:text-base font-medium line-through decoration-rose-500/30 decoration-2">
                                    {formatPrice(effectiveOriginalPrice)}
                                </span>
                            )}
                        </div>

                        {/* Stok Info */}
                        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-6 py-5 rounded-3xl border transition-all duration-300 ${
                            product.stock > 0 && product.stock <= 10 
                                ? 'bg-orange-50/50 border-orange-100' 
                                : product.stock > 0 
                                    ? 'bg-emerald-50/50 border-emerald-100' 
                                    : 'bg-rose-50/50 border-rose-100'
                        }`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                    product.stock > 0 && product.stock <= 10 ? 'bg-orange-100 text-orange-600' : product.stock > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                                }`}>
                                    {product.stock > 0 && product.stock <= 10 ? <Zap className="w-5 h-5 animate-pulse" /> : product.stock > 0 ? <Package className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-black uppercase tracking-[0.2em] mb-1">Status Ketersediaan</h4>
                                    <p className={`text-xs font-bold ${
                                        product.stock > 0 && product.stock <= 10 ? 'text-orange-600' : product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'
                                    }`}>
                                        {product.stock > 0 && product.stock <= 10 ? `Sisa ${product.stock} unit - Terbatas!` : product.stock > 0 ? `Ready Stock (${product.stock} Unit)` : 'Stok Habis Sementara'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center hidden sm:flex pr-2">
                                <div className="relative flex h-3 w-3">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                        product.stock > 0 && product.stock <= 10 ? 'bg-orange-400' : product.stock > 0 ? 'bg-emerald-400' : 'bg-rose-400'
                                    }`}></span>
                                    <span className={`relative inline-flex rounded-full h-3 w-3 ${
                                        product.stock > 0 && product.stock <= 10 ? 'bg-orange-500' : product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                                    }`}></span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons - Marketplace Links */}
                        <div className="flex flex-col gap-4 mb-12">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Beli di Official Store Kami</h3>
                            {activeLinks.length > 0 ? (
                                <div className="grid gap-3">
                                    {activeLinks.map(link => (
                                        <button
                                            key={link.id}
                                            onClick={() => handleMarketplaceClick(link)}
                                            disabled={product.stock <= 0 || redirectingLinkId === link.id}
                                            className={`group py-5 px-6 ${getPlatformColor(link.platform)} text-[11px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] shadow-xl hover:shadow-2xl transition-all flex items-center justify-between active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed`}
                                        >
                                            <span className="flex items-center gap-3">
                                                {redirectingLinkId === link.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <ExternalLink className="w-5 h-5" />
                                                )}
                                                Beli di {link.platform}
                                            </span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        Belum tersedia di marketplace online
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-6 pt-12 border-t border-gray-100">
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
            <div className="fixed bottom-0 inset-x-0 z-[60] bg-white/90 backdrop-blur-2xl border-t border-gray-100 p-4 pb-6 flex flex-col gap-3 lg:hidden animate-in slide-in-from-bottom duration-500">
                <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Price</span>
                    <span className="text-lg font-black text-black tracking-tighter italic leading-none">
                        {formatPrice(effectiveDisplayPrice)}
                    </span>
                </div>
                {activeLinks.length > 0 ? (
                    <div className="flex gap-2 w-full overflow-x-auto pb-2 snap-x">
                        {activeLinks.map(link => (
                            <button
                                key={link.id}
                                onClick={() => handleMarketplaceClick(link)}
                                disabled={product.stock <= 0 || redirectingLinkId === link.id}
                                className={`flex-1 min-w-[140px] snap-center py-4 ${getPlatformColor(link.platform)} text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40 whitespace-nowrap px-4`}
                            >
                                {redirectingLinkId === link.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ExternalLink className="w-4 h-4" />
                                )}
                                {link.platform}
                            </button>
                        ))}
                    </div>
                ) : (
                    <button disabled className="w-full py-4 bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-2xl">
                        Tidak Tersedia
                    </button>
                )}
            </div>
        </div>
    );
}
