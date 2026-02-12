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
    Settings,
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
        name: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
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
                <div className="flex flex-col flex-grow bg-gradient-to-b from-blue-900 to-blue-800 pt-5 pb-4 overflow-y-auto shadow-xl">
                    <div className="flex items-center flex-shrink-0 px-6">
                        <h1 className="text-2xl font-bold text-white">
                            UB Merch Admin
                        </h1>
                    </div>
                    <nav className="mt-8 flex-1 px-3 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                    group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive
                                            ? "bg-blue-700 text-white shadow-lg"
                                            : "text-blue-100 hover:bg-blue-700/50 hover:text-white"
                                        }
                  `}
                                >
                                    <Icon
                                        className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-blue-300"
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
