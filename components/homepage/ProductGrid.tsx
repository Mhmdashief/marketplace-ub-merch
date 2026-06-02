import Link from 'next/link';
import ProductCard from '../shared/ProductCard';
import { getKoleksiPilihanProducts } from '@/app/actions/products';

export default async function ProductGrid() {
    // Fetch produk
    const products = await getKoleksiPilihanProducts(12);

    // Jika tidak ada produk yang ditandai Koleksi Pilihan,
    // sembunyikan seluruh section — sama seperti section lainnya.
    if (products.length === 0) return null;

    return (
        <section id="products" className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-6 sm:w-8 h-[1px] bg-ub-gold" />
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-ub-gold">Curated Archive</span>
                        <div className="w-6 sm:w-8 h-[1px] bg-ub-gold" />
                    </div>
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-black uppercase mb-8 sm:mb-10">
                        Koleksi <span className="italic font-light text-gray-600">Pilihan</span>
                    </h2>


                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-16">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            slug={product.slug}
                            name={product.name}
                            price={product.price}
                            discountPrice={product.discountPrice}
                            image={product.image}
                        />
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-24">
                    <Link
                        href="/merchandise"
                        className="group relative px-12 py-6 bg-black text-white rounded-2xl transition-all overflow-hidden inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] hover:bg-ub-navy"
                    >
                        <span>View Full Archive</span>
                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-1">
                            →
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
