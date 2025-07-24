/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static optimization for better performance
  output: 'standalone',
  
  // Configure i18n
  i18n: {
    locales: ['en', 'cs'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  
  // Configure image optimization
  images: {
    domains: ['localhost'], // Add your production domain here
  },
  
  // Webpack configuration for better bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't include moment.js locales in client bundle
      config.resolve.alias.moment = 'moment/moment.js';
    }
    return config;
  },
  
  // Enable React 18 features
  experimental: {
    // Add any experimental features here
  },
};

module.exports = nextConfig;
