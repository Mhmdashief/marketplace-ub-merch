'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    Package,
    ChevronRight,
    Search,
    Clock,
    CheckCircle2,
    Truck,
    CreditCard,
} from 'lucide-react';
import { getMyOrders } from '@/app/actions/orders';

export default function OrdersClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated' && session?.user?.email) {
            fetchOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    const fetchOrders = async () => {
        setIsLoading(true);
        const result = await getMyOrders(session!.user!.email!);
        if (result.success) {
            setOrders(result.orders);
        }
        setIsLoading(false);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getPaymentStatusStyle = (payStatus: string) => {
        switch (payStatus) {
            case 'PAID': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'EXPIRED': return 'bg-gray-50 text-gray-500 border-gray-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    const getShippingStatusIcon = (shipStatus: string) => {
        switch (shipStatus) {
            case 'SHIPPED': return <Truck className="w-4 h-4" />;
            case 'DELIVERED': return <CheckCircle2 className="w-4 h-4" />;
            case 'PENDING': return <Clock className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-ub-gold/20 border-t-ub-gold rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Archive...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black text-black tracking-tighter uppercase italic">My Orders</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Acquisition History &amp; Tracking</p>
                    </div>

                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search by Order ID..."
                            className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-black/5 focus:outline-none transition-all w-full md:w-64 shadow-sm"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 border border-gray-100 text-center space-y-8 shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto rotate-12 hover:rotate-0 transition-transform duration-700">
                            <Package className="w-10 h-10 text-gray-200" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-black uppercase italic tracking-tight">No Orders Found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto font-medium">
                                You haven&apos;t made any acquisitions yet. Explore our official merchandise archive.
                            </p>
                        </div>
                        <Link
                            href="/merchandise"
                            className="inline-flex px-10 py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-ub-navy transition-all shadow-xl shadow-black/10"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                            >
                                {/* Order Header */}
                                <div className="p-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-6 bg-gray-50/30">
                                    <div className="flex items-center gap-6 flex-wrap">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                                            <p className="text-sm font-black text-black tracking-tight">{order.orderCode}</p>
                                        </div>
                                        <div className="w-[1px] h-8 bg-gray-200 hidden sm:block" />
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Placed On</p>
                                            <p className="text-sm font-bold text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 flex-wrap">
                                        <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getPaymentStatusStyle(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </div>
                                        <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                            {getShippingStatusIcon(order.shippingStatus)}
                                            {order.shippingStatus}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items Bundle */}
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                        <div className="flex -space-x-8 overflow-hidden flex-shrink-0">
                                            {order.items.slice(0, 3).map((item: any) => (
                                                <div
                                                    key={item.id}
                                                    className="relative w-24 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-[#F9F9F9]"
                                                >
                                                    <Image
                                                        src={item.product?.assets?.[0]?.url || '/images/reusable/Logo Ub Merch.png'}
                                                        alt={item.productName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="w-24 h-32 rounded-2xl bg-black flex items-center justify-center text-white text-xs font-black italic border-4 border-white shadow-lg">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <p className="text-xs font-black text-black uppercase tracking-tight italic">
                                                {order.items[0]?.productName}
                                                {order.items.length > 1 && ` and ${order.items.length - 1} other item(s)`}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-md">
                                                To: {order.customerName} · {order.address?.split(',')[0]}
                                            </p>
                                            {order.paymentMethod && (
                                                <div className="pt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ub-gold">
                                                    <CreditCard className="w-3 h-3" />
                                                    {order.paymentMethod}
                                                </div>
                                            )}
                                        </div>

                                        <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-6">
                                            <div className="md:text-right">
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Total Vault</p>
                                                <p className="text-2xl font-black text-black italic tracking-tighter">
                                                    {formatPrice(Number(order.totalAmount))}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/orders/${order.id}`)}
                                                className="group/btn px-8 py-4 bg-gray-50 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-3 active:scale-95"
                                            >
                                                View Transaction
                                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
