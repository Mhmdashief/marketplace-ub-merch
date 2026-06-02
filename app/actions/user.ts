'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { UserStatus } from "@prisma/client";
import { auth } from "@/lib/auth";

export async function createUser(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized: Only Super Admin can create users");
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        throw new Error("Missing required fields");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "ADMIN",
            status: UserStatus.ACTIVE,
        },
    });

    revalidatePath("/admin/users");
}

export async function toggleUserStatus(userId: string, currentStatus: UserStatus) {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized: Only Super Admin can toggle user status");
    }

    if (session.user.id === userId) {
        throw new Error("Cannot change your own status");
    }

    const newStatus = currentStatus === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;

    await prisma.user.update({
        where: { id: userId },
        data: { status: newStatus },
    });

    revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized: Only Super Admin can delete users");
    }

    if (session.user.id === userId) {
        throw new Error("Cannot delete your own account");
    }

    await prisma.user.delete({
        where: { id: userId },
    });

    revalidatePath("/admin/users");
}

export async function checkAdminEmail(email: string): Promise<{ success: boolean; error?: string }> {
    if (!email) {
        return { success: false, error: 'Email wajib diisi.' };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { status: true, role: true }
        });

        if (!user) {
            return { success: false, error: 'Email tidak terdaftar atau tidak memiliki akses admin.' };
        }

        if (user.status !== 'ACTIVE') {
            return { success: false, error: 'Akun Anda sedang diblokir atau dinonaktifkan.' };
        }

        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            return { success: false, error: 'Akun Anda tidak memiliki akses untuk admin panel.' };
        }

        return { success: true };
    } catch (err) {
        console.error('[checkAdminEmail] Error:', err);
        return { success: false, error: 'Terjadi kesalahan pada server.' };
    }
}
