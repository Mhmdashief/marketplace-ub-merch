import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { $Enums } from '@prisma/client';
import { auth } from '@/lib/auth';

type MarketplacePlatform = $Enums.MarketplacePlatform;

const VALID_PLATFORMS: MarketplacePlatform[] = [
    'TOKOPEDIA', 'SHOPEE',
];

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        const body = await req.json();
        const { productId, platform, marketplaceLinkId } = body;

        if (!productId || typeof productId !== 'string') {
            return NextResponse.json({ error: 'productId required' }, { status: 400 });
        }
        if (!platform || !VALID_PLATFORMS.includes(platform as MarketplacePlatform)) {
            return NextResponse.json({ error: 'platform tidak valid' }, { status: 400 });
        }

        // Verify product exists
        const product = await prisma.product.findUnique({
            where: { id: productId, isActive: true, deletedAt: null },
            select: { id: true },
        });

        if (!product) {
            return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
        }

        // Get redirect URL from marketplace link
        let redirectUrl: string | null = null;
        if (marketplaceLinkId) {
            const link = await prisma.marketplaceLink.findUnique({
                where: { id: marketplaceLinkId },
                select: { url: true },
            });
            redirectUrl = link?.url ?? null;
        }

        if (!redirectUrl) {
            // Fallback: ambil berdasarkan productId + platform
            const link = await prisma.marketplaceLink.findUnique({
                where: {
                    productId_platform: {
                        productId,
                        platform: platform as MarketplacePlatform,
                    },
                },
                select: { url: true, id: true },
            });
            redirectUrl = link?.url ?? null;
        }

        // Track the click (fire and forget, don't block redirect)
        prisma.clickTracking.create({
            data: {
                userId,
                productId,
                platform: platform as MarketplacePlatform,
                marketplaceLinkId: marketplaceLinkId ?? null,
            },
        }).catch(console.error);

        if (redirectUrl) {
            return NextResponse.json({ url: redirectUrl });
        }

        return NextResponse.json({ error: 'Link marketplace tidak ditemukan' }, { status: 404 });
    } catch (err) {
        console.error('[track-click]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
