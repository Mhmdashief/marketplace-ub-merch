import type { Metadata } from 'next';
import ServicesContent from '../components/services/ServicesContent';

export const metadata: Metadata = {
    title: 'Layanan Kreatif Profesional - UB Merchandise',
    description: 'Solusi kreatif lengkap untuk brand Anda: Design, Product Development, Branding, Logo Design, Video Profile, Company Profile Photography, Event Documentation, dan Website Development.',
    keywords: 'Creative Services, Branding, Logo Design, Video Production, Photography, Event Documentation, Website Development, UB Merch',
};

export default function ServicesPage() {
    return <ServicesContent />;
}
