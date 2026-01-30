'use client';

import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';

const showcaseProducts = [
    {
        id: 'showcase-1',
        name: 'Varsity Jacket Collection',
        description: 'Premium varsity jackets dengan desain eksklusif dan material berkualitas tinggi',
        image: '/images/products/Varsity/2.png',
        price: 450000,
        tag: 'Premium Collection'
    },
    {
        id: 'showcase-2',
        name: 'Sneakers Series',
        description: 'Koleksi sepatu sneakers nyaman untuk aktivitas sehari-hari',
        image: '/images/products/Sepatu/7.png',
        price: 385000,
        tag: 'Comfort Fit'
    },
    {
        id: 'showcase-3',
        name: 'Leather Product Bundle',
        description: 'Paket lengkap leather product untuk melengkapi gaya UB-mu',
        image: '/images/products/Leather Product/2.png',
        price: 150000,
        tag: 'Best Value'
    }
];

export default function ProductShowcase() {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <section className="py-20 bg-black text-white overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                        <Sparkles className="w-4 h-4 text-white hover:text-yellow-400 transition-colors" />
                        <span className="text-sm font-semibold uppercase tracking-wider hover:text-yellow-400 transition-colors">
                            Exclusive Showcase
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                        Koleksi Eksklusif
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Produk pilihan dengan desain premium dan kualitas terbaik
                    </p>
                </div>

                {/* Asymmetric Grid Layout */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Large Featured Card - Left */}
                    <div className="lg:row-span-2 group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-white/10 transition-all duration-500">
                        <div className="relative h-[600px]">
                            <Image
                                src={showcaseProducts[0].image}
                                alt={showcaseProducts[0].name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            {/* Content Overlay */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="mb-4">
                                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold">
                                        {showcaseProducts[0].tag}
                                    </span>
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-bold mb-3">
                                    {showcaseProducts[0].name}
                                </h3>
                                <p className="text-gray-300 mb-6 text-lg max-w-md">
                                    {showcaseProducts[0].description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-bold">
                                        {formatPrice(showcaseProducts[0].price)}
                                    </div>
                                    <button className="group/btn px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all flex items-center gap-2">
                                        <span>Lihat Detail</span>
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Right Card */}
                    <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-white/10 transition-all duration-500">
                        <div className="relative h-[290px]">
                            <Image
                                src={showcaseProducts[1].image}
                                alt={showcaseProducts[1].name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <div className="mb-3">
                                    <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
                                        {showcaseProducts[1].tag}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">
                                    {showcaseProducts[1].name}
                                </h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    {showcaseProducts[1].description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold">
                                        {formatPrice(showcaseProducts[1].price)}
                                    </div>
                                    <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-100 transition-all">
                                        Lihat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Right Card */}
                    <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-white/10 transition-all duration-500">
                        <div className="relative h-[290px]">
                            <Image
                                src={showcaseProducts[2].image}
                                alt={showcaseProducts[2].name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <div className="mb-3">
                                    <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
                                        {showcaseProducts[2].tag}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">
                                    {showcaseProducts[2].name}
                                </h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    {showcaseProducts[2].description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold">
                                        {formatPrice(showcaseProducts[2].price)}
                                    </div>
                                    <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-100 transition-all">
                                        Lihat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <button className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl">
                        Jelajahi Semua Koleksi
                    </button>
                </div>
            </div>
        </section>
    );
}
