'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

export async function getAdminArticles(search?: string) {
    const articles = await prisma.article.findMany({
        where: {
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { id: { contains: search, mode: 'insensitive' } },
                ],
            }),
        },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            author: true,
            isActive: true,
            createdAt: true,
            imageMime: true,
        }
    });

    return articles.map(a => ({
        ...a,
        hasImage: !!a.imageMime,
        imageUrl: a.imageMime ? `/api/articles/${a.id}/image` : null
    }));
}

export async function getPublicArticles(search?: string) {
    const articles = await prisma.article.findMany({
        where: {
            isActive: true,
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { excerpt: { contains: search, mode: 'insensitive' } },
                ],
            }),
        },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            excerpt: true,
            author: true,
            createdAt: true,
            imageMime: true,
        }
    });

    return articles.map(a => ({
        ...a,
        imageUrl: a.imageMime ? `/api/articles/${a.id}/image` : null
    }));
}

export async function getArticleBySlug(slug: string) {
    const article = await prisma.article.findUnique({
        where: { slug },
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            content: true,
            category: true,
            author: true,
            isActive: true,
            imageMime: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    if (!article || !article.isActive) return null;

    return {
        ...article,
        imageUrl: article.imageMime ? `/api/articles/${article.id}/image` : null
    };
}

export async function getArticleById(id: string) {
    const article = await prisma.article.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            content: true,
            category: true,
            isActive: true,
            imageMime: true,
        }
    });

    if (!article) return null;

    return {
        ...article,
        imageUrl: article.imageMime ? `/api/articles/${article.id}/image` : null
    };
}

// Get recent articles for sidebar
export async function getRecentArticles(excludeSlug?: string, limit = 5) {
    const articles = await prisma.article.findMany({
        where: {
            isActive: true,
            ...(excludeSlug && { slug: { not: excludeSlug } }),
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true,
            imageMime: true,
        }
    });

    return articles.map(a => ({
        ...a,
        imageUrl: a.imageMime ? `/api/articles/${a.id}/image` : null
    }));
}

export async function deleteArticle(id: string) {
    await prisma.article.delete({ where: { id } });
    revalidatePath('/admin/news');
    revalidatePath('/news');
    revalidatePath('/');
}

export async function bulkDeleteArticles(ids: string[]) {
    await prisma.article.deleteMany({ where: { id: { in: ids } } });
    revalidatePath('/admin/news');
    revalidatePath('/news');
    revalidatePath('/');
}

export async function toggleArticleStatus(id: string, currentStatus: boolean) {
    await prisma.article.update({
        where: { id },
        data: { isActive: !currentStatus },
    });
    revalidatePath('/admin/news');
    revalidatePath('/news');
    revalidatePath('/');
}

export async function createArticle(formData: FormData) {
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string | null;
    const isActive = formData.get('isActive') === 'true';
    const imageFile = formData.get('image') as File | null;

    if (!title || !content) {
        return { error: 'Judul dan konten wajib diisi.' };
    }

    try {
        let imageBytes = null;
        let imageMime = null;

        if (imageFile && imageFile.size > 0) {
            if (imageFile.size > MAX_FILE_SIZE) return { error: 'Ukuran gambar maksimal 5MB.' };
            if (!ALLOWED_MIME_TYPES.includes(imageFile.type)) return { error: 'Format gambar tidak didukung.' };
            const bytes = await imageFile.arrayBuffer();
            imageBytes = Buffer.from(bytes);
            imageMime = imageFile.type;
        }

        const slug = `${slugify(title)}-${Date.now()}`;

        await prisma.article.create({
            data: { title, slug, excerpt, content, category, isActive, imageBytes, imageMime }
        });

        revalidatePath('/admin/news');
        revalidatePath('/news');
        return { success: true };
    } catch (err) {
        console.error('[createArticle]', err);
        return { error: 'Gagal menyimpan artikel.' };
    }
}

export async function updateArticle(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string | null;
    const isActive = formData.get('isActive') === 'true';
    const imageFile = formData.get('image') as File | null;
    const removeImage = formData.get('removeImage') === 'true';

    if (!title || !content) {
        return { error: 'Judul dan konten wajib diisi.' };
    }

    try {
        let updateData: any = {
            title, excerpt, content, category, isActive,
            slug: `${slugify(title)}-${Date.now()}`,
        };

        if (removeImage) {
            updateData.imageBytes = null;
            updateData.imageMime = null;
        } else if (imageFile && imageFile.size > 0) {
            if (imageFile.size > MAX_FILE_SIZE) return { error: 'Ukuran gambar maksimal 5MB.' };
            if (!ALLOWED_MIME_TYPES.includes(imageFile.type)) return { error: 'Format gambar tidak didukung.' };
            const bytes = await imageFile.arrayBuffer();
            updateData.imageBytes = Buffer.from(bytes);
            updateData.imageMime = imageFile.type;
        }

        await prisma.article.update({ where: { id }, data: updateData });

        revalidatePath('/admin/news');
        revalidatePath(`/admin/news/${id}/edit`);
        revalidatePath('/news');
        return { success: true };
    } catch (err) {
        console.error('[updateArticle]', err);
        return { error: 'Gagal mengupdate artikel.' };
    }
}
