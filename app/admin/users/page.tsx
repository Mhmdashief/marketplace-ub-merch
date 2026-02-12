// app/admin/users/page.tsx
import { prisma } from "@/lib/prisma";
import UsersTable from "@/components/admin/UsersTable";
import { Users as UsersIcon } from "lucide-react";

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
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                            <UsersIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Manage all users and their permissions
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                        <p className="text-sm text-gray-500">Total Users</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <UsersTable users={users} />
            </div>
        </div>
    );
}
