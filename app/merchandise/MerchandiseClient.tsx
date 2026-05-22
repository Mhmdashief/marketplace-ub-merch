'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Grid3x3, LayoutGrid, ArrowRight, Package, ChevronDown, Filter, SlidersHorizontal, Check } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    stock: number;
    image: string;
    sales: number;
    category?: string | null;
}

interface MerchandiseClientProps {
    initialProducts: Product[];
}


export default function MerchandiseClient({
    initialProducts,
}: MerchandiseClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryParam = searchParams ? searchParams.get('q') : '';

    const [searchQuery, setSearchQuery] = useState(queryParam || '');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [gridView, setGridView] = useState<'3' | '4'>('4');

    useEffect(() => {
        if (queryParam !== null) {
            setSearchQuery(queryParam);
        }
    }, [queryParam]);

    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);

    // Click outside handlers
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const categories = useMemo(() => {
        const cats = new Set(initialProducts.map(p => p.category).filter(Boolean) as string[]);
        return ['all', ...Array.from(cats)];
    }, [initialProducts]);

    const filteredProducts = useMemo(() => {
        let filtered = [...initialProducts];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q)
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
                break;
            case 'price-desc':
                filtered.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
                break;
            default:
                break;
        }

        return filtered;
    }, [initialProducts, searchQuery, sortBy, selectedCategory]);

    return (
        <div className="bg-white min-h-screen">
            {/* Advanced Premium Filter Bar */}
            <div className="sticky top-16 md:top-20 z-40 bg-white/90 backdrop-blur-2xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-center justify-between">

                        {/* Left: Search & Filters Group */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1 max-w-4xl">
                            {/* Modern Search */}
                            <div className="relative flex-1 group">
                                <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search specific products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 md:pl-14 pr-6 md:pr-8 py-3.5 md:py-5 bg-gray-50/50 border border-gray-100 rounded-[2rem] text-black focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black transition-all text-xs md:text-sm font-medium placeholder:text-gray-400"
                                />
                            </div>

                        </div>

                        {/* Right: Filters & View Controls */}
                        <div className="flex flex-row items-center gap-3 md:gap-4 w-full lg:w-auto justify-between sm:justify-start">

                            {/* Category Dropdown */}
                            <div className="relative flex-1 sm:flex-none" ref={categoryRef}>
                                <button
                                    onClick={() => {
                                        setIsCategoryOpen(!isCategoryOpen);
                                        setIsSortOpen(false);
                                    }}
                                    className={`w-full sm:w-auto px-4 sm:px-8 py-3.5 md:py-5 flex items-center justify-between gap-2 md:gap-4 bg-gray-50/50 border border-gray-100 rounded-[2rem] min-w-[140px] md:min-w-[180px] transition-all hover:bg-white hover:border-black group ${isCategoryOpen ? 'bg-white border-black ring-4 ring-black/5' : ''}`}
                                >
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <Filter className={`w-3.5 md:w-4 h-3.5 md:h-4 ${isCategoryOpen ? 'text-black' : 'text-gray-400'}`} />
                                        <span className={`text-[9px] md:text-[11px] font-black uppercase tracking-widest line-clamp-1 text-left ${isCategoryOpen ? 'text-black' : 'text-gray-600'}`}>
                                            {selectedCategory === 'all' ? 'Semua Kategori' : selectedCategory}
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-3.5 md:w-4 h-3.5 md:h-4 transition-transform duration-300 flex-shrink-0 ${isCategoryOpen ? 'rotate-180 text-black' : 'text-gray-400'}`} />
                                </button>

                                {isCategoryOpen && (
                                    <div className="absolute top-full right-0 mt-3 w-48 md:w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 md:p-3 animate-in fade-in slide-in-from-top-2 duration-300 z-50 ring-1 ring-black/5 max-h-80 overflow-y-auto">
                                        <div className="space-y-1">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => {
                                                        setSelectedCategory(cat);
                                                        setIsCategoryOpen(false);
                                                    }}
                                                    className={`w-full flex items-center justify-between px-4 md:px-5 py-3 md:py-3.5 rounded-2xl transition-all ${selectedCategory === cat
                                                        ? 'bg-black text-white'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                                                        }`}
                                                >
                                                    <span className="text-[10px] md:text-xs font-bold line-clamp-1 text-left">
                                                        {cat === 'all' ? 'Semua Kategori' : cat}
                                                    </span>
                                                    {selectedCategory === cat && <Check className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Grid View Controls (Hidden on very small screens, default to 2 cols) */}
                            <div className="hidden sm:flex bg-gray-100/50 p-1.5 rounded-[2rem] border border-gray-100">
                                <button
                                    onClick={() => setGridView('3')}
                                    aria-label="Tampilan grid 3 kolom"
                                    className={`p-3 md:p-3.5 rounded-2xl transition-all ${gridView === '3' ? 'bg-white shadow-lg text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Grid3x3 className="w-4 md:w-5 h-4 md:h-5" />
                                </button>
                                <button
                                    onClick={() => setGridView('4')}
                                    aria-label="Tampilan grid 4 kolom"
                                    className={`p-3 md:p-3.5 rounded-2xl transition-all ${gridView === '4' ? 'bg-white shadow-lg text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <LayoutGrid className="w-4 md:w-5 h-4 md:h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Display Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-16 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-black italic uppercase">Brawijaya Archive</h2>
                        <div className="flex items-center gap-2 md:gap-3 mt-2">
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-ub-gold">Curated Collection</span>
                            <div className="w-8 md:w-12 h-[1px] bg-gray-200" />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{filteredProducts.length} Items Available</span>
                        </div>
                    </div>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className={`grid gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-20 transition-all duration-500 ${gridView === '3'
                        ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-2 lg:grid-cols-4'
                        }`}>
                        {filteredProducts.map((product, idx) => (
                            <Link
                                key={product.id}
                                href={`/merchandise/${product.slug}`}
                                className="group relative flex flex-col"
                            >
                                {/* Augmented Product Image */}
                                <div className="relative aspect-[4/5] overflow-hidden bg-[#fafafa] rounded-2xl md:rounded-[2.5rem] transition-all duration-700 group-hover:md:rounded-[1.5rem] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-gray-100">
                                    <Image
                                        src={product.image || '/images/reusable/placeholder.png'}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                                    {/* Action Overlays */}


                                    <div className="hidden md:flex absolute inset-x-8 bottom-8 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                                        <div className="w-full py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-3xl hover:bg-ub-navy transition-all flex items-center justify-center gap-4">
                                            Acquire Now
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Product Status Badge */}
                                    <div className="absolute top-3 left-3 md:top-6 md:left-6 flex flex-col gap-2">
                                        {product.discountPrice && (
                                            <span className="px-2 md:px-4 py-1.5 md:py-2 bg-rose-500 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg md:rounded-xl shadow-md">
                                                Sale
                                            </span>
                                        )}
                                    </div>

                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm md:backdrop-blur-md flex items-center justify-center">
                                            <div className="px-3 md:px-6 py-2 md:py-3 bg-black text-white rounded-xl md:rounded-2xl flex items-center gap-1 md:gap-2">
                                                <Package className="w-3 md:w-4 h-3 md:h-4" />
                                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Sold Out</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Refined Meta Info */}
                                <div className="mt-4 md:mt-10 px-1 md:px-4 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-2 md:mb-4">
                                        <span className="text-[9px] md:text-[11px] font-black text-ub-gold uppercase tracking-[0.3em] line-clamp-1">
                                            {product.category || 'Merchandise'}
                                        </span>
                                    </div>

                                    <h3 className="text-sm md:text-xl font-bold text-gray-900 leading-snug mb-4 group-hover:text-ub-navy transition-colors line-clamp-2 italic">
                                        {product.name}
                                    </h3>

                                    <div className="mt-auto pt-3 md:pt-6 border-t border-gray-50 flex flex-col md:flex-row items-start md:items-end justify-between gap-3">
                                        <div className="flex flex-col gap-1 w-full">
                                            <div className="flex items-center justify-between w-full">
                                                <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest">Official Price</span>
                                                <span className="md:hidden text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">
                                                    {product.stock > 0 ? `${product.stock} Left` : 'Out'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                                <span className="text-lg md:text-2xl font-black text-black tracking-tighter italic">
                                                    {formatPrice(product.discountPrice ?? product.price)}
                                                </span>
                                                {product.discountPrice && (
                                                    <span className="text-[10px] md:text-xs text-gray-400 line-through font-medium">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="hidden md:inline-flex text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-2 rounded-xl whitespace-nowrap">
                                            {product.stock > 0 ? `${product.stock} Units` : 'Out'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-48 border-[3px] border-dashed border-gray-50 rounded-[4rem] bg-gray-50/20">
                        <div className="w-24 h-24 bg-white rounded-full shadow-xl shadow-black/5 flex items-center justify-center mb-8 animate-pulse">
                            <Package className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight mb-4 uppercase italic">Produk Tidak Ditemukan</h3>
                        <p className="text-gray-400 text-sm mb-12 max-w-sm text-center font-medium leading-relaxed">
                            Maaf, kami tidak dapat menemukan produk dalam koleksi ini. Silakan coba atur kembali filter Anda atau jelajahi kategori lainnya.
                        </p>
                        {(searchQuery || selectedCategory !== 'all') && (
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                                className="px-14 py-6 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-[2rem] shadow-2xl hover:shadow-black/20 hover:bg-ub-navy transition-all active:scale-95"
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
