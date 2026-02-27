'use server';

import { prisma } from '@/lib/prisma';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type CreateOrderInput = {
    items: {
        productId: string;
        quantity: number;
        size?: string | null;
    }[];
    userId?: string | null;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    shippingAmount: number;
    courier: string;
    courierService: string;
};

type OrderItemPayload = {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    total: number;
};

// ─────────────────────────────────────────────
// CREATE ORDER
// ─────────────────────────────────────────────
export async function createOrder(data: CreateOrderInput) {
    try {
        let totalSubtotal = 0;
        const orderItems: OrderItemPayload[] = [];

        for (const item of data.items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
                include: {
                    promotions: {
                        where: {
                            promotion: {
                                isActive: true,
                                deletedAt: null,
                                startAt: { lte: new Date() },
                                endAt: { gte: new Date() },
                            },
                        },
                        include: { promotion: true },
                    },
                },
            });

            if (!product) throw new Error(`Product ${item.productId} not found`);
            if (!product.isActive || product.deletedAt) throw new Error(`Product ${product.name} is unavailable`);

            let price = Number(product.regularPrice);

            // Apply size-specific pricing if applicable
            if (item.size && product.sizes) {
                try {
                    const sizesConfig = JSON.parse(product.sizes);
                    const sizeEntry = sizesConfig.sizes?.find((s: { value: string; regularPrice?: number }) => s.value === item.size);
                    if (sizeEntry && Number(sizeEntry.regularPrice) > 0) {
                        price = Number(sizeEntry.regularPrice);
                    }
                } catch {
                    // Sizes JSON parse failed — use base price
                }
            }

            // Apply active promotion or discount price
            const activePromo = product.promotions[0];
            if (activePromo) {
                const promoVal = Number(activePromo.discountValue);
                if (activePromo.discountType === 'PERCENTAGE') {
                    price = price * (1 - promoVal / 100);
                } else {
                    price = Math.max(0, price - promoVal);
                }
            } else if (product.discountPrice && Number(product.discountPrice) > 0) {
                price = Number(product.discountPrice);
            }

            const itemTotal = price * item.quantity;
            totalSubtotal += itemTotal;

            orderItems.push({
                productId: product.id,
                productName: `${product.name}${item.size ? ` (${item.size})` : ''}`,
                price,
                quantity: item.quantity,
                total: itemTotal,
            });
        }

        const totalAmount = totalSubtotal + data.shippingAmount;

        // Generate unique order code: UB-YYYYMMDD-XXXXX
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
        const orderCode = `UB-${dateStr}-${randomStr}`;

        const order = await prisma.order.create({
            data: {
                orderCode,
                // Link to user account if logged in
                ...(data.userId ? { userId: data.userId } : {}),
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,
                address: data.address,
                subtotal: totalSubtotal,
                shippingAmount: data.shippingAmount,
                totalAmount,
                // paymentStatus and shippingStatus use enum defaults (PENDING) — not set manually
                paymentMethod: `${data.courier} - ${data.courierService}`,
                items: {
                    create: orderItems,
                },
            },
        });

        return { success: true as const, orderId: order.id, orderCode: order.orderCode };
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false as const, error: 'Gagal membuat pesanan. Coba lagi.' };
    }
}

// ─────────────────────────────────────────────
// GET MY ORDERS (by email)
// ─────────────────────────────────────────────
export async function getMyOrders(email: string) {
    try {
        const orders = await prisma.order.findMany({
            where: {
                customerEmail: email,
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                assets: {
                                    take: 1,
                                    select: { url: true },
                                },
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return { success: true as const, orders };
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { success: false as const, error: 'Gagal mengambil data pesanan' };
    }
}

// ─────────────────────────────────────────────
// GET SINGLE ORDER DETAIL (by ID + email for security)
// ─────────────────────────────────────────────
export async function getOrderDetail(orderId: string, email: string) {
    try {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                customerEmail: email,
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                assets: { take: 1, select: { url: true } },
                            },
                        },
                    },
                },
            },
        });

        if (!order) return { success: false as const, error: 'Pesanan tidak ditemukan' };

        return { success: true as const, order };
    } catch (error) {
        console.error('Error fetching order detail:', error);
        return { success: false as const, error: 'Gagal mengambil detail pesanan' };
    }
}
