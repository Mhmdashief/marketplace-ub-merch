import type { Metadata } from 'next';
import ContactHero from '@/components/contact/ContactHero';
import ContactContent from '@/components/contact/ContactContent';

export const metadata: Metadata = {
    title: 'Hubungi Kami - UB Merchandise',
    description: 'Hubungi UB Merchandise untuk pertanyaan, custom order, atau kerjasama. Tim kami siap membantu Anda dengan layanan customer service terbaik.',
    keywords: 'Kontak UB Merch, Hubungi UB Merch, Customer Service, WhatsApp, Email',
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white">
            <ContactHero />
            <ContactContent />
        </main>
    );
}
