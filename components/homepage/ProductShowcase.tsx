import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getExclusiveShowcaseProducts } from '@/app/actions/products';

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
}

const SHOWCASE_TAGS = ['Premium Collection', 'Comfort Fit', 'Best Value'];

export default async function ProductShowcase() {
    const showcaseProducts = await getExclusiveShowcaseProducts(3);

    if (showcaseProducts.length < 1) return null;

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
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Exclusive Showcase</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">Koleksi Eksklusif</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Produk pilihan dengan desain premium dan kualitas terbaik
                    </p>
                </div>

                {/* Render depending on how many products we have (1, 2, or 3) */}
                {showcaseProducts.length === 1 && (
                    <div className="max-w-2xl mx-auto">
                        <Link
                            href={`/merchandise/${showcaseProducts[0].slug}`}
                            className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-white/10 transition-all duration-500 block"
                        >
                            <div className="relative h-[500px]">
                                <Image src={showcaseProducts[0].image} alt={showcaseProducts[0].name} fill sizes="100vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider w-fit mb-4">{SHOWCASE_TAGS[0]}</span>
                                    <h3 className="text-3xl font-black mb-3 uppercase italic">{showcaseProducts[0].name}</h3>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="text-3xl font-black italic">{formatPrice(showcaseProducts[0].discountPrice ?? showcaseProducts[0].price)}</div>
                                        <div className="px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                                            <span>Lihat Detail</span><ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {showcaseProducts.length === 2 && (
                    <div className="grid lg:grid-cols-2 gap-6">
                        {showcaseProducts.map((product, i) => (
                            <Link key={product.id} href={`/merchandise/${product.slug}`}
                                className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-white/10 transition-all duration-500"
                            >
                                <div className="relative h-[400px]">
                                    <Image src={product.image} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                        <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider w-fit mb-3">{SHOWCASE_TAGS[i] ?? SHOWCASE_TAGS[0]}</span>
                                        <h3 className="text-2xl font-black mb-3 uppercase italic">{product.name}</h3>
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="text-2xl font-black italic">{formatPrice(product.discountPrice ?? product.price)}</div>
                                            <div className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full">Lihat</div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {showcaseProducts.length >= 3 && (
                    /* Asymmetric Grid Layout */
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Large Featured Card - Left */}
                        <Link
                            href={`/merchandise/${showcaseProducts[0].slug}`}
                            className="lg:row-span-2 group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-white/10 transition-all duration-500"
                        >
                            <div className="relative h-[500px] lg:h-[600px]">
                                <Image
                                    src={showcaseProducts[0].image}
                                    alt={showcaseProducts[0].name}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                                    <div className="mb-3 sm:mb-4">
                                        <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                            {SHOWCASE_TAGS[0]}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 sm:mb-3 leading-tight uppercase italic">{showcaseProducts[0].name}</h3>
                                    <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-lg max-w-md line-clamp-2 font-medium opacity-80 uppercase tracking-tight">
                                        {showcaseProducts[0].category} — UB Official Merchandise
                                    </p>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="text-2xl sm:text-3xl font-black italic">
                                            {formatPrice(showcaseProducts[0].discountPrice ?? showcaseProducts[0].price)}
                                        </div>
                                        <div className="group/btn px-4 sm:px-6 py-2.5 sm:py-3.5 bg-white text-black text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full hover:bg-gray-100 transition-all flex items-center gap-2 flex-shrink-0">
                                            <span>Lihat Detail</span>
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Top Right Card */}
                        <Link
                            href={`/merchandise/${showcaseProducts[1].slug}`}
                            className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-white/10 transition-all duration-500"
                        >
                            <div className="relative h-[250px] sm:h-[290px]">
                                <Image src={showcaseProducts[1].image} alt={showcaseProducts[1].name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
                                    <div className="mb-2 sm:mb-3">
                                        <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">{SHOWCASE_TAGS[1]}</span>
                                    </div>
                                    <h3 className="text-lg sm:text-2xl font-black mb-3 sm:mb-4 uppercase italic leading-none">{showcaseProducts[1].name}</h3>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="text-xl sm:text-2xl font-black italic">{formatPrice(showcaseProducts[1].discountPrice ?? showcaseProducts[1].price)}</div>
                                        <div className="px-4 py-2 bg-white text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-gray-100 transition-all flex-shrink-0">Lihat</div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Bottom Right Card */}
                        <Link
                            href={`/merchandise/${showcaseProducts[2].slug}`}
                            className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-white/10 transition-all duration-500"
                        >
                            <div className="relative h-[250px] sm:h-[290px]">
                                <Image src={showcaseProducts[2].image} alt={showcaseProducts[2].name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
                                    <div className="mb-2 sm:mb-3">
                                        <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">{SHOWCASE_TAGS[2]}</span>
                                    </div>
                                    <h3 className="text-lg sm:text-2xl font-black mb-3 sm:mb-4 uppercase italic leading-none">{showcaseProducts[2].name}</h3>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="text-xl sm:text-2xl font-black italic">{formatPrice(showcaseProducts[2].discountPrice ?? showcaseProducts[2].price)}</div>
                                        <div className="px-4 py-2 bg-white text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-gray-100 transition-all flex-shrink-0">Lihat</div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <Link
                        href="/merchandise"
                        className="inline-block px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
                    >
                        Jelajahi Semua Koleksi
                    </Link>
                </div>
            </div>
        </section>
    );
}
