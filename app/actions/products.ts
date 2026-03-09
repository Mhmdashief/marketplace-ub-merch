'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { PRODUCT_CATEGORIES } from '@/app/constant/product-categories';
import { writeFile } from 'fs/promises';
import path from 'path';

// ─── Helper: buat slug dari nama produk ─────────────────────────────────────
function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

// ─── Helper: pastikan Category sudah ada di DB, return categoryId ────────────
async function ensureCategory(categoryName: string): Promise<string> {
    const slug = slugify(categoryName);
    const category = await prisma.category.upsert({
        where: { slug },
        update: {},
        create: { name: categoryName, slug },
    });
    return category.id;
}

// ─── Helper: shared include untuk promotions ─────────────────────────────────
function promotionInclude(now: Date) {
    return {
        where: {
            promotion: {
                isActive: true,
                deletedAt: null,
                startAt: { lte: now },
                endAt: { gte: now },
            },
        },
        include: { promotion: true },
    } as const;
}

// ─── Helper: map raw prisma product → public-facing shape ────────────────────
function mapPublicProduct(p: any) {
    const regPrice = Number(p.regularPrice);
    let discPrice = p.discountPrice ? Number(p.discountPrice) : null;

    const activePromo = p.promotions?.[0];
    if (activePromo) {
        const promoVal = Number(activePromo.discountValue);
        if (activePromo.discountType === 'PERCENTAGE') {
            discPrice = regPrice * (1 - promoVal / 100);
        } else {
            discPrice = regPrice - promoVal;
        }
    }

    return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: regPrice,
        discountPrice: discPrice,
        stock: p.stock,
        category: p.category.name,
        categorySlug: p.category.slug,
        image: p.assets[0]?.url ?? '/images/reusable/placeholder.png',
        rating: 4.8,
        sales: 0,
        hasPromotion: !!activePromo,
        promoName: activePromo?.promotion.name,
        // Showcase flags
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        isBestSeller: p.isBestSeller,
        isExclusiveShowcase: p.isExclusiveShowcase,
        isKoleksiPilihan: p.isKoleksiPilihan,
    };
}

// ─── LIST products untuk halaman publik (user-facing) ──────────────────────
export async function getPublicProducts(search?: string, categorySlug?: string) {
    const now = new Date();
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            deletedAt: null,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                ],
            }),
            ...(categorySlug && categorySlug !== 'all' && {
                category: { slug: categorySlug },
            }),
        },
        include: {
            category: { select: { name: true, slug: true } },
            assets: { select: { url: true }, take: 1 },
            promotions: promotionInclude(now),
        },
        orderBy: { createdAt: 'desc' },
    });

    return products.map(mapPublicProduct);
}

// ─── Scoped homepage queries ─────────────────────────────────────────────────

export async function getFeaturedProducts(limit = 2) {
    const now = new Date();
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isFeatured: true },
        include: {
            category: { select: { name: true, slug: true } },
            assets: { select: { url: true }, take: 1 },
            promotions: promotionInclude(now),
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

export async function getNewArrivals(limit = 6) {
    const now = new Date();
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isNewArrival: true },
        include: {
            category: { select: { name: true, slug: true } },
            assets: { select: { url: true }, take: 1 },
            promotions: promotionInclude(now),
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

export async function getBestSellers(limit = 4) {
    const now = new Date();
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isBestSeller: true },
        include: {
            category: { select: { name: true, slug: true } },
            assets: { select: { url: true }, take: 1 },
            promotions: promotionInclude(now),
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

export async function getExclusiveShowcaseProducts(limit = 3) {
    const now = new Date();
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isExclusiveShowcase: true },
        include: {
            category: { select: { name: true, slug: true } },
            assets: { select: { url: true }, take: 1 },
            promotions: promotionInclude(now),
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

export async function getKoleksiPilihanProducts(limit = 8) {
    const now = new Date();
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isKoleksiPilihan: true },
        include: {
            category: { select: { name: true, slug: true } },
            assets: { select: { url: true }, take: 1 },
            promotions: promotionInclude(now),
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

// ─── GET semua categories aktif untuk filter publik ─────────────────────────
export async function getPublicCategories() {
    const categories = await prisma.category.findMany({
        where: { isActive: true, deletedAt: null },
        select: { name: true, slug: true },
        orderBy: { name: 'asc' },
    });
    return categories;
}

// ─── LIST products (untuk tabel admin) ──────────────────────────────────────
export async function getAdminProducts(search?: string, categoryFilter?: string) {
    const products = await prisma.product.findMany({
        where: {
            deletedAt: null,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { id: { contains: search, mode: 'insensitive' } },
                ],
            }),
            ...(categoryFilter && categoryFilter !== 'ALL' && {
                category: { name: categoryFilter },
            }),
        },
        include: {
            category: { select: { name: true } },
            assets: { select: { url: true }, take: 1 },
            promotions: {
                where: {
                    promotion: {
                        isActive: true,
                        deletedAt: null,
                    }
                },
                include: { promotion: true }
            }
        },
        orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.regularPrice),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
        stock: p.stock,
        category: p.category.name,
        slug: p.slug,
        image: p.assets[0]?.url ?? null,
        status: (p.isActive ? 'ACTIVE' : 'DRAFT') as 'ACTIVE' | 'DRAFT',
        promotion: p.promotions[0]?.promotion.name ?? null,
    }));
}

