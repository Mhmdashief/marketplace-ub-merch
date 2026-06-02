'use server';

import { prisma } from '@/lib/prisma';

export async function getUserActivities(userId: string) {
    try {
        const activities = await prisma.clickTracking.findMany({
            orderBy: { clickedAt: 'desc' },
            take: 20,
            include: {
                product: {
                    select: {
                        name: true,
                        slug: true,
                    }
                }
            }
        });
        return { success: true, activities };
    } catch (error) {
        console.error('Error fetching activities:', error);
        return { success: false, error: 'Gagal mengambil data aktivitas' };
    }
}
