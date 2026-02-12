// app/admin/reports/page.tsx
import { FileText } from "lucide-react";

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
                        <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            View sales reports and analytics
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Placeholder */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12">
                <div className="text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Reports & Analytics Coming Soon
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        This section will provide detailed sales reports, analytics, and insights
                        about your store performance.
                    </p>
                </div>
            </div>
        </div>
    );
}
