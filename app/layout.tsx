import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/components/shared";
import { AuthProvider } from "@/components/auth/AuthProvider";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UB Merch - Official Universitas Brawijaya Merchandise",
    template: "%s | UB Merch",
  },
  description: "Koleksi merchandise official kualitas terbaik untuk mahasiswa dan alumni Universitas Brawijaya. Bangga menjadi bagian dari Brawijaya!",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ubmerch.co.id'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ubmerch.co.id',
    siteName: 'UB Merch',
    title: 'UB Merch - Official Universitas Brawijaya Merchandise',
    description: 'Koleksi merchandise official kualitas terbaik untuk mahasiswa dan alumni Universitas Brawijaya.',
    images: [
      {
        url: '/images/reusable/Logo Ub Merch.png',
        width: 1200,
        height: 630,
        alt: 'UB Merch - Merchandise Resmi Universitas Brawijaya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UB Merch - Official Universitas Brawijaya Merchandise',
    description: 'Koleksi merchandise official kualitas terbaik untuk mahasiswa dan alumni Universitas Brawijaya.',
    images: ['/images/reusable/Logo Ub Merch.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
