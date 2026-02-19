// components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    FolderTree,
    FileText,
} from "lucide-react";

const menuItems = [
    {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Products",
        href: "/admin/products",
        icon: Package,
    },
    {
        name: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        name: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        name: "Reports",
        href: "/admin/reports",
        icon: FileText,
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <>
            {/* Sidebar untuk desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-[#001a33] pt-5 pb-4 overflow-y-auto shadow-2xl border-r border-white/5">
                    <div className="flex items-center flex-shrink-0 px-6 mb-10">
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black text-white tracking-widest uppercase">
                                UB MERCH
                            </h1>
                            <span className="text-[10px] text-ub-gold font-bold tracking-[0.2em] -mt-1 uppercase">Admin Panel</span>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        group flex items-center px-4 py-3.5 text-xs font-bold rounded-2xl transition-all duration-300 uppercase tracking-wider
                                        ${isActive
                                            ? "bg-ub-gold text-white shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-[1.02]"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }
                                    `}
                                >
                                    <Icon
                                        className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"
                                            }`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Mobile sidebar - akan ditambahkan nanti dengan state management */}
        </>
    );
}
