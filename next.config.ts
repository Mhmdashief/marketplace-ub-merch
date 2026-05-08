import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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