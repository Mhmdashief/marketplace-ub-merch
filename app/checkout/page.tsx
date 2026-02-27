import CheckoutClient from './CheckoutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Checkout | UB Merchandise',
    description: 'Finalize your order and proceed to payment.',
};

export default function CheckoutPage() {
    return <CheckoutClient />;
}
