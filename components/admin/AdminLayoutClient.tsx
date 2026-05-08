"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

interface AdminLayoutClientProps {
    user: any;
    children: React.ReactNode;
}

export default function AdminLayoutClient({ user, children }: AdminLayoutClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#000d1a]">
            <AdminSidebar isMobileOpen={isSidebarOpen} setIsMobileOpen={setIsSidebarOpen} />
            <div className="lg:pl-64">
                <AdminNavbar user={user} onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="py-6 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
