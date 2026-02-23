'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
    id: string;
    slug: string;
    name: string;
    price: number;
    category: string;
    image: string;
}

export default function ProductCard({ id, slug, name, price, category, image }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Link
            href={`/merchandise/${slug}`}
            className="group relative flex flex-col transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Stage */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-[#F9F9F9] transition-all duration-700 group-hover:rounded-[1rem] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]">
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Status/Category Overlay */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span
                        className="px-3 py-1 bg-white/90 backdrop-blur-xl text-[8px] font-black uppercase tracking-[0.2em] text-black rounded-lg shadow-sm border border-white/50 w-fit"
                    >
                        {category}
                    </span>
                </div>

                {/* Engagement Actions */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLiked(!isLiked);
                    }}
                    className={`absolute top-6 right-6 p-3.5 rounded-2xl backdrop-blur-xl transition-all duration-500 ${isLiked
                        ? 'bg-red-500 text-white shadow-xl shadow-red-200'
                        : 'bg-white/80 text-gray-900 border border-white/50 opacity-0 group-hover:opacity-100'
                        }`}
                >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-white' : ''}`} />
                </button>

                {/* Primary Action Button */}
                <div className="absolute inset-x-6 bottom-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button className="w-full py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl hover:bg-ub-navy transition-all flex items-center justify-center gap-3 active:scale-95">
                        <ShoppingCart className="w-3 h-3" />
                        Quick Purchase
                    </button>
                </div>
            </div>

            {/* Content Stage */}
            <div className="mt-8 px-2 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-ub-gold rounded-full" />
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">In Stock</span>
                    </div>
                    <div className="flex items-center gap-1 text-ub-gold">
                        <span className="text-[10px] font-black">4.9</span>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-ub-navy transition-colors mb-4 line-clamp-1">
                    {name}
                </h3>

                <div className="mt-auto flex items-end justify-between pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Market Price</span>
                        <span className="text-xl font-black text-black tracking-tighter italic">
                            {formatPrice(price)}
                        </span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-all transform group-hover:rotate-45">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
