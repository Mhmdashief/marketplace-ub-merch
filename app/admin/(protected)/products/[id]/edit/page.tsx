import { getProductById } from '@/app/actions/products';
import EditProductForm from './EditProductForm';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    // product is guaranteed non-null here after notFound() guard above
    return <EditProductForm product={product!} />;
}
