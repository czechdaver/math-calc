/**
 * Site configuration for MathCalc Pro
 * This file contains site-wide configuration and metadata
 */

export const siteConfig = {
  name: 'MathCalc Pro',
  url: 'https://www.mathcalcpro.com',
  description: 'Výkonná online kalkulačka pro všechny vaše matematické výpočty. Převody jednotek, procenta, DPH, BMI a mnoho dalšího.',
  mainNav: [
    {
      title: 'Domů',
      href: '/',
    },
    {
      title: 'Kalkulačky',
      href: '/kalkulacky',
    },
    {
      title: 'Převodník jednotek',
      href: '/prevodnik-jednotek',
    },
    {
      title: 'O aplikaci',
      href: '/o-aplikaci',
    },
  ],
  links: {
    github: 'https://github.com/czechdaver/math-calc',
    twitter: 'https://twitter.com/mathcalcpro',
    facebook: 'https://facebook.com/mathcalcpro',
    instagram: 'https://instagram.com/mathcalcpro',
  },
  author: {
    name: 'MathCalc Pro Team',
    url: 'https://www.mathcalcpro.com',
    email: 'info@mathcalcpro.com',
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'MathCalc Pro',
    title: 'MathCalc Pro - Online kalkulačky a převody jednotek',
    description: 'Výkonná online kalkulačka pro všechny vaše matematické výpočty. Převody jednotek, procenta, DPH, BMI a mnoho dalšího.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MathCalc Pro - Online kalkulačky a převody jednotek',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MathCalc Pro - Online kalkulačky a převody jednotek',
    description: 'Výkonná online kalkulačka pro všechny vaše matematické výpočty',
    images: ['/images/twitter-image.jpg'],
    creator: '@mathcalcpro',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  contact: {
    email: 'podpora@mathcalcpro.com',
    phone: '+420 123 456 789',
    address: 'Václavské náměstí 1, 110 00 Praha 1',
  },
  legal: {
    termsOfService: '/obchodni-podminky',
    privacyPolicy: '/ochrana-osobnich-udaju',
    cookiePolicy: '/pouziti-souboru-cookie',
  },
  features: {
    darkMode: true,
    multiLanguage: true,
    offlineSupport: true,
    pwa: true,
  },
  socials: [
    {
      name: 'GitHub',
      url: 'https://github.com/czechdaver/math-calc',
      icon: 'github',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/mathcalcpro',
      icon: 'twitter',
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/mathcalcpro',
      icon: 'facebook',
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
