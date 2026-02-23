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

        return {
            title: `${product.name} - UB Merch`,
            description:
                product.description ??
                `Beli ${product.name} dari UB Merch Official Store`,
        }
    } catch (error) {
        console.error('METADATA ERROR:', error)
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