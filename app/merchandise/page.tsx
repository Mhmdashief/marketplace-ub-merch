'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { Search, Grid3x3, LayoutGrid, Heart, ShoppingCart } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// All products data - FIXED UNIQUE IDs
const allProducts = [
    // Varsity Collection (1-2)
    { id: 1, name: 'Varsity Jacket UB Limited Edition', price: 450000, category: 'Varsity', image: '/images/products/Varsity/1.png', rating: 4.9, sales: 245 },
    { id: 2, name: 'Varsity Jacket UB Classic', price: 450000, category: 'Varsity', image: '/images/products/Varsity/2.png', rating: 4.8, sales: 189 },

    // Sepatu Collection (3-12)
    { id: 3, name: 'Sepatu Sneakers UB Collection', price: 385000, category: 'Sepatu', image: '/images/products/Sepatu/1.png', rating: 4.8, sales: 198 },
    { id: 4, name: 'Sepatu Sneakers UB White Edition', price: 395000, category: 'Sepatu', image: '/images/products/Sepatu/2.png', rating: 4.7, sales: 167 },
    { id: 5, name: 'Sepatu Sneakers Navy', price: 395000, category: 'Sepatu', image: '/images/products/Sepatu/3.png', rating: 4.6, sales: 145 },
    { id: 6, name: 'Sepatu Sneakers UB Navy', price: 385000, category: 'Sepatu', image: '/images/products/Sepatu/4.png', rating: 4.8, sales: 178 },
    { id: 7, name: 'Sepatu Sneakers White', price: 385000, category: 'Sepatu', image: '/images/products/Sepatu/5.png', rating: 4.9, sales: 203 },
    { id: 8, name: 'Sepatu Sneakers UB Red', price: 395000, category: 'Sepatu', image: '/images/products/Sepatu/6.png', rating: 4.7, sales: 134 },
    { id: 9, name: 'Sepatu Sneakers Series', price: 385000, category: 'Sepatu', image: '/images/products/Sepatu/7.png', rating: 4.8, sales: 189 },
    { id: 10, name: 'Sepatu Sneakers UB Edition', price: 385000, category: 'Sepatu', image: '/images/products/Sepatu/8.png', rating: 4.7, sales: 156 },
    { id: 11, name: 'Sepatu Sneakers UB Premium', price: 395000, category: 'Sepatu', image: '/images/products/Sepatu/9.png', rating: 4.8, sales: 178 },
    { id: 12, name: 'Sepatu Sneakers UB Limited', price: 395000, category: 'Sepatu', image: '/images/products/Sepatu/10.png', rating: 4.9, sales: 192 },

    // Topi Collection (13-16)
    { id: 13, name: 'Topi Baseball UB Premium', price: 95000, category: 'Topi', image: '/images/products/Topi/1.png', rating: 4.6, sales: 234 },
    { id: 14, name: 'Topi Baseball Classic', price: 95000, category: 'Topi', image: '/images/products/Topi/2.png', rating: 4.7, sales: 198 },
    { id: 15, name: 'Topi Baseball UB Black', price: 95000, category: 'Topi', image: '/images/products/Topi/3.png', rating: 4.5, sales: 167 },
    { id: 16, name: 'Topi Baseball UB Navy', price: 95000, category: 'Topi', image: '/images/products/Topi/4.png', rating: 4.6, sales: 156 },

    // T-shirt Collection (17-21)
    { id: 17, name: 'T-shirt UB Official', price: 125000, category: 'T-shirt', image: '/images/products/T-Shirt/1.png', rating: 4.7, sales: 289 },
    { id: 18, name: 'T-shirt UB Premium', price: 135000, category: 'T-shirt', image: '/images/products/T-Shirt/2.png', rating: 4.6, sales: 234 },
    { id: 19, name: 'T-shirt UB Classic', price: 125000, category: 'T-shirt', image: '/images/products/T-Shirt/3.png', rating: 4.8, sales: 267 },
    { id: 20, name: 'T-shirt UB Edition', price: 125000, category: 'T-shirt', image: '/images/products/T-Shirt/4.png', rating: 4.7, sales: 245 },
    { id: 21, name: 'T-shirt UB Limited', price: 135000, category: 'T-shirt', image: '/images/products/T-Shirt/5.png', rating: 4.8, sales: 256 },

    // T-Shirt Colourful Collection (22-28)
    { id: 22, name: 'T-Shirt Colourful UB Complete', price: 135000, category: 'T-Shirt Colourful', image: '/images/products/T-Shirt Colourful/1.png', rating: 4.7, sales: 178 },
    { id: 23, name: 'T-Shirt Colourful UB Limited', price: 125000, category: 'T-Shirt Colourful', image: '/images/products/T-Shirt Colourful/2.png', rating: 4.6, sales: 145 },
    { id: 24, name: 'T-Shirt Colourful UB Edition', price: 135000, category: 'T-Shirt Colourful', image: '/images/products/T-Shirt Colourful/3.png', rating: 4.8, sales: 198 },
    { id: 25, name: 'T-Shirt Colourful UB Premium', price: 135000, category: 'T-Shirt Colourful', image: '/images/products/T-Shirt Colourful/4.png', rating: 4.7, sales: 167 },
    { id: 26, name: 'T-Shirt Colourful UB Classic', price: 125000, category: 'T-Shirt Colourful', image: '/images/products/T-Shirt Colourful/5.png', rating: 4.8, sales: 189 },
    { id: 27, name: 'T-Shirt Colourful UB Special', price: 135000, category: 'T-Shirt Colourful', image: '/images/products/T-Shirt Colourful/6.png', rating: 4.7, sales: 156 },
    { id: 28, name: 'T-Shirt Colourful UB Exclusive', price: 135000, category: 'T-Shirt Colourful', image: '/images/products/T-Shirt Colourful/7.png', rating: 4.9, sales: 201 },

    // Leather Product Collection (29-35)
    { id: 29, name: 'Leather Product UB Collection', price: 135000, category: 'Leather Product', image: '/images/products/Leather Product/1.png', rating: 4.8, sales: 156 },
    { id: 30, name: 'Leather Product Set UB Collection', price: 145000, category: 'Leather Product', image: '/images/products/Leather Product/2.png', rating: 4.7, sales: 134 },
    { id: 31, name: 'Leather Product Bundle', price: 150000, category: 'Leather Product', image: '/images/products/Leather Product/3.png', rating: 4.9, sales: 167 },
    { id: 32, name: 'Leather Product Premium', price: 155000, category: 'Leather Product', image: '/images/products/Leather Product/4.png', rating: 4.8, sales: 145 },
    { id: 33, name: 'Leather Product Limited', price: 160000, category: 'Leather Product', image: '/images/products/Leather Product/5.png', rating: 4.7, sales: 128 },
    { id: 34, name: 'Leather Product Exclusive', price: 165000, category: 'Leather Product', image: '/images/products/Leather Product/6.png', rating: 4.9, sales: 178 },
    { id: 35, name: 'Leather Product Special', price: 170000, category: 'Leather Product', image: '/images/products/Leather Product/7.png', rating: 4.8, sales: 156 },

    // Leather Jacket Collection (36-37)
    { id: 36, name: 'Leather Jacket UB Edition', price: 555000, category: 'Leather Jacket', image: '/images/products/Leather jacket/1.png', rating: 4.9, sales: 89 },
    { id: 37, name: 'Leather Jacket UB Premium', price: 565000, category: 'Leather Jacket', image: '/images/products/Leather jacket/8.png', rating: 4.8, sales: 76 },

    // Tote Bag & Slempang Collection (38-41)
    { id: 38, name: 'Tote Bag UB Official', price: 145000, category: 'Tote Bag & Slempang', image: '/images/products/Totebag & Slempang/1.png', rating: 4.6, sales: 198 },
    { id: 39, name: 'Tote Bag UB Premium', price: 150000, category: 'Tote Bag & Slempang', image: '/images/products/Totebag & Slempang/2.png', rating: 4.7, sales: 178 },
    { id: 40, name: 'Slempang UB Collection', price: 155000, category: 'Tote Bag & Slempang', image: '/images/products/Totebag & Slempang/3.png', rating: 4.5, sales: 145 },
    { id: 41, name: 'Tote Bag UB Limited', price: 160000, category: 'Tote Bag & Slempang', image: '/images/products/Totebag & Slempang/4.png', rating: 4.8, sales: 167 },

    // Crewneck & Hoodie Collection (42-48)
    { id: 42, name: 'Crewneck & Hoodie Set', price: 220000, category: 'Crewneck & Hoodie', image: '/images/products/Crewneck & Hoodie/1.png', rating: 4.8, sales: 167 },
    { id: 43, name: 'Crewneck UB Premium', price: 215000, category: 'Crewneck & Hoodie', image: '/images/products/Crewneck & Hoodie/2.png', rating: 4.7, sales: 156 },
    { id: 44, name: 'Hoodie UB Classic', price: 225000, category: 'Crewneck & Hoodie', image: '/images/products/Crewneck & Hoodie/3.png', rating: 4.9, sales: 189 },
    { id: 45, name: 'Crewneck UB Limited', price: 230000, category: 'Crewneck & Hoodie', image: '/images/products/Crewneck & Hoodie/4.png', rating: 4.8, sales: 178 },
    { id: 46, name: 'Hoodie UB Premium', price: 235000, category: 'Crewneck & Hoodie', image: '/images/products/Crewneck & Hoodie/5.png', rating: 4.7, sales: 145 },
    { id: 47, name: 'Crewneck UB Edition', price: 220000, category: 'Crewneck & Hoodie', image: '/images/products/Crewneck & Hoodie/6.png', rating: 4.9, sales: 198 },
    { id: 48, name: 'Hoodie UB Exclusive', price: 240000, category: 'Crewneck & Hoodie', image: '/images/products/Crewneck & Hoodie/7.png', rating: 4.8, sales: 167 },

    // Tumbler Collection (49-54)
    { id: 49, name: 'Tumbler UB Official', price: 135000, category: 'Tumbler', image: '/images/products/Tumbler/1.png', rating: 4.6, sales: 234 },
    { id: 50, name: 'Tumbler UB Premium', price: 145000, category: 'Tumbler', image: '/images/products/Tumbler/2.png', rating: 4.7, sales: 198 },
    { id: 51, name: 'Tumbler UB Limited Edition', price: 140000, category: 'Tumbler', image: '/images/products/Tumbler/3.png', rating: 4.8, sales: 212 },
    { id: 52, name: 'Tumbler UB Exclusive', price: 150000, category: 'Tumbler', image: '/images/products/Tumbler/4.png', rating: 4.7, sales: 178 },
    { id: 53, name: 'Tumbler UB Edition', price: 155000, category: 'Tumbler', image: '/images/products/Tumbler/5.png', rating: 4.8, sales: 167 },
    { id: 54, name: 'Tumbler UB Special', price: 160000, category: 'Tumbler', image: '/images/products/Tumbler/6.png', rating: 4.7, sales: 156 },

    // Polo Collection (55-57)
    { id: 55, name: 'Polo Shirt UB Classic', price: 165000, category: 'Polo', image: '/images/products/Polo/1.png', rating: 4.7, sales: 145 },
    { id: 56, name: 'Polo Shirt UB Premium', price: 175000, category: 'Polo', image: '/images/products/Polo/2.png', rating: 4.8, sales: 167 },
    { id: 57, name: 'Polo Shirt UB Limited', price: 180000, category: 'Polo', image: '/images/products/Polo/3.png', rating: 4.7, sales: 156 },

    // Vest Collection (58-59)
    { id: 58, name: 'Vest UB Official', price: 185000, category: 'Vest', image: '/images/products/Vest/1.png', rating: 4.6, sales: 123 },
    { id: 59, name: 'Vest UB Premium', price: 195000, category: 'Vest', image: '/images/products/Vest/2.png', rating: 4.7, sales: 134 },
];

