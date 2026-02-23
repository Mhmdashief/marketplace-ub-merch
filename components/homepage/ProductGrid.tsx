import { Suspense } from 'react';
import Link from 'next/link';
import ProductCard from '../shared/ProductCard';
import ProductSkeleton from '../shared/ProductSkeleton';
import { getPublicProducts, getPublicCategories } from '@/app/actions/products';

async function ProductList() {
    const products = await getPublicProducts();
    const displayProducts = products.slice(0, 12);

    if (displayProducts.length === 0) {
        return (
            <p className="col-span-4 text-center text-gray-400 py-16 font-medium">
                Produk belum tersedia. Tambahkan dari panel admin.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {displayProducts.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    price={product.discountPrice ?? product.price}
                    category={product.category}
                    image={product.image}
                />
            ))}
        </div>
    );
}

function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
}

export default async function ProductGrid() {
    const categories = await getPublicCategories();
    const homeCategories = [{ name: 'All', slug: 'all' }, ...categories.slice(0, 6)];

    return (
        <section id="products" className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-[1px] bg-ub-gold" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ub-gold">Curated Archive</span>
                        <div className="w-8 h-[1px] bg-ub-gold" />
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter text-black uppercase mb-10">
                        Koleksi <span className="italic font-light text-gray-300">Pilihan</span>
                    </h2>

                    {/* Category Quick Links — navigasi ke /merchandise dengan filter */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {homeCategories.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={cat.slug === 'all' ? '/merchandise' : `/merchandise?category=${cat.slug}`}
                                className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 bg-gray-50 text-gray-400 hover:bg-black hover:text-white border border-transparent hover:border-black"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Product Grid dengan Suspense */}
                <Suspense fallback={<ProductGridSkeleton />}>
                    <ProductList />
                </Suspense>

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
