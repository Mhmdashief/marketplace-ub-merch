import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Shield,
    Mail,
    Calendar,
    User,
    Hash,
    Phone,
    MapPin,
    ShoppingBag,
    Clock,
    CheckCircle,
    Ban,
    History
} from "lucide-react";
import Image from "next/image";

export default async function UserDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    const user = await prisma.user.findUnique({
        where: { id: id },
    });

    if (!user) {
        notFound();
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "INACTIVE":
                return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            default:
                return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        }
    };

    return (
        <div className="space-y-10 animate-fade-in py-2 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin/users" className="p-2 bg-white/5 hover:bg-ub-gold hover:text-white rounded-xl transition-all mr-2 border border-white/5">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Directory</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Account <span className="text-white/10">/</span> Overview
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column - Essential Info */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Profile Card */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-ub-gold/5 blur-3xl rounded-full -mr-16 -mt-16"></div>

                        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-[40px] bg-gradient-to-br from-ub-navy to-black flex items-center justify-center text-4xl font-black text-white ring-4 ring-ub-gold/20 shadow-2xl uppercase italic">
                                    {user.name.charAt(0)}
                                </div>
                                <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest shadow-xl shadow-black/40 ${getStatusStyles(user.status)}`}>
                                    {user.status}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{user.name}</h2>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">{user.role}</p>
                            </div>

                            <div className="w-full pt-6 border-t border-white/5 flex flex-col gap-4">
                                <div className="flex items-center justify-between px-4">
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Global ID</span>
                                    <span className="text-[9px] font-mono text-white/40">{user.id}</span>
                                </div>
                                <div className="flex items-center justify-between px-4">
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Joined</span>
                                    <span className="text-[9px] font-black text-white uppercase">{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact details */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6">
                        <h3 className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em] mb-4">Contact Intelligence</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-ub-gold/10 transition-colors border border-white/5">
                                    <Mail className="h-4 w-4 text-gray-500 group-hover:text-ub-gold" />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Primary Email</p>
                                    <p className="text-[11px] font-bold text-white lowercase">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-ub-gold/10 transition-colors border border-white/5">
                                    <Shield className="h-4 w-4 text-gray-500 group-hover:text-ub-gold" />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Account Type</p>
                                    <p className="text-[11px] font-bold text-white uppercase tracking-widest">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Tabs & Complex Data */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#001a33] rounded-[40px] p-8 border border-white/5 shadow-2xl group hover:border-ub-gold/20 transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic group-hover:text-blue-400 transition-colors">Lifetime</span>
                            </div>
                            <h4 className="text-4xl font-black text-white italic tracking-tighter">0</h4>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-2">Total Acquisitions</p>
                        </div>
                        <div className="bg-[#001a33] rounded-[40px] p-8 border border-white/5 shadow-2xl group hover:border-ub-gold/20 transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                                    <History className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic group-hover:text-emerald-400 transition-colors">Stability</span>
                            </div>
                            <h4 className="text-4xl font-black text-white italic tracking-tighter">100%</h4>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-2">Account Health</p>
                        </div>
                    </div>

                    {/* Timeline / Activity */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">Activity Stream</h3>
                            <Clock className="h-4 w-4 text-gray-700" />
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                    <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                                    </div>
                                    <div className="w-[1.5px] h-12 bg-white/5"></div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Account Created Successfully</p>
                                    <p className="text-[9px] font-bold text-gray-600 uppercase mt-1">{new Date(user.createdAt).toLocaleDateString()} at {new Date(user.createdAt).toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 opacity-40">
                                <div className="flex flex-col items-center">
                                    <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                        <History className="h-3 w-3 text-gray-500" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">No further activity logged</p>
                                    <p className="text-[9px] font-bold text-gray-600 uppercase mt-1">Status: Operational</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
