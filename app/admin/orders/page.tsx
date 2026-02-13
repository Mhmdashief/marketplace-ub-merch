import { ShoppingCart, Search, Filter, MoreVertical, Eye, Truck, CreditCard, RefreshCcw, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
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

export default function OrdersPage() {
    return (
        <div className="space-y-10 animate-fade-in py-2">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-100 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-[2px] bg-ub-gold"></div>
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Transactions</span>
                    </div>
                    <h1 className="text-4xl font-black text-[#001a33] tracking-tighter uppercase italic">
                        Orders <span className="text-gray-200">/</span> Ledger
                    </h1>
                </div>
            </div>

            {/* Order Categories / Workflow Filter */}
            <div className="flex flex-wrap gap-2">
                {["All Orders", "Pending", "Processing", "Shipped", "Delivered", "Refunded"].map((cat, idx) => (
                    <button
                        key={cat}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${idx === 0
                                ? "bg-[#001a33] text-white shadow-lg"
                                : "bg-white text-gray-400 hover:text-[#001a33] border border-gray-100"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden group">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="SEARCH BY ORDER ID OR CUSTOMER NAME..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-[#001a33] transition-all text-black"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-3 px-6 py-4 bg-gray-50 hover:bg-[#001a33] text-[#001a33] hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                            <CreditCard className="h-3 w-3" />
                            Payment Method
                        </button>
                        <button className="flex items-center gap-3 px-6 py-4 bg-gray-50 hover:bg-[#001a33] text-[#001a33] hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all">
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
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Logistics</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-transparent">
                            {mockOrders.map((order) => {
                                const status = getStatusConfig(order.status);
                                const StatusIcon = status.icon;
                                return (
                                    <tr key={order.id} className="group hover:scale-[1.01] transition-all duration-300">
                                        <td className="px-8 py-6 bg-gray-50/50 rounded-l-3xl group-hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-[#001a33] uppercase italic">{order.id}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{order.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-gray-50/50 group-hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-black text-[#001a33] uppercase italic transition-colors group-hover:text-ub-gold">{order.customer}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{order.items} SKU Items</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-gray-50/50 group-hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-[#001a33]">Rp {order.total.toLocaleString('id-ID')}</span>
                                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">{order.payment}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-gray-50/50 group-hover:bg-gray-100 transition-colors font-mono">
                                            <div className="flex items-center gap-2">
                                                <Truck className={`h-3 w-3 ${order.tracking ? 'text-blue-500' : 'text-gray-300'}`} />
                                                <span className={`text-[10px] font-black ${order.tracking ? 'text-[#001a33]' : 'text-gray-300 italic'}`}>
                                                    {order.tracking || "NOT SHIPPED"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-gray-50/50 group-hover:bg-gray-100 transition-colors">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${status.bg} ${status.border} ${status.color}`}>
                                                <StatusIcon className="h-3 w-3" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{order.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-gray-50/50 rounded-r-3xl group-hover:bg-gray-100 transition-colors text-right">
                                            <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center justify-center p-3 hover:bg-[#001a33] hover:text-white rounded-xl transition-all duration-300 group/view">
                                                <Eye className="h-4 w-4 group-hover/view:scale-110 transition-transform" />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Displaying 5 of 1,240 results</p>
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

