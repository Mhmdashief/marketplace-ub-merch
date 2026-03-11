'use client';

import { useState, useTransition } from 'react';
import {
    ArrowLeft, Truck, User, MapPin, Printer, Mail, Phone,
    CheckCircle2, Clock, ShieldCheck, Box, XCircle,
    CreditCard, ChevronRight, RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// ─── Types ─────────────────────────────────────────────────────────────────
type OrderItem = {
    id: string;
    productName: string;
    price: number;
    quantity: number;
    total: number;
    createdAt: string;
    product: { assets: { url: string }[] } | null;
};

type Order = {
    id: string;
    orderCode: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    subtotal: number;
    shippingAmount: number;
    totalAmount: number;
    paymentStatus: string;
    shippingStatus: string;
    paymentMethod: string | null;
    paymentRef: string | null;
    trackingNumber: string | null;
    invoiceUrl: string | null;
    paidAt: string | null;
    expiredAt: string | null;
    createdAt: string;
    items: OrderItem[];
};

// ─── Configs ────────────────────────────────────────────────────────────────
const PAYMENT_CFG: Record<string, { label: string; color: string; bg: string }> = {
    PAID: { label: 'Paid', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    PENDING: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    EXPIRED: { label: 'Expired', color: 'text-gray-400', bg: 'bg-gray-500/10' },
    FAILED: { label: 'Failed', color: 'text-rose-400', bg: 'bg-rose-500/10' },
};

const SHIPPING_STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const;
const SHIPPING_LABELS: Record<string, string> = {
    PENDING: 'Menunggu',
    PROCESSING: 'Diproses',
    SHIPPED: 'Dikirim',
    DELIVERED: 'Terkirim',
    CANCELLED: 'Dibatalkan',
};

const formatIDR = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const formatDate = (iso: string | null) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function OrderDetailClient({ order: initialOrder }: { order: Order }) {
    const router = useRouter();
    const [order, setOrder] = useState<Order>(initialOrder);
    const [trackingInput, setTracking] = useState(initialOrder.trackingNumber ?? '');
    const [isPending, startTransition] = useTransition();
    const [saveMsg, setSaveMsg] = useState<string | null>(null);

    const updateShipping = async (shippingStatus?: string, trackingNumber?: string) => {
        setSaveMsg(null);
        const body: Record<string, string> = {};
        if (shippingStatus) body.shippingStatus = shippingStatus;
        if (trackingNumber !== undefined) body.trackingNumber = trackingNumber;

        startTransition(async () => {
            try {
                const res = await fetch(`/api/admin/orders/${order.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                if (res.ok) {
                    // Refresh page data from server
                    router.refresh();
                    setSaveMsg('✅ Status berhasil diperbarui!');
                    // Also update local state optimistically
                    setOrder(prev => ({
                        ...prev,
                        ...(shippingStatus ? { shippingStatus } : {}),
                        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
                    }));
                    setTimeout(() => setSaveMsg(null), 3000);
                } else {
                    const err = await res.json();
                    setSaveMsg(`❌ Gagal: ${err.error}`);
                }
            } catch (e) {
                setSaveMsg('❌ Koneksi error, coba lagi.');
            }
        });
    };

    const paymentCfg = PAYMENT_CFG[order.paymentStatus] ?? PAYMENT_CFG['PENDING'];
    const currentIdx = SHIPPING_STEPS.indexOf(order.shippingStatus as any);

    return (
        <div className="space-y-10 py-2 pb-20">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin/orders" className="p-2 bg-white/5 hover:bg-ub-gold rounded-xl transition-all mr-2 border border-white/5">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Order Detail</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        {order.orderCode}
                    </h1>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-2">
                        Dibuat: {formatDate(order.createdAt)}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-white/5"
                    >
                        <Printer className="h-4 w-4" />
                        Print
                    </button>
                    {order.paymentStatus === 'PAID' && order.shippingStatus !== 'DELIVERED' && (
                        <button
                            onClick={() => updateShipping('DELIVERED')}
                            disabled={isPending}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-ub-gold hover:bg-yellow-400 text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-ub-gold/10 active:scale-95 disabled:opacity-50"
                        >
                            <ShieldCheck className="h-4 w-4" />
                            Mark as Delivered
                        </button>
                    )}
                </div>
            </div>

            {/* Success / Error feedback */}
            {saveMsg && (
                <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${saveMsg.startsWith('✅') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    }`}>
                    {saveMsg}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* ═══════ LEFT ═══════ */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Items */}
                    <div className="bg-[#001a33] rounded-[40px] border border-white/5 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Purchase Details</h2>
                            <span className="text-[10px] font-black px-3 py-1 bg-ub-gold/10 text-ub-gold rounded-lg border border-ub-gold/20 uppercase tracking-widest">
                                {order.items.length} Produk
                            </span>
                        </div>

                        <div className="space-y-3">
                            {order.items.map((item) => {
                                const imgUrl = item.product?.assets?.[0]?.url;
                                return (
                                    <div key={item.id} className="flex items-center justify-between p-5 bg-white/2 rounded-3xl border border-transparent hover:border-white/10 transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="h-16 w-16 rounded-2xl overflow-hidden bg-black/40 border border-white/5 flex-shrink-0 group-hover:rotate-2 transition-transform">
                                                {imgUrl ? (
                                                    <Image src={imgUrl} alt={item.productName} width={64} height={64} className="object-cover w-full h-full" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Box className="h-6 w-6 text-gray-700" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white uppercase italic group-hover:text-ub-gold transition-colors">{item.productName}</p>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                                                    Qty: {item.quantity} &nbsp;·&nbsp; {formatIDR(item.price)} / item
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-black text-white font-mono">{formatIDR(item.total)}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary */}
                        <div className="mt-8 pt-8 border-t border-dashed border-white/10 space-y-3 px-2 font-mono">
                            <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>{formatIDR(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                <span>Ongkos Kirim</span>
                                <span>{formatIDR(order.shippingAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3">
                                <span className="text-sm font-black text-ub-gold uppercase tracking-widest italic">Total</span>
                                <span className="text-2xl font-black text-white">{formatIDR(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Lifecycle Control */}
                    <div className="bg-[#001a33] rounded-[40px] border border-white/5 p-8 space-y-8">
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Lifecycle Control</h2>

                        {/* Timeline progress */}
                        <div className="flex items-start gap-0">
                            {SHIPPING_STEPS.map((step, idx) => {
                                const done = idx <= currentIdx;
                                const current = idx === currentIdx;
                                return (
                                    <div key={step} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${done ? 'bg-ub-gold border-ub-gold' :
                                                    current ? 'border-ub-gold animate-pulse bg-transparent' :
                                                        'border-white/10 bg-transparent'
                                                }`}>
                                                {done
                                                    ? <CheckCircle2 className="h-4 w-4 text-black" />
                                                    : <Clock className="h-4 w-4 text-gray-600" />
                                                }
                                            </div>
                                            <span className={`text-[9px] font-black uppercase tracking-wider text-center w-20 leading-tight ${done ? 'text-ub-gold' : 'text-gray-600'
                                                }`}>
                                                {SHIPPING_LABELS[step]}
                                            </span>
                                        </div>
                                        {idx < SHIPPING_STEPS.length - 1 && (
                                            <div className={`flex-1 h-[2px] -mt-6 ${done && idx < currentIdx ? 'bg-ub-gold' : 'bg-white/10'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Quick action buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                            {(['PROCESSING', 'SHIPPED', 'DELIVERED'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => updateShipping(s)}
                                    disabled={isPending || order.shippingStatus === s || order.paymentStatus !== 'PAID'}
                                    className="flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all border border-white/5 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Truck className="h-4 w-4 text-gray-500" />
                                        {SHIPPING_LABELS[s]}
                                    </div>
                                    {order.shippingStatus === s
                                        ? <CheckCircle2 className="h-4 w-4 text-ub-gold" />
                                        : <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    }
                                </button>
                            ))}

                            <button
                                onClick={() => updateShipping('CANCELLED')}
                                disabled={isPending || order.shippingStatus === 'DELIVERED'}
                                className="flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/30 disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all border border-white/5 col-span-2 md:col-span-1"
                            >
                                <div className="flex items-center gap-3">
                                    <XCircle className="h-4 w-4 text-rose-500" />
                                    Batalkan Pengiriman
                                </div>
                            </button>
                        </div>

                        {/* Tracking number */}
                        <div className="space-y-3 pt-6 border-t border-white/5">
                            <label className="text-[10px] font-black text-white uppercase tracking-widest">Nomor Resi / AWB</label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={trackingInput}
                                    onChange={(e) => setTracking(e.target.value)}
                                    placeholder="Masukkan nomor resi..."
                                    className="flex-1 px-5 py-4 bg-black/20 border border-white/5 rounded-2xl text-[11px] font-bold focus:ring-2 focus:ring-ub-gold transition-all text-white placeholder:text-gray-600 focus:outline-none uppercase"
                                />
                                <button
                                    onClick={() => updateShipping(undefined, trackingInput)}
                                    disabled={isPending}
                                    className="px-6 py-4 bg-ub-gold text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 ${isPending ? 'animate-spin' : ''}`} />
                                    Simpan
                                </button>
                            </div>
                            {order.trackingNumber && (
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                    Tersimpan: <span className="text-ub-gold font-mono">{order.trackingNumber}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══════ RIGHT ═══════ */}
                <div className="space-y-6">

                    {/* Payment status */}
                    <div className="bg-[#001a33] rounded-[40px] border border-white/5 p-8 space-y-5">
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Settlement</h2>

                        <div className={`p-5 rounded-3xl border border-white/5 ${paymentCfg.bg}`}>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-black/20">
                                        <CreditCard className={`h-5 w-5 ${paymentCfg.color}`} />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-black uppercase tracking-widest ${paymentCfg.color}`}>
                                            {paymentCfg.label}
                                        </p>
                                        {order.paidAt && (
                                            <p className="text-[9px] font-bold text-emerald-500 mt-0.5">
                                                {formatDate(order.paidAt)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <p className={`text-lg font-black font-mono ${paymentCfg.color}`}>
                                    {formatIDR(order.totalAmount)}
                                </p>
                            </div>
                        </div>

                        {order.paymentMethod && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                                <CreditCard className="h-3.5 w-3.5 text-gray-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{order.paymentMethod}</span>
                            </div>
                        )}

                        {order.invoiceUrl && (
                            <a
                                href={order.invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-5 py-3 bg-white/5 hover:bg-ub-gold/10 border border-white/5 hover:border-ub-gold/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-ub-gold transition-all group"
                            >
                                Buka Invoice Xendit
                                <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </a>
                        )}
                    </div>

                    {/* Customer */}
                    <div className="bg-[#001a33] rounded-[40px] border border-white/5 p-8 space-y-6 group hover:shadow-ub-gold/5 transition-all duration-500">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <User className="h-7 w-7 text-gray-600 group-hover:text-ub-gold transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white tracking-tight uppercase italic group-hover:text-ub-gold transition-colors">
                                    {order.customerName}
                                </h3>
                                <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-500/20">
                                    Buyer
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-dashed border-white/10">
                            <div className="flex items-center gap-3 group/row">
                                <div className="p-2 bg-white/5 rounded-xl border border-white/5 group-hover/row:bg-ub-gold/10 transition-colors">
                                    <Mail className="h-3 w-3 text-gray-600 group-hover/row:text-ub-gold" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest break-all">{order.customerEmail}</span>
                            </div>
                            <div className="flex items-center gap-3 group/row">
                                <div className="p-2 bg-white/5 rounded-xl border border-white/5 group-hover/row:bg-ub-gold/10 transition-colors">
                                    <Phone className="h-3 w-3 text-gray-600 group-hover/row:text-ub-gold" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.customerPhone || '-'}</span>
                            </div>
                            <div className="flex flex-col gap-2 group/row">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/5 rounded-xl border border-white/5 group-hover/row:bg-ub-gold/10 transition-colors">
                                        <MapPin className="h-3 w-3 text-gray-600 group-hover/row:text-ub-gold" />
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Alamat</span>
                                </div>
                                <p className="pl-11 text-[10px] font-bold text-gray-500 leading-relaxed">{order.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
