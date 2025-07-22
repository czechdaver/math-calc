// src/app/[locale]/calculator/unit-converter/page.tsx
'use client';

import React from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Ruler, Scale, Droplets, Thermometer, ArrowRightLeft } from 'lucide-react';

// Dynamically import the calculator with SSR disabled to avoid hydration issues
const UnitConverter = dynamic(
  () => import('@/components/calculators/UnitConverter'),
  { 
    ssr: false,
    loading: () => <div className="h-[600px] w-full rounded-md animate-pulse bg-muted" />
  }
);

const PrevodnikJednotekPage: React.FC = () => {
  const { t } = useTranslation('unitConverter');

  // SEO metadata
  const seoTitle = t('unit_converter');
  const seoDescription = t('unit_converter_description');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {seoTitle}
        </h1>
        <p className="text-muted-foreground">
          {seoDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Calculator Section */}
        <div className="lg:col-span-2">
          <UnitConverter />
        </div>

        {/* Sidebar with Information */}
        <div className="space-y-6">
          {/* Supported Units Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('supported_units')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Ruler className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{t('length')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('length_units')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Scale className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{t('weight')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('weight_units')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Droplets className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{t('volume')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('volume_units')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Thermometer className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{t('temperature')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('temperature_units')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips Card */}
          <Card className="border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {t('quick_tips')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <ArrowRightLeft className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  {t('swap_units_tip')}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  {t('precision_info')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>

      {/* Přidáno AdBanner (in-content mezi sekcemi) */}
      <AdBanner placement="in-content" />

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

      {/* Přidáno AdBanner (sticky bottom na mobilu) */}
      <AdBanner placement="sticky-bottom" />

    </div>
  );
};

export default PrevodnikJednotekPage;
