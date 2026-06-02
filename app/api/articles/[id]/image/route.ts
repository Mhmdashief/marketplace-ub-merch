import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const article = await prisma.article.findUnique({
        where: { id },
        select: { imageBytes: true, imageMime: true },
    });

    if (!article || !article.imageBytes) {
        return new NextResponse('Gambar tidak ditemukan', { status: 404 });
    }

    return new NextResponse(new Uint8Array(article.imageBytes), {
        status: 200,
        headers: {
            'Content-Type': article.imageMime || 'image/jpeg',
            'Cache-Control': 'public, max-age=604800, immutable',
        },
    });
}
