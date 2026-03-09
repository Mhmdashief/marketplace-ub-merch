import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createInvoice } from '@/lib/xendit';

export async function POST(req: NextRequest) {
    try {
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ error: 'orderId diperlukan' }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 });
        }

        if (!order.customerEmail) {
            return NextResponse.json(
                { error: 'email customer tidak tersedia' },
                { status: 400 }
            );
        }

        if (order.paymentStatus !== 'PENDING') {
            return NextResponse.json(
                { error: 'Order sudah dibayar atau kedaluwarsa' },
                { status: 400 }
            );
        }

        const invoice = await createInvoice({
            externalId: order.orderCode,
            amount: Number(order.totalAmount),
            description: `Pembayaran Order ${order.orderCode} - UB Merch`,
            payerEmail: order.customerEmail,
        });

        await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentRef: invoice.id,
                expiredAt: invoice.expiry_date
                    ? new Date(invoice.expiry_date)
                    : null,
            },
        });

        return NextResponse.json({
            success: true,
            invoiceUrl: invoice.invoice_url,
            invoiceId: invoice.id,
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[create-invoice] Error:', message);

        return NextResponse.json(
            { error: `Gagal membuat invoice: ${message}` },
            { status: 500 }
        );
    }
}