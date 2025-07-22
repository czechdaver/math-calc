import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';

interface ResponsiveLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string[];
  className?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  title,
  description,
  keywords = [],
  className = '',
}) => {
  const { t } = useTranslation('common');
  const pageTitle = title ? `${title} | ${t('app_name')}` : t('app_name');
  
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description || t('default_meta_description')} />
        <meta name="keywords" content={keywords.join(', ')} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#3B82F6" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description || t('default_meta_description')} />
        <meta property="og:site_name" content={t('app_name')} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description || t('default_meta_description')} />
      </Head>
      
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveLayout;
