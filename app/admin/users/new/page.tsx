'use client';

import { useState, useTransition } from "react";
import { User, ArrowLeft, Mail, Shield, Lock, Upload, X, Save, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/actions/user";

export default function NewUserPage() {
    const router = useRouter();
    const [image, setImage] = useState<File | null>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column - User Details */}
                    <div className="lg:col-span-2 space-y-8">
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
                                            <option value="SUPER_ADMIN" className="bg-[#001a33]">SUPER ADMIN</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6">
                            <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Security Settings</h2>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-6 h-6 rounded-lg border-white/20 bg-transparent text-ub-gold focus:ring-ub-gold focus:ring-offset-0 transition-all"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black text-white uppercase tracking-widest">Require Password Change</span>
                                        <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest italic">User will be forced to change password on first login.</span>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-6 h-6 rounded-lg border-white/20 bg-transparent text-ub-gold focus:ring-ub-gold focus:ring-offset-0 transition-all"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black text-white uppercase tracking-widest">Send Invite Email</span>
                                        <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest italic">Send account credentials to the specified email address.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Avatar & Identity */}
                    <div className="space-y-8">
                        <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-ub-gold/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-ub-gold/20 transition-colors duration-500"></div>
                            <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-4 relative z-10">Profile Identity</h2>

                            <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
                                <div className="relative group/avatar">
                                    <div className="h-40 w-40 rounded-[40px] bg-black/40 border-2 border-dashed border-white/5 flex items-center justify-center overflow-hidden group-hover/avatar:border-ub-gold transition-all duration-500">
                                        {image ? (
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <Upload className="h-10 w-10 text-gray-700 mx-auto mb-2 group-hover/avatar:text-ub-gold transition-colors" />
                                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Upload Avatar</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                    />
                                    {image && (
                                        <button
                                            type="button"
                                            onClick={() => setImage(null)}
                                            className="absolute -top-2 -right-2 p-2 bg-rose-500 text-white rounded-xl shadow-lg hover:scale-110 transition-transform z-20"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Avatar Specification</p>
                                    <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">JPG, PNG OR WEBP. MAX 2MB.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
