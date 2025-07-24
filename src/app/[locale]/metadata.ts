import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { locales } from '@/i18n';
import { notFound } from 'next/navigation';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params?.locale || 'en';
  
  // Validate the locale
  if (!locales.includes(locale as any)) {
    notFound();
  }
  
  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
      'calculator',
      'math',
      'mathematics',
      'percentage calculator',
      'unit converter',
      'fractions',
      'algebra',
      'geometry',
      'statistics',
      'finance',
      'engineering',
      'science',
      'education',
      'online calculator',
      'free calculator',
      'math tools',
      locale,
    ],
    authors: [
      {
        name: 'MathCalc Pro Team',
        url: 'https://mathcalc.pro',
      },
    ],
    creator: 'MathCalc Pro Team',
    openGraph: {
      type: 'website',
      locale: locale,
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}/og.jpg`,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [`${siteConfig.url}/og.jpg`],
      creator: '@mathcalcpro',
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: `${siteConfig.url}/site.webmanifest`,
  };
}
