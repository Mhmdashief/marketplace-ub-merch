'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { auth } from '@/lib/auth';

export async function getUserProfile() {
    try {
        const session = await auth();
        if (!session) {
            return { success: false as const, error: 'Anda belum login' };
        }

        const userId = session.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
            },
        });

        if (!user) {
            return { success: false as const, error: 'User tidak ditemukan' };
        }

        return { success: true as const, user };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return { success: false as const, error: 'Gagal mengambil data profil' };
    }
}

// =============================
// UPDATE USER PROFILE
// =============================
export async function updateUserProfile(
    data: { name: string }
) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false as const, error: 'Anda belum login' };
        }

        const userId = session.user.id;

        if (!data.name || !data.name.trim()) {
            return { success: false as const, error: 'Nama tidak boleh kosong' };
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name.trim(),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        revalidatePath('/profile');

        return { success: true as const, user };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false as const, error: 'Gagal mengupdate profil' };
    }
}

// =============================
// CHANGE PASSWORD
// =============================
export async function changeUserPassword(
    data: { currentPassword: string; newPassword: string }
) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false as const, error: 'Anda belum login' };
        }

        const userId = session.user.id;

        // ✅ validasi input dulu
        if (!data.currentPassword || !data.newPassword) {
            return { success: false as const, error: 'Semua field harus diisi' };
        }

        if (data.newPassword.length < 8) {
            return { success: false as const, error: 'Password minimal 8 karakter' };
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true },
        });

        if (!user) {
            return { success: false as const, error: 'User tidak ditemukan' };
        }

        const isMatch = await bcrypt.compare(data.currentPassword, user.password);
        if (!isMatch) {
            return { success: false as const, error: 'Password saat ini tidak sesuai' };
        }

        const hashed = await bcrypt.hash(data.newPassword, 12);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashed },
        });

        return { success: true as const };
    } catch (error) {
        console.error('Error changing password:', error);
        return { success: false as const, error: 'Gagal mengubah password' };
    }
}

// =============================
// SOFT DELETE (INACTIVE)
// =============================
export async function softDeleteAccount() {
    try {
        const session = await auth();
        if (!session) {
            return { success: false as const, error: 'Anda belum login' };
        }

        const userId = session.user.id;

        await prisma.user.update({
            where: { id: userId },
            data: { status: 'INACTIVE' },
        });

        revalidatePath('/');

        return { success: true as const };
    } catch (error) {
        console.error('Error soft deleting account:', error);
        return { success: false as const, error: 'Gagal menonaktifkan akun' };
    }
}