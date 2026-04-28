import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Google profile images (OAuth)
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        // Cloudinary - gambar produk & avatar
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/**`,
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;