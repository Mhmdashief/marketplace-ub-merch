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

// ─── LIST products untuk halaman publik (user-facing) ──────────────────────
export async function getPublicProducts(search?: string, categorySlug?: string) {
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
        },
        orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.regularPrice),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
        stock: p.stock,
        category: p.category.name,
        categorySlug: p.category.slug,
        image: p.assets[0]?.url ?? '/images/reusable/placeholder.png',
        rating: 4.8, // placeholder, bisa dikembangkan ke tabel reviews
        sales: 0,    // placeholder, bisa dikembangkan ke tabel orders
    }));
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
    }));
}

export async function getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
            assets: true,
        },
    });

    if (!product) return null;

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        stock: product.stock,
        regularPrice: Number(product.regularPrice),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
        category: product.category.name,
        isActive: product.isActive,
        images: product.assets.map(a => a.url),
        sizes: product.sizes || null,
        rating: 4.5,
        sales: 0,
        price: Number(product.regularPrice),
        image: product.assets[0]?.url || '/images/reusable/placeholder.png',
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

    const keptImages = formData.getAll('keptImages') as string[];
    const files = formData.getAll('images') as File[];
    const newImageUrls: string[] = [];

    if (!name || !description || !categoryName || !regularPrice || stock === undefined) {
        return { error: 'Field nama, deskripsi, kategori, harga, dan stok wajib diisi.' };
    }

    try {
        // Upload new images logic if any
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
                assets: {
                    // Only delete assets not in keptImages list.
                    // If keptImages is empty, delete ALL old assets.
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

    const files = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

    // Validasi field wajib
    if (!name || !description || !categoryName || !regularPrice || stock === undefined) {
        return { error: 'Field nama, deskripsi, kategori, harga, dan stok wajib diisi.' };
    }

    if (!PRODUCT_CATEGORIES.includes(categoryName as typeof PRODUCT_CATEGORIES[number])) {
        return { error: 'Kategori tidak valid.' };
    }

    try {
        // Simpan file ke public/uploads
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
