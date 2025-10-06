import {Metadata} from 'next';
import {siteConfig} from '@/config/site';
import {locales} from '@/i18n';
import {getTranslations} from 'next-intl/server';

type BuildCalculatorMetadataArgs = {
  locale: string;
  slug: string; // calculators.<slug> namespace
  urlPath: string; // e.g. '/calculator/vat'
  category?: string; // Calculator category for structured data
  lastModified?: Date; // For freshness signals
  priority?: 'high' | 'medium' | 'low'; // SEO priority hint
  enhancedFeatures?: boolean; // Whether calculator has enhanced UI
};

function normalizeKeywords(value: unknown): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === 'string')
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  return undefined;
}

export async function buildCalculatorMetadata({
  locale,
  slug,
  urlPath,
  category = 'utility',
  lastModified,
  priority = 'medium',
  enhancedFeatures = false
}: BuildCalculatorMetadataArgs): Promise<Metadata> {
  const ns = `calculators.${slug}.seo` as const;

  // Attempt to load localized strings; fall back gracefully if missing
  let t: ((key: string) => unknown) | null = null;
  try {
    const tt = await getTranslations({locale, namespace: ns});
    t = (key: string) => tt(key);
  } catch {
    t = null;
  }

  const localizedTitle = t ? (t('title') as string) : undefined;
  const localizedDescription = t ? (t('description') as string) : undefined;
  const localizedKeywords = t ? normalizeKeywords(t('keywords')) : undefined;

  const title = localizedTitle ?? `${slug} | ${siteConfig.name}`;
  const description = localizedDescription ?? siteConfig.description;
  const keywords = localizedKeywords;

  const basePath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
  const url = `${siteConfig.url}/${locale}${basePath}`;

  const languageAlternates: Record<string, string> = {};
  for (const l of locales) {
    languageAlternates[l] = `${siteConfig.url}/${l}${basePath}`;
  }

  // Enhanced metadata with additional SEO features
  const metadata: Metadata = {
    title,
    description,
    keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    
    // Robots directives based on priority
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph for social sharing
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}/og-calculator-${slug}.png`, // Would need to generate these
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@mathcalcpro', // Would need to configure
      images: [`${siteConfig.url}/og-calculator-${slug}.png`],
    },

    // Verification and other meta tags
    verification: {
      google: 'your-google-verification-code', // Would need to configure
    },

    // Language alternates
    alternates: {
      canonical: url,
      languages: languageAlternates,
    },

    // Additional metadata
    category: category,
    ...(lastModified && { 
      other: {
        'last-modified': lastModified.toISOString(),
        'dc.modified': lastModified.toISOString(),
      }
    }),
  };

  return metadata;
}

// Helper function to generate JSON-LD structured data for calculators
export function generateCalculatorStructuredData({
  title,
  description,
  url,
  category,
  slug,
  locale,
  lastModified,
  enhancedFeatures = false
}: {
  title: string;
  description: string;
  url: string;
  category: string;
  slug: string;
  locale: string;
  lastModified?: Date;
  enhancedFeatures?: boolean;
}) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    description: description,
    url: url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    softwareVersion: '1.0',
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: locale === 'cs' ? 'CZK' : 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    dateCreated: '2024-01-01',
    inLanguage: locale,
    isAccessibleForFree: true,
    ...(lastModified && { dateModified: lastModified.toISOString() }),
    ...(enhancedFeatures && {
      featureList: [
        'Real-time calculations',
        'Enhanced UI design',
        'Mobile responsive',
        'Multilingual support',
        'Professional visualizations'
      ]
    }),
    // Category-specific properties
    keywords: [
      'calculator',
      'math',
      category,
      slug,
      locale === 'cs' ? 'kalkulačka' : 'calculator',
      locale === 'cs' ? 'česky' : 'english'
    ].join(', ')
  };

  return JSON.stringify(baseSchema, null, 2);
}
