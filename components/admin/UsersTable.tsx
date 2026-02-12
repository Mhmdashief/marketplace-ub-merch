// components/admin/UsersTable.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical, Shield, Ban, CheckCircle, UserCog } from "lucide-react";

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

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "SUPER_ADMIN":
                return "bg-red-100 text-red-800 border-red-200";
            case "ADMIN":
                return "bg-purple-100 text-purple-800 border-purple-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-100 text-green-800 border-green-200";
            case "SUSPENDED":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "BANNED":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getRoleIcon = (role: string) => {
        if (role === "SUPER_ADMIN" || role === "ADMIN") {
            return <Shield className="h-4 w-4 inline mr-1" />;
        }
        return <UserCog className="h-4 w-4 inline mr-1" />;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return <CheckCircle className="h-4 w-4 inline mr-1" />;
            case "BANNED":
                return <Ban className="h-4 w-4 inline mr-1" />;
            default:
                return null;
        }
    };

    return (
        <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {user.image ? (
                                            <Image
                                                className="h-10 w-10 rounded-full ring-2 ring-gray-200"
                                                src={user.image}
                                                alt={user.name}
                                                width={40}
                                                height={40}
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold ring-2 ring-gray-200">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${getRoleBadge(
                                            user.role
                                        )}`}
                                    >
                                        {getRoleIcon(user.role)}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(
                                            user.status
                                        )}`}
                                    >
                                        {getStatusIcon(user.status)}
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No users found</p>
                </div>
            )}
        </div>
    );
}
