'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { $Enums } from '@prisma/client';

type MarketplacePlatform = $Enums.MarketplacePlatform;

export type MarketplaceLinkInput = {
    platform: MarketplacePlatform;
    url: string;
    isActive: boolean;
};
export async function upsertMarketplaceLinks(
    productId: string,
    links: MarketplaceLinkInput[]
) {
    const platforms = links.map((l) => l.platform);
    await prisma.marketplaceLink.deleteMany({
        where: { productId, platform: { notIn: platforms } },
    });

    for (const link of links) {
        if (!link.url.trim()) {
            await prisma.marketplaceLink.deleteMany({
                where: { productId, platform: link.platform },
            });
            continue;
        }
        await prisma.marketplaceLink.upsert({
            where: { productId_platform: { productId, platform: link.platform } },
            update: { url: link.url.trim(), isActive: link.isActive },
            create: {
                productId,
                platform: link.platform,
                url: link.url.trim(),
                isActive: link.isActive,
            },
        });
    }

    revalidatePath('/admin/products');
    revalidatePath('/merchandise');
    return { success: true };
}

export async function getMarketplaceLinksByProductId(productId: string) {
    return prisma.marketplaceLink.findMany({
        where: { productId, isActive: true },
        orderBy: { platform: 'asc' },
    });
}

export async function trackMarketplaceClick(
    productId: string,
    platform: MarketplacePlatform,
    marketplaceLinkId?: string
) {
    await prisma.clickTracking.create({
        data: {
            productId,
            platform,
            marketplaceLinkId: marketplaceLinkId ?? null,
        },
    });
}

export async function getClickAnalytics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalClicks, clicksByPlatform, topProducts, recentClicks] = await Promise.all([
        prisma.clickTracking.count({
            where: { clickedAt: { gte: thirtyDaysAgo } },
        }),
        prisma.clickTracking.groupBy({
            by: ['platform'],
            _count: { platform: true },
            where: { clickedAt: { gte: thirtyDaysAgo } },
            orderBy: { _count: { platform: 'desc' } },
        }),
        prisma.clickTracking.groupBy({
            by: ['productId'],
            _count: { productId: true },
            where: { clickedAt: { gte: thirtyDaysAgo } },
            orderBy: { _count: { productId: 'desc' } },
            take: 5,
        }),
        prisma.clickTracking.findMany({
            where: { clickedAt: { gte: sevenDaysAgo } },
            select: { clickedAt: true, platform: true },
            orderBy: { clickedAt: 'asc' },
        }),
    ]);

    const productIds = topProducts.map((p) => p.productId);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, assets: { select: { id: true }, take: 1 } },
    });

    const topProductsWithName = topProducts.map((tp) => {
        const product = products.find((p) => p.id === tp.productId);
        return {
            productId: tp.productId,
            name: product?.name ?? 'Unknown',
            image: product?.assets[0] ? `/api/assets/${product.assets[0].id}` : null,
            clicks: tp._count.productId,
        };
    });

    const dailyClicks: { date: string; clicks: number }[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const count = recentClicks.filter(
            (c) => c.clickedAt.toISOString().startsWith(dateStr)
        ).length;
        dailyClicks.push({ date: dateStr, clicks: count });
    }

    return {
        totalClicks,
        clicksByPlatform: clicksByPlatform.map((c) => ({
            platform: c.platform,
            clicks: c._count.platform,
        })),
        topProducts: topProductsWithName,
        dailyClicks,
    };
}

export async function getProductsWithoutMarketplaceLinks() {
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            deletedAt: null,
            marketplaceLinks: { none: {} },
        },
        select: { id: true, name: true, slug: true },
        take: 10,
    });
    return products;
}
