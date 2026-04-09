'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
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

// ─── Helper: map raw prisma product → public-facing shape ────────────────────
function mapPublicProduct(p: any) {
    const regPrice = Number(p.regularPrice);
    let discPrice = p.discountPrice ? Number(p.discountPrice) : null;

    return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: regPrice,
        discountPrice: discPrice,
        stock: p.stock,
        image: p.assets?.[0]?.url ?? '/images/reusable/placeholder.png',
        rating: 4.8,
        sales: 0,
        // Showcase flags
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        isBestSeller: p.isBestSeller,
        isExclusiveShowcase: p.isExclusiveShowcase,
        isKoleksiPilihan: p.isKoleksiPilihan,
        category: p.category,
    };
}

// ─── LIST products untuk halaman publik (user-facing) ──────────────────────
export async function getPublicProducts(search?: string) {
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            deletedAt: null,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                ],
            }),
        },
        include: {
            assets: { select: { url: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
    });

    return products.map(mapPublicProduct);
}

// ─── Scoped homepage queries ─────────────────────────────────────────────────

export async function getFeaturedProducts(limit = 2) {
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isFeatured: true },
        include: {
            assets: { select: { url: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

export async function getNewArrivals(limit = 6) {
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isNewArrival: true },
        include: {
            assets: { select: { url: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

export async function getBestSellers(limit = 4) {
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isBestSeller: true },
        include: {
            assets: { select: { url: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

export async function getExclusiveShowcaseProducts(limit = 12) {
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isExclusiveShowcase: true },
        include: {
            assets: { select: { url: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

export async function getKoleksiPilihanProducts(limit = 8) {
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isKoleksiPilihan: true },
        include: {
            assets: { select: { url: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

// ─── LIST products (untuk tabel admin) ──────────────────────────────────────
export async function getAdminProducts(search?: string) {
    const products = await prisma.product.findMany({
        where: {
            deletedAt: null,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { id: { contains: search, mode: 'insensitive' } },
                ],
            }),
        },
        include: {
            assets: { select: { url: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.regularPrice),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
        stock: p.stock,
        slug: p.slug,
        image: p.assets[0]?.url ?? null,
        status: (p.isActive ? 'ACTIVE' : 'DRAFT') as 'ACTIVE' | 'DRAFT',
        category: p.category,
    }));
}

export async function getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            assets: true,
            marketplaceLinks: {
                where: { isActive: true },
                orderBy: { platform: 'asc' },
            },
        },
    });

    if (!product) return null;

    const regPrice = Number(product.regularPrice);
    let discPrice = product.discountPrice ? Number(product.discountPrice) : null;

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        stock: product.stock,
        regularPrice: regPrice,
        discountPrice: discPrice,
        isActive: product.isActive,
        images: product.assets.map((a: { url: string }) => a.url),
        rating: 4.5,
        sales: 0,
        price: discPrice ?? regPrice,
        category: product.category,
        sizes: product.sizes,
        image: product.assets[0]?.url || '/images/reusable/placeholder.png',
        marketplaceLinks: product.marketplaceLinks.map((link: any) => ({
            id: link.id,
            platform: link.platform,
            url: link.url,
            isActive: link.isActive,
        })),
    };
}

export async function getProductById(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            assets: true,
            marketplaceLinks: {
                where: { isActive: true },
                orderBy: { platform: 'asc' },
            },
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
        isActive: product.isActive,
        images: product.assets.map((a: any) => a.url),
        category: product.category,
        sizes: product.sizes,
        // Showcase flags
        isFeatured: product.isFeatured,
        isNewArrival: product.isNewArrival,
        isBestSeller: product.isBestSeller,
        isExclusiveShowcase: product.isExclusiveShowcase,
        isKoleksiPilihan: product.isKoleksiPilihan,
        // Marketplace links
        marketplaceLinks: product.marketplaceLinks.map((l: any) => ({
            platform: l.platform,
            url: l.url,
            isActive: l.isActive,
        })),
    };
}

export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const regularPrice = Number(formData.get('regularPrice'));
    const discountPrice = formData.get('discountPrice') ? Number(formData.get('discountPrice')) : null;
    const stock = Number(formData.get('stock'));
    const category = formData.get('category') as string | null;
    const isActive = formData.get('isActive') === 'true';

    // Showcase flags
    const isFeatured = formData.get('isFeatured') === 'true';
    const isNewArrival = formData.get('isNewArrival') === 'true';
    const isBestSeller = formData.get('isBestSeller') === 'true';
    const isExclusiveShowcase = formData.get('isExclusiveShowcase') === 'true';
    const isKoleksiPilihan = formData.get('isKoleksiPilihan') === 'true';

    const keptImages = formData.getAll('keptImages') as string[];
    const files = formData.getAll('images') as File[];
    const newImageUrls: string[] = [];

    if (!name || !description || !regularPrice || stock === undefined) {
        return { error: 'Field nama, deskripsi, harga, dan stok wajib diisi.' };
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
                category,
                isActive,
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
    const regularPrice = Number(formData.get('regularPrice'));
    const discountPrice = formData.get('discountPrice')
        ? Number(formData.get('discountPrice'))
        : null;
    const stock = Number(formData.get('stock'));
    const category = formData.get('category') as string | null;
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

    if (!name || !description || !regularPrice || stock === undefined) {
        return { error: 'Field nama, deskripsi, harga, dan stok wajib diisi.' };
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

        const slug = `${slugify(name)}-${Date.now()}`;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                slug,
                regularPrice,
                discountPrice,
                stock,
                category,
                isActive,
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
