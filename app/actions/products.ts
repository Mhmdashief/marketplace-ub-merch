'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Ukuran maksimum per file: 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// ─── Helper: buat slug dari nama produk ─────────────────────────────────────
function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

// ─── Helper: konversi File ke binary buffer ───────────────────────────────────
async function fileToBuffer(file: File): Promise<Buffer> {
    const bytes = await file.arrayBuffer();
    return Buffer.from(bytes);
}

// ─── Helper: URL asset dari asset ID ─────────────────────────────────────────
function assetUrl(assetId: string): string {
    return `/api/assets/${assetId}`;
}

// ─── Helper: map raw prisma product → public-facing shape ────────────────────
function mapPublicProduct(p: any) {
    const regPrice = Number(p.regularPrice);
    const discPrice = p.discountPrice ? Number(p.discountPrice) : null;
    const firstAsset = p.assets?.[0];

    return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: regPrice,
        discountPrice: discPrice,
        stock: p.stock,
        image: firstAsset ? assetUrl(firstAsset.id) : '/images/reusable/placeholder.png',
        rating: 4.8,
        sales: 0,
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        isBestSeller: p.isBestSeller,
        isExclusiveShowcase: p.isExclusiveShowcase,
        isKoleksiPilihan: p.isKoleksiPilihan,
        category: p.category,
    };
}

// Pilih hanya field yang dibutuhkan untuk listing (tidak ambil binary data)
const ASSET_SELECT_FOR_LIST = {
    select: { id: true },
    take: 1,
    orderBy: { sortOrder: 'asc' as const },
};

// ─── LIST products untuk halaman publik (user-facing) ──────────────────────
export async function getPublicProducts(search?: string) {
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            deletedAt: null,
            ...(search && {
                OR: [{ name: { contains: search, mode: 'insensitive' } }],
            }),
        },
        include: { assets: ASSET_SELECT_FOR_LIST },
        orderBy: { createdAt: 'desc' },
    });

    return products.map(mapPublicProduct);
}

// ─── Scoped homepage queries ─────────────────────────────────────────────────

export async function getFeaturedProducts(limit = 2) {
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isFeatured: true },
        include: { assets: ASSET_SELECT_FOR_LIST },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

export async function getNewArrivals(limit = 6) {
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isNewArrival: true },
        include: { assets: ASSET_SELECT_FOR_LIST },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

export async function getBestSellers(limit = 4) {
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isBestSeller: true },
        include: { assets: ASSET_SELECT_FOR_LIST },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

export async function getExclusiveShowcaseProducts(limit = 12) {
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isExclusiveShowcase: true },
        include: { assets: ASSET_SELECT_FOR_LIST },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

export async function getKoleksiPilihanProducts(limit = 8) {
    const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null, isKoleksiPilihan: true },
        include: { assets: ASSET_SELECT_FOR_LIST },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return products.map(mapPublicProduct);
}

// ─── LIST products (untuk tabel admin) ──────────────────────────────────────
export async function getAdminProducts(search?: string, category?: string) {
    const products = await prisma.product.findMany({
        where: {
            deletedAt: null,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { id: { contains: search, mode: 'insensitive' } },
                ],
            }),
            ...(category && category !== 'ALL' && { category }),
        },
        include: { assets: ASSET_SELECT_FOR_LIST },
        orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.regularPrice),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
        stock: p.stock,
        slug: p.slug,
        image: p.assets[0] ? assetUrl(p.assets[0].id) : null,
        status: (p.isActive ? 'ACTIVE' : 'DRAFT') as 'ACTIVE' | 'DRAFT',
        category: p.category,
    }));
}

export async function getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            assets: {
                select: { id: true, sortOrder: true },
                orderBy: { sortOrder: 'asc' },
            },
            marketplaceLinks: {
                where: { isActive: true },
                orderBy: { platform: 'asc' },
            },
        },
    });

    if (!product) return null;

    const regPrice = Number(product.regularPrice);
    const discPrice = product.discountPrice ? Number(product.discountPrice) : null;

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        stock: product.stock,
        regularPrice: regPrice,
        discountPrice: discPrice,
        isActive: product.isActive,
        images: product.assets.map((a) => assetUrl(a.id)),
        rating: 4.5,
        sales: 0,
        price: discPrice ?? regPrice,
        category: product.category,
        sizes: product.sizes,
        image: product.assets[0] ? assetUrl(product.assets[0].id) : '/images/reusable/placeholder.png',
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
            assets: {
                select: { id: true, fileName: true, sortOrder: true },
                orderBy: { sortOrder: 'asc' },
            },
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
        // Kembalikan array { id, url, fileName } agar UI bisa preview & tracking
        images: product.assets.map((a) => ({
            id: a.id,
            url: assetUrl(a.id),
            fileName: a.fileName,
        })),
        category: product.category,
        sizes: product.sizes,
        isFeatured: product.isFeatured,
        isNewArrival: product.isNewArrival,
        isBestSeller: product.isBestSeller,
        isExclusiveShowcase: product.isExclusiveShowcase,
        isKoleksiPilihan: product.isKoleksiPilihan,
        marketplaceLinks: product.marketplaceLinks.map((l: any) => ({
            platform: l.platform,
            url: l.url,
            isActive: l.isActive,
        })),
    };
}

