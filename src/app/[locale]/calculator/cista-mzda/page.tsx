// src/app/[locale]/calculator/cista-mzda/page.tsx
'use client';

import React from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Calculator, Percent, Shield, HeartPulse, Banknote } from 'lucide-react';

// Dynamically import the calculator with SSR disabled to avoid hydration issues
const CistaMzdaCalculator = dynamic(
  () => import('@/components/calculators/CistaMzdaCalculator.refactored'),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full rounded-md animate-pulse bg-muted" />
  }
);

const CistaMzdaPage: React.FC = () => {
  const { t } = useTranslation('netSalaryCalculator');

  // SEO metadata
  const seoTitle = t('net_salary_calculator');
  const seoDescription = t('net_salary_calculator_description');

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
          <CistaMzdaCalculator />
        </div>

        {/* Sidebar with Information */}
        <div className="space-y-6">
          {/* About Net Salary Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('about_net_salary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{t('net_salary_explanation')}</p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Banknote className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{t('gross_salary')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('gross_salary_explanation')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Percent className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{t('taxes')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('taxes_explanation')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{t('social_insurance')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('social_insurance_explanation')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <HeartPulse className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{t('health_insurance')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('health_insurance_explanation')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer Card */}
          <Card className="border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {t('important_note')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('calculator_disclaimer')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* TODO: Přidat FAQ sekci */}
      {/* <div className="mt-8">FAQ sekce bude zde.</div> */}

      {/* TODO: Přidat AdBanner (sticky bottom na mobilu) */}
      {/* <AdBanner placement="sticky-bottom" /> */}

    </div>
  );
};

export default CistaMzdaPage;
