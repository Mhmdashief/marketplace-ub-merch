// app/admin/users/page.tsx
import { prisma } from "@/lib/prisma";
import UsersTable from "@/components/admin/UsersTable";
import { Users as UsersIcon, Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UsersPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/admin/login");
    }

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
                <div className="flex flex-row items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                    <div className="text-left sm:text-right">
                        <p className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter leading-none">{users.length}</p>
                        <p className="text-[8px] sm:text-[10px] text-ub-gold font-black uppercase tracking-widest mt-1">Global Users</p>
                    </div>
                    {session.user.role === "SUPER_ADMIN" && (
                        <Link
                            href="/admin/users/new"
                            className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-4 bg-ub-gold hover:bg-ub-gold/90 text-white rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-ub-gold/20 active:scale-95 group flex-1 sm:flex-none"
                        >
                            <Plus className="h-4 w-4" />
                            Create Admin
                        </Link>
                    )}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 overflow-hidden">
                <UsersTable 
                    users={users} 
                    currentUserRole={session.user.role as string}
                    currentUserId={session.user.id as string}
                />
            </div>
        </div>
    );
}