export async function getProductBySlug(slug: string) {
    const now = new Date();
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
            assets: true,
            promotions: promotionInclude(now),
        },
    });

    if (!product) return null;

    const regPrice = Number(product.regularPrice);
    let discPrice = product.discountPrice ? Number(product.discountPrice) : null;
    const activePromo = product.promotions[0];

    if (activePromo) {
        const promoVal = Number(activePromo.discountValue);
        if (activePromo.discountType === 'PERCENTAGE') {
            discPrice = regPrice * (1 - promoVal / 100);
        } else {
            discPrice = regPrice - promoVal;
        }
    }

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        stock: product.stock,
        regularPrice: regPrice,
        discountPrice: discPrice,
        category: product.category.name,
        isActive: product.isActive,
        images: product.assets.map((a: { url: string }) => a.url),
        sizes: product.sizes || null,
        rating: 4.5,
        sales: 0,
        price: discPrice ?? regPrice,
        image: product.assets[0]?.url || '/images/reusable/placeholder.png',
        promotion: activePromo ? {
            name: (activePromo as any).promotion.name,
            endAt: (activePromo as any).promotion.endAt,
            discountValue: Number(activePromo.discountValue),
            discountType: activePromo.discountType
        } : null
    };
}

export async function getProductById(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            assets: true,
        },
    });

    if (!product) return null;

    return {
        id: product.id,
        name: product.name,
        description: product.description,
        stock: product.stock,
        regularPrice: Number(product.regularPrice),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
        category: product.category.name,
        isActive: product.isActive,
        images: product.assets.map(a => a.url),
        sizes: product.sizes || null,
        // Showcase flags
        isFeatured: product.isFeatured,
        isNewArrival: product.isNewArrival,
        isBestSeller: product.isBestSeller,
        isExclusiveShowcase: product.isExclusiveShowcase,
        isKoleksiPilihan: product.isKoleksiPilihan,
    };
}

