'use client';

import '../styles/globals.css';
import Script from 'next/script';
import CookieBanner from '@/components/CookieBanner';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getLocaleFromPath } from '@/i18n/utils';

const MEASUREMENT_ID = 'YOUR_MEASUREMENT_ID'; // TODO: Replace with your actual Measurement ID
const ADS_CLIENT_ID = 'ca-pub-YOUR_ADS_CLIENT_ID'; // TODO: Replace with your actual AdSense client ID
const COOKIE_CONSENT_KEY = 'cookie_consent';

// Load messages for the current locale
async function loadMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return {};
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);

  // Load messages when the component mounts or the locale changes
  useEffect(() => {
    async function load() {
      const loadedMessages = await loadMessages(locale);
      setMessages(loadedMessages);
      setIsLoading(false);
    }
    
    load();
  }, [locale]);
  
  // Set the document language
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    const handleConsentGranted = () => {
      console.log('Consent granted, loading tracking and personalized ads');

      // Load Google Analytics
      if (window.gtag) {
        window.gtag('config', MEASUREMENT_ID, {
          page_path: window.location.pathname,
        });
         // Grant ad and analytics storage consent
        window.gtag('consent', 'update', {
            'ad_storage': 'granted',
            'analytics_storage': 'granted'
        });
      }

      // Load Google AdSense (personalized ads)
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
        console.log('AdSense push command executed for personalized ads.');
      }
    };

    const handleConsentDenied = () => {
        console.log('Consent denied, loading non-personalized ads');

        // Deny ad and analytics storage consent, but grant necessary cookies
        if (window.gtag) {
             window.gtag('consent', 'update', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied'
            });
        }

         // Load Google AdSense (non-personalized ads) - This might require additional configuration
         // One approach is to load ads with restricted data processing or other parameters
         // The exact implementation for non-personalized ads can be complex and might depend on AdSense setup
         // A common way is to use a different push command or configure AdSense directly.
         // For demonstration, we'll just log a message and potentially still call push,
         // but AdSense might serve non-personalized ads based on consent signals.
         if (window.adsbygoogle) {
             // Note: The exact way to request non-personalized ads via push might vary
             // This is a simplified representation. Refer to AdSense documentation.
             window.adsbygoogle.push({
                 params: { google_consent_state: { ad_storage: 'denied' } }
             });
             console.log('AdSense push command executed for non-personalized ads (attempt).');
         }

    };

    // Listen for the custom consent events
    window.addEventListener('consentGranted', handleConsentGranted);
    window.addEventListener('consentDenied', handleConsentDenied);

    // Check consent status on mount and trigger appropriate handler
    const initialConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (initialConsent === 'granted') {
        handleConsentGranted();
    } else if (initialConsent === 'denied') {
        handleConsentDenied();
    }

    // Clean up the event listeners on component unmount
    return () => {
      window.removeEventListener('consentGranted', handleConsentGranted);
      window.removeEventListener('consentDenied', handleConsentDenied);
    };
  }, []);

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
      <head>
        <title>Math Calculator</title>
        <meta name="description" content="A calculator application with multiple calculation tools" />
        <link rel="canonical" href={`https://yourdomain.com/${locale}`} />
        <link rel="alternate" hrefLang="en" href="https://yourdomain.com/en" />
        <link rel="alternate" hrefLang="cs" href="https://yourdomain.com/cs" />
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
      <body>
        <NextIntlClientProvider 
          locale={locale} 
          messages={messages}
          timeZone="Europe/Prague"
        >
          {children}
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
