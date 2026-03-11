import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CreditCard } from 'lucide-react';

export default async function RecentOrders() {
    const orders = await prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
            items: { take: 1, select: { productName: true } },
        },
    });

    const getStatusStyles = (payStatus: string) => {
        switch (payStatus) {
            case 'PAID':
                return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            case 'PENDING':
                return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
            case 'EXPIRED':
                return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
            case 'FAILED':
                return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
            default:
                return 'bg-white/5 text-gray-400 border border-white/10';
        }
    };

    const formatIDR = (n: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-black/20">
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Order ID</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Customer</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Produk</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Payment</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Amount</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-600 font-medium">
                                Belum ada transaksi.
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id} className="hover:bg-white/2 transition-colors group">
                                <td className="px-6 py-4">
                                    <Link href={`/admin/orders/${order.id}`} className="text-sm font-black text-white italic hover:text-ub-gold transition-colors">
                                        {order.orderCode}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-ub-gold transition-colors">{order.customerName}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-[11px] font-bold text-gray-400 max-w-[180px] truncate">
                                    {order.items[0]?.productName ?? '-'}
                                    {order.items.length > 1 && <span className="text-gray-600"> +{order.items.length - 1}</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5">
                                        <CreditCard className="h-3 w-3 text-gray-400" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                                            {order.paymentMethod ?? 'N/A'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-black text-white">
                                    {formatIDR(Number(order.totalAmount))}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase ${getStatusStyles(order.paymentStatus)}`}>
                                        {order.paymentStatus}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
