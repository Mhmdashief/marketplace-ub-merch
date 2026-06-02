'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
    id: string;
    slug: string;
    name: string;
    price: number;
    discountPrice?: number | null;
    image: string;
    category?: string | null;
}

export default function ProductCard({ id, slug, name, price, discountPrice, image, category }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const displayPrice = discountPrice ?? price;

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
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-[2rem] bg-[#F9F9F9] transition-all duration-700 group-hover:rounded-xl sm:group-hover:rounded-[1rem] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]">
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Status/Category Overlay */}
                <div className="absolute top-3 left-3 sm:top-6 sm:left-6 flex flex-col gap-2">
                    <span
                        className="px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-xl text-[7px] sm:text-[8px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black rounded-md sm:rounded-lg shadow-sm border border-white/50 w-fit"
                    >
                        {category || 'MERCHANDISE'}
                    </span>
                </div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLiked(!isLiked);
                    }}
                    className={`absolute top-4 right-4 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl backdrop-blur-xl transition-all duration-500 hidden sm:flex ${isLiked
                        ? 'bg-red-500 text-white shadow-xl shadow-red-200 opacity-100'
                        : 'bg-white/80 text-gray-900 border border-white/50 opacity-0 group-hover:opacity-100'
                        }`}
                >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiked ? 'fill-current text-white' : ''}`} />
                </button>

                {/* Primary Action Button - Hover only on desktop */}
                <div className="absolute inset-x-4 sm:inset-x-6 bottom-4 sm:bottom-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden sm:block">
                    <div
                        className="w-full py-3.5 sm:py-5 bg-black text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-xl sm:rounded-2xl shadow-2xl hover:bg-ub-navy transition-all flex items-center justify-center gap-2 sm:gap-3"
                    >
                        <ArrowUpRight className="w-3 h-3" />
                        View Product
                    </div>
                </div>
            </div>

            {/* Content Stage */}
            <div className="mt-4 sm:mt-8 px-1 sm:px-2 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-ub-gold rounded-full" />
                        <span className="text-[8px] sm:text-[10px] font-black text-gray-300 uppercase tracking-widest">In Stock</span>
                    </div>
                </div>

                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight group-hover:text-ub-navy transition-colors mb-3 sm:mb-4 line-clamp-1 uppercase">
                    {name}
                </h3>

                <div className="mt-auto flex items-end justify-between pt-3 sm:pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Market Price</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm sm:text-xl font-black text-black tracking-tighter italic">
                                {formatPrice(displayPrice)}
                            </span>
                            {discountPrice && (
                                <span className="text-[8px] sm:text-[10px] text-gray-300 line-through font-medium">
                                    {formatPrice(price)}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="p-2 sm:p-3 bg-gray-50 rounded-xl sm:rounded-2xl group-hover:bg-black group-hover:text-white transition-all transform group-hover:rotate-45">
                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
