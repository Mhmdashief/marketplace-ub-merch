import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  console.log("Webhook triggered");
  const callbackToken = req.headers.get('x-callback-token');

  if (callbackToken !== process.env.XENDIT_CALLBACK_TOKEN) {
    console.warn('[webhook] Unauthorized: invalid callback token');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  console.log('[webhook] Xendit event received:', JSON.stringify(data, null, 2));

  const externalId = data.external_id as string | undefined;
  const status = data.status as string | undefined;
  const xenditId = data.id as string | undefined;

  if (!externalId || !status) {
    console.warn('[webhook] Missing external_id or status in payload');
    return NextResponse.json({ success: true }); // Tetap return 200 agar Xendit tidak retry
  }

  try {
    // Cari order berdasarkan orderCode (external_id yang kita set saat buat invoice)
    const order = await prisma.order.findUnique({
      where: { orderCode: externalId },
    });

    if (!order) {
      console.warn(`[webhook] Order not found for external_id: ${externalId}`);
      return NextResponse.json({ success: true });
    }

    if (status === 'PAID') {
      await prisma.order.update({
        where: { orderCode: externalId },
        data: {
          paymentStatus: 'PAID',
          paidAt: new Date(),
          paymentRef: xenditId ?? order.paymentRef,
          paymentMethod: (data.payment_method as string) ?? order.paymentMethod,
        },
      });
      console.log(`[webhook] ✅ Order ${externalId} marked as PAID`);

    } else if (status === 'EXPIRED') {
      await prisma.order.update({
        where: { orderCode: externalId },
        data: {
          paymentStatus: 'EXPIRED',
        },
      });
      console.log(`[webhook] ⏰ Order ${externalId} marked as EXPIRED`);

    } else if (status === 'FAILED') {
      await prisma.order.update({
        where: { orderCode: externalId },
        data: {
          paymentStatus: 'FAILED',
        },
      });
      console.log(`[webhook] ❌ Order ${externalId} marked as FAILED`);
    } else {
      console.log(`[webhook] Unhandled status: ${status} for order ${externalId}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[webhook] DB update error:', message);
    // Tetap return 200 agar Xendit tidak terus retry
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: true });
}