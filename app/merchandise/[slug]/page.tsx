'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Star,
    ShieldCheck,
    Truck,
    ShoppingCart,
    Heart,
    Share2,
    Info,
    CheckCircle2,
    ArrowRight,
    Zap
} from 'lucide-react';
import { getProductBySlug as getMockProduct } from '@/lib/products-data';
import { getProductBySlug as getDbProduct } from '@/app/actions/products';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const mockProduct = useMemo(() => getMockProduct(slug), [slug]);
    const [dbProduct, setDbProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(!mockProduct);

    useEffect(() => {
        if (!mockProduct) {
            setIsLoading(true);
            getDbProduct(slug)
                .then((data) => {
                    if (data) setDbProduct(data);
                })
                .finally(() => setIsLoading(false));
        }
    }, [slug, mockProduct]);

    const product = mockProduct || dbProduct;

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(1);

    // Mock checkout form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                    <Info className="w-10 h-10 text-gray-300" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-4 uppercase">Piece Not Found</h1>
                <p className="text-gray-500 text-center max-w-md mb-8">The item you are looking for does not exist in our archive or has been moved.</p>
                <Link href="/merchandise" className="px-10 py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-ub-navy transition-all">
                    Return to Collection
                </Link>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    const handleCheckoutSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCheckoutStep(2); // Move to success/confirmation
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
                    <div className="lg:col-span-7 space-y-8">
                        <div className="relative aspect-[4/5] bg-[#F9F9F9] rounded-[3rem] overflow-hidden group shadow-2xl shadow-black/5">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute top-8 left-8">
                                <span className="px-4 py-2 bg-white/90 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest text-black rounded-xl border border-white/50 shadow-sm">
                                    Official Archive
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Information Section */}
                    <div className="lg:col-span-5 flex flex-col pt-4">
                        {/* Dynamic Flash Sale Banner*/}
                        <div className="relative overflow-hidden bg-gradient-to-r from-ub-navy to-ub-dark-navy rounded-3xl p-6 mb-10 group shadow-lg shadow-rose-500/10">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Zap className="w-16 h-16 text-white fill-current" />
                            </div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <h3 className="text-white text-lg font-black tracking-tight uppercase italic">FLASH SALE</h3>
                                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1">Limited Time Institutional Offer</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-3 border border-white/20">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[14px] font-black text-white">02</span>
                                        <span className="text-[6px] font-black text-white/60">HRS</span>
                                    </div>
                                    <span className="text-white font-black">:</span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[14px] font-black text-white">45</span>
                                        <span className="text-[6px] font-black text-white/60">MIN</span>
                                    </div>
                                    <span className="text-white font-black">:</span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[14px] font-black text-white">12</span>
                                        <span className="text-[6px] font-black text-white/60">SEC</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">{product.category}</span>
                            <div className="w-[1px] h-3 bg-gray-200" />
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-[11px] font-black">{product.rating}</span>
                                <span className="text-gray-400 text-[10px] font-medium ml-1">({product.sales} Sales)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tight leading-[1.1] mb-8 uppercase italic">
                            {product.name}
                        </h1>

                        <div className="flex flex-col gap-2 mb-8">
                            <div className="flex items-baseline gap-4">
                                <span className="text-5xl font-black text-black tracking-tighter italic">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] font-black rounded-lg">
                                    35% OFF
                                </span>
                            </div>
                            <span className="text-gray-400 text-base font-medium line-through decoration-rose-500/30 decoration-2">
                                {formatPrice(product.price * 1.35)}
                            </span>
                        </div>
                        {/* Product Options */}
                        <div className="space-y-10 mb-12">
                            {/* Size Selection */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Select Size</span>
                                    <button className="text-[10px] font-black text-ub-navy uppercase tracking-widest hover:underline underline-offset-4">Size Guide</button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-14 h-14 rounded-2xl text-xs font-black transition-all flex items-center justify-center ${selectedSize === size
                                                ? 'bg-black text-white shadow-xl shadow-black/20 ring-4 ring-black/5'
                                                : 'bg-white text-gray-400 border border-gray-100 hover:border-black hover:text-black'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Quantity</span>
                                <div className="inline-flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center text-sm font-black text-black">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Dual Call to Action Buttons */}
                        <div className="flex flex-col gap-4 mb-12">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    className="group py-6 bg-white text-black border-2 border-black text-[11px] font-black uppercase tracking-[0.3em] rounded-[2rem] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => setShowCheckout(true)}
                                    className="group py-6 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl hover:bg-ub-navy transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
                                >
                                    Buy Now
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="grid grid-cols-2 gap-6 pt-12 border-t border-gray-100">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-black">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] text-black font-bold uppercase tracking-widest mb-1">Global Shipping</h4>
                                    <p className="text-[10px] text-black font-black">Delivered to your doorstep within 3-5 business days.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-black">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] text-black font-bold uppercase tracking-widest mb-1">Vault Security</h4>
                                    <p className="text-[10px] text-black font-black">100% genuine merchandise under official UB license.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Information Tabs */}
                <div className="mt-32 border-t border-gray-100 pt-16 max-w-4xl">
                    <div className="flex gap-12 mb-12 overflow-x-auto pb-4 scrollbar-hide">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`text-[12px] font-black uppercase tracking-[0.3em] pb-4 transition-all whitespace-nowrap ${activeTab === 'description' ? 'text-black border-b-2 border-black' : 'text-gray-300 border-b-2 border-transparent hover:text-gray-500'}`}
                        >
                            History & Description
                        </button>
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`text-[12px] font-black uppercase tracking-[0.3em] pb-4 transition-all whitespace-nowrap ${activeTab === 'specs' ? 'text-black border-b-2 border-black' : 'text-gray-300 border-b-2 border-transparent hover:text-gray-500'}`}
                        >
                            Archival Specifications
                        </button>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {activeTab === 'description' ? (
                            <div className="space-y-6">
                                <p className="text-xl text-gray-600 leading-relaxed font-medium italic">
                                    {product.description || "A masterpiece of university pride, this item embodies the enduring spirit and excellence of Universitas Brawijaya. Crafted with meticulous attention to detail using only the finest materials available."}
                                </p>
                                <p className="text-gray-500 leading-relaxed border-l-4 border-ub-gold pl-8 py-2">
                                    This collection item is part of the limited Brawijaya Heritage Series, celebrating the institution's commitment to academic mastery and community legacy. Each piece is individually inspected for quality assurance.
                                </p>
                            </div>
                        ) : (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                {(product.specs || ['Composition: Professional Grade Material', 'Dimensions: Optimized for Comfort', 'Origin: Official UB Merchandise Workshop', 'Care: Cold Wash Preferred']).map((spec: string, i: number) => (
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

            {/* Premium Checkout Modal/Overlay */}
            {showCheckout && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 lg:p-12">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setShowCheckout(false)} />

                    <div className="relative w-full max-w-2xl bg-white rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-12 duration-700">
                        {checkoutStep === 1 ? (
                            <div className="flex flex-col h-[90vh] sm:h-auto max-h-[90vh]">
                                <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-[#F9F9F9]">
                                    <div>
                                        <h2 className="text-2xl font-black text-black tracking-tight uppercase italic">Order Acquisition</h2>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Finalize your archival selection</p>
                                    </div>
                                    <button
                                        onClick={() => setShowCheckout(false)}
                                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-black transition-all shadow-sm border border-gray-100"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-10 space-y-10">
                                    {/* Order Summary Recap */}
                                    <div className="bg-black text-white p-8 rounded-3xl flex items-center gap-8 shadow-xl shadow-black/10">
                                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0">
                                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black uppercase italic tracking-tight">{product.name}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
                                                Size: {selectedSize} · Quantity: {quantity}
                                            </p>
                                            <div className="mt-4 text-xl font-bold tracking-tighter text-ub-gold italic">
                                                {formatPrice(product.price * quantity)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 transition-all text-sm font-bold uppercase placeholder:text-gray-300"
                                                placeholder="EDWARD BRADLEY"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Institutional Email</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 transition-all text-sm font-bold lowercase placeholder:text-gray-300"
                                                placeholder="bradley@ub.ac.id"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Contact Number</label>
                                            <input
                                                required
                                                type="tel"
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 transition-all text-sm font-bold uppercase placeholder:text-gray-300"
                                                placeholder="+62 812 3456 7890"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Dispatch Address</label>
                                            <textarea
                                                required
                                                rows={3}
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 transition-all text-sm font-bold uppercase placeholder:text-gray-300 resize-none"
                                                placeholder="JL. VETERAN NO. 8, MALANG, JAWA TIMUR"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 italic">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                                            By proceeding, you agree to our Terms of Acquisition \u0026 Privacy Protocols.
                                        </p>
                                    </div>
                                </form>

                                <div className="p-10 bg-[#F9F9F9] border-t border-gray-100">
                                    <button
                                        type="submit"
                                        onClick={handleCheckoutSubmit}
                                        className="w-full py-6 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl hover:bg-ub-navy transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
                                    >
                                        Place Archival Order
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-20 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-1000">
                                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-black tracking-tight uppercase italic mb-4">Order Authenticated</h2>
                                    <p className="text-lg text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                                        Your acquisition request has been successfully recorded in the official archives.
                                        A confirmation dossier has been sent to your email.
                                    </p>
                                </div>
                                <div className="pt-10 flex flex-col gap-4 w-full">
                                    <button
                                        onClick={() => setShowCheckout(false)}
                                        className="w-full py-6 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl hover:bg-ub-navy transition-all"
                                    >
                                        Return to Archive
                                    </button>
                                    <button
                                        onClick={() => router.push('/merchandise')}
                                        className="w-full py-6 bg-white text-black border border-gray-100 text-[11px] font-black uppercase tracking-[0.3em] rounded-[2rem] hover:bg-gray-50 transition-all"
                                    >
                                        Explore Collection
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
