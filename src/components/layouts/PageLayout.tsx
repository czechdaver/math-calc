import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import MainNavigation from '@/components/navigation/MainNavigation';
import Footer from '@/components/layouts/Footer';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string[];
  className?: string;
  fullWidth?: boolean;
  showFooter?: boolean;
  showNavigation?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  keywords = [],
  className = '',
  fullWidth = false,
  showFooter = true,
  showNavigation = true,
}) => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const pageTitle = title ? `${title} | ${t('app_name')}` : t('app_name');
  const pageDescription = description || t('default_meta_description');
  const pageKeywords = [...(keywords || []), 'calculator', 'math', 'mathematics', 'tools'];

  // Add language-specific keywords if available
  if (locale) {
    const languageKeywords = {
      cs: ['kalkulačka', 'matematika', 'výpočty'],
      sk: ['kalkulačka', 'matematika', 'výpočty'],
      pl: ['kalkulator', 'matematyka', 'obliczenia'],
      hu: ['kalkulátor', 'matematika', 'számítások'],
    };
    
    const additionalKeywords = languageKeywords[locale as keyof typeof languageKeywords] || [];
    pageKeywords.push(...additionalKeywords);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords.join(', ')} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#3B82F6" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:site_name" content={t('app_name')} />
        <meta property="og:locale" content={locale || 'en'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`}
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      {showNavigation && (
        <header className="sticky top-0 z-50">
          <MainNavigation />
        </header>
      )}

      <main
        className={cn(
          'flex-grow',
          fullWidth ? '' : 'max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8',
          className
        )}
      >
        {children}
      </main>

      {showFooter && <Footer />}

      {/* Global site tag (gtag.js) - Google Analytics */}
      {process.env.NODE_ENV === 'production' && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
    </div>
  );
};

export default PageLayout;
