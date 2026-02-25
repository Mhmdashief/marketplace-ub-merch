import Image from 'next/image';
import { TrendingUp, ShoppingBag, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getPublicProducts } from '@/app/actions/products';

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
}

export default async function BestSellers() {
    const allProducts = await getPublicProducts();

    const bestSellers = allProducts.slice(0, 4).map((p, i) => ({
        ...p,
        rank: i + 1,
        sales: 100 + i * 30,
    }));

    if (bestSellers.length === 0) return null;

    return (
        <section className="py-14 sm:py-20 lg:py-28 bg-[#fafafa]">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-24">

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black rounded-full mb-5 sm:mb-6">
                        <span className="text-[9px] sm:text-xs font-bold text-white uppercase tracking-[0.25em]">
                            Best Sellers
                        </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black tracking-tight text-black leading-tight uppercase mb-4">
                        Paling <span className="italic font-light text-ub-gold">Laris</span>
                    </h2>

                    <p className="text-gray-500 max-w-md sm:max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                        The definitive list of items most coveted by the university community.
                    </p>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-14">

                    {bestSellers.map((product) => (
                        <Link
                            key={product.id}
                            href={`/merchandise/${product.slug}`}
                            className="group flex flex-col"
                        >
                            {/* IMAGE CARD */}
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-100 transition-all duration-500 sm:group-hover:shadow-xl">

                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover transition-transform duration-700 sm:group-hover:scale-105"
                                />

                                {/* Rank Badge */}
                                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/90 backdrop-blur rounded-lg text-xs sm:text-sm font-bold shadow">
                                    {product.rank}
                                </div>

                                {/* Crown Badge */}
                                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-ub-gold text-white p-1.5 sm:p-2 rounded-lg shadow">
                                    <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                                </div>

                                <div
                                    className="group/btn absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 bg-black text-white rounded-full transition-all duration-300 shadow-xl active:scale-95 whitespace-nowrap sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-4 sm:group-hover:translate-y-0"
                                >
                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em]">
                                        View Details
                                    </span>
                                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover/btn:translate-x-1" />
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="mt-4 sm:mt-6 text-center px-1">

                                <span className="block text-[9px] sm:text-[10px] font-bold text-ub-gold uppercase tracking-[0.2em] mb-1">
                                    {product.category}
                                </span>

                                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                                    {product.name}
                                </h3>

                                <span className="block text-base sm:text-lg lg:text-xl font-black text-black italic">
                                    {formatPrice(product.discountPrice ?? product.price)}
                                </span>

                            </div>
                        </Link>
                    ))}

                </div>

                <div className="mt-14 sm:mt-20 lg:mt-28 text-center">
                    <Link
                        href="/merchandise"
                        className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-black text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] rounded-full transition-all hover:bg-ub-navy active:scale-95"
                    >
                        Explore Archive
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </section>
    );
}