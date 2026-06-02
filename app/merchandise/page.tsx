import { Suspense } from 'react';
import Image from 'next/image';
import { getPublicProducts } from '@/app/actions/products';
import MerchandiseClient from './MerchandiseClient';

export const metadata = {
    title: 'Koleksi Merchandise - UB Merch Official Store',
    description: 'Temukan merchandise resmi Universitas Brawijaya. Koleksi lengkap dari varsity jacket, sepatu, topi, kaos, hingga tumbler eksklusif.',
};

// Re-fetch setiap kunjungan agar selalu sinkron dengan admin panel
export const dynamic = 'force-dynamic';

async function MerchandiseContent() {
    const products = await getPublicProducts();

    return (
        <MerchandiseClient
            initialProducts={products}
        />
    );
}

export default function MerchandisePage() {

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Ultra Premium Hero Section */}
            <header className="relative pt-32 pb-24 overflow-hidden bg-[#050505]">
                {/* Modern Abstract Aura Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[140%] bg-ub-navy/20 rounded-full blur-[160px] transform rotate-12" />
                    <div className="absolute bottom-[-30%] left-[-10%] w-[60%] h-[120%] bg-ub-gold/15 rounded-full blur-[140px] transform -rotate-12" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`
                    }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Floating Badge */}
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/[0.03] backdrop-blur-2xl rounded-full mb-10 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] transform hover:scale-105 transition-transform">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">UB Merch Official Store</span>
                    </div>

                    {/* Signature Header - Logo Replacement */}
                    <h1 className="flex flex-col items-center mb-12">
                        <span className="text-gray-300 text-[10px] font-black tracking-[0.6em] mb-10 translate-x-[0.3em]">ESTABLISHED 1963</span>
                        <div className="relative w-[300px] sm:w-[450px] lg:w-[600px] aspect-[4/1] invert brightness-200">
                            <Image
                                src="/images/reusable/Logo Ub Merch.png"
                                alt="UB Merch Official Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="sr-only">Brawijaya Collection - UB Merch Official Store</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-gray-300 text-base sm:text-lg font-medium leading-relaxed mb-16">
                        Elevating university pride through masterfully crafted merchandise. A fusion of heritage and contemporary luxury for the modern academic.
                    </p>
                </div>

                {/* Elegant Geometric Accent */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="w-[1px] h-16 bg-gradient-to-b from-ub-gold to-transparent" />
                </div>
            </header>

            <main className="flex-1 bg-white">
                <Suspense fallback={
                    <div className="flex justify-center items-center py-40">
                        <div className="w-16 h-16 border-4 border-ub-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                }>
                    <MerchandiseContent />
                </Suspense>
            </main>
        </div>
    );
}
