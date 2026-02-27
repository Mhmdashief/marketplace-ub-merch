'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function getUserProfile(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                status: true,
                createdAt: true,
                _count: {
                    select: {
                        orders: true,
                        addresses: true,
                    },
                },
            },
        });
        if (!user) return { success: false as const, error: 'User tidak ditemukan' };
        return { success: true as const, user };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return { success: false as const, error: 'Gagal mengambil data profil' };
    }
}

export async function updateUserProfile(
    userId: string,
    data: { name: string }
) {
    try {
        if (!data.name.trim()) {
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
                image: true,
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

export async function updateUserAvatar(userId: string, formData: FormData) {
    try {
        const file = formData.get('image') as File;
        if (!file || file.size === 0) return { success: false as const, error: 'File tidak valid' };
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `avatar-${userId}-${Date.now()}${path.extname(file.name)}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads');

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) { }

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        const imageUrl = `/uploads/${fileName}`;

        const user = await prisma.user.update({
            where: { id: userId },
            data: { image: imageUrl },
            select: { image: true }
        });

        revalidatePath('/profile');
        revalidatePath('/');
        return { success: true as const, image: user.image };
    } catch (error) {
        console.error('Error uploading avatar:', error);
        return { success: false as const, error: 'Gagal mengupload foto' };
    }
}

export async function changeUserPassword(
    userId: string,
    data: { currentPassword: string; newPassword: string }
) {
    try {
        if (data.newPassword.length < 8) {
            return { success: false as const, error: 'Password minimal 8 karakter' };
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true },
        });

        if (!user) return { success: false as const, error: 'User tidak ditemukan' };

        if (user.password) {
            const isMatch = await bcrypt.compare(data.currentPassword, user.password);
            if (!isMatch) {
                return { success: false as const, error: 'Password saat ini tidak sesuai' };
            }
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

export async function softDeleteAccount(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { status: 'DELETED' },
        });

        revalidatePath('/');
        return { success: true as const };
    } catch (error) {
        console.error('Error soft deleting account:', error);
        return { success: false as const, error: 'Gagal menonaktifkan akun' };
    }
}
