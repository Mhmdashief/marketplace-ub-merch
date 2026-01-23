import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
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

        {/* Category Section */}
        <CategoryGrid />

        {/* Product Grid Section */}
        <ProductGrid />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
