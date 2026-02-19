import { Landmark, Wallet, Smartphone, CreditCard } from "lucide-react";

export default function RecentOrders() {
    const orders = [
        {
            id: "ORD-001",
            customer: "John Doe",
            product: "UB Hoodie",
            amount: "Rp 250.000",
            status: "Pending",
            date: "2024-03-20",
            payment: "Bank Transfer",
        },
        {
            id: "ORD-002",
            customer: "Jane Smith",
            product: "UB Tote Bag",
            amount: "Rp 150.000",
            status: "Completed",
            date: "2024-03-19",
            payment: "GoPay",
        },
        {
            id: "ORD-003",
            customer: "Bob Wilson",
            product: "UB T-Shirt",
            amount: "Rp 120.000",
            status: "Processing",
            date: "2024-03-19",
            payment: "Credit Card",
        },
    ];

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

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "Completed":
                return "bg-emerald-500/10 text-emerald-400 font-black border border-emerald-500/20";
            case "Processing":
                return "bg-blue-500/10 text-blue-400 font-black border border-blue-500/20";
            case "Pending":
                return "bg-amber-500/10 text-amber-400 font-black border border-amber-500/20";
            default:
                return "bg-white/5 text-gray-400 font-black border border-white/10";
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-black/20">
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Order ID</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Customer</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Product</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Payment</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Amount</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-600 font-medium">
                                No recent transactions found.
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => {
                            const payment = getPaymentConfig(order.payment);
                            const PaymentIcon = payment.icon;
                            return (
                                <tr key={order.id} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-black text-white italic">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-ub-gold transition-colors">{order.customer}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{order.date}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-400">{order.product}</td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-white/5 ${payment.bg}`}>
                                            <PaymentIcon className={`h-3 w-3 ${payment.color}`} />
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${payment.color}`}>{order.payment}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-black text-white">{order.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] tracking-widest uppercase ${getStatusStyles(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

