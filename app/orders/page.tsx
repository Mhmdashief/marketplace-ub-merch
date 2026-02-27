import OrdersClient from './OrdersClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Orders | UB Merchandise',
    description: 'View and track your order history.',
};

export default function OrdersPage() {
    return <OrdersClient />;
}
