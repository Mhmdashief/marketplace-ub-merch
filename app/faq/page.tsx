import type { Metadata } from 'next';
import FaqAccordion from '@/components/faq/FaqAccordion';
import { MessageCircleQuestion, Search } from 'lucide-react';

export const metadata: Metadata = {
    title: 'FAQ - UB Merchandise',
    description: 'Temukan jawaban atas pertanyaan umum seputar pemesanan, pengiriman, dan layanan UB Merchandise.',
};

export default function FaqPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-ub-navy overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Modern Gradient Blobs */}
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-gradient-to-br from-ub-gold/10 to-transparent rounded-full blur-[120px] mix-blend-screen opacity-60" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-gradient-to-tr from-blue-600/10 to-transparent rounded-full blur-[100px] mix-blend-screen opacity-50" />

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight animate-fade-in-up delay-100">
                        Frequently Asked <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-ub-gold via-yellow-400 to-orange-400 italic font-serif">
                            Questions
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-10 animate-fade-in-up delay-200">
                        Punya pertanyaan? Kami punya jawabannya. Temukan informasi lengkap seputar layanan dan produk UB Merch disini.
                    </p>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce-slow opacity-50">
                    <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-ub-gold to-transparent" />
                </div>
            </section>

            {/* FAQ Content Section */}
            <section className="py-20 md:py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
                        {/* Sidebar / Sticky Menu area */}
                        <div className="md:w-1/3 lg:w-1/4 hidden md:block">
                            <div className="sticky top-32 space-y-8">
                                <div className="bg-ub-navy rounded-3xl p-6 text-white overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-ub-gold/20 rounded-full blur-2xl -mr-10 -mt-10" />
                                    <h4 className="font-bold text-lg mb-2 relative z-10">Butuh Bantuan Lain?</h4>
                                    <p className="text-sm text-gray-400 mb-6 relative z-10">Hubungi tim support kami langsung.</p>
                                    <a href="https://wa.me/6282126667575" className="inline-block w-full py-3 bg-white text-ub-navy text-center font-bold rounded-xl hover:bg-ub-gold transition-colors relative z-10">
                                        Contact Us
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Main Accordion Content */}
                        <div className="md:w-2/3 lg:w-3/4">
                            <FaqAccordion />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
