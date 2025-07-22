// src/app/[locale]/calculator/financie-rozsirene/slozene-uroceni/page.tsx
'use client';

import React from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
// Simple skeleton component since the shadcn/ui one is not available
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-muted rounded-md ${className}`} />
);
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

// Dynamically import the calculator with SSR disabled to avoid hydration issues
const CompoundInterestCalculator = dynamic(
  () => import('@/components/calculators/CompoundInterestCalculator.refactored'),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full rounded-md" />
  }
);

const SlozeneUroceniPage: React.FC = () => {
  const { t } = useTranslation('calculator');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* SEO Metadata */}
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {t('compound_interest_calculator')}
      </h1>
      <p className="text-muted-foreground mb-8">
        {t('compound_interest_calculator_description')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('calculator')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CompoundInterestCalculator />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('about_compound_interest')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{t('compound_interest_explanation')}</p>
              
              <div className="p-4 bg-muted/50 rounded-md">
                <h3 className="font-semibold mb-2">{t('formula')}:</h3>
                <code className="block bg-background p-2 rounded text-sm overflow-x-auto">
                  A = P(1 + r/n)^(nt)
                </code>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>A = {t('future_value')}</li>
                  <li>P = {t('principal')}</li>
                  <li>r = {t('annual_interest_rate')}</li>
                  <li>n = {t('compounding_periods_per_year')}</li>
                  <li>t = {t('time_in_years')}</li>
                </ul>
              </div>

              <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  {t('compound_interest_tip')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('common_questions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{t('what_is_compound_interest')}?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('compound_interest_definition')}
                </p>
              </div>
              <div>
                <h4 className="font-medium">{t('how_often_should_compound')}?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('compounding_frequency_explanation')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SlozeneUroceniPage;
