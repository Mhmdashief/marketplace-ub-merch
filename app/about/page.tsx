import type { Metadata } from 'next';
import HeroSection from '../components/about/HeroSection';
import StorySection from '../components/about/StorySection';
import PartnerSection from '../components/about/PartnerSection';

export const metadata: Metadata = {
    title: 'Tentang Kami - UB Merchandise',
    description: 'Pelajari lebih lanjut tentang UB Merchandise, toko merchandise resmi Universitas Brawijaya. Misi kami adalah menyatukan kebanggaan, tradisi, dan inovasi.',
    keywords: 'UB Merch, Universitas Brawijaya, About Us, Merchandise Kampus',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <StorySection />
            <PartnerSection />
        </main>
    );
}
