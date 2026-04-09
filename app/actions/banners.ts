'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function getBanners() {
    return prisma.banner.findMany({
        where: { deletedAt: null },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
}

export async function getActiveBanners() {
    return prisma.banner.findMany({
        where: { isActive: true, deletedAt: null },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
}

export async function createBanner(formData: FormData) {
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string | null;
    const linkUrl = formData.get('linkUrl') as string | null;
    const linkLabel = formData.get('linkLabel') as string | null;
    const isActive = formData.get('isActive') === 'true';
    const sortOrder = Number(formData.get('sortOrder') ?? 0);
    const imageFile = formData.get('image') as File | null;

    if (!title?.trim()) return { error: 'Judul banner wajib diisi.' };
    if (!imageFile || imageFile.size === 0) return { error: 'Gambar banner wajib diupload.' };

    try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `banner-${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`;
        const uploadPath = path.join(process.cwd(), 'public/uploads', fileName);
        await writeFile(uploadPath, buffer);
        const imageUrl = `/uploads/${fileName}`;

        await prisma.banner.create({
            data: {
                title: title.trim(),
                subtitle: subtitle?.trim() || null,
                imageUrl,
                linkUrl: linkUrl?.trim() || null,
                linkLabel: linkLabel?.trim() || null,
                isActive,
                sortOrder,
            },
        });

        revalidatePath('/admin/banners');
        revalidatePath('/');
        return { success: true };
    } catch (err) {
        console.error('[createBanner]', err);
        return { error: 'Gagal membuat banner.' };
    }
}

export async function updateBanner(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string | null;
    const linkUrl = formData.get('linkUrl') as string | null;
    const linkLabel = formData.get('linkLabel') as string | null;
    const isActive = formData.get('isActive') === 'true';
    const sortOrder = Number(formData.get('sortOrder') ?? 0);
    const imageFile = formData.get('image') as File | null;
    const existingImageUrl = formData.get('existingImageUrl') as string | null;

    if (!title?.trim()) return { error: 'Judul banner wajib diisi.' };

    try {
        let imageUrl = existingImageUrl ?? '';

        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `banner-${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`;
            const uploadPath = path.join(process.cwd(), 'public/uploads', fileName);
            await writeFile(uploadPath, buffer);
            imageUrl = `/uploads/${fileName}`;
        }

        await prisma.banner.update({
            where: { id },
            data: {
                title: title.trim(),
                subtitle: subtitle?.trim() || null,
                imageUrl,
                linkUrl: linkUrl?.trim() || null,
                linkLabel: linkLabel?.trim() || null,
                isActive,
                sortOrder,
            },
        });

        revalidatePath('/admin/banners');
        revalidatePath('/');
        return { success: true };
    } catch (err) {
        console.error('[updateBanner]', err);
        return { error: 'Gagal mengupdate banner.' };
    }
}

export async function deleteBanner(id: string) {
    await prisma.banner.update({
        where: { id },
        data: { deletedAt: new Date(), isActive: false },
    });
    revalidatePath('/admin/banners');
    revalidatePath('/');
}

export async function toggleBannerStatus(id: string, currentStatus: boolean) {
    await prisma.banner.update({
        where: { id },
        data: { isActive: !currentStatus },
    });
    revalidatePath('/admin/banners');
    revalidatePath('/');
}

export async function updateBannerOrder(items: { id: string; sortOrder: number }[]) {
    await Promise.all(
        items.map(({ id, sortOrder }) =>
            prisma.banner.update({ where: { id }, data: { sortOrder } })
        )
    );
    revalidatePath('/admin/banners');
    revalidatePath('/');
}
