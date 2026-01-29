import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import NewArrivals from './components/NewArrivals';
import BestSellers from './components/BestSellers';
import ProductShowcase from './components/ProductShowcase';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
