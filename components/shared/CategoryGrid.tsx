import { Shirt, BookOpen, Watch, Gift } from 'lucide-react';
import Link from 'next/link';

const categories = [
    {
        id: 'apparel',
        name: 'Apparel',
        icon: Shirt,
        description: 'Kaos, Jaket, Hoodie',
    },
    {
        id: 'stationery',
        name: 'Stationery',
        icon: BookOpen,
        description: 'Buku, Pulpen, Notes',
    },
    {
        id: 'accessories',
        name: 'Accessories',
        icon: Watch,
        description: 'Topi, Tas, Tumbler',
    },
    {
        id: 'giftcard',
        name: 'Gift Card',
        icon: Gift,
        description: 'Voucher & Hampers',
    },
];

export default function CategoryGrid() {
    return (
        <section id="categories" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
                        Kategori Produk
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Temukan berbagai koleksi merchandise official UB sesuai kebutuhanmu
                    </p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.id}
                                href={`/category/${category.id}`}
                                className="group relative bg-white border-2 border-gray-200 hover:border-black rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                            >
                                {/* Background Effect */}
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                    {/* Icon */}
                                    <div className="w-20 h-20 rounded-2xl bg-black group-hover:bg-gray-900 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                                        <Icon className="w-10 h-10 text-white" />
                                    </div>

                                    {/* Name */}
                                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-black">
                                        {category.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-500 group-hover:text-gray-700">
                                        {category.description}
                                    </p>
                                </div>

                                {/* Hover Arrow */}
                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg
                                        className="w-6 h-6 text-black"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
