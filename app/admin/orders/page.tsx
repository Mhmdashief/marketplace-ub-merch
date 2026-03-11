import { Suspense } from 'react';
import AdminOrdersClient from './OrdersClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Orders | Admin Panel',
};

export default function AdminOrdersPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-ub-gold/20 border-t-ub-gold rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Loading...</p>
                </div>
            </div>
        }>
            <AdminOrdersClient />
        </Suspense>
    );
}
