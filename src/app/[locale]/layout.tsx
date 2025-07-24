'use client';

import { NextIntlClientProvider } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getLocaleFromPath } from '@/i18n/utils';
import Head from 'next/head';

// This is a client component that handles the entire layout
export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);

  // Set the document language
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Load messages for the current locale
  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = (await import(`@/messages/${locale}.json`)).default;
        setMessages(loadedMessages);
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMessages();
  }, [locale]);

  if (isLoading) {
    return (
      <html lang={locale}>
        <body>
          <div>Loading...</div>
        </body>
      </html>
    );
  }

  return (
    <html lang={locale}>
      <Head>
        <title>Math Calculator</title>
        <meta name="description" content="A calculator application with multiple calculation tools" />
        <link rel="canonical" href={`https://yourdomain.com/${locale}`} />
        <link rel="alternate" hrefLang="en" href="https://yourdomain.com/en" />
        <link rel="alternate" hrefLang="cs" href="https://yourdomain.com/cs" />
        <link rel="alternate" hrefLang="x-default" href="https://yourdomain.com/en" />
      </Head>
      <body>
        <NextIntlClientProvider 
          locale={locale}
          messages={messages}
          timeZone="Europe/Prague"
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}