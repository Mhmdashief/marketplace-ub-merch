import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { PaymentStatus, ShippingStatus } from '@prisma/client';

const VALID_PAYMENT = ['PAID', 'PENDING', 'EXPIRED', 'FAILED', 'CANCELED', 'REFUNDED'] as const;
const VALID_SHIPPING = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'RETURNED', 'CANCELLED'] as const;

const isPayment = (s: string): s is PaymentStatus => VALID_PAYMENT.includes(s as any);
const isShipping = (s: string): s is ShippingStatus => VALID_SHIPPING.includes(s as any);

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role as string)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sp = req.nextUrl.searchParams;
    const query = sp.get('q') ?? '';
    const status = sp.get('status') ?? '';
    const shipping = sp.get('shipping') ?? '';
    const page = Math.max(1, parseInt(sp.get('page') ?? '1', 10));
    const limit = Math.min(50, parseInt(sp.get('limit') ?? '15', 10));
    const skip = (page - 1) * limit;

    const where: any = {
        ...(query ? {
            OR: [
                { orderCode: { contains: query, mode: 'insensitive' } },
                { customerName: { contains: query, mode: 'insensitive' } },
                { customerEmail: { contains: query, mode: 'insensitive' } },
                { customerPhone: { contains: query, mode: 'insensitive' } },
            ],
        } : {}),
        ...(status && isPayment(status) ? { paymentStatus: status } : {}),
        ...(shipping && isShipping(shipping) ? { shippingStatus: shipping } : {}),
    };

    const [orders, total, paymentGroups, shippingGroups] = await Promise.all([
        prisma.order.findMany({
            where,
            include: {
                items: { select: { id: true, productName: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.order.count({ where }),
        prisma.order.groupBy({ by: ['paymentStatus'], _count: { _all: true } }),
        prisma.order.groupBy({ by: ['shippingStatus'], _count: { _all: true } }),
    ]);

    const countByPayment: Record<string, number> = {};
    const countByShipping: Record<string, number> = {};
    paymentGroups.forEach(g => { countByPayment[g.paymentStatus] = g._count._all; });
    shippingGroups.forEach(g => { countByShipping[g.shippingStatus] = g._count._all; });

    // Sanitize Decimal + Date fields
    const sanitized = orders.map((order: any) => ({
        id: order.id,
        orderCode: order.orderCode,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        totalAmount: Number(order.totalAmount),
        paymentStatus: order.paymentStatus,
        shippingStatus: order.shippingStatus,
        trackingNumber: order.trackingNumber ?? null,
        createdAt: order.createdAt.toISOString(),
        items: (order.items ?? []).map((item: any) => ({
            id: item.id,
            productName: item.productName,
        })),
    }));

    return NextResponse.json({
        orders: sanitized,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        countByPayment,
        countByShipping,
    });
}
