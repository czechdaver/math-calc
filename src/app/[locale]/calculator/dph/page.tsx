// src/app/[locale]/calculator/dph/page.tsx
'use client';

import React from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import SeoMetadata from '@/components/seo/SeoMetadata';

// Dynamically import the DPHCalculator component with SSR disabled
const DPHCalculator = dynamic(
  () => import('@/components/calculators/DPHCalculator.refactored'),
  { ssr: false }
);

// TODO: Add import for Ads components when available
// import AdBanner from '@/components/ads/AdBanner';

const DPHPage: React.FC = () => {
  const { t } = useTranslation('common');
  
  // SEO Metadata
  const seoTitle = t('dph_calculator_title');
  const seoDescription = t('dph_seo_description');
  
  // VAT rates information
  const vatRates = [
    {
      country: t('czech_republic'),
      rates: [
        { rate: '21%', description: t('basic_rate') },
        { rate: '15%', description: t('reduced_rate_food_medicine_books') },
        { rate: '10%', description: t('reduced_rate_children_books_magazines') },
      ],
    },
    {
      country: t('slovakia'),
      rates: [
        { rate: '20%', description: t('basic_rate') },
        { rate: '10%', description: t('reduced_rate_medicine_books_food') },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* SEO Metadata */}
      <SeoMetadata 
        title={seoTitle} 
        description={seoDescription}
      />

      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{seoTitle}</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {t('dph_calculator_description')}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calculator Section */}
        <div className="lg:col-span-2">
          <DPHCalculator />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* VAT Rates Information */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">{t('vat_rates')}</h2>
            <div className="space-y-6">
              {vatRates.map((country, index) => (
                <div key={index}>
                  <h3 className="font-medium text-lg mb-2">{country.country}:</h3>
                  <ul className="space-y-2">
                    {country.rates.map((rate, rateIndex) => (
                      <li key={rateIndex} className="flex items-start">
                        <span className="font-semibold w-12">{rate.rate}</span>
                        <span className="text-muted-foreground">{rate.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DPHPage;