export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const categoryName = formData.get('category') as string;
    const regularPrice = Number(formData.get('regularPrice'));
    const discountPrice = formData.get('discountPrice') ? Number(formData.get('discountPrice')) : null;
    const stock = Number(formData.get('stock'));
    const isActive = formData.get('isActive') === 'true';
    const sizesJson = formData.get('sizes') as string | null;

    // Showcase flags
    const isFeatured = formData.get('isFeatured') === 'true';
    const isNewArrival = formData.get('isNewArrival') === 'true';
    const isBestSeller = formData.get('isBestSeller') === 'true';
    const isExclusiveShowcase = formData.get('isExclusiveShowcase') === 'true';
    const isKoleksiPilihan = formData.get('isKoleksiPilihan') === 'true';

    const keptImages = formData.getAll('keptImages') as string[];
    const files = formData.getAll('images') as File[];
    const newImageUrls: string[] = [];

    if (!name || !description || !categoryName || !regularPrice || stock === undefined) {
        return { error: 'Field nama, deskripsi, kategori, harga, dan stok wajib diisi.' };
    }

    try {
        for (const file of files) {
            if (!file || file.size === 0) continue;
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
            const uploadPath = path.join(process.cwd(), 'public/uploads', fileName);
            await writeFile(uploadPath, buffer);
            newImageUrls.push(`/uploads/${fileName}`);
        }

        const categoryId = await ensureCategory(categoryName);
        const slug = `${slugify(name)}-${Date.now()}`;

        await prisma.product.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                regularPrice,
                discountPrice,
                stock,
                isActive,
                categoryId,
                sizes: sizesJson || null,
                // Showcase flags
                isFeatured,
                isNewArrival,
                isBestSeller,
                isExclusiveShowcase,
                isKoleksiPilihan,
                assets: {
                    deleteMany: keptImages.length > 0
                        ? { url: { notIn: keptImages } }
                        : {},
                    create: newImageUrls.map((url) => ({ url })),
                },
            },
        });

        revalidatePath('/admin/products');
        revalidatePath(`/admin/products/${id}/edit`);
        revalidatePath('/merchandise');
        revalidatePath('/');
        return { success: true };
    } catch (err) {
        console.error('[updateProduct]', err);
        return { error: 'Gagal mengupdate produk.' };
    }
}

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const categoryName = formData.get('category') as string;
    const regularPrice = Number(formData.get('regularPrice'));
    const discountPrice = formData.get('discountPrice')
        ? Number(formData.get('discountPrice'))
        : null;
    const stock = Number(formData.get('stock'));
    const isActive = formData.get('isActive') === 'true';
    const sizesJson = formData.get('sizes') as string | null;

    // Showcase flags
    const isFeatured = formData.get('isFeatured') === 'true';
    const isNewArrival = formData.get('isNewArrival') === 'true';
    const isBestSeller = formData.get('isBestSeller') === 'true';
    const isExclusiveShowcase = formData.get('isExclusiveShowcase') === 'true';
    const isKoleksiPilihan = formData.get('isKoleksiPilihan') === 'true';

    const files = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

    if (!name || !description || !categoryName || !regularPrice || stock === undefined) {
        return { error: 'Field nama, deskripsi, kategori, harga, dan stok wajib diisi.' };
    }

    if (!PRODUCT_CATEGORIES.includes(categoryName as typeof PRODUCT_CATEGORIES[number])) {
        return { error: 'Kategori tidak valid.' };
    }

    try {
        for (const file of files) {
            if (!file || file.size === 0) continue;

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
            const uploadPath = path.join(process.cwd(), 'public/uploads', fileName);

            await writeFile(uploadPath, buffer);
            imageUrls.push(`/uploads/${fileName}`);
        }

        const categoryId = await ensureCategory(categoryName);
        const slug = `${slugify(name)}-${Date.now()}`;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                slug,
                regularPrice,
                discountPrice,
                stock,
                isActive,
                categoryId,
                sizes: sizesJson || null,
                // Showcase flags
                isFeatured,
                isNewArrival,
                isBestSeller,
                isExclusiveShowcase,
                isKoleksiPilihan,
                assets: {
                    create: imageUrls.map((url) => ({ url })),
                },
            },
        });

        revalidatePath('/admin/products');
        revalidatePath('/merchandise');
        revalidatePath('/');
        return { success: true, productId: product.id };
    } catch (err) {
        console.error('[createProduct]', err);
        return { error: 'Gagal menyimpan produk. Coba lagi.' };
    }
}

// ─── SOFT DELETE produk ──────────────────────────────────────────────────────
export async function deleteProduct(productId: string) {
    await prisma.product.update({
        where: { id: productId },
        data: { deletedAt: new Date(), isActive: false },
    });
    revalidatePath('/admin/products');
    revalidatePath('/merchandise');
    revalidatePath('/');
}

// ─── BULK SOFT DELETE ────────────────────────────────────────────────────────
export async function bulkDeleteProducts(productIds: string[]) {
    await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { deletedAt: new Date(), isActive: false },
    });
    revalidatePath('/admin/products');
    revalidatePath('/merchandise');
    revalidatePath('/');
}

// ─── TOGGLE ACTIVE status ────────────────────────────────────────────────────
export async function toggleProductStatus(productId: string, currentStatus: boolean) {
    await prisma.product.update({
        where: { id: productId },
        data: { isActive: !currentStatus },
    });
    revalidatePath('/admin/products');
    revalidatePath('/merchandise');
    revalidatePath('/');
}
