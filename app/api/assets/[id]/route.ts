import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const asset = await prisma.productAsset.findUnique({
        where: { id },
        select: { data: true, mimeType: true },
    });

    if (!asset) {
        return new NextResponse('Asset tidak ditemukan', { status: 404 });
    }

    return new NextResponse(new Uint8Array(asset.data), {
        status: 200,
        headers: {
            'Content-Type': asset.mimeType,
            'Cache-Control': 'public, max-age=604800, immutable',
        },
    });
}
