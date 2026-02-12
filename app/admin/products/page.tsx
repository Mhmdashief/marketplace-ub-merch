// app/admin/products/page.tsx
import { Package } from "lucide-react";

export default function ProductsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                        <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage your merchandise products
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Placeholder */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12">
                <div className="text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Products Management Coming Soon
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        This section will allow you to add, edit, and manage all your merchandise products.
                        Product model will be added to the database schema.
                    </p>
                </div>
            </div>
        </div>
    );
}
