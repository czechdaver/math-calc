const withNextIntl = require('next-intl/plugin')('./next-intl.config.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Configure image optimization
  // Configure image optimization
  images: {
    // domains: ['localhost'], // Uncomment for local development if needed
    // remotePatterns: [], // Add production domains here
    unoptimized: process.env.NODE_ENV === 'development', // Optional: disable optimization in dev
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // Webpack configuration for better bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't include moment.js locales in client bundle
      config.resolve.alias.moment = 'moment/moment.js';
    }
    return config;
  },
};

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(withNextIntl(nextConfig));
