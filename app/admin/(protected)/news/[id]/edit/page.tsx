import { getArticleById } from '@/app/actions/news';
import { notFound } from 'next/navigation';
import EditNewsForm from './EditNewsForm';

export default async function EditArticlePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const article = await getArticleById(id);

    if (!article) {
        notFound();
    }

    return <EditNewsForm article={article} />;
}
