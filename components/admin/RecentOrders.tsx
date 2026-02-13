export default function RecentOrders() {
    const orders = [
        {
            id: "ORD-001",
            customer: "John Doe",
            product: "UB Hoodie",
            amount: "Rp 250.000",
            status: "Pending",
            date: "2024-03-20",
        },
        {
            id: "ORD-002",
            customer: "Jane Smith",
            product: "UB Tote Bag",
            amount: "Rp 150.000",
            status: "Completed",
            date: "2024-03-19",
        },
        {
            id: "ORD-003",
            customer: "Bob Wilson",
            product: "UB T-Shirt",
            amount: "Rp 120.000",
            status: "Processing",
            date: "2024-03-19",
        },
    ];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "Completed":
                return "bg-emerald-100 text-emerald-700 font-bold";
            case "Processing":
                return "bg-blue-100 text-blue-700 font-bold";
            case "Pending":
                return "bg-amber-100 text-amber-700 font-bold";
            default:
                return "bg-gray-100 text-gray-700 font-bold";
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                                No recent transactions found.
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 text-sm font-black text-gray-900">{order.id}</td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-gray-900">{order.customer}</p>
                                    <p className="text-xs text-gray-400">{order.date}</p>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{order.product}</td>
                                <td className="px-6 py-4 text-sm font-black text-gray-900">{order.amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] tracking-wider uppercase ${getStatusStyles(order.status)}`}>
                                        {order.status}
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

