import { ShoppingCart, Search, Filter, MoreVertical, Eye, Truck, CreditCard, RefreshCcw, CheckCircle2, XCircle, AlertCircle, Clock, Landmark, Wallet, Smartphone } from "lucide-react";
import Link from "next/link";

const mockOrders = [
    {
        id: "ORD-9921",
        customer: "Ahmad Fauzi",
        total: 450000,
        status: "Paid",
        date: "13 Feb 2024",
        items: 2,
        payment: "Bank Transfer",
        tracking: null,
    },
    {
        id: "ORD-9845",
        customer: "Siska Putri",
        total: 125000,
        status: "Shipped",
        date: "12 Feb 2024",
        items: 1,
        payment: "GoPay",
        tracking: "UB-TRK-77821",
    },
    {
        id: "ORD-9822",
        customer: "Budi Santoso",
        total: 890000,
        status: "Refunded",
        date: "11 Feb 2024",
        items: 4,
        payment: "Google Pay",
        tracking: null,
    },
    {
        id: "ORD-9711",
        customer: "Dewi Lestari",
        total: 320000,
        status: "Delivered",
        date: "10 Feb 2024",
        items: 3,
        payment: "Bank Transfer",
        tracking: "UB-TRK-11200",
    },
    {
        id: "ORD-9701",
        customer: "Rian Hidayat",
        total: 150000,
        status: "Processing",
        date: "10 Feb 2024",
        items: 1,
        payment: "Credit Card",
        tracking: null,
    },
];

const getStatusConfig = (status: string) => {
    switch (status) {
        case "Paid":
            return { icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" };
        case "Shipped":
            return { icon: Truck, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" };
        case "Delivered":
            return { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" };
        case "Refunded":
            return { icon: RefreshCcw, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100" };
        case "Processing":
            return { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" };
        case "Cancelled":
            return { icon: XCircle, color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-100" };
        default:
            return { icon: AlertCircle, color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-100" };
    }
};

const getPaymentConfig = (method: string) => {
    switch (method) {
        case "Bank Transfer":
            return { icon: Landmark, color: "text-blue-400", bg: "bg-blue-500/10" };
        case "GoPay":
            return { icon: Wallet, color: "text-emerald-400", bg: "bg-emerald-500/10" };
        case "Google Pay":
            return { icon: Smartphone, color: "text-white", bg: "bg-white/10" };
        case "Credit Card":
            return { icon: CreditCard, color: "text-amber-400", bg: "bg-amber-500/10" };
        default:
            return { icon: CreditCard, color: "text-gray-400", bg: "bg-white/5" };
    }
};

export default function OrdersPage() {
    return (
        <div className="space-y-10 animate-fade-in py-2">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-[2px] bg-ub-gold"></div>
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Transactions</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Orders <span className="text-white/10">/</span> Ledger
                    </h1>
                </div>
            </div>

            {/* Order Categories / Workflow Filter */}
            <div className="flex flex-wrap gap-2">
                {["All Orders", "Pending", "Processing", "Shipped", "Delivered", "Refunded"].map((cat, idx) => (
                    <button
                        key={cat}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${idx === 0
                            ? "bg-ub-gold text-white shadow-lg shadow-ub-gold/20"
                            : "bg-[#001a33] text-gray-400 hover:text-white border border-white/5 hover:border-ub-gold/50"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Main Table Card */}
            <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 overflow-hidden group">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="SEARCH BY ORDER ID OR CUSTOMER NAME..."
                            className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all text-white placeholder:text-gray-600"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-ub-gold text-gray-400 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-white/5">
                            <CreditCard className="h-3 w-3" />
                            Payment Method
                        </button>
                        <button className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-ub-gold text-gray-400 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-white/5">
                            <Filter className="h-3 w-3" />
                            Date Range
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto p-2">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction ID</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer Info</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Financials</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Payment</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Logistics</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-transparent">
                            {mockOrders.map((order) => {
                                const status = getStatusConfig(order.status);
                                const StatusIcon = status.icon;
                                const payment = getPaymentConfig(order.payment);
                                const PaymentIcon = payment.icon;

                                return (
                                    <tr key={order.id} className="group hover:scale-[1.01] transition-all duration-300">
                                        <td className="px-8 py-6 bg-white/2 rounded-l-3xl group-hover:bg-white/5 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-white uppercase italic">{order.id}</span>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{order.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-white/2 group-hover:bg-white/5 transition-colors">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-black text-white uppercase italic transition-colors group-hover:text-ub-gold">{order.customer}</p>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{order.items} SKU Items</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-white/2 group-hover:bg-white/5 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-white">Rp {order.total.toLocaleString('id-ID')}</span>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Order Total</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-white/2 group-hover:bg-white/5 transition-colors">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 ${payment.bg}`}>
                                                <PaymentIcon className={`h-3 w-3 ${payment.color}`} />
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${payment.color}`}>{order.payment}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-white/2 group-hover:bg-white/5 transition-colors font-mono">
                                            <div className="flex items-center gap-2">
                                                <Truck className={`h-3 w-3 ${order.tracking ? 'text-blue-500' : 'text-gray-700'}`} />
                                                <span className={`text-[10px] font-black ${order.tracking ? 'text-white' : 'text-gray-700 italic'}`}>
                                                    {order.tracking || "NOT SHIPPED"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-white/2 group-hover:bg-white/5 transition-colors">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${status.bg} ${status.border} ${status.color} bg-opacity-10 border-opacity-20`}>
                                                <StatusIcon className="h-3 w-3" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{order.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-white/2 rounded-r-3xl group-hover:bg-white/5 transition-colors text-right">
                                            <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center justify-center p-3 hover:bg-ub-gold hover:text-white rounded-xl transition-all duration-300 group/view border border-white/5">
                                                <Eye className="h-4 w-4 group-hover/view:scale-110 transition-transform text-white" />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 bg-white/2 flex items-center justify-between border-t border-white/5">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Displaying 5 of 1,240 results</p>
                    <div className="flex items-center gap-2">
                        <button className="h-10 w-10 flex items-center justify-center bg-white/5 text-white rounded-xl border border-white/5 font-bold text-xs disabled:opacity-50" disabled>1</button>
                        <button className="h-10 w-10 flex items-center justify-center bg-white/5 hover:bg-ub-gold text-white rounded-xl border border-white/5 font-bold text-xs transition-colors">2</button>
                        <button className="h-10 w-10 flex items-center justify-center bg-white/5 hover:bg-ub-gold text-white rounded-xl border border-white/5 font-bold text-xs transition-colors">3</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

