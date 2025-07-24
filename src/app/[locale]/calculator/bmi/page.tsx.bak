// src/app/[locale]/calculator/bmi/page.tsx
'use client';

import React from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import SeoMetadata from '@/components/seo/SeoMetadata';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

// Dynamically import the BMICalculator component with SSR disabled
const BMICalculator = dynamic(
  () => import('@/components/calculators/BMICalculator'),
  { ssr: false }
);

// TODO: Add import for Ads components when available
// import AdBanner from '@/components/ads/AdBanner';

const BMIPage: React.FC = () => {
  const { t } = useTranslation('common');
  
  // SEO Metadata
  const seoTitle = t('bmi_calculator_title');
  const seoDescription = t('bmi_seo_description');
  
  // BMI categories information
  const bmiCategories = [
    { range: '< 18.5', label: t('bmi_category_underweight'), className: 'text-blue-500' },
    { range: '18.5 - 24.9', label: t('bmi_category_normal'), className: 'text-green-500' },
    { range: '25.0 - 29.9', label: t('bmi_category_overweight'), className: 'text-yellow-500' },
    { range: '≥ 30.0', label: t('bmi_category_obese'), className: 'text-red-500' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* SEO Metadata */}
      <SeoMetadata 
        title={seoTitle} 
        description={seoDescription}
        keywords={['bmi calculator', 'body mass index', 'health calculator', t('bmi_calculator_title')]}
      />

      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{seoTitle}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('bmi_calculator_description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Calculator Section */}
        <div className="lg:col-span-2">
          <BMICalculator />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* BMI Categories */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('bmi_categories')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {bmiCategories.map((category, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium">{category.range}</span>
                    <span className={`font-semibold ${category.className}`}>
                      {category.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* BMI Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('about_bmi')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('bmi_about_text')}
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md text-sm">
                <div className="flex items-start">
                  <Info className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-yellow-800 dark:text-yellow-200">
                    {t('bmi_limitation_notice')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TODO: Add AdBanner (sidebar) */}
          {/* <AdBanner placement="sidebar" /> */}
        </div>
      </div>

      {/* TODO: Přidat AdBanner (in-content mezi sekcemi) */}
      {/* <AdBanner placement="in-content" /> */}

      {explanation && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">{t('explanation_title')}</h2> {/* TODO: Přidat do lokalizace */}
          {/* TODO: Zde vykreslit vysvětlení a popis kategorií */}
          <p>{explanation}</p>
        </div>
      )}

      {examples && examples.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">{t('examples_title')}</h2> {/* TODO: Přidat do lokalizace */}
          {/* TODO: Zobrazit příklady */}
          <p>Příklady budou zde.</p>
        </div>
      )}

      {relatedCalculators && relatedCalculators.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">{t('related_calculators_title')}</h2> {/* TODO: Přidat do lokalizace */}
          {/* TODO: Zobrazit související kalkulačky (např. odkazy) */}
          <ul>
            {relatedCalculators.map((calc, index) => (
              <li key={index}><a href={calc.href}>{calc.name}</a></li>
            ))}
          </ul>
        </div>
      )}

      {/* TODO: Přidat FAQ sekci */}
      {/* <div className="mt-8">FAQ sekce bude zde.</div> */}

      {/* TODO: Přidat AdBanner (sticky bottom na mobilu) */}
      {/* <AdBanner placement="sticky-bottom" /> */}

    </div>
  );
};

export default BMIPage;
