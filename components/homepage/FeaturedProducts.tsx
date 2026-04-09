import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProducts } from '@/app/actions/products';

export default async function FeaturedProducts() {
    const featuredProducts = await getFeaturedProducts(2);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (featuredProducts.length === 0) return null;

    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

                {/* Header*/}
                <div className="flex flex-col items-center text-center mb-14 sm:mb-20 lg:mb-24">

                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-6 sm:w-8 h-[1px] bg-ub-gold" />
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-ub-gold">
                            Curated Masterpieces
                        </span>
                        <div className="w-6 sm:w-8 h-[1px] bg-ub-gold" />
                    </div>

                    <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-black leading-tight uppercase mb-4 sm:mb-6">
                        Produk <span className="italic font-light text-gray-600">Unggulan</span>
                    </h2>

                    <p className="text-gray-400 max-w-md sm:max-w-xl text-sm sm:text-base lg:text-lg font-medium leading-relaxed">
                        Handpicked selections representing the pinnacle of our design philosophy.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid gap-14 sm:gap-16 lg:grid-cols-2">

                    {featuredProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className={`group relative flex flex-col transition-all duration-700 ${index % 2 === 1 ? 'lg:translate-y-16' : ''
                                }`}
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/5] sm:aspect-[4/5] lg:h-[600px] overflow-hidden rounded-3xl sm:rounded-[3rem] bg-[#F9F9F9] transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]">

                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            </div>

                            {/* Content */}
                            <div className="mt-8 sm:mt-12 px-2 sm:px-4 max-w-xl">
                                {/* Title */}
                                <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight">
                                    {product.name}
                                </h3>

                                {/* Price + Button */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-10">

                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1">
                                            Price Archive
                                        </span>
                                        <span className="text-xl sm:text-2xl lg:text-3xl font-black text-black italic tracking-tight">
                                            {formatPrice(product.discountPrice ?? product.price)}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/merchandise/${product.slug}`}
                                        className="group/btn inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-xl sm:rounded-2xl transition-all shadow-lg hover:bg-ub-navy active:scale-95 sm:hover:scale-105"
                                    >
                                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                                            View Details
                                        </span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
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
