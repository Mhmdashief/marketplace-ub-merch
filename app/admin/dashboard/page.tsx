import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/admin/StatsCard";
import RecentOrders from "@/components/admin/RecentOrders";
import RevenueChart from "@/components/admin/RevenueChart";
import { Package, ShoppingCart, Users, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
    const session = await auth();

    // Fetch semua stats dari database secara paralel
    const [
        totalUsers,
        totalProducts,
        totalOrders,
        revenueResult,
        pendingOrders,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.product.count({ where: { isActive: true, deletedAt: null } }),
        prisma.order.count(),
        prisma.order.aggregate({
            where: { paymentStatus: 'PAID' },
            _sum: { totalAmount: true },
        }),
        prisma.order.count({ where: { paymentStatus: 'PENDING' } }),
    ]);

    const totalRevenue = Number(revenueResult._sum.totalAmount ?? 0);

    const formatIDR = (n: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

    const stats = [
        {
            name: "Total Customers",
            value: totalUsers.toLocaleString('id-ID'),
            icon: Users,
            change: "Registered users",
            changeType: "increase" as const,
            color: "blue" as const,
        },
        {
            name: "Active Products",
            value: totalProducts.toLocaleString('id-ID'),
            icon: Package,
            change: "Published items",
            changeType: "increase" as const,
            color: "green" as const,
        },
        {
            name: "Total Orders",
            value: totalOrders.toLocaleString('id-ID'),
            icon: ShoppingCart,
            change: `${pendingOrders} pending`,
            changeType: pendingOrders > 0 ? "increase" as const : "decrease" as const,
            color: "purple" as const,
        },
        {
            name: "Total Revenue",
            value: formatIDR(totalRevenue),
            icon: TrendingUp,
            change: "From paid orders",
            changeType: "increase" as const,
            color: "orange" as const,
        },
    ];

    return (
        <div className="space-y-10 animate-fade-in py-2">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-[2px] bg-ub-gold"></div>
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Administrator</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Analytics <span className="text-white/10">/</span> Overview
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col text-right">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Session</span>
                        <span className="text-sm font-black text-ub-gold">{session?.user?.name}</span>
                    </div>
                    <div className="h-12 w-[1px] bg-white/5 hidden md:block"></div>
                    <div className="flex items-center gap-3 px-6 py-3 bg-[#001a33] border border-white/5 rounded-2xl shadow-2xl shadow-black text-white group cursor-default">
                        <Calendar className="h-4 w-4 text-ub-gold group-hover:rotate-12 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                            {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid — REAL DATA */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <StatsCard key={stat.name} {...stat} />
                ))}
            </div>

            {/* Chart & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>

                <div className="space-y-8">
                    <div className="bg-[#001a33] rounded-[32px] shadow-2xl shadow-blue-900/20 p-8 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-ub-gold/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <h2 className="text-sm font-black text-ub-gold mb-8 flex items-center gap-3 uppercase tracking-[0.2em]">
                                <div className="w-2 h-2 bg-ub-gold rounded-full animate-pulse"></div>
                                Control Center
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <Link href="/admin/products" className="flex items-center justify-between p-5 bg-white/5 hover:bg-ub-gold group/btn rounded-2xl transition-all duration-500 border border-white/5 hover:border-ub-gold shadow-lg hover:shadow-ub-gold/20">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/10 group-hover/btn:bg-white/20 rounded-xl text-white transition-colors">
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <span className="font-black text-xs text-white uppercase tracking-widest group-hover/btn:scale-105 transition-transform">Products Management</span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-ub-gold group-hover/btn:text-white transition-all transform group-hover/btn:translate-x-1" />
                                </Link>
                                <Link href="/admin/users" className="flex items-center justify-between p-5 bg-white/5 hover:bg-white group/btn rounded-2xl transition-all duration-500 border border-white/5 hover:border-white shadow-lg hover:shadow-white/20">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/10 group-hover/btn:bg-[#001a33]/10 rounded-xl text-white group-hover/btn:text-[#001a33] transition-colors">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <span className="font-black text-xs text-white group-hover/btn:text-[#001a33] uppercase tracking-widest group-hover/btn:scale-105 transition-transform">Users Hub</span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-white group-hover/btn:text-[#001a33] transition-all transform group-hover/btn:translate-x-1" />
                                </Link>
                                <Link href="/admin/orders" className="flex items-center justify-between p-5 bg-white/5 hover:bg-white group/btn rounded-2xl transition-all duration-500 border border-white/5 hover:border-white shadow-lg hover:shadow-white/20">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/10 group-hover/btn:bg-[#001a33]/10 rounded-xl text-white group-hover/btn:text-[#001a33] transition-colors">
                                            <ShoppingCart className="h-5 w-5" />
                                        </div>
                                        <span className="font-black text-xs text-white group-hover/btn:text-[#001a33] uppercase tracking-widest group-hover/btn:scale-105 transition-transform">Orders Desk</span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-white group-hover/btn:text-[#001a33] transition-all transform group-hover/btn:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions — REAL DATA */}
            <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 overflow-hidden group">
                <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-ub-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div>
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-1 leading-none">Ledger Journal</h2>
                        <h3 className="text-3xl font-black text-white tracking-tighter italic">Recent <span className="text-ub-gold">Transactions</span></h3>
                    </div>
                    <Link href="/admin/orders" className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-ub-gold text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 group/link border border-white/5">
                        Explore All Transactions
                        <ArrowRight className="h-4 w-4 group-hover/link:translate-x-2 transition-transform" />
                    </Link>
                </div>
                <div className="p-2">
                    <RecentOrders />
                </div>
            </div>
        </div>
    );
}
