import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
      // Izinkan ngrok dan tunnel lainnya untuk Server Actions
      allowedOrigins: [
        'localhost:3000',
        '*.ngrok.io',
        '*.ngrok-free.app',
        '*.ngrok.app',
      ],
    },
  },

  // Izinkan semua host ngrok untuk development
  allowedDevOrigins: [
    '*.ngrok.io',
    '*.ngrok-free.app',
    '*.ngrok.app',
  ],
};

export default nextConfig;