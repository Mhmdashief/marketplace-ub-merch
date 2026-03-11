import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import OrderDetailClient from './OrderDetailClient';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: Props) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            assets: { take: 1, select: { url: true } },
                        },
                    },
                },
            },
        },
    });

    if (!order) notFound();

    // Sanitize all Decimal / Date fields before passing to Client Component
    const raw = order as any;
    const sanitized = {
        ...raw,
        subtotal: Number(order.subtotal),
        discountAmount: Number(order.discountAmount),
        shippingAmount: Number(order.shippingAmount),
        totalAmount: Number(order.totalAmount),
        trackingNumber: raw.trackingNumber ?? null,
        paidAt: order.paidAt?.toISOString() ?? null,
        expiredAt: order.expiredAt?.toISOString() ?? null,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map((item: any) => ({
            ...item,
            price: Number(item.price),
            total: Number(item.total),
            createdAt: item.createdAt.toISOString(),
            product: item.product ?? null,
        })),
    };

    return <OrderDetailClient order={sanitized} />;
}
