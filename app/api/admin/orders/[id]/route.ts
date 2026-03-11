import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function checkAdmin() {
    const session = await auth();
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role as string)) {
        return null;
    }
    return session;
}

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: { assets: { take: 1, select: { url: true } } },
                        },
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 });
        }

        // Sanitize: convert Decimal → Number, Date → ISO string
        // trackingNumber cast as any (prisma generate pending)
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
            })),
        };

        return NextResponse.json({ order: sanitized });
    } catch (error) {
        console.error('[admin/orders GET]', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { shippingStatus, trackingNumber } = body;

        // Use `as any` for trackingNumber until `prisma generate` is re-run
        const data: any = {};
        if (shippingStatus) data.shippingStatus = shippingStatus;
        if (trackingNumber !== undefined) data.trackingNumber = trackingNumber;

        const order = await prisma.order.update({
            where: { id: params.id },
            data,
        });

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error('[admin/orders PATCH]', error);
        return NextResponse.json({ error: 'Gagal update order' }, { status: 500 });
    }
}
