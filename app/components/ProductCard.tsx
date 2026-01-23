'use client';

import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
}

export default function ProductCard({ id, name, price, category, image }: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);
        setTimeout(() => {
            setIsAdding(false);
            console.log('Added to cart:', id);
        }, 600);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="group bg-white rounded-xl border border-gray-200 hover:border-black hover:shadow-2xl transition-all duration-300 overflow-hidden">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/90 backdrop-blur-sm rounded-lg">
                    <span className="text-xs font-medium text-white uppercase tracking-wide">{category}</span>
                </div>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="px-6 py-3 bg-white text-black rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-100">
                        Lihat Detail
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5 space-y-4">
                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem] text-base">
                    {name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-black">
                        {formatPrice(price)}
                    </span>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${isAdding
                            ? 'bg-black text-white'
                            : 'bg-gray-900 hover:bg-black text-white'
                        }`}
                >
                    <ShoppingCart className={`w-5 h-5 ${isAdding ? 'animate-bounce' : ''}`} />
                    <span>{isAdding ? 'Ditambahkan!' : 'Tambah ke Keranjang'}</span>
                </button>
            </div>
        </div>
    );
}
