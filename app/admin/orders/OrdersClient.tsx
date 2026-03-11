'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
    ShoppingCart, Search, Eye, Truck, CreditCard,
    CheckCircle2, XCircle, Clock, RefreshCcw, Package,
    ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ─────────────────────────────────────────────────────────────────
type OrderRow = {
    id: string;
    orderCode: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    paymentStatus: string;
    shippingStatus: string;
    trackingNumber: string | null;
    createdAt: string;
    items: { id: string; productName: string }[];
};

type FetchResult = {
    orders: OrderRow[];
    total: number;
    totalPages: number;
    countByPayment: Record<string, number>;
    countByShipping: Record<string, number>;
};

// ─── Configs ────────────────────────────────────────────────────────────────
const PAYMENT_CFG: Record<string, { label: string; color: string; bg: string; border: string; Icon: any }> = {
    ALL: { label: 'Semua', color: 'text-white', bg: 'bg-white/5', border: 'border-white/10', Icon: ShoppingCart },
    PAID: { label: 'Paid', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', Icon: CheckCircle2 },
    PENDING: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', Icon: Clock },
    EXPIRED: { label: 'Expired', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', Icon: RefreshCcw },
    FAILED: { label: 'Failed', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', Icon: XCircle },
    REFUNDED: { label: 'Refunded', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', Icon: CreditCard },
};

const SHIPPING_CFG: Record<string, { label: string; color: string }> = {
    ALL: { label: 'Semua Pengiriman', color: 'text-white' },
    PENDING: { label: 'Belum Dikirim', color: 'text-gray-400' },
    PROCESSING: { label: 'Diproses', color: 'text-amber-400' },
    SHIPPED: { label: 'Dikirim', color: 'text-blue-400' },
    DELIVERED: { label: 'Terkirim', color: 'text-emerald-400' },
    RETURNED: { label: 'Dikembalikan', color: 'text-orange-400' },
    CANCELLED: { label: 'Dibatalkan', color: 'text-rose-400' },
};

const ITEMS_PER_PAGE = 15;

const formatIDR = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

// ─── Component ──────────────────────────────────────────────────────────────
export default function AdminOrdersClient() {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const query = sp.get('q') ?? '';
    const status = sp.get('status') ?? 'ALL';
    const shipping = sp.get('shipping') ?? 'ALL';
    const page = parseInt(sp.get('page') ?? '1', 10);

    const [searchInput, setSearchInput] = useState(query);
    const [result, setResult] = useState<FetchResult>({
        orders: [], total: 0, totalPages: 1,
        countByPayment: {}, countByShipping: {},
    });
    const [isLoading, setIsLoading] = useState(true);

    // ── fetch ─────────────────────────────────────────────────────────────
    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.set('q', query);
            if (status !== 'ALL') params.set('status', status);
            if (shipping !== 'ALL') params.set('shipping', shipping);
            params.set('page', String(page));
            params.set('limit', String(ITEMS_PER_PAGE));

            const res = await fetch(`/api/admin/orders?${params.toString()}`);
            if (res.ok) setResult(await res.json());
        } catch (e) {
            console.error('[AdminOrdersClient] fetch error:', e);
        } finally {
            setIsLoading(false);
        }
    }, [query, status, shipping, page]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);
    useEffect(() => { setSearchInput(query); }, [query]);

    // ── navigation helpers ────────────────────────────────────────────────
    const navigate = (overrides: Record<string, string>) => {
        const next = new URLSearchParams();
        // carry current params
        if (query) next.set('q', query);
        if (status !== 'ALL') next.set('status', status);
        if (shipping !== 'ALL') next.set('shipping', shipping);
        // apply overrides
        Object.entries(overrides).forEach(([k, v]) => {
            if (!v || v === 'ALL') next.delete(k);
            else next.set(k, v);
        });
        next.delete('page'); // always reset page on filter change
        startTransition(() => router.push(`${pathname}?${next.toString()}`));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate({ q: searchInput });
    };

    const clearSearch = () => {
        setSearchInput('');
        navigate({ q: '' });
    };

    const goPage = (p: number) => {
        const next = new URLSearchParams(sp.toString());
        next.set('page', String(p));
        startTransition(() => router.push(`${pathname}?${next.toString()}`));
    };

    const { orders, total, totalPages, countByPayment, countByShipping } = result;

    return (
        <div className="space-y-8 animate-fade-in py-2">

            {/* ── Header ───────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-[2px] bg-ub-gold" />
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Transactions</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Orders <span className="text-white/10">/</span> Ledger
                    </h1>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2">
                        {isLoading ? '...' : `${total.toLocaleString('id-ID')} total transaksi`}
                    </p>
                </div>
            </div>

            {/* ── Payment Status Tabs ────────────────────────────────────── */}
            <div>
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Status Pembayaran</p>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(PAYMENT_CFG).map(([key, cfg]) => {
                        const isActive = status === key;
                        const count = key === 'ALL' ? total : (countByPayment[key] ?? 0);
                        return (
                            <button
                                key={key}
                                onClick={() => navigate({ status: key })}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isActive
                                        ? 'bg-ub-gold text-black border-ub-gold shadow-lg shadow-ub-gold/20'
                                        : `${cfg.bg} ${cfg.color} ${cfg.border} hover:opacity-90`
                                    }`}
                            >
                                <cfg.Icon className="h-3 w-3" />
                                {cfg.label}
                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black min-w-[20px] text-center ${isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-500'
                                    }`}>
                                    {key === 'ALL' ? (isLoading ? '…' : total) : (countByPayment[key] ?? 0)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Shipping Status Tabs ───────────────────────────────────── */}
            <div>
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Status Pengiriman</p>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(SHIPPING_CFG).map(([key, cfg]) => {
                        const isActive = shipping === key;
                        return (
                            <button
                                key={key}
                                onClick={() => navigate({ shipping: key })}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isActive
                                        ? 'bg-ub-gold text-black border-ub-gold shadow-lg shadow-ub-gold/20'
                                        : 'bg-[#001a33] border-white/5 text-gray-400 hover:text-white hover:border-ub-gold/30'
                                    }`}
                            >
                                <Truck className="h-3 w-3" />
                                {cfg.label}
                                {key !== 'ALL' && (
                                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black min-w-[20px] text-center ${isActive ? 'bg-black/20 text-black' : 'bg-white/5 text-gray-600'
                                        }`}>
                                        {countByShipping[key] ?? 0}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Table Card ─────────────────────────────────────────────── */}
            <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 overflow-hidden">

                {/* Search bar */}
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center gap-4">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-3 max-w-lg">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Cari order ID, nama, atau email..."
                                className="w-full pl-12 pr-10 py-4 bg-black/20 border border-white/5 rounded-2xl text-[11px] font-bold focus:ring-2 focus:ring-ub-gold transition-all text-white placeholder:text-gray-600 focus:outline-none"
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-4 bg-ub-gold text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-yellow-400 transition-all active:scale-95 whitespace-nowrap"
                        >
                            Cari
                        </button>
                    </form>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest md:ml-auto">
                        {isLoading ? 'Memuat...' : total > 0 ? `Showing ${Math.min((page - 1) * ITEMS_PER_PAGE + 1, total)}–${Math.min(page * ITEMS_PER_PAGE, total)} of ${total}` : '0 results'}
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto p-2">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr>
                                {['Transaction ID', 'Customer', 'Produk', 'Total', 'Pengiriman', 'Payment', 'Actions'].map(h => (
                                    <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={7} className="px-6 py-2">
                                            <div className="h-16 bg-white/2 animate-pulse rounded-2xl" />
                                        </td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                                            <Package className="h-12 w-12 text-gray-700" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                                                {query ? `Tidak ada hasil untuk "${query}"` : 'Belum ada order'}
                                            </p>
                                            {query && (
                                                <button
                                                    onClick={clearSearch}
                                                    className="text-ub-gold text-[10px] font-black uppercase tracking-widest hover:underline"
                                                >
                                                    Hapus pencarian
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const pc = PAYMENT_CFG[order.paymentStatus] ?? PAYMENT_CFG['PENDING'];
                                    const sc = SHIPPING_CFG[order.shippingStatus] ?? SHIPPING_CFG['PENDING'];
                                    const PIcon = pc.Icon;
                                    return (
                                        <tr key={order.id} className="group hover:scale-[1.005] transition-all duration-200">
                                            <td className="px-6 py-5 bg-white/2 rounded-l-3xl group-hover:bg-white/5 transition-colors">
                                                <p className="text-sm font-black text-white uppercase italic">{order.orderCode}</p>
                                                <p className="text-[9px] font-bold text-gray-600 mt-0.5">
                                                    {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5 bg-white/2 group-hover:bg-white/5 transition-colors">
                                                <p className="text-sm font-black text-white uppercase italic group-hover:text-ub-gold transition-colors truncate max-w-[160px]">
                                                    {order.customerName}
                                                </p>
                                                <p className="text-[9px] font-bold text-gray-600 truncate max-w-[160px]">{order.customerEmail}</p>
                                            </td>
                                            <td className="px-6 py-5 bg-white/2 group-hover:bg-white/5 transition-colors">
                                                <p className="text-[10px] font-bold text-gray-300 truncate max-w-[180px]">
                                                    {order.items[0]?.productName ?? '-'}
                                                </p>
                                                {order.items.length > 1 && (
                                                    <p className="text-[9px] text-gray-600 mt-0.5">+{order.items.length - 1} lainnya</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 bg-white/2 group-hover:bg-white/5 transition-colors">
                                                <p className="text-sm font-black text-white whitespace-nowrap">{formatIDR(order.totalAmount)}</p>
                                            </td>
                                            <td className="px-6 py-5 bg-white/2 group-hover:bg-white/5 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <Truck className={`h-3 w-3 flex-shrink-0 ${sc.color}`} />
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${sc.color} whitespace-nowrap`}>
                                                        {sc.label}
                                                    </span>
                                                </div>
                                                {order.trackingNumber && (
                                                    <p className="text-[9px] font-mono text-gray-600 mt-0.5 truncate max-w-[120px]">{order.trackingNumber}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 bg-white/2 group-hover:bg-white/5 transition-colors">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${pc.bg} ${pc.border}`}>
                                                    <PIcon className={`h-3 w-3 ${pc.color}`} />
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${pc.color} whitespace-nowrap`}>
                                                        {pc.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 bg-white/2 rounded-r-3xl group-hover:bg-white/5 transition-colors text-right">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="inline-flex items-center justify-center p-3 hover:bg-ub-gold rounded-xl transition-all border border-white/5 group/view"
                                                    title={`Detail ${order.orderCode}`}
                                                >
                                                    <Eye className="h-4 w-4 text-white group-hover/view:scale-110 transition-transform" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-8 bg-white/2 flex items-center justify-between border-t border-white/5">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                            Halaman {page} dari {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => goPage(page - 1)}
                                disabled={page <= 1 || isPending}
                                className="h-10 w-10 flex items-center justify-center bg-white/5 hover:bg-ub-gold text-white rounded-xl border border-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                const p = i + 1;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => goPage(p)}
                                        className={`h-10 w-10 flex items-center justify-center rounded-xl border font-black text-xs transition-colors ${page === p
                                                ? 'bg-ub-gold text-black border-ub-gold'
                                                : 'bg-white/5 hover:bg-ub-gold/50 text-white border-white/5'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => goPage(page + 1)}
                                disabled={page >= totalPages || isPending}
                                className="h-10 w-10 flex items-center justify-center bg-white/5 hover:bg-ub-gold text-white rounded-xl border border-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
