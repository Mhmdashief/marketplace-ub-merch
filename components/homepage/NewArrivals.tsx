import Image from 'next/image';
import { ShoppingCart, Plus } from 'lucide-react';
import Link from 'next/link';
import { getPublicProducts } from '@/app/actions/products';

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
}

export default async function NewArrivals() {
    // Ambil 6 produk terbaru dari DB
    const allProducts = await getPublicProducts();
    const newArrivals = allProducts.slice(0, 6);

    if (newArrivals.length === 0) return null;

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
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
                                Koleksi terbaru dari UB Merch Store, hadir dengan desain eksklusif dan kualitas premium.
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

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-12">
                    {newArrivals.map((product) => (
                        <Link
                            key={product.id}
                            href={`/merchandise/${product.slug}`}
                            className="group relative flex flex-col bg-white transition-all duration-500"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F6F6F6] transition-all duration-500 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* New Badge */}
                                <div className="absolute top-4 left-4 px-3 py-1 bg-black text-white rounded-full">
                                    <span className="text-[10px] font-black uppercase tracking-widest">New</span>
                                </div>

                                {/* Quick Add Hover */}
                                <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="w-full py-4 bg-black text-white rounded-xl shadow-xl flex items-center justify-center gap-2">
                                        <ShoppingCart className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-widest">View Item</span>
                                    </div>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="mt-5 px-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold text-ub-gold uppercase tracking-[0.2em]">{product.category}</span>
                                </div>

                                <h3 className="text-sm font-bold text-gray-900 mb-3 leading-snug group-hover:text-ub-navy transition-colors line-clamp-2 min-h-[2.5rem]">
                                    {product.name}
                                </h3>

                                <div className="flex items-center justify-between">
                                    <span className="text-base font-black text-black tracking-tight italic">
                                        {formatPrice(product.discountPrice ?? product.price)}
                                    </span>
                                    <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-ub-gold/10 transition-colors">
                                        <Plus className="w-3 h-3 text-gray-400 group-hover:text-ub-gold" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-24 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
            </div>
        </section>
    );
}