const categories = ['All', 'Varsity', 'Sepatu', 'Topi', 'T-shirt', 'T-Shirt Colourful', 'Leather Product', 'Leather Jacket', 'Tote Bag & Slempang', 'Crewneck & Hoodie', 'Tumbler', 'Polo', 'Vest'];

function MerchandiseContent() {
    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get('category');

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [gridView, setGridView] = useState<'3' | '4'>('4');
    const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

    // Sync state with URL query parameter
    useEffect(() => {
        if (categoryQuery) {
            setSelectedCategory(categoryQuery);
        } else {
            setSelectedCategory('All');
        }
    }, [categoryQuery]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const toggleLike = (productId: number) => {
        setLikedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = [...allProducts];

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort products
        switch (sortBy) {
            case 'popular':
                filtered.sort((a, b) => b.sales - a.sales);
                break;
            case 'newest':
                filtered.sort((a, b) => b.id - a.id);
                break;
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
        }

        return filtered;
    }, [selectedCategory, searchQuery, sortBy]);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            {/* Ultra Premium Hero Section */}
            <header className="relative pt-32 pb-24 overflow-hidden bg-[#050505]">
                {/* Modern Abstract Aura Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[140%] bg-ub-navy/20 rounded-full blur-[160px] transform rotate-12" />
                    <div className="absolute bottom-[-30%] left-[-10%] w-[60%] h-[120%] bg-ub-gold/15 rounded-full blur-[140px] transform -rotate-12" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`
                    }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Floating Badge */}
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/[0.03] backdrop-blur-2xl rounded-full mb-10 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] transform hover:scale-105 transition-transform">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">UB Merch Official Store</span>
                    </div>

                    {/* Signature Header - Logo Replacement */}
                    <h1 className="flex flex-col items-center mb-12">
                        <span className="text-gray-500 text-[10px] font-black tracking-[0.6em] mb-10 translate-x-[0.3em]">ESTABLISHED 1963</span>
                        <div className="relative w-[300px] sm:w-[450px] lg:w-[600px] aspect-[4/1] invert brightness-200">
                            <Image
                                src="/images/reusable/Logo Ub Merch.png"
                                alt="UB Merch Official Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="sr-only">Brawijaya Collection - UB Merch Official Store</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-gray-400 text-base sm:text-lg font-medium leading-relaxed mb-16 opacity-80">
                        Elevating university pride through masterfully crafted merchandise. A fusion of heritage and contemporary luxury for the modern academic.
                    </p>
                </div>

                {/* Elegant Geometric Accent */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="w-[1px] h-16 bg-gradient-to-b from-ub-gold to-transparent" />
                </div>
            </header>

            <main className="flex-1 bg-white">
                {/* Advanced Filter Bar - Sticky */}
                <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto">
                            {/* Modern Search - Prominent \u0026 Centered */}
                            <div className="relative flex-1 w-full group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Looking for something specific?"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-8 py-5 bg-gray-100 border-transparent rounded-[2rem] text-black focus:bg-white focus:ring-[12px] focus:ring-black/5 transition-all text-base font-medium placeholder:text-gray-400"
                                />
                            </div>

                            {/* View Controls - Now subtle side elements */}
                            <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner">
                                <button
                                    onClick={() => setGridView('3')}
                                    className={`p-3.5 rounded-xl transition-all ${gridView === '3' ? 'bg-white shadow-lg text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                                    title="3 Columns"
                                >
                                    <Grid3x3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setGridView('4')}
                                    className={`p-3.5 rounded-xl transition-all ${gridView === '4' ? 'bg-white shadow-lg text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                                    title="4 Columns"
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Category Selector */}
                        <div className="mt-8 flex flex-wrap gap-2 justify-center">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === category
                                        ? 'bg-black text-white shadow-xl shadow-black/20 ring-4 ring-black/5'
                                        : 'bg-white text-gray-400 border border-gray-100 hover:border-black hover:text-black'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Archive Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-8">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-gray-900">COLLECTION PIECES</h2>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">
                                {filteredProducts.length} Masterpieces Found
                            </p>
                        </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className={`grid gap-x-8 gap-y-16 ${gridView === '3'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-2 lg:grid-cols-4'
                            }`}>
                            {filteredProducts.map(product => (
                                <article
                                    key={product.id}
                                    className="group relative flex flex-col"
                                >
                                    {/* Product Image Stage */}
                                    <div className="relative aspect-[4/5] overflow-hidden bg-[#f9f9f9] rounded-[2rem] transition-all duration-700 group-hover:rounded-[1rem] group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)]">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />

                                        {/* Interaction Overlays */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <button
                                            onClick={() => toggleLike(product.id)}
                                            className={`absolute top-6 right-6 p-4 rounded-2xl backdrop-blur-xl shadow-sm transition-all duration-300 ${likedProducts.has(product.id) ? 'bg-red-500 text-white opacity-100 translate-y-0' : 'bg-white/90 text-black opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'}`}
                                        >
                                            <Heart className={`w-4 h-4 ${likedProducts.has(product.id) ? 'fill-current' : ''}`} />
                                        </button>

                                        <div className="absolute inset-x-6 bottom-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <button className="w-full py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-ub-navy transition-all flex items-center justify-center gap-3">
                                                <ShoppingCart className="w-3 h-3" />
                                                Acquire Item
                                            </button>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="absolute top-6 left-6">
                                            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-xl text-[8px] font-black uppercase tracking-widest text-black rounded-lg shadow-sm border border-white/50">
                                                Archive {product.id.toString().padStart(3, '0')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Meta */}
                                    <div className="mt-8 px-2">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[9px] font-black text-ub-gold uppercase tracking-[0.2em]">{product.category}</span>
                                            <span className="text-gray-200">/</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-400 text-xs text-semibold">★</span>
                                                <span className="text-[10px] font-bold text-gray-900">{product.rating ? product.rating : '4.8'}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-4 group-hover:text-ub-navy transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <span className="text-xl font-black text-black tracking-tight italic">
                                                {formatPrice(product.price)}
                                            </span>
                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                                {product.sales} PIECES SOLD
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-gray-100 rounded-[3rem]">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Search className="w-8 h-8 text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight mb-2 uppercase">NO PIECES FOUND</h3>
                            <p className="text-gray-400 text-sm mb-10 max-w-xs text-center font-medium">The archive does not contain items matching your current filters.</p>
                            <button
                                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                                className="px-12 py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-2xl hover:shadow-black/20 transition-all"
                            >
                                Reset Archive
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function MerchandisePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-ub-gold border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <MerchandiseContent />
        </Suspense>
    );
}
