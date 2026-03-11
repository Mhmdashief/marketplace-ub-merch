import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const orderCode = req.nextUrl.searchParams.get('orderCode');

    if (!orderCode) {
        return NextResponse.json({ error: 'orderCode diperlukan' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
        where: { orderCode },
        select: {
            paymentStatus: true,
            paidAt: true,
            expiredAt: true,
            invoiceUrl: true,
        },
    });

    if (!order) {
        return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
        paymentStatus: order.paymentStatus,
        paidAt: order.paidAt?.toISOString() ?? null,
        expiredAt: order.expiredAt?.toISOString() ?? null,
        invoiceUrl: order.invoiceUrl,
    });
}
