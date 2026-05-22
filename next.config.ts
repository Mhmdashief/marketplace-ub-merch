import type { NextConfig } from "next";

// Security headers untuk semua halaman
const securityHeaders = [
  // Cegah clickjacking
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Cegah MIME type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // DNS prefetch control
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Referrer policy
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Batasi penggunaan browser API
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // HSTS - paksa HTTPS (hanya aktif di production)
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    : []),
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Terapkan ke semua route
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        // Google profile images (OAuth admin jika diperlukan)
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  experimental: {
    serverActions: {
      // Batas 10 MB untuk upload gambar produk melalui server action
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;