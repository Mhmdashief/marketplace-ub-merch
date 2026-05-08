'use client';

import { motion } from 'framer-motion';
import {
    BarChart2, MousePointerClick, TrendingUp,
    AlertTriangle, ExternalLink, ShoppingBag, Package,
} from 'lucide-react';
import Link from 'next/link';

const PLATFORM_CONFIG: Record<string, { label: string; color: string; bgColor: string; emoji: string }> = {
    TOKOPEDIA: { label: 'Tokopedia', color: 'text-green-400', bgColor: 'bg-green-500/20', emoji: '🟢' },
    SHOPEE: { label: 'Shopee', color: 'text-orange-400', bgColor: 'bg-orange-500/20', emoji: '🟠' },
    LAZADA: { label: 'Lazada', color: 'text-blue-400', bgColor: 'bg-blue-500/20', emoji: '🔵' },
    TIKTOK: { label: 'TikTok Shop', color: 'text-pink-400', bgColor: 'bg-pink-500/20', emoji: '🎵' },
    BUKALAPAK: { label: 'Bukalapak', color: 'text-rose-400', bgColor: 'bg-rose-500/20', emoji: '🔴' },
    OFFICIAL_WEBSITE: { label: 'Official Website', color: 'text-ub-gold', bgColor: 'bg-ub-gold/20', emoji: '⭐' },
};

type Analytics = {
    totalClicks: number;
    clicksByPlatform: { platform: string; clicks: number }[];
    topProducts: { productId: string; name: string; image: string | null; clicks: number }[];
    dailyClicks: { date: string; clicks: number }[];
};

interface AnalyticsClientProps {
    analytics: Analytics;
    noLinkProducts: { id: string; name: string; slug: string }[];
}

