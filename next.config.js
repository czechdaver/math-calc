const withNextIntl = require('next-intl/plugin')('./next-intl.config.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
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
};

module.exports = withNextIntl(nextConfig);
