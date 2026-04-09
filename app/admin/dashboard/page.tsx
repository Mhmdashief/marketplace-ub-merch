import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/admin/StatsCard";
import { Package, Users, Calendar, ArrowRight, AlertTriangle, MousePointerClick, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
    const session = await auth();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
        totalUsers,
        totalProducts,
        lowStockProducts,
        productsWithoutLinks,
        totalClicks30d,
        activeBanners,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.product.count({ where: { isActive: true, deletedAt: null } }),
        prisma.product.count({ where: { isActive: true, deletedAt: null, stock: { lte: 5 } } }),
        prisma.product.count({
            where: { isActive: true, deletedAt: null, marketplaceLinks: { none: {} } },
        }),
        prisma.clickTracking.count({
            where: { clickedAt: { gte: thirtyDaysAgo } },
        }),
        prisma.banner.count({ where: { isActive: true, deletedAt: null } }),
    ]);

    const stats = [
        {
            name: "Total Pengguna",
            value: totalUsers.toLocaleString('id-ID'),
            icon: Users,
            change: "Registered users",
            changeType: "increase" as const,
            color: "blue" as const,
        },
        {
            name: "Produk Aktif",
            value: totalProducts.toLocaleString('id-ID'),
            icon: Package,
            change: "Published items",
            changeType: "increase" as const,
            color: "green" as const,
        },
        {
            name: "Klik Marketplace",
            value: totalClicks30d.toLocaleString('id-ID'),
            icon: MousePointerClick,
            change: "30 hari terakhir",
            changeType: totalClicks30d > 0 ? "increase" as const : "decrease" as const,
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

            {/* Alerts */}
            {(productsWithoutLinks > 0 || lowStockProducts > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {productsWithoutLinks > 0 && (
                        <Link href="/admin/reports" className="group flex items-center gap-4 p-5 bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/20 rounded-2xl transition-all">
                            <div className="p-3 bg-orange-500/10 rounded-xl flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-orange-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">
                                    {productsWithoutLinks} Produk Tanpa Link Marketplace
                                </p>
                                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">
                                    Klik untuk lihat detail →
                                </p>
                            </div>
                        </Link>
                    )}
                    {lowStockProducts > 0 && (
                        <Link href="/admin/products" className="group flex items-center gap-4 p-5 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-2xl transition-all">
                            <div className="p-3 bg-rose-500/10 rounded-xl flex-shrink-0">
                                <Package className="h-5 w-5 text-rose-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
                                    {lowStockProducts} Produk Stok Menipis
                                </p>
                                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">
                                    Klik untuk manage produk →
                                </p>
                            </div>
                        </Link>
                    )}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <StatsCard key={stat.name} {...stat} />
                ))}
            </div>

            {/* Control Center + Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="bg-[#001a33] rounded-[32px] shadow-2xl shadow-blue-900/20 p-8 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ub-gold/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <h2 className="text-sm font-black text-ub-gold mb-8 flex items-center gap-3 uppercase tracking-[0.2em]">
                            <div className="w-2 h-2 bg-ub-gold rounded-full animate-pulse"></div>
                            Control Center
                        </h2>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { href: '/admin/products', icon: Package, label: 'Products Management', color: 'hover:bg-ub-gold hover:border-ub-gold' },
                                { href: '/admin/banners', icon: ImageIcon, label: 'Banner Management', color: 'hover:bg-blue-500 hover:border-blue-500' },
                                { href: '/admin/users', icon: Users, label: 'Users Hub', color: 'hover:bg-white hover:border-white' },
                                { href: '/admin/reports', icon: MousePointerClick, label: 'Analytics & Reports', color: 'hover:bg-purple-500 hover:border-purple-500' },
                            ].map(({ href, icon: Icon, label, color }) => (
                                <Link key={href} href={href}
                                    className={`flex items-center justify-between p-4 bg-white/5 group/btn rounded-2xl transition-all duration-300 border border-white/5 shadow-lg ${color}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-white/10 group-hover/btn:bg-white/20 rounded-xl text-white transition-colors">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <span className="font-black text-[10px] text-white uppercase tracking-widest group-hover/btn:scale-105 transition-transform">
                                            {label}
                                        </span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-white/40 group-hover/btn:text-white transition-all transform group-hover/btn:translate-x-1" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="space-y-6">
                    <div className="bg-[#001a33] rounded-[32px] shadow-2xl border border-white/5 p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full -ml-16 -mt-16"></div>
                        <div className="relative z-10">
                            <h2 className="text-sm font-black text-orange-400 mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                Stok Menipis
                            </h2>
                            <LowStockList />
                        </div>
                    </div>

                    {/* Active Banners Count */}
                    <Link href="/admin/banners"
                        className="flex items-center gap-4 p-6 bg-[#001a33] rounded-[28px] border border-white/5 hover:border-blue-500/30 transition-all group"
                    >
                        <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                            <ImageIcon className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Banner Aktif</p>
                            <p className="text-2xl font-black text-white mt-0.5">{activeBanners}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

async function LowStockList() {
    const lowStock = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, stock: { lte: 10 } },
        orderBy: { stock: 'asc' },
        take: 6,
        select: { id: true, name: true, stock: true, slug: true },
    });

    if (lowStock.length === 0) {
        return (
            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">
                Semua produk memiliki stok yang cukup.
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {lowStock.map((p) => (
                <Link key={p.id} href={`/admin/products/${p.id}/edit`} className="flex items-center justify-between hover:bg-white/5 px-3 py-2 rounded-xl transition-all group">
                    <p className="text-[11px] font-bold text-gray-300 uppercase tracking-tight truncate max-w-[200px] group-hover:text-white transition-colors">
                        {p.name}
                    </p>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-xl ${p.stock === 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {p.stock === 0 ? 'Habis' : `${p.stock} unit`}
                    </span>
                </Link>
            ))}
        </div>
    );
}
