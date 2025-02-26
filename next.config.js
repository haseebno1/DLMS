/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during production builds for better performance
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure image optimization
  images: {
    domains: [
      'tbmslfkurtqvfxnbtxju.supabase.co',
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}`.replace('https://', ''),
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Enable React strict mode for better development
  reactStrictMode: true,

  // Customize the build output
  output: 'standalone',

  // Configure redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },

  // Configure headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
