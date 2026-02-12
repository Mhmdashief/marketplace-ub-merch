// app/admin/categories/page.tsx
import { FolderTree } from "lucide-react";

export default function CategoriesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                        <FolderTree className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Organize your products with categories
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Placeholder */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12">
                <div className="text-center">
                    <FolderTree className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Categories Management Coming Soon
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        This section will allow you to create and manage product categories.
                        Category model will be added to the database schema.
                    </p>
                </div>
            </div>
        </div>
    );
}
