import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

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

export default withNextIntl(nextConfig);
