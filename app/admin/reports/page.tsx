import { getClickAnalytics, getProductsWithoutMarketplaceLinks } from '@/app/actions/marketplace';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
    const [analytics, noLinkProducts] = await Promise.all([
        getClickAnalytics(),
        getProductsWithoutMarketplaceLinks(),
    ]);

    return (
        <AnalyticsClient
            analytics={analytics}
            noLinkProducts={noLinkProducts}
        />
    );
}