// ─── UPDATE produk ────────────────────────────────────────────────────────────
export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const regularPrice = Number(formData.get('regularPrice'));
    const discountPrice = formData.get('discountPrice') ? Number(formData.get('discountPrice')) : null;
    const stock = Number(formData.get('stock'));
    const category = formData.get('category') as string | null;
    const isActive = formData.get('isActive') === 'true';

    const isFeatured = formData.get('isFeatured') === 'true';
    const isNewArrival = formData.get('isNewArrival') === 'true';
    const isBestSeller = formData.get('isBestSeller') === 'true';
    const isExclusiveShowcase = formData.get('isExclusiveShowcase') === 'true';
    const isKoleksiPilihan = formData.get('isKoleksiPilihan') === 'true';

    const keptAssetIds = formData.getAll('keptImages') as string[];
    const files = formData.getAll('images') as File[];
    console.log('[updateProduct] received files:', files.map(f => typeof f === 'object' ? { name: f.name, size: f.size, type: f.type } : typeof f));

    if (!name || !description || !regularPrice || stock === undefined) {
        return { error: 'Field nama, deskripsi, harga, dan stok wajib diisi.' };
    }

    try {
        for (const file of files) {
            if (!file || file.size === 0) continue;
            if (file.size > MAX_FILE_SIZE) {
                return { error: `File "${file.name}" melebihi batas 5 MB.` };
            }
            if (!ALLOWED_MIME_TYPES.includes(file.type)) {
                return { error: `Tipe file "${file.type}" tidak didukung. Gunakan JPEG, PNG, atau WebP.` };
            }
        }

        const slug = `${slugify(name)}-${Date.now()}`;

        await prisma.$transaction(async (tx) => {
            await tx.productAsset.deleteMany({
                where: {
                    productId: id,
                    id: { notIn: keptAssetIds },
                },
            });

            const existingCount = await tx.productAsset.count({ where: { productId: id } });
            let sortOrder = existingCount;

            for (const file of files) {
                if (!file || file.size === 0) continue;
                const buffer = await fileToBuffer(file);
                await tx.productAsset.create({
                    data: {
                        productId: id,
                        data: buffer,
                        mimeType: file.type,
                        fileName: file.name,
                        size: file.size,
                        sortOrder: sortOrder++,
                    },
                });
            }

            await tx.product.update({
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
                    isFeatured,
                    isNewArrival,
                    isBestSeller,
                    isExclusiveShowcase,
                    isKoleksiPilihan,
                },
            });
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
    const discountPrice = formData.get('discountPrice') ? Number(formData.get('discountPrice')) : null;
    const stock = Number(formData.get('stock'));
    const category = formData.get('category') as string | null;
    const isActive = formData.get('isActive') === 'true';
    const sizesJson = formData.get('sizes') as string | null;

    const isFeatured = formData.get('isFeatured') === 'true';
    const isNewArrival = formData.get('isNewArrival') === 'true';
    const isBestSeller = formData.get('isBestSeller') === 'true';
    const isExclusiveShowcase = formData.get('isExclusiveShowcase') === 'true';
    const isKoleksiPilihan = formData.get('isKoleksiPilihan') === 'true';

    const files = formData.getAll('images') as File[];
    console.log('[createProduct] received files:', files.map(f => typeof f === 'object' ? { name: f.name, size: f.size, type: f.type } : typeof f));

    if (!name || !description || !regularPrice || stock === undefined) {
        return { error: 'Field nama, deskripsi, harga, dan stok wajib diisi.' };
    }

    try {
        for (const file of files) {
            if (!file || file.size === 0) continue;
            if (file.size > MAX_FILE_SIZE) {
                return { error: `File "${file.name}" melebihi batas 5 MB.` };
            }
            if (!ALLOWED_MIME_TYPES.includes(file.type)) {
                return { error: `Tipe file "${file.type}" tidak didukung.` };
            }
        }

        const slug = `${slugify(name)}-${Date.now()}`;

        const product = await prisma.$transaction(async (tx) => {
            const newProduct = await tx.product.create({
                data: {
                    name,
                    description,
                    slug,
                    regularPrice,
                    discountPrice,
                    stock,
                    category,
                    isActive,
                    sizes: sizesJson,
                    isFeatured,
                    isNewArrival,
                    isBestSeller,
                    isExclusiveShowcase,
                    isKoleksiPilihan,
                },
            });

            let sortOrder = 0;
            for (const file of files) {
                if (!file || file.size === 0) continue;
                const buffer = await fileToBuffer(file);
                await tx.productAsset.create({
                    data: {
                        productId: newProduct.id,
                        data: buffer,
                        mimeType: file.type,
                        fileName: file.name,
                        size: file.size,
                        sortOrder: sortOrder++,
                    },
                });
            }

            return newProduct;
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

export async function deleteProduct(productId: string) {
    await prisma.product.update({
        where: { id: productId },
        data: { deletedAt: new Date(), isActive: false },
    });
    revalidatePath('/admin/products');
    revalidatePath('/merchandise');
    revalidatePath('/');
}

export async function bulkDeleteProducts(productIds: string[]) {
    await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { deletedAt: new Date(), isActive: false },
    });
    revalidatePath('/admin/products');
    revalidatePath('/merchandise');
    revalidatePath('/');
}

export async function toggleProductStatus(productId: string, currentStatus: boolean) {
    await prisma.product.update({
        where: { id: productId },
        data: { isActive: !currentStatus },
    });
    revalidatePath('/admin/products');
    revalidatePath('/merchandise');
    revalidatePath('/');
}
