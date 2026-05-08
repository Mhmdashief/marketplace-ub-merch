'use client';

import { useState, useTransition } from "react";
import { User, ArrowLeft, Mail, Shield, Lock, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/actions/user";

export default function NewUserPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            try {
                await createUser(formData);
                router.push("/admin/users");
            } catch (err: any) {
                setError(err.message || "Something went wrong. Please try again.");
            }
        });
    };

    return (
        <div className="space-y-10 animate-fade-in py-2 pb-20">
            <form onSubmit={handleSubmit}>
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href="/admin/users" className="p-2 bg-white/5 hover:bg-ub-gold hover:text-white rounded-xl transition-all mr-2 border border-white/5">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Permissions</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                            Create <span className="text-white/10">/</span> New Admin
                        </h1>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-ub-gold hover:bg-ub-gold/90 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-ub-gold/20 active:scale-95 group disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isPending ? "Saving..." : "Save Account"}
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl mb-8">
                        <p className="text-xs font-black text-rose-500 uppercase tracking-widest text-center">{error}</p>
                    </div>
                )}

                <div className="max-w-4xl mx-auto">
                    <div className="space-y-8">
                        <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-8">
                            <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Account Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="EX: JOHN DOE..."
                                            className="w-full pl-14 pr-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="ADMIN@UBMERCH.COM..."
                                            className="w-full pl-14 pr-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            placeholder="STRENGTHEN YOUR ACCESS..."
                                            className="w-full pl-14 pr-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Role Permission</label>
                                    <div className="relative">
                                        <Shield className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                                        <select
                                            name="role"
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-black/20 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="ADMIN" className="bg-[#001a33]">ADMIN</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
