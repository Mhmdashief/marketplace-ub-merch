// app/admin/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/admin/StatsCard";
import RecentOrders from "@/components/admin/RecentOrders";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
    const session = await auth();

    // Fetch statistics
    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
        prisma.user.count(),
        // Nanti akan ditambahkan setelah model Product dibuat
        Promise.resolve(0),
        // Nanti akan ditambahkan setelah model Order dibuat
        Promise.resolve(0),
    ]);

    const stats = [
        {
            name: "Total Users",
            value: totalUsers.toString(),
            icon: Users,
            change: "+12%",
            changeType: "increase" as const,
            color: "blue" as const,
        },
        {
            name: "Total Products",
            value: totalProducts.toString(),
            icon: Package,
            change: "+8%",
            changeType: "increase" as const,
            color: "green" as const,
        },
        {
            name: "Total Orders",
            value: totalOrders.toString(),
            icon: ShoppingCart,
            change: "+23%",
            changeType: "increase" as const,
            color: "purple" as const,
        },
        {
            name: "Revenue",
            value: "Rp 0",
            icon: TrendingUp,
            change: "+15%",
            changeType: "increase" as const,
            color: "orange" as const,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {session?.user?.name}! 👋
                </h1>
                <p className="text-blue-100">
                    Here&apos;s what&apos;s happening with your store today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <StatsCard key={stat.name} {...stat} />
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Recent Orders
                    </h2>
                    <RecentOrders />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Quick Actions
                    </h2>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all duration-200 border border-blue-200">
                            <div className="flex items-center">
                                <Package className="h-5 w-5 text-blue-600 mr-3" />
                                <span className="font-medium text-gray-900">Add New Product</span>
                            </div>
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all duration-200 border border-green-200">
                            <div className="flex items-center">
                                <Users className="h-5 w-5 text-green-600 mr-3" />
                                <span className="font-medium text-gray-900">Manage Users</span>
                            </div>
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg transition-all duration-200 border border-purple-200">
                            <div className="flex items-center">
                                <ShoppingCart className="h-5 w-5 text-purple-600 mr-3" />
                                <span className="font-medium text-gray-900">View All Orders</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
