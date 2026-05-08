"use client";

import { Search, Menu, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface AdminNavbarProps {
    user: {
        name?: string | null;
        email?: string | null;
        role: string;
    };
    onMenuClick?: () => void;
}

export default function AdminNavbar({ user, onMenuClick }: AdminNavbarProps) {
    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/admin/login" });
    };

    return (
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-[#001a33] shadow-lg border-b border-white/5">
            <button
                type="button"
                onClick={onMenuClick}
                className="border-r border-white/5 px-4 text-gray-400 hover:text-white focus:outline-none lg:hidden"
            >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" />
            </button>
            <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1">
                </div>
                <div className="ml-4 flex items-center gap-4">
                    {/* Profile dropdown */}
                    <div className="relative flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white uppercase tracking-wider">{user.name}</p>
                            <p className="text-[10px] text-ub-gold font-black uppercase tracking-[0.1em]">{user.role}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-ub-navy to-ub-dark-navy flex items-center justify-center text-white font-bold ring-2 ring-ub-gold uppercase">
                            {user.name?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                            title="Sign out"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
