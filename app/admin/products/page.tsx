import { Package, Plus, Search, Filter, MoreVertical, Edit2, Trash2, Star, Zap, TrendingUp, ShieldCheck, Heart, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

const mockProducts = [
    {
        id: "PROD-001",
        name: "UB Official Navy Hoodie",
        price: 250000,
        discountPrice: 199000,
        stock: 45,
        category: "Apparel",
        image: null,
        labels: ["Featured", "Best Seller"],
    },
    {
        id: "PROD-002",
        name: "Premium UB Tote Bag",
        price: 85000,
        discountPrice: null,
        stock: 120,
        category: "Accessories",
        image: null,
        labels: ["New Arrival", "Koleksi Pilihan"],
    },
    {
        id: "PROD-003",
        name: "UB Exclusive Tumbler",
        price: 150000,
        discountPrice: 135000,
        stock: 15,
        category: "Drinkware",
        image: null,
        labels: ["Exclusive Showcase"],
    },
];

export default function ProductsPage() {
    return (
        <div className="space-y-10 animate-fade-in py-2">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-100 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-[2px] bg-ub-gold"></div>
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Inventory</span>
                    </div>
                    <h1 className="text-4xl font-black text-[#001a33] tracking-tighter uppercase italic">
                        Products <span className="text-gray-200">/</span> Management
                    </h1>
                </div>

                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#001a33] hover:bg-ub-gold text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-blue-900/10 active:scale-95 group"
                >
                    <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                    List New Product
                </Link>
            </div>

            {/* Quick Stats Toolbar */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-3 group hover:border-ub-navy transition-colors">
                    <Star className="h-4 w-4 text-ub-gold fill-ub-gold" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#001a33]">Featured</span>
                    <span className="ml-auto bg-gray-50 px-2 py-1 rounded font-bold text-xs">12</span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-3 group hover:border-ub-navy transition-colors">
                    <Zap className="h-4 w-4 text-blue-500 fill-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#001a33]">New Arrivals</span>
                    <span className="ml-auto bg-gray-50 px-2 py-1 rounded font-bold text-xs">8</span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-3 group hover:border-ub-navy transition-colors">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#001a33]">Best Sellers</span>
                    <span className="ml-auto bg-gray-50 px-2 py-1 rounded font-bold text-xs">24</span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-3 group hover:border-ub-navy transition-colors">
                    <ShieldCheck className="h-4 w-4 text-purple-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#001a33]">Exclusive</span>
                    <span className="ml-auto bg-gray-50 px-2 py-1 rounded font-bold text-xs">5</span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-3 group hover:border-ub-navy transition-colors">
                    <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#001a33]">Favorites</span>
                    <span className="ml-auto bg-gray-50 px-2 py-1 rounded font-bold text-xs">19</span>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden group">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="SEARCH BY PRODUCT NAME OR ID..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-[#001a33] transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-3 px-6 py-4 bg-gray-50 hover:bg-[#001a33] text-[#001a33] hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                            <Filter className="h-3 w-3" />
                            Filter by Category
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto p-2">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Info</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Inventory</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price Details</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status Labels</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-transparent">
                            {mockProducts.map((product) => (
                                <tr key={product.id} className="group hover:scale-[1.01] transition-all duration-300">
                                    <td className="px-8 py-6 bg-gray-50/50 rounded-l-3xl group-hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 bg-[#001a33]/5 rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden group-hover:rotate-2 transition-transform">
                                                <ImageIcon className="h-6 w-6 text-gray-300" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#001a33] uppercase italic tracking-tight">{product.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{product.id} <span className="text-gray-200 mx-1">/</span> {product.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 bg-gray-50/50 group-hover:bg-gray-100 transition-colors">
                                        <span className={`text-[11px] font-black px-3 py-1.5 rounded-lg border ${product.stock < 20 ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-gray-100 border-gray-200 text-[#001a33]'}`}>
                                            {product.stock} IN STOCK
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 bg-gray-50/50 group-hover:bg-gray-100 transition-colors">
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-black text-[#001a33] ${product.discountPrice ? 'line-through text-gray-300 decoration-rose-500' : ''}`}>
                                                Rp {product.price.toLocaleString('id-ID')}
                                            </span>
                                            {product.discountPrice && (
                                                <span className="text-[11px] font-black text-emerald-500">
                                                    Rp {product.discountPrice.toLocaleString('id-ID')}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 bg-gray-50/50 group-hover:bg-gray-100 transition-colors">
                                        <div className="flex flex-wrap gap-2">
                                            {product.labels.map((label) => (
                                                <span key={label} className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-white border border-gray-100 rounded-md text-gray-400 group-hover:border-ub-gold group-hover:text-ub-gold transition-colors">
                                                    {label}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 bg-gray-50/50 rounded-r-3xl group-hover:bg-gray-100 transition-colors text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-3 hover:bg-[#001a33] hover:text-white rounded-xl transition-all duration-300 group/edit">
                                                <Edit2 className="h-4 w-4 group-hover/edit:scale-110 transition-transform" />
                                            </button>
                                            <button className="p-3 hover:bg-rose-500 hover:text-white rounded-xl transition-all duration-300 group/del">
                                                <Trash2 className="h-4 w-4 group-hover/del:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-8 bg-gray-50/50 flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing 3 of 152 products</p>
                    <div className="flex items-center gap-2">
                        <button className="h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-gray-100 font-bold text-xs disabled:opacity-50" disabled>1</button>
                        <button className="h-10 w-10 flex items-center justify-center bg-white hover:bg-black hover:text-white rounded-xl border border-gray-100 font-bold text-xs transition-colors">2</button>
                        <button className="h-10 w-10 flex items-center justify-center bg-white hover:bg-black hover:text-white rounded-xl border border-gray-100 font-bold text-xs transition-colors">3</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

