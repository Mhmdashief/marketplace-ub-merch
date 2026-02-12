// components/admin/RecentOrders.tsx
export default function RecentOrders() {
    // Placeholder - akan diisi dengan data real setelah model Order dibuat
    const orders = [
        {
            id: "ORD-001",
            customer: "John Doe",
            product: "UB Hoodie",
            amount: "Rp 250.000",
            status: "Pending",
        },
        {
            id: "ORD-002",
            customer: "Jane Smith",
            product: "UB Tote Bag",
            amount: "Rp 150.000",
            status: "Completed",
        },
        {
            id: "ORD-003",
            customer: "Bob Wilson",
            product: "UB T-Shirt",
            amount: "Rp 120.000",
            status: "Processing",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-800 border-green-200";
            case "Processing":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "Pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="space-y-3">
            {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No recent orders</p>
                </div>
            ) : (
                orders.map((order) => (
                    <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <p className="text-sm font-semibold text-gray-900">
                                    {order.id}
                                </p>
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                                        order.status
                                    )}`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{order.customer}</p>
                            <p className="text-xs text-gray-500">{order.product}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{order.amount}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
