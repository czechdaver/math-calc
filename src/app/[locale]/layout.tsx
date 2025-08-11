import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import CookieBanner from '@/components/CookieBanner';

// Define supported locales as a constant to avoid repetition
const supportedLocales = ['cs', 'en', 'sk', 'pl', 'hu'] as const;
export type Locale = (typeof supportedLocales)[number];

type Props = {
  children: ReactNode;
  params: { locale: Locale };
};

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  // Access locale from params
  const { locale } = params;
  
  // TypeScript will ensure locale is one of the supported locales
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  // Load messages for the current locale
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    // Log in development for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Failed to load messages for locale: ${locale}`, error);
    }
    notFound();
  }

  return (
    <NextIntlClientProvider 
      locale={locale}
      messages={messages}
      timeZone="Europe/Prague"
    >
      {children}
      <CookieBanner />
    </NextIntlClientProvider>
  );
}
