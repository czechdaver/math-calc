import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import Script from 'next/script';
import { Inter, Fraunces } from 'next/font/google';
import CookieBanner from '@/components/CookieBanner';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import MainNavigation from '@/components/navigation/MainNavigation';
import '@/styles/globals.css';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import GoogleTagManager, { GoogleTagManagerNoScript } from '@/components/analytics/GoogleTagManager';


// Font configuration
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

// Define supported locales as a constant to avoid repetition
const supportedLocales = ['cs', 'en', 'sk', 'pl', 'hu'] as const;
export type Locale = (typeof supportedLocales)[number];

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const ADS_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX';

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  // Access locale from params asynchronously
  const { locale } = await params;

  // TypeScript will ensure locale is one of the supported locales
  // We use 'as any' here because locale is typed as string but supportedLocales expects specific string literals
  if (!supportedLocales.includes(locale as any)) {
    notFound();
  }

  // Safe to cast after the check
  const validLocale = locale as Locale;

  // Load messages for the current locale
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }

  const t = await getTranslations({ locale });

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        <GoogleTagManager />
        <title>{t('app_name')}</title>
        <meta name="description" content={t('homepage.categories_description')} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href={`https://yourdomain.com/${locale}`} />
        <link rel="alternate" hrefLang="en" href="https://yourdomain.com/en" />
        <link rel="alternate" hrefLang="cs" href="https://yourdomain.com/cs" />
        <link rel="alternate" hrefLang="sk" href="https://yourdomain.com/sk" />
        <link rel="alternate" hrefLang="pl" href="https://yourdomain.com/pl" />
        <link rel="alternate" hrefLang="hu" href="https://yourdomain.com/hu" />
        <link rel="alternate" hrefLang="x-default" href="https://yourdomain.com/en" />

        {/* Google Adsense Script */}
        <Script
          id="adsense-script"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className="font-body">
        <GoogleTagManagerNoScript />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <ThemeProvider>
          <NextIntlClientProvider
            locale={locale}
            messages={messages}
            timeZone="Europe/Prague"
          >
            <MainNavigation />
            <main className="pt-20 pb-16 min-h-screen">
              {children}
            </main>
            <CookieBanner />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