export default function AnalyticsClient({ analytics, noLinkProducts }: AnalyticsClientProps) {
    const { totalClicks, clicksByPlatform, topProducts, dailyClicks } = analytics;

    const maxDailyClicks = Math.max(...dailyClicks.map((d) => d.clicks), 1);
    const maxPlatformClicks = Math.max(...clicksByPlatform.map((p) => p.clicks), 1);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="space-y-10 animate-fade-in py-2">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-[2px] bg-ub-gold" />
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Intelligence</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Analytics <span className="text-white/10">/</span> Reports
                    </h1>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-2">
                        Data 30 hari terakhir · Klik ke marketplace
                    </p>
                </div>
            </div>

            {/* Alert: Produk tanpa marketplace link */}
            {noLinkProducts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-orange-500/10 border border-orange-500/20 rounded-[28px] p-6"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-500/20 rounded-2xl flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[11px] font-black text-orange-400 uppercase tracking-widest mb-2">
                                {noLinkProducts.length} Produk Belum Punya Link Marketplace
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {noLinkProducts.map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/admin/products/${p.id}/edit`}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-xl text-[9px] font-black text-orange-300 uppercase tracking-widest transition-all"
                                    >
                                        <ExternalLink className="h-2.5 w-2.5" />
                                        {p.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    {
                        label: 'Total Klik (30 hari)',
                        value: totalClicks.toLocaleString('id-ID'),
                        icon: MousePointerClick,
                        color: 'text-ub-gold',
                        bg: 'bg-ub-gold/10',
                    },
                    {
                        label: 'Platform Aktif',
                        value: clicksByPlatform.length.toString(),
                        icon: ShoppingBag,
                        color: 'text-blue-400',
                        bg: 'bg-blue-500/10',
                    },
                    {
                        label: 'Produk Tak Punya Link',
                        value: noLinkProducts.length.toString(),
                        icon: AlertTriangle,
                        color: noLinkProducts.length > 0 ? 'text-orange-400' : 'text-emerald-400',
                        bg: noLinkProducts.length > 0 ? 'bg-orange-500/10' : 'bg-emerald-500/10',
                    },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className="bg-[#001a33] rounded-[28px] border border-white/5 p-6 flex items-center gap-4"
                        >
                            <div className={`p-4 rounded-2xl ${stat.bg} flex-shrink-0`}>
                                <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{stat.label}</p>
                                <p className={`text-3xl font-black ${stat.color} mt-1`}>{stat.value}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Daily Click Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-[#001a33] rounded-[32px] border border-white/5 p-8"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-ub-gold/10 rounded-xl">
                            <TrendingUp className="h-5 w-5 text-ub-gold" />
                        </div>
                        <div>
                            <h2 className="text-[11px] font-black text-white uppercase tracking-widest">Klik Per Hari</h2>
                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">7 hari terakhir</p>
                        </div>
                    </div>

                    {totalClicks === 0 ? (
                        <div className="text-center py-10">
                            <BarChart2 className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Belum ada data klik</p>
                        </div>
                    ) : (
                        <div className="flex items-end gap-2 h-40">
                            {dailyClicks.map((day, i) => {
                                const heightPct = maxDailyClicks > 0 ? (day.clicks / maxDailyClicks) * 100 : 0;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <span className="text-[8px] font-black text-gray-600">
                                            {day.clicks > 0 ? day.clicks : ''}
                                        </span>
                                        <div className="w-full relative" style={{ height: '100px' }}>
                                            <div
                                                className="absolute bottom-0 w-full rounded-t-lg bg-ub-gold/20 hover:bg-ub-gold/40 transition-all"
                                                style={{ height: `${Math.max(heightPct, 4)}%` }}
                                                title={`${day.clicks} klik`}
                                            />
                                        </div>
                                        <span className="text-[7px] font-bold text-gray-600 uppercase">
                                            {formatDate(day.date)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>

                {/* Platform Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-[#001a33] rounded-[32px] border border-white/5 p-8"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-blue-500/10 rounded-xl">
                            <ShoppingBag className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-[11px] font-black text-white uppercase tracking-widest">Klik Per Platform</h2>
                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">30 hari terakhir</p>
                        </div>
                    </div>

                    {clicksByPlatform.length === 0 ? (
                        <div className="text-center py-10">
                            <ShoppingBag className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Belum ada data klik</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {clicksByPlatform.map((item, i) => {
                                const config = PLATFORM_CONFIG[item.platform] ?? {
                                    label: item.platform, color: 'text-gray-400', bgColor: 'bg-gray-500/20', emoji: '🔗',
                                };
                                const widthPct = (item.clicks / maxPlatformClicks) * 100;
                                return (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{config.emoji}</span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                                                    {config.label}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-black text-white">
                                                {item.clicks.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${widthPct}%` }}
                                                transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }}
                                                className={`h-full rounded-full ${config.bgColor}`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Top Products */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-[#001a33] rounded-[32px] border border-white/5 p-8"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-purple-500/10 rounded-xl">
                        <Package className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-[11px] font-black text-white uppercase tracking-widest">Top Produk Diklik</h2>
                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">30 hari terakhir — 5 teratas</p>
                    </div>
                </div>

                {topProducts.length === 0 ? (
                    <div className="text-center py-10">
                        <Package className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Belum ada data klik produk</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {topProducts.map((product, i) => (
                            <div key={product.productId} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                                <span className="text-2xl font-black text-white/20 w-8 text-center flex-shrink-0">
                                    {i + 1}
                                </span>
                                {product.image && (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded-xl flex-shrink-0"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-black text-white uppercase tracking-tight truncate">
                                        {product.name}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <MousePointerClick className="h-3.5 w-3.5 text-ub-gold" />
                                    <span className="text-[12px] font-black text-ub-gold">
                                        {product.clicks.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <Link
                                    href={`/admin/products/${product.productId}/edit`}
                                    className="p-2 bg-white/5 hover:bg-ub-gold hover:text-white text-gray-500 rounded-xl transition-all"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
