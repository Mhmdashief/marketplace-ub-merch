import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/app/actions/products'
import ProductDetailClient from './ProductDetailClient'

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params

    if (!slug) {
        return { title: 'Produk Tidak Ditemukan - UB Merch' }
    }

    try {
        const product = await getProductBySlug(slug)

        if (!product) {
            return { title: 'Produk Tidak Ditemukan - UB Merch' }
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ubmerch.co.id';
        const imageUrl = product.images?.[0]
            ? `${baseUrl}${product.images[0]}`
            : `${baseUrl}/images/reusable/Logo Ub Merch.png`;

        const priceText = product.discountPrice
            ? `Rp ${product.discountPrice.toLocaleString('id-ID')}`
            : `Rp ${product.regularPrice.toLocaleString('id-ID')}`;

        return {
            title: `${product.name} - UB Merch`,
            description: product.description
                ? `${product.description.slice(0, 150)}... | ${priceText}`
                : `Beli ${product.name} dari UB Merch Official Store. ${priceText}`,
            openGraph: {
                title: `${product.name} - UB Merch`,
                description: product.description?.slice(0, 200) ?? `Beli ${product.name} di UB Merch.`,
                images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
                type: 'website',
                locale: 'id_ID',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${product.name} - UB Merch`,
                description: product.description?.slice(0, 200) ?? `Beli ${product.name} di UB Merch.`,
                images: [imageUrl],
            },
        }
    } catch (error) {
        return { title: 'UB Merch' }
    }
}
export default async function ProductDetailPage({
    params,
}: PageProps) {
    const { slug } = await params

    if (!slug) {
        notFound()
    }

    try {
        const product = await getProductBySlug(slug)

        if (!product) {
            notFound()
        }

        return <ProductDetailClient product={product} />
    } catch (error) {
        console.error('PRODUCT DETAIL ERROR:', error)
        notFound()
    }
}