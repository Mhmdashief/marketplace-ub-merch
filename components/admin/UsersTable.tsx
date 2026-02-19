// components/admin/UsersTable.tsx
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { MoreVertical, Shield, Ban, CheckCircle, UserCog, Trash2, Power, Eye, Loader2 } from "lucide-react";
import { toggleUserStatus, deleteUser } from "@/app/actions/user";
import { UserStatus } from "@prisma/client";
import Link from "next/link";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: Date;
    image: string | null;
}

interface UsersTableProps {
    users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isPending, startTransition] = useTransition();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleToggleStatus = (userId: string, currentStatus: any) => {
        setLoadingId(userId);
        startTransition(async () => {
            try {
                await toggleUserStatus(userId, currentStatus as UserStatus);
            } catch (error) {
                console.error("Failed to toggle status:", error);
            } finally {
                setLoadingId(null);
            }
        });
    };

    const handleDelete = (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        setLoadingId(userId);
        startTransition(async () => {
            try {
                await deleteUser(userId);
            } catch (error) {
                console.error("Failed to delete user:", error);
            } finally {
                setLoadingId(null);
            }
        });
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "SUPER_ADMIN":
                return "bg-rose-500/10 text-rose-400 border-rose-500/20 font-black tracking-widest";
            case "ADMIN":
                return "bg-ub-gold/10 text-ub-gold border-ub-gold/20 font-black tracking-widest";
            default:
                return "bg-white/5 text-gray-500 border-white/10 font-black tracking-widest";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black tracking-widest";
            case "SUSPENDED":
                return "bg-amber-500/10 text-amber-400 border-amber-500/20 font-black tracking-widest";
            case "BANNED":
                return "bg-rose-500/10 text-rose-400 border-rose-500/20 font-black tracking-widest";
            default:
                return "bg-white/5 text-gray-500 border-white/10 font-black tracking-widest";
        }
    };

    const getRoleIcon = (role: string) => {
        if (role === "SUPER_ADMIN" || role === "ADMIN") {
            return <Shield className="h-3 w-3 inline mr-2" />;
        }
        return <UserCog className="h-3 w-3 inline mr-2" />;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return <CheckCircle className="h-3 w-3 inline mr-2" />;
            case "BANNED":
                return <Ban className="h-3 w-3 inline mr-2" />;
            default:
                return null;
        }
    };

    return (
        <div className="p-8">
            {/* Search Bar */}
            <div className="mb-10">
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest text-white placeholder:text-gray-600 focus:ring-2 focus:ring-ub-gold outline-none transition-all shadow-xl"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2">
                    <thead>
                        <tr className="bg-black/20 uppercase tracking-[0.2em]">
                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-500">
                                Identity
                            </th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-500">
                                Contact
                            </th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-500">
                                Rank
                            </th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-500">
                                Status
                            </th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-500">
                                Registration
                            </th>
                            <th className="px-8 py-4 text-right text-[10px] font-black text-gray-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-transparent">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="group hover:scale-[1.01] transition-all duration-300">
                                <td className="px-8 py-6 bg-white/2 rounded-l-3xl group-hover:bg-white/5 transition-colors">
                                    <div className="flex items-center">
                                        {user.image ? (
                                            <Image
                                                className="h-10 w-10 rounded-full ring-2 ring-ub-gold/30"
                                                src={user.image}
                                                alt={user.name}
                                                width={40}
                                                height={40}
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-ub-navy to-black flex items-center justify-center text-white text-xs font-black ring-2 ring-ub-gold/30 uppercase">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="ml-4">
                                            <div className="text-sm font-black text-white uppercase italic group-hover:text-ub-gold transition-colors">
                                                {user.name}
                                            </div>
                                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter truncate max-w-[100px]">
                                                {user.id}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 bg-white/2 group-hover:bg-white/5 transition-colors">
                                    <div className="text-xs font-bold text-gray-400 lowercase">{user.email}</div>
                                </td>
                                <td className="px-8 py-6 bg-white/2 group-hover:bg-white/5 transition-colors">
                                    <span
                                        className={`px-3 py-1.5 inline-flex items-center text-[9px] uppercase rounded-lg border ${getRoleBadge(
                                            user.role
                                        )}`}
                                    >
                                        {getRoleIcon(user.role)}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6 bg-white/2 group-hover:bg-white/5 transition-colors">
                                    <span
                                        className={`px-3 py-1.5 inline-flex items-center text-[9px] uppercase rounded-lg border ${getStatusBadge(
                                            user.status
                                        )}`}
                                    >
                                        {getStatusIcon(user.status)}
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 bg-white/2 group-hover:bg-white/5 transition-colors text-[10px] font-black text-gray-500 uppercase">
                                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </td>
                                <td className="px-8 py-6 bg-white/2 rounded-r-3xl group-hover:bg-white/5 transition-colors text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(user.id, user.status)}
                                            disabled={isPending && loadingId === user.id}
                                            title={user.status === "ACTIVE" ? "Deactivate User" : "Activate User"}
                                            className={`p-3 rounded-xl transition-all border border-white/5 bg-white/5 disabled:opacity-50 ${user.status === "ACTIVE"
                                                ? "text-amber-500 hover:bg-amber-500 hover:text-white"
                                                : "text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                                }`}
                                        >
                                            {isPending && loadingId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            disabled={isPending && loadingId === user.id}
                                            title="Delete User"
                                            className="p-3 text-rose-500 hover:text-white hover:bg-rose-500 rounded-xl transition-all border border-white/5 bg-white/5 disabled:opacity-50"
                                        >
                                            {isPending && loadingId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                        </button>
                                        <Link
                                            href={`/admin/users/${user.id}`}
                                            title="View Details"
                                            className="p-3 text-gray-400 hover:text-white hover:bg-ub-gold rounded-xl transition-all border border-white/5 bg-white/5"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-20 bg-white/2 rounded-3xl border border-dashed border-white/5">
                    <p className="text-gray-600 font-black uppercase tracking-widest text-xs">No administrative entities found</p>
                </div>
            )}
        </div>
    );
}
