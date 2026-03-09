'use server';

import { prisma } from '@/lib/prisma';

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

            if (!product) {
                console.error(`[createOrder] Product not found: id="${item.productId}"`);
                return {
                    success: false as const,
                    error: `Produk dengan ID "${item.productId}" tidak ditemukan. Silakan perbarui keranjang belanja Anda dan coba lagi.`,
                    staleCart: true,
                };
            }

            if (!product.isActive || product.deletedAt) {
                return {
                    success: false as const,
                    error: `Produk "${product.name}" sedang tidak tersedia. Silakan hapus dari keranjang dan coba lagi.`,
                };
            }

            let price = Number(product.regularPrice);

            if (item.size && product.sizes) {
                try {
                    const sizesConfig = JSON.parse(product.sizes);
                    const sizeEntry = sizesConfig.sizes?.find((s: { value: string; regularPrice?: number }) => s.value === item.size);
                    if (sizeEntry && Number(sizeEntry.regularPrice) > 0) {
                        price = Number(sizeEntry.regularPrice);
                    }
                } catch {
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

        // Verify userId actually exists in DB before linking.
        // Session can have a stale/dangling userId (e.g. after DB reset) that
        // would cause a FK constraint violation — treat as guest order instead.
        let verifiedUserId: string | null = null;
        if (data.userId) {
            const userExists = await prisma.user.findUnique({
                where: { id: data.userId },
                select: { id: true },
            });
            verifiedUserId = userExists?.id ?? null;
            if (!userExists) {
                console.warn(`[createOrder] userId "${data.userId}" not found in DB — creating as guest order.`);
            }
        }

        const order = await prisma.order.create({
            data: {
                orderCode,
                ...(verifiedUserId ? { userId: verifiedUserId } : {}),
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,
                address: data.address,
                subtotal: totalSubtotal,
                shippingAmount: data.shippingAmount,
                totalAmount,
                paymentMethod: `${data.courier} - ${data.courierService}`,
                items: {
                    create: orderItems,
                },
            },

        });

        return { success: true as const, orderId: order.id, orderCode: order.orderCode };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[createOrder] Unexpected error:', message);
        return { success: false as const, error: `Gagal membuat pesanan: ${message}` };
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
