"use client";

import { Search, Menu, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface AdminNavbarProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role: string;
    };
}

export default function AdminNavbar({ user }: AdminNavbarProps) {
    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow-sm">
            <button
                type="button"
                className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
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
                            <p className="text-sm font-medium text-gray-700">{user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                        {user.image ? (
                            <Image
                                className="h-10 w-10 rounded-full ring-2 ring-blue-500"
                                src={user.image}
                                alt={user.name || "User"}
                                width={40}
                                height={40}
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold ring-2 ring-blue-500">
                                {user.name?.charAt(0).toUpperCase() || "A"}
                            </div>
                        )}
                        <button
                            onClick={handleSignOut}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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
