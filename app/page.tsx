import type { Metadata } from 'next';
import {
  Hero,
  FeaturedProducts,
  NewArrivals,
  BestSellers,
  ProductShowcase,
  ProductGrid
} from '@/components/homepage';

export const metadata: Metadata = {
  title: 'UB Merchandise - Official Store Universitas Brawijaya',
  description: 'Toko merchandise resmi Universitas Brawijaya. Temukan koleksi eksklusif hoodie, kaos, tote bag, dan merchandise premium lainnya. Tunjukkan kebanggaanmu sebagai bagian dari keluarga besar UB!',
  keywords: 'UB Merch, Universitas Brawijaya, Merchandise UB, Hoodie UB, Kaos UB, Tote Bag UB, Official Merchandise',
};


export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products - Large Hero Cards */}
      <FeaturedProducts />

      {/* New Arrivals - 6 Column Grid */}
      <NewArrivals />

      {/* Best Sellers - Top 4 Ranked */}
      <BestSellers />

      {/* Exclusive Showcase - Asymmetric Dark Layout */}
      <ProductShowcase />

      {/* More Products - Curated Collection */}
      <ProductGrid />
    </main>
  );
}
