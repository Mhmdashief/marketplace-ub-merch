// app/admin/users/page.tsx
import { prisma } from "@/lib/prisma";
import UsersTable from "@/components/admin/UsersTable";
import { Users as UsersIcon, Plus } from "lucide-react";
import Link from "next/link";

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            image: true,
        },
    });

    return (
        <div className="space-y-10 py-2">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-ub-gold rounded-[24px] shadow-xl shadow-ub-gold/20">
                        <UsersIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-[2px] bg-ub-gold"></div>
                            <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">
                                Permissions
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                            Users <span className="text-white/10">/</span> Hub
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-4xl font-black text-white italic tracking-tighter">{users.length}</p>
                        <p className="text-[10px] text-ub-gold font-black uppercase tracking-widest">Global Users</p>
                    </div>
                    <Link
                        href="/admin/users/new"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-ub-gold hover:bg-ub-gold/90 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-ub-gold/20 active:scale-95 group"
                    >
                        <Plus className="h-4 w-4" />
                        Create Admin
                    </Link>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 overflow-hidden">
                <UsersTable users={users} />
            </div>
        </div>
    );
}
