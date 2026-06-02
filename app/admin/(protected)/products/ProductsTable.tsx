'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import {
    Search, Filter, Edit2, Trash2, Eye, Check, ChevronDown, Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { deleteProduct, bulkDeleteProducts, toggleProductStatus } from '@/app/actions/products';

interface Product {
    id: string;
    name: string;
    price: number;
    discountPrice: number | null;
    stock: number;
    category: string | null;
    slug: string;
    image: string | null;
    status: 'ACTIVE' | 'DRAFT';
}

interface Props {
    products: Product[];
    categories: string[];
    initialSearch: string;
    initialCategory: string;
}

export default function ProductsTable({ products, categories, initialSearch, initialCategory }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    // Search / filter state yang sync dengan URL
    const [search, setSearch] = useState(initialSearch);
    const [filterCategory, setFilterCategory] = useState(initialCategory);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Selection
    const [selected, setSelected] = useState<string[]>([]);

    // Debounce search → update URL query params
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (filterCategory && filterCategory !== 'ALL') params.set('category', filterCategory);
            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`);
            });
        }, 350);
        return () => clearTimeout(timer);
    }, [search, filterCategory]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleSelect = (id: string) =>
        setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

    const toggleSelectAll = () =>
        setSelected(selected.length === products.length ? [] : products.map((p) => p.id));

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus produk ini? (soft delete)')) return;
        startTransition(async () => {
            await deleteProduct(id);
        });
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Hapus ${selected.length} produk terpilih?`)) return;
        startTransition(async () => {
            await bulkDeleteProducts(selected);
            setSelected([]);
        });
    };

    const handleToggleStatus = async (id: string, isActive: boolean) => {
        startTransition(async () => {
            await toggleProductStatus(id, isActive);
        });
    };

    return (
        <div className={`transition-opacity ${isPending ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
            {/* SEARCH & FILTER */}
            <div className="bg-[#001a33] rounded-3xl border border-white/5 shadow-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="SEARCH PRODUCT NAME OR ID..."
                        className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-[0.1em] text-white placeholder:text-gray-600 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all shadow-sm"
                    />
                </div>

                {/* Custom Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center gap-6 bg-black/40 border ${isDropdownOpen ? 'border-[#D4AF37]' : 'border-white/10'} rounded-2xl px-6 py-3.5 shadow-xl transition-all hover:border-[#D4AF37]/50 min-w-[220px] justify-between`}
                    >
                        <div className="flex items-center gap-4">
                            <Filter className={`h-4 w-4 ${isDropdownOpen ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                            <div className="text-left">
                                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">Filter Category</p>
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white truncate max-w-[120px]">
                                    {filterCategory}
                                </p>
                            </div>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[#D4AF37]' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-full min-w-[240px] bg-[#001a33] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                            >
                                <div className="p-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => { setFilterCategory(cat); setIsDropdownOpen(false); }}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mb-1 last:mb-0 ${filterCategory === cat
                                                ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20'
                                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            {cat}
                                            {filterCategory === cat && <Check className="h-3 w-3" strokeWidth={4} />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* BULK ACTION BAR */}
            <AnimatePresence>
                {selected.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-[#D4AF37] text-white p-4 rounded-2xl flex items-center justify-between shadow-2xl shadow-[#D4AF37]/20 mb-6"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Check className="h-4 w-4" strokeWidth={3} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">
                                {selected.length} Products Selected
                            </span>
                        </div>
                        <button
                            onClick={handleBulkDelete}
                            className="text-[10px] font-black uppercase tracking-widest bg-black/20 hover:bg-black/40 px-6 py-2.5 rounded-xl transition-colors border border-white/10"
                        >
                            Delete Permanently
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TABLE */}
            <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto p-4">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr>
                                <th className="px-6 py-4">
                                    <div
                                        onClick={toggleSelectAll}
                                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${selected.length === products.length && products.length > 0
                                            ? 'bg-[#D4AF37] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
                                            : 'bg-white/5 border-white/10 hover:border-[#D4AF37]/40'
                                            }`}
                                    >
                                        {selected.length === products.length && products.length > 0 && (
                                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
                                        )}
                                    </div>
                                </th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Product</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Price</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-4 text-gray-600">
                                            <ImageIcon className="h-10 w-10" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">No products found</p>
                                            <p className="text-[10px] font-medium">Try adjusting your search or filter, or add a new product.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="group transition-all">
                                        <td className="px-6 py-6 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors rounded-l-3xl border-y border-l border-white/5">
                                            <div
                                                onClick={() => toggleSelect(product.id)}
                                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${selected.includes(product.id)
                                                    ? 'bg-[#D4AF37] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-110'
                                                    : 'bg-white/5 border-white/10 group-hover:border-[#D4AF37]/40'
                                                    }`}
                                            >
                                                {selected.includes(product.id) && (
                                                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-8 py-6 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors border-y border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 bg-black/40 rounded-xl flex items-center justify-center border border-white/5 overflow-hidden shadow-sm group-hover:border-[#D4AF37]/30 transition-colors flex-shrink-0">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="h-5 w-5 text-gray-700" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white uppercase italic group-hover:text-[#D4AF37] transition-colors tracking-tight">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                                                        {product.id.slice(0, 12).toUpperCase()}… <span className="text-white/10 mx-1">|</span> {product.category}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-6 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors border-y border-white/5">
                                            <button
                                                onClick={() => handleToggleStatus(product.id, product.status === 'ACTIVE')}
                                                className={`text-[9px] font-black px-3 py-1.5 rounded-lg tracking-widest uppercase cursor-pointer transition-all hover:scale-105 ${product.status === 'ACTIVE'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                                    : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10'
                                                    }`}
                                                title="Klik untuk toggle status"
                                            >
                                                {product.status}
                                            </button>
                                        </td>



                                        <td className="px-8 py-6 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors border-y border-white/5">
                                            <div className="flex flex-col font-mono">
                                                <span className={`text-sm font-black ${product.discountPrice ? 'line-through text-gray-600 text-[10px]' : 'text-white'}`}>
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </span>
                                                {product.discountPrice && (
                                                    <span className="text-xs font-black text-emerald-400">
                                                        Rp {product.discountPrice.toLocaleString('id-ID')}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-8 py-6 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors rounded-r-3xl border-y border-r border-white/5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/merchandise/${product.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2.5 bg-black/20 hover:bg-white/10 text-gray-500 hover:text-white rounded-xl transition-all border border-white/5 inline-flex"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="p-2.5 bg-black/20 hover:bg-[#D4AF37]/10 text-gray-500 hover:text-[#D4AF37] rounded-xl transition-all border border-white/5 inline-flex"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2.5 bg-black/20 hover:bg-rose-500/10 text-gray-500 hover:text-rose-500 rounded-xl transition-all border border-white/5"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 bg-black/20 flex items-center justify-between border-t border-white/5">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        Showing {products.length} entries
                    </p>
                    <div className="flex gap-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/5 px-4 py-2 rounded-lg border border-[#D4AF37]/10">
                            Page 1 of 1
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.5); }
            `}</style>
        </div>
    );
}
