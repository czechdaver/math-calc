import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import Script from 'next/script';
import { Inter, Fraunces } from 'next/font/google';
import CookieBanner from '@/components/CookieBanner';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import MainNavigation from '@/components/navigation/MainNavigation';
import '@/styles/globals.css';

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
  params: Promise<{ locale: Locale }>;
};

const MEASUREMENT_ID = 'YOUR_MEASUREMENT_ID'; // TODO: Replace with your actual Measurement ID
const ADS_CLIENT_ID = 'ca-pub-YOUR_ADS_CLIENT_ID'; // TODO: Replace with your actual AdSense client ID

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
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  // Load messages for the current locale
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        <title>Math Calculator</title>
        <meta name="description" content="A calculator application with multiple calculation tools" />
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

        {/* Google Analytics */}
        <Script id="google-consent-defaults">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied'
            });
          `}
        </Script>
        <Script
          id="google-analytics-script"
          src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
      </head>
      <body className="font-body">
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
