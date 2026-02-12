// app/admin/orders/page.tsx
import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                        <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Track and manage customer orders
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Placeholder */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12">
                <div className="text-center">
                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Orders Management Coming Soon
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        This section will allow you to view, process, and manage all customer orders.
                        Order model will be added to the database schema.
                    </p>
                </div>
            </div>
        </div>
    );
}
