'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleWishlist(userId: string, productId: string) {
    try {
        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_productId: { userId, productId }
            }
        });

        if (existing) {
            await prisma.wishlist.delete({
                where: { id: existing.id }
            });
            revalidatePath('/profile');
            revalidatePath('/merchandise');
            return { success: true, added: false };
        } else {
            await prisma.wishlist.create({
                data: { userId, productId }
            });
            revalidatePath('/profile');
            revalidatePath('/merchandise');
            return { success: true, added: true };
        }
    } catch (error) {
        console.error('Error toggling wishlist:', error);
        return { success: false, error: 'Gagal mengubah wishlist' };
    }
}

export async function getUserWishlists(userId: string) {
    try {
        const wishlists = await prisma.wishlist.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        regularPrice: true,
                        discountPrice: true,
                        stock: true,
                        assets: { select: { url: true }, take: 1 }
                    }
                }
            }
        });
        return { success: true, wishlists };
    } catch (error) {
        console.error('Error fetching wishlists:', error);
        return { success: false, error: 'Gagal mengambil data wishlist' };
    }
}

export async function checkIsWishlisted(userId: string, productId: string) {
    try {
        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_productId: { userId, productId }
            }
        });
        return { success: true, isWishlisted: !!existing };
    } catch (error) {
        return { success: false, error: 'Gagal cek wishlist' };
    }
}
