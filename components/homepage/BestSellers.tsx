'use client';

import Image from 'next/image';
import { TrendingUp, ShoppingBag, Crown, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const bestSellers = [
    {
        id: 'best-1',
        name: 'Varsity Jacket UB Classic',
        price: 450000,
        image: '/images/products/Varsity/2.png',
        sales: 245,
        rank: 1
    },
    {
        id: 'best-2',
        name: 'T-Shirt UB Official',
        price: 125000,
        image: '/images/products/T-Shirt/1.png',
        sales: 189,
        rank: 2
    },
    {
        id: 'best-3',
        name: 'Sepatu Sneakers White',
        price: 385000,
        image: '/images/products/Sepatu/5.png',
        sales: 156,
        rank: 3
    },
    {
        id: 'best-4',
        name: 'Topi Baseball Classic',
        price: 95000,
        image: '/images/products/Topi/2.png',
        sales: 142,
        rank: 4
    }
];

interface BestSellerCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    sales: number;
    rank: number;
}

function BestSellerCard({ id, name, price, image, sales, rank }: BestSellerCardProps) {
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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex flex-col transition-all duration-700"
        >
            {/* Image Stage - Elite Presentation */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#f0f0f0] transition-all duration-700 group-hover:rounded-[1.5rem] group-hover:shadow-[0_40px_80px_-15px_rgba(212,175,55,0.15)]">
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Rank Badge */}
                <div className="absolute top-6 left-6 flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50">
                    <span className="text-xl font-black text-black">{rank}</span>
                </div>

                {/* Elite Badge */}
                <div className="absolute top-6 right-6">
                    <div className="p-3 bg-ub-gold text-white rounded-2xl shadow-xl transform rotate-12 transition-transform group-hover:rotate-0">
                        <Crown className="w-4 h-4" />
                    </div>
                </div>

                {/* Direct Acquisition Overlay */}
                <div className="absolute inset-x-8 bottom-8 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button className="w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-3">
                        <ShoppingBag className="w-4 h-4" />
                        Aquire Piece
                    </button>
                </div>
            </div>

            {/* Content Stage */}
            <div className="mt-8 px-4 flex flex-col items-center text-center">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-6 bg-ub-gold" />
                    <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.2em]">Pinnacle Collection</span>
                    <div className="h-px w-6 bg-ub-gold" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-ub-navy transition-colors line-clamp-1">
                    {name}
                </h3>

                <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-black text-black tracking-tighter italic">
                        {formatPrice(price)}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{sales} PIECES SOLD</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BestSellers() {
    return (
        <section className="py-32 bg-[#fafafa]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header - Centered Elite Look */}
                <div className="flex flex-col items-center text-center mb-24">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-black rounded-full mb-8 border border-gray-100 shadow-sm">
                        <span className="text-sm font-black text-white uppercase tracking-[0.3em]">
                            Best Sellers
                        </span>
                    </div>
                    <h2 className="text-6xl sm:text-7xl font-black tracking-tighter text-black leading-none uppercase mb-6">
                        Paling <span className="italic font-light text-ub-gold">Laris</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl text-lg font-medium leading-relaxed">
                        The definitive list of items most coveted by the university community.
                    </p>
                </div>

                {/* Best Sellers Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
                    {bestSellers.map((product) => (
                        <BestSellerCard key={product.id} {...product} />
                    ))}
                </div>

                {/* Elite CTA */}
                <div className="mt-32 flex flex-col items-center">
                    <Link
                        href="/merchandise"
                        className="group relative px-12 py-6 bg-black text-white rounded-2xl transition-all overflow-hidden block"
                    >
                        <div className="absolute inset-0 bg-ub-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <div className="relative flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em]">
                            <span>Explore Pinnacle Archive</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
