import { Suspense } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

// Mock data - In production, this would come from API/Database
const mockProducts = [
    {
        id: '1',
        name: 'Kaos Official UB Navy',
        price: 125000,
        category: 'Apparel',
        image: '/images/products/kaos-navy.jpg',
    },
    {
        id: '2',
        name: 'Hoodie UB Premium Gold Edition',
        price: 350000,
        category: 'Apparel',
        image: '/images/products/hoodie-gold.jpg',
    },
    {
        id: '3',
        name: 'Notebook UB Hardcover',
        price: 75000,
        category: 'Stationery',
        image: '/images/products/notebook.jpg',
    },
    {
        id: '4',
        name: 'Tumbler Stainless UB 500ml',
        price: 150000,
        category: 'Accessories',
        image: '/images/products/tumbler.jpg',
    },
    {
        id: '5',
        name: 'Topi Baseball UB Navy',
        price: 95000,
        category: 'Accessories',
        image: '/images/products/topi.jpg',
    },
    {
        id: '6',
        name: 'Jaket Varsity UB Limited',
        price: 450000,
        category: 'Apparel',
        image: '/images/products/jaket-varsity.jpg',
    },
    {
        id: '7',
        name: 'Tas Ransel UB Canvas',
        price: 275000,
        category: 'Accessories',
        image: '/images/products/tas-ransel.jpg',
    },
    {
        id: '8',
        name: 'Gift Card UB 500K',
        price: 500000,
        category: 'Gift Card',
        image: '/images/products/giftcard.jpg',
    },
];

// Simulate async data fetching
async function getProducts() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockProducts;
}

async function ProductList() {
    const products = await getProducts();

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} {...product} />
            ))}
        </div>
    );
}

function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
}

export default function ProductGrid() {
    return (
        <section id="products" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
                        Produk Terpopuler
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Koleksi merchandise terlaris dan paling diminati oleh keluarga besar UB
                    </p>
                </div>

                {/* Product Grid with Suspense */}
                <Suspense fallback={<ProductGridSkeleton />}>
                    <ProductList />
                </Suspense>

                {/* View All Button */}
                <div className="text-center mt-16">
                    <button className="px-10 py-4 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg">
                        Lihat Semua Produk
                    </button>
                </div>
            </div>
        </section>
    );
}
