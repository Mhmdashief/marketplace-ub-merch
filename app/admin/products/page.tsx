"use client";
import React, { useMemo, useState } from "react";
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Star,
    Zap,
    TrendingUp,
    ShieldCheck,
    Heart,
    Image as ImageIcon,
    Eye,
    MoreVertical,
} from "lucide-react";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    price: number;
    discountPrice: number | null;
    stock: number;
    category: string;
    image: string | null;
    labels: string[];
    status: "ACTIVE" | "DRAFT";
}

const mockProducts: Product[] = [
    {
        id: "PROD-001",
        name: "UB Official Navy Hoodie",
        price: 250000,
        discountPrice: 199000,
        stock: 45,
        category: "Apparel",
        image: null,
        labels: ["Featured", "Best Seller"],
        status: "ACTIVE",
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
        status: "ACTIVE",
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
        status: "DRAFT",
    },
];

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [filterCategory, setFilterCategory] = useState<string>("ALL");

    const categories = useMemo(() => {
        const unique = new Set(mockProducts.map((p) => p.category));
        return ["ALL", ...Array.from(unique)];
    }, []);

    const filteredProducts = useMemo(() => {
        return mockProducts.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.id.toLowerCase().includes(search.toLowerCase());

            const matchesCategory =
                filterCategory === "ALL" || product.category === filterCategory;

            return matchesSearch && matchesCategory;
        });
    }, [search, filterCategory]);

    const toggleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selected.length === filteredProducts.length) {
            setSelected([]);
        } else {
            setSelected(filteredProducts.map((p) => p.id));
        }
    };

    return (
        <div className="space-y-10 py-2">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-[2px] bg-ub-gold"></div>
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">
                            Inventory
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Products <span className="text-white/10">/</span> Management
                    </h1>
                </div>

                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-ub-gold hover:bg-ub-gold/90 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-ub-gold/10 active:scale-95 group"
                >
                    <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                    List New Product
                </Link>
            </div>

            {/* SEARCH & FILTER */}
            <div className="bg-[#001a33] rounded-3xl border border-white/5 shadow-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="SEARCH PRODUCT NAME OR ID..."
                        className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-[0.1em] text-white placeholder:text-gray-600 focus:ring-2 focus:ring-ub-gold outline-none transition-all shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-4 bg-black/20 border border-white/5 rounded-2xl px-4 py-1 shadow-sm">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="py-3 bg-transparent text-xs font-bold uppercase text-white outline-none cursor-pointer pr-4"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat} className="bg-[#001a33]">
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* BULK ACTION BAR */}
            {selected.length > 0 && (
                <div className="bg-[#001a33] text-white p-4 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-bold uppercase">
                        {selected.length} selected
                    </span>
                    <button className="text-xs font-bold uppercase bg-rose-500 px-4 py-2 rounded-lg">
                        Delete Selected
                    </button>
                </div>
            )}

            {/* TABLE */}
            <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto p-2">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr>
                                <th className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-ub-gold focus:ring-ub-gold cursor-pointer"
                                        checked={
                                            selected.length === filteredProducts.length &&
                                            filteredProducts.length > 0
                                        }
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">
                                    Product
                                </th>
                                <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">
                                    Status
                                </th>
                                <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">
                                    Stock
                                </th>
                                <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">
                                    Price
                                </th>
                                <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:scale-[1.01] transition-all group">
                                    <td className="px-6 py-6 bg-white/2 group-hover:bg-white/5 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-ub-gold focus:ring-ub-gold cursor-pointer"
                                            checked={selected.includes(product.id)}
                                            onChange={() => toggleSelect(product.id)}
                                        />
                                    </td>

                                    <td className="px-8 py-6 bg-white/2 group-hover:bg-white/5 transition-colors rounded-l-3xl">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-black/40 rounded-xl flex items-center justify-center border border-white/5 overflow-hidden shadow-sm">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-5 w-5 text-gray-700" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white uppercase italic group-hover:text-ub-gold transition-colors">
                                                    {product.name}
                                                </p>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                                                    {product.id} <span className="text-white/5">|</span> {product.category}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-8 py-6 bg-white/2 group-hover:bg-white/5 transition-colors">
                                        <span
                                            className={`text-[9px] font-black px-3 py-1.5 rounded-lg tracking-widest uppercase ${product.status === "ACTIVE"
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "bg-white/5 text-gray-500 border border-white/10"
                                                }`}
                                        >
                                            {product.status}
                                        </span>
                                    </td>

                                    <td className="px-8 py-6 bg-white/2 group-hover:bg-white/5 transition-colors">
                                        <span
                                            className={`text-xs font-black ${product.stock < 20
                                                ? "text-rose-500"
                                                : "text-white font-mono"
                                                }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>

                                    <td className="px-8 py-6 bg-white/2 group-hover:bg-white/5 transition-colors">
                                        <div className="flex flex-col font-mono">
                                            <span
                                                className={`text-sm font-black ${product.discountPrice
                                                    ? "line-through text-gray-600"
                                                    : "text-white"
                                                    }`}
                                            >
                                                Rp {product.price.toLocaleString("id-ID")}
                                            </span>
                                            {product.discountPrice && (
                                                <span className="text-xs font-black text-emerald-400">
                                                    Rp {product.discountPrice.toLocaleString("id-ID")}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-8 py-6 bg-white/2 group-hover:bg-white/5 transition-colors rounded-r-3xl text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 hover:bg-white/10 text-gray-500 hover:text-white rounded-xl transition-all duration-300 border border-white/5">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 hover:bg-ub-gold/10 text-gray-500 hover:text-ub-gold rounded-xl transition-all duration-300 border border-white/5">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 hover:bg-rose-500/10 text-gray-500 hover:text-rose-500 rounded-xl transition-all duration-300 border border-white/5">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-black/20 flex items-center justify-between border-t border-white/5">
                    <p className="text-xs font-bold text-gray-600 uppercase">
                        Showing {filteredProducts.length} of {mockProducts.length} products
                    </p>
                    <div className="text-xs font-bold uppercase text-ub-gold">
                        Total Selected: {selected.length}
                    </div>
                </div>
            </div>
        </div>
    );
}
