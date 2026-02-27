'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Grid3x3, LayoutGrid, Heart, ArrowRight, Package, ChevronDown, Filter, SlidersHorizontal, Check } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    hasPromotion?: boolean;
    promoName?: string;
    stock: number;
    category: string;
    categorySlug: string;
    image: string;
    sales: number;
}

interface Category {
    name: string;
    slug: string;
}

interface MerchandiseClientProps {
    initialProducts: Product[];
    categories: Category[];
    activeCategory?: string;
}

const SORT_OPTIONS = [
    { label: 'Terbaru', value: 'newest' },
    { label: 'Harga Terendah', value: 'price-asc' },
    { label: 'Harga Tertinggi', value: 'price-desc' },
];

export default function MerchandiseClient({
    initialProducts,
    categories,
    activeCategory,
}: MerchandiseClientProps) {
    const router = useRouter();

    const [selectedCategorySlug, setSelectedCategorySlug] = useState(activeCategory || 'all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [gridView, setGridView] = useState<'3' | '4'>('4');
    const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

    // Dropdown States
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const categoryRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    // Sync categories from props
    useEffect(() => {
        setSelectedCategorySlug(activeCategory || 'all');
    }, [activeCategory]);

    // Click outside handlers
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
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

    const handleCategoryChange = (slug: string) => {
        setSelectedCategorySlug(slug);
        setIsCategoryOpen(false);
        if (slug === 'all') {
            router.push('/merchandise', { scroll: false });
        } else {
            router.push(`/merchandise?category=${slug}`, { scroll: false });
        }
    };

    const toggleLike = (productId: string) => {
        setLikedProducts(prev => {
            const next = new Set(prev);
            if (next.has(productId)) {
                next.delete(productId);
            } else {
                next.add(productId);
            }
            return next;
        });
    };

    const activeSortLabel = SORT_OPTIONS.find(opt => opt.value === sortBy)?.label || 'Sort By';
    const activeCategoryName = selectedCategorySlug === 'all'
        ? 'All Categories'
        : categories.find(c => c.slug === selectedCategorySlug)?.name || selectedCategorySlug;

    const filteredProducts = useMemo(() => {
        let filtered = [...initialProducts];

        if (selectedCategorySlug && selectedCategorySlug !== 'all') {
            filtered = filtered.filter(p => p.categorySlug === selectedCategorySlug);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
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
    }, [initialProducts, searchQuery, sortBy, selectedCategorySlug]);

    const NAVBAR_CATEGORIES = [
        { name: 'Tote Bag & Slempang', slug: 'totebag-and-slempang' },
        { name: 'T-shirt', slug: 't-shirt' },
        { name: 'Tumbler', slug: 'tumbler' },
        { name: 'Crewneck & Hoodie', slug: 'crewneck-and-hoodie' },
        { name: 'Varsity', slug: 'varsity' },
        { name: 'Polo', slug: 'polo' },
        { name: 'Leather Jacket', slug: 'leather-jacket' },
        { name: 'Leather Product', slug: 'leather-product' },
        { name: 'T-Shirt Colourful', slug: 't-shirt-colourful' },
        { name: 'Vest', slug: 'vest' },
        { name: 'Sepatu', slug: 'sepatu' },
        { name: 'Topi', slug: 'topi' },
        { name: 'Sweater', slug: 'sweater' }
    ];

    const allCategories = useMemo(() => {
        const base = [{ name: 'All Categories', slug: 'all' }];
        const combined = [...NAVBAR_CATEGORIES];

        categories.forEach(cat => {
            if (!combined.some(c => c.slug === cat.slug)) {
                combined.push(cat);
            }
        });

        return [...base, ...combined];
    }, [categories]);

    return (
        <div className="bg-white min-h-screen">
            {/* Advanced Premium Filter Bar */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-2xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">

                        {/* Left: Search & Filters Group */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1 max-w-4xl">
                            {/* Modern Search */}
                            <div className="relative flex-1 group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search specific products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-8 py-5 bg-gray-50/50 border border-gray-100 rounded-3xl text-black focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black transition-all text-sm font-medium placeholder:text-gray-400"
                                />
                            </div>

                            {/* Premium Category Dropdown - Synchronized with Navbar Style */}
                            <div className="relative" ref={categoryRef}>
                                <button
                                    onClick={() => {
                                        setIsCategoryOpen(!isCategoryOpen);
                                        setIsSortOpen(false);
                                    }}
                                    className={`h-full px-8 py-5 flex items-center justify-between gap-4 bg-gray-50/50 border border-gray-100 rounded-3xl min-w-[200px] transition-all hover:bg-white hover:border-black group ${isCategoryOpen ? 'bg-white border-black ring-4 ring-black/5' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Filter className={`w-4 h-4 ${isCategoryOpen ? 'text-black' : 'text-gray-400'}`} />
                                        <span className={`text-[11px] font-black uppercase tracking-widest ${isCategoryOpen ? 'text-black' : 'text-gray-600'}`}>
                                            {activeCategoryName}
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180 text-black' : 'text-gray-400'}`} />
                                </button>

                                {isCategoryOpen && (
                                    <div className="absolute top-full left-0 mt-3 w-screen max-w-[320px] sm:max-w-[480px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 animate-in fade-in slide-in-from-top-2 duration-300 z-50 ring-1 ring-black/5">
                                        <div className="mb-4 pb-4 border-b border-gray-50">
                                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Select Category</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {allCategories.map((cat) => (
                                                <button
                                                    key={cat.slug}
                                                    onClick={() => handleCategoryChange(cat.slug)}
                                                    className={`flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all group/item ${selectedCategorySlug === cat.slug
                                                        ? 'bg-black text-white shadow-xl shadow-black/10'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                                                        }`}
                                                >
                                                    <span className={`text-xs font-bold ${selectedCategorySlug === cat.slug ? '' : 'group-hover/item:translate-x-1'} transition-transform`}>
                                                        {cat.name}
                                                    </span>
                                                    {selectedCategorySlug === cat.slug && <Check className="w-4 h-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Sort & View Controls */}
                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            {/* Custom Sort Dropdown */}
                            <div className="relative flex-1 sm:flex-none" ref={sortRef}>
                                <button
                                    onClick={() => {
                                        setIsSortOpen(!isSortOpen);
                                        setIsCategoryOpen(false);
                                    }}
                                    className={`w-full sm:w-auto px-8 py-5 flex items-center justify-between gap-4 bg-gray-50/50 border border-gray-100 rounded-3xl min-w-[180px] transition-all hover:bg-white hover:border-black group ${isSortOpen ? 'bg-white border-black ring-4 ring-black/5' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <SlidersHorizontal className={`w-4 h-4 ${isSortOpen ? 'text-black' : 'text-gray-400'}`} />
                                        <span className={`text-[11px] font-black uppercase tracking-widest ${isSortOpen ? 'text-black' : 'text-gray-600'}`}>
                                            {activeSortLabel}
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSortOpen ? 'rotate-180 text-black' : 'text-gray-400'}`} />
                                </button>

                                {isSortOpen && (
                                    <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 p-3 animate-in fade-in slide-in-from-top-2 duration-300 z-50 ring-1 ring-black/5">
                                        <div className="space-y-1">
                                            {SORT_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => {
                                                        setSortBy(opt.value);
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all ${sortBy === opt.value
                                                        ? 'bg-black text-white'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                                                        }`}
                                                >
                                                    <span className="text-xs font-bold">{opt.label}</span>
                                                    {sortBy === opt.value && <Check className="w-4 h-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Grid View Controls */}
                            <div className="flex bg-gray-100/50 p-1.5 rounded-[2rem] border border-gray-100">
                                <button
                                    onClick={() => setGridView('3')}
                                    className={`p-3.5 rounded-2xl transition-all ${gridView === '3' ? 'bg-white shadow-lg text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Grid3x3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setGridView('4')}
                                    className={`p-3.5 rounded-2xl transition-all ${gridView === '4' ? 'bg-white shadow-lg text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Display Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-16">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-black italic uppercase">Brawijaya Archive</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ub-gold">Curated Collection</span>
                            <div className="w-12 h-[1px] bg-gray-200" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{filteredProducts.length} Items Available</span>
                        </div>
                    </div>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className={`grid gap-x-8 gap-y-20 transition-all duration-500 ${gridView === '3'
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-2 lg:grid-cols-4'
                        }`}>
                        {filteredProducts.map((product, idx) => (
                            <Link
                                key={product.id}
                                href={`/merchandise/${product.slug}`}
                                className="group relative flex flex-col"
                            >
                                {/* Augmented Product Image */}
                                <div className="relative aspect-[4/5] overflow-hidden bg-[#fafafa] rounded-[2.5rem] transition-all duration-700 group-hover:rounded-[1.5rem] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]">
                                    <Image
                                        src={product.image || '/images/reusable/placeholder.png'}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                                    {/* Action Overlays */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleLike(product.id);
                                        }}
                                        className={`absolute top-6 right-6 p-4 rounded-2xl backdrop-blur-2xl shadow-sm transition-all duration-500 ${likedProducts.has(product.id)
                                            ? 'bg-rose-500 text-white opacity-100'
                                            : 'bg-white/80 text-black opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                                            }`}
                                    >
                                        <Heart className={`w-4 h-4 ${likedProducts.has(product.id) ? 'fill-current' : ''}`} />
                                    </button>

                                    <div className="absolute inset-x-8 bottom-8 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                                        <div className="w-full py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-3xl hover:bg-ub-navy transition-all flex items-center justify-center gap-4">
                                            Acquire Now
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Product Status Badge */}
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        {(product.hasPromotion || product.discountPrice) && (
                                            <span className="px-4 py-2 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                                                {product.promoName || 'Special Price'}
                                            </span>
                                        )}
                                    </div>

                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center">
                                            <div className="px-6 py-3 bg-black text-white rounded-2xl flex items-center gap-2">
                                                <Package className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Fully Acquired</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Refined Meta Info */}
                                <div className="mt-10 px-4 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[11px] font-black text-ub-gold uppercase tracking-[0.3em]">{product.category}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-6 group-hover:text-ub-navy transition-colors line-clamp-1 italic">
                                        {product.name}
                                    </h3>

                                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-end justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Official Price</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-black text-black tracking-tighter italic">
                                                    {formatPrice(product.discountPrice ?? product.price)}
                                                </span>
                                                {product.discountPrice && (
                                                    <span className="text-xs text-gray-400 line-through font-medium">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-3 py-2 rounded-xl">
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
                        {(searchQuery || selectedCategorySlug !== 'all') && (
                            <button
                                onClick={() => { setSearchQuery(''); handleCategoryChange('all'); }}
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
