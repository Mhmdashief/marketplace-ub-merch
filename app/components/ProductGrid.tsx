'use client';

import { Suspense, useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import Link from 'next/link';

// Product data using actual assets
const mockProducts = [
    {
        id: '2',
        name: 'Sepatu Sneakers UB White Edition',
        price: 395000,
        category: 'Sepatu',
        image: '/images/products/Sepatu/2.png',
    },
    {
        id: '3',
        name: 'Topi Baseball UB Black',
        price: 95000,
        category: 'Topi',
        image: '/images/products/Topi/3.png',
    },
    {
        id: '4',
        name: 'Leather Product Set UB Collection',
        price: 145000,
        category: 'Leather Product',
        image: '/images/products/Leather Product/2.png',
    },
    {
        id: '5',
        name: 'T-Shirt UB Premium',
        price: 135000,
        category: 'T-shirt',
        image: '/images/products/T-Shirt/2.png',
    },
    {
        id: '6',
        name: 'Totebag UB Official',
        price: 150000,
        category: 'Tote Bag & Slempang',
        image: '/images/products/Totebag & Slempang/2.png',
    },
    {
        id: '7',
        name: 'Sepatu Sneakers UB Navy',
        price: 385000,
        category: 'Sepatu',
        image: '/images/products/Sepatu/4.png',
    },
    {
        id: '8',
        name: 'Topi Baseball UB Navy',
        price: 95000,
        category: 'Topi',
        image: '/images/products/Topi/4.png',
    },
    {
        id: '9',
        name: 'T-Shirt Colourful UB Complete',
        price: 135000,
        category: 'T-Shirt Colourful',
        image: '/images/products/T-Shirt Colourful/1.png',
    },
    {
        id: '10',
        name: 'Leather Jacket UB Edition',
        price: 555000,
        category: 'Leather Jacket',
        image: '/images/products/Leather jacket/1.png',
    },
    {
        id: '11',
        name: 'Sepatu Sneakers UB Red',
        price: 395000,
        category: 'Sepatu',
        image: '/images/products/Sepatu/6.png',
    },
    {
        id: '12',
        name: 'Tumbler UB Limited Edition',
        price: 140000,
        category: 'Tumbler',
        image: '/images/products/Tumbler/3.png',
    },
    {
        id: '13',
        name: 'Varsity Jacket UB Limited Edition',
        price: 450000,
        category: 'Varsity',
        image: '/images/products/Varsity/1.png',
    }
];

const homeCategories = ['All', 'Varsity', 'Sepatu', 'Topi', 'T-shirt', 'Tumbler', 'Leather Product'];

function ProductList({ selectedCategory }: { selectedCategory: string }) {
    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'All') return mockProducts;
        return mockProducts.filter(p => p.category === selectedCategory);
    }, [selectedCategory]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
            ))}
        </div>
    );
}

function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
}

export default function ProductGrid() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    return (
        <section id="products" className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-24">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-[1px] bg-ub-gold" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ub-gold">Curated Archive</span>
                        <div className="w-8 h-[1px] bg-ub-gold" />
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter text-black uppercase mb-6">
                        Koleksi <span className="italic font-light text-gray-300">Pilihan</span>
                    </h2>

                    {/* Category Filter Tabs */}
                    <div className="mt-12 flex flex-wrap justify-center gap-3">
                        {homeCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat
                                    ? 'bg-black text-white shadow-2xl'
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-black'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid with Suspense */}
                <Suspense fallback={<ProductGridSkeleton />}>
                    <ProductList selectedCategory={selectedCategory} />
                </Suspense>

                {/* View All Button */}
                <div className="text-center mt-24">
                    <Link href="/merchandise">
                        <button className="group relative px-12 py-6 bg-black text-white rounded-2xl transition-all overflow-hidden inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em]">
                            <span>View Full Archive</span>
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-1">
                                →
                            </div>
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
