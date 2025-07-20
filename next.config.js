/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['cs', 'sk', 'pl', 'hu'],
    defaultLocale: 'cs',
    localeDetection: true,
  },
};

module.exports = nextConfig;
