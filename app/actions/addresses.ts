'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type UserAddressData = {
    label: string;
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    isDefault?: boolean;
};
export async function getUserAddresses(userId: string) {
    try {
        const addresses = await prisma.userAddress.findMany({
            where: { userId },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
        });
        return { success: true, addresses };
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return { success: false, error: 'Gagal mengambil data alamat' };
    }
}

export async function addUserAddress(userId: string, data: UserAddressData) {
    try {
        if (data.isDefault) {
            await prisma.userAddress.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        const existingCount = await prisma.userAddress.count({ where: { userId } });
        const shouldBeDefault = existingCount === 0 ? true : (data.isDefault ?? false);

        const address = await prisma.userAddress.create({
            data: {
                userId,
                label: data.label,
                recipientName: data.recipientName,
                phone: data.phone,
                address: data.address,
                city: data.city,
                province: data.province,
                postalCode: data.postalCode,
                isDefault: shouldBeDefault,
            },
        });

        revalidatePath('/profile');
        return { success: true, address };
    } catch (error) {
        console.error('Error adding address:', error);
        return { success: false, error: 'Gagal menambah alamat' };
    }
}

export async function updateUserAddress(userId: string, addressId: string, data: UserAddressData) {
    try {
        const existing = await prisma.userAddress.findFirst({ where: { id: addressId, userId } });
        if (!existing) return { success: false, error: 'Alamat tidak ditemukan' };

        if (data.isDefault) {
            await prisma.userAddress.updateMany({
                where: { userId, isDefault: true, NOT: { id: addressId } },
                data: { isDefault: false },
            });
        }

        const address = await prisma.userAddress.update({
            where: { id: addressId },
            data: {
                label: data.label,
                recipientName: data.recipientName,
                phone: data.phone,
                address: data.address,
                city: data.city,
                province: data.province,
                postalCode: data.postalCode,
                isDefault: data.isDefault ?? existing.isDefault,
            },
        });

        revalidatePath('/profile');
        return { success: true, address };
    } catch (error) {
        console.error('Error updating address:', error);
        return { success: false, error: 'Gagal mengupdate alamat' };
    }
}

export async function deleteUserAddress(userId: string, addressId: string) {
    try {
        const existing = await prisma.userAddress.findFirst({ where: { id: addressId, userId } });
        if (!existing) return { success: false, error: 'Alamat tidak ditemukan' };

        await prisma.userAddress.delete({ where: { id: addressId } });

        if (existing.isDefault) {
            const firstRemaining = await prisma.userAddress.findFirst({
                where: { userId },
                orderBy: { createdAt: 'asc' },
            });
            if (firstRemaining) {
                await prisma.userAddress.update({
                    where: { id: firstRemaining.id },
                    data: { isDefault: true },
                });
            }
        }

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Error deleting address:', error);
        return { success: false, error: 'Gagal menghapus alamat' };
    }
}

export async function setDefaultAddress(userId: string, addressId: string) {
    try {
        await prisma.userAddress.updateMany({
            where: { userId },
            data: { isDefault: false },
        });
        await prisma.userAddress.update({
            where: { id: addressId },
            data: { isDefault: true },
        });

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Error setting default address:', error);
        return { success: false, error: 'Gagal mengatur alamat default' };
    }
}
