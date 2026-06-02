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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ubmerch.id';

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'UB Merch',
    'alternateName': ['UB Merchandise', 'Official UB Merch', 'Universitas Brawijaya Merchandise'],
    'url': baseUrl,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${baseUrl}/merchandise?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    'name': 'UB Merch',
    'image': `${baseUrl}/images/reusable/Logo%20Ub%20Merch.png`,
    '@id': `${baseUrl}/#store`,
    'url': baseUrl,
    'telephone': '+6282126667575',
    'priceRange': 'RP',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Gedung Utara Asrama Mahasiswa, GOR Pertamina Universitas Brawijaya',
      'addressLocality': 'Malang',
      'addressRegion': 'Jawa Timur',
      'postalCode': '65145',
      'addressCountry': 'ID'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': -7.9536039,
      'longitude': 112.6160368
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ],
      'opens': '09:00',
      'closes': '17:00'
    },
    'sameAs': [
      'https://www.instagram.com/ubmerch.id/',
      'https://www.facebook.com/ubmerch.official',
      'https://www.tiktok.com/@ubmerch.id'
    ]
  };

  const navigationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SiteNavigationElement',
        '@id': `${baseUrl}/#nav-merchandise`,
        'name': 'Merchandise',
        'url': `${baseUrl}/merchandise`
      },
      {
        '@type': 'SiteNavigationElement',
        '@id': `${baseUrl}/#nav-about`,
        'name': 'Tentang Kami',
        'url': `${baseUrl}/about`
      },
      {
        '@type': 'SiteNavigationElement',
        '@id': `${baseUrl}/#nav-news`,
        'name': 'Berita Terbaru',
        'url': `${baseUrl}/news`
      },
      {
        '@type': 'SiteNavigationElement',
        '@id': `${baseUrl}/#nav-services`,
        'name': 'Layanan',
        'url': `${baseUrl}/services`
      },
      {
        '@type': 'SiteNavigationElement',
        '@id': `${baseUrl}/#nav-faq`,
        'name': 'FAQ',
        'url': `${baseUrl}/faq`
      },
      {
        '@type': 'SiteNavigationElement',
        '@id': `${baseUrl}/#nav-contact`,
        'name': 'Hubungi Kami',
        'url': `${baseUrl}/contact`
      }
    ]
  };

  return (
    <main className="min-h-screen">
      {/* JSON-LD Structured Data for Sitelinks Searchbox and Navigation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationSchema) }}
      />

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
