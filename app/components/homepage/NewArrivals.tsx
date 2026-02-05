'use client';

import Image from 'next/image';
import { ShoppingCart, Heart, Plus } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const newArrivals = [
    {
        id: 'new-1',
        name: 'Topi Baseball UB Premium',
        price: 95000,
        image: '/images/products/Topi/1.png',
        category: 'Accessories',
        isNew: true
    },
    {
        id: 'new-2',
        name: 'Leather Product UB Collection',
        price: 135000,
        image: '/images/products/Leather Product/1.png',
        category: 'Accessories',
        isNew: true
    },
    {
        id: 'new-3',
        name: 'T-Shirt Colourful UB Limited',
        price: 125000,
        image: '/images/products/T-Shirt Colourful/1.png',
        category: 'Apparel',
        isNew: true
    },
    {
        id: 'new-4',
        name: 'Totebag UB Official',
        price: 145000,
        image: '/images/products/Totebag & Slempang/1.png',
        category: 'Accessories',
        isNew: true
    },
    {
        id: 'new-5',
        name: 'Crewneck & Hoodie Set',
        price: 220000,
        image: '/images/products/Crewneck & Hoodie/1.png',
        category: 'Apparel',
        isNew: true
    },
    {
        id: 'new-6',
        name: 'Sepatu Sneakers Navy',
        price: 395000,
        image: '/images/products/Sepatu/3.png',
        category: 'Footwear',
        isNew: true
    }
];

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    isNew?: boolean;
}

function NewArrivalCard({ id, name, price, image, category, isNew }: ProductCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div
            className="group relative flex flex-col bg-white transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container - Minimalist & Clean */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F6F6F6] transition-all duration-500 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* New Badge - Premium Minimalist */}
                {isNew && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black text-white rounded-full">
                        <span className="text-[10px] font-black uppercase tracking-widest">New</span>
                    </div>
                )}

                {/* Like Button - Floating & Elegant */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLiked(!isLiked);
                    }}
                    className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${isLiked
                        ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                        : 'bg-white/80 text-gray-900 border border-gray-100 hover:bg-white'
                        } ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
                >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                {/* Quick Add To Cart - Sleek Bottom Pill */}
                <div className={`absolute inset-x-4 bottom-4 transition-all duration-500 transform ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                    <button className="w-full py-4 bg-black text-white rounded-xl shadow-xl flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors active:scale-95">
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Add to Cart</span>
                    </button>
                </div>
            </div>

            {/* Product Details - High End Look */}
            <div className="mt-5 px-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-ub-gold uppercase tracking-[0.2em]">{category}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                    <div className="flex items-center gap-0.5">
                        <span className="text-[10px] font-bold text-gray-400">4.8</span>
                    </div>
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-3 leading-snug group-hover:text-ub-navy transition-colors line-clamp-2 min-h-[2.5rem]">
                    {name}
                </h3>

                <div className="flex items-center justify-between">
                    <span className="text-base font-black text-black tracking-tight italic">
                        {formatPrice(price)}
                    </span>
                    <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-ub-gold/10 transition-colors">
                        <Plus className="w-3 h-3 text-gray-400 group-hover:text-ub-gold" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NewArrivals() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Modern Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-[2px] bg-ub-gold" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ub-gold">Curated Archive</span>
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-black leading-none uppercase">
                            New <br className="hidden md:block" /> Arrivals
                        </h2>
                        <div className="mt-6 flex items-center gap-4">
                            <p className="text-gray-400 text-sm font-medium max-w-sm leading-relaxed">
                                Exploring the boundaries of university apparel and accessories with our latest luxury drop.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/merchandise" className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-black">
                            <span>View All Drops</span>
                            <div className="p-4 rounded-full border border-gray-200 group-hover:bg-black group-hover:text-white transition-all transform group-hover:rotate-[360deg] duration-700">
                                <Plus className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Products Grid - Increased Column Count for more sleek appearance */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-12">
                    {newArrivals.map((product) => (
                        <NewArrivalCard key={product.id} {...product} />
                    ))}
                </div>

                {/* Decorative Bottom Bar */}
                <div className="mt-24 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
            </div>
        </section>
    );
}
