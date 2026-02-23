import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Plus } from 'lucide-react';
import { getPublicProducts } from '@/app/actions/products';

export default async function FeaturedProducts() {
    // Ambil 2 produk terbaru dari DB yang aktif
    const allProducts = await getPublicProducts();
    const featuredProducts = allProducts.slice(0, 2);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Fallback jika DB masih kosong — tampilkan skeleton/placeholder
    if (featuredProducts.length === 0) {
        return null;
    }

    return (
        <section className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-24">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-[1px] bg-ub-gold" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ub-gold">Curated Masterpieces</span>
                        <div className="w-8 h-[1px] bg-ub-gold" />
                    </div>
                    <h2 className="text-6xl sm:text-7xl font-black tracking-tighter text-black leading-none uppercase mb-6">
                        Produk <span className="italic font-light text-gray-300">Unggulan</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl text-lg font-medium leading-relaxed">
                        Handpicked selections representing the pinnacle of our design philosophy.
                    </p>
                </div>

                {/* Featured Grid */}
                <div className="grid lg:grid-cols-2 gap-16">
                    {featuredProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className={`group relative flex flex-col transition-all duration-1000 ${index % 2 === 1 ? 'lg:translate-y-20' : ''}`}
                        >
                            {/* Image Stage */}
                            <div className="relative h-[600px] overflow-hidden rounded-[3rem] bg-[#F9F9F9] transition-all duration-1000 group-hover:shadow-[0_60px_100px_-20px_rgba(0,0,0,0.1)]">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                />

                                {/* Badge */}
                                <div className="absolute top-8 left-8">
                                    <div className="px-6 py-2.5 bg-black text-white rounded-2xl shadow-2xl">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                            {product.discountPrice ? 'Sale' : 'Featured'}
                                        </span>
                                    </div>
                                </div>

                                <div className="absolute top-8 right-8">
                                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-xl flex items-center justify-center border border-white/50 shadow-xl group-hover:rotate-90 transition-transform duration-700">
                                        <Plus className="w-5 h-5 text-black" />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mt-12 px-4 max-w-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.2em]">{product.category}</span>
                                    <span className="h-1 w-1 bg-gray-200 rounded-full" />
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs font-bold">{product.rating.toFixed(1)}</span>
                                    </div>
                                </div>

                                <h3 className="text-4xl font-black text-gray-900 mb-6 leading-tight tracking-tighter">
                                    {product.name}
                                </h3>

                                <div className="flex items-center gap-12">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Price Archive</span>
                                        <span className="text-3xl font-black text-black italic tracking-tighter">
                                            {formatPrice(product.discountPrice ?? product.price)}
                                        </span>
                                    </div>
                                    <Link
                                        href={`/merchandise/${product.slug}`}
                                        className="group/btn relative inline-flex items-center gap-6 px-10 py-6 bg-black text-white rounded-2xl transition-all shadow-2xl hover:bg-ub-navy overflow-hidden"
                                    >
                                        <div className="relative z-10 flex items-center gap-3">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">View Details</span>
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
