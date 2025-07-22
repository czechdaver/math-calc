// src/app/[locale]/calculator/financie-rozsirene/anuitni-splatka/page.tsx
'use client';

import React from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Calculator, DollarSign, Calendar, Percent } from 'lucide-react';

// Dynamically import the calculator with SSR disabled to avoid hydration issues
const AnuitniSplatkaCalculator = dynamic(
  () => import('@/components/calculators/AnuitniSplatkaCalculator.refactored'),
  { 
    ssr: false,
    loading: () => <div className="h-[600px] w-full rounded-md animate-pulse bg-muted" />
  }
);

const AnuitniSplatkaPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t('anuitni_splatka_title')}
        </h1>
        <p className="text-muted-foreground">
          {t('anuitni_splatka_page_description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Calculator Section */}
        <div className="lg:col-span-2">
          <AnuitniSplatkaCalculator />
        </div>

        {/* Sidebar with Information */}
        <div className="space-y-6">
          {/* What is Annuity Payment? */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">
                  {t('what_is_annuity_payment')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{t('annuity_payment_definition')}</p>
              <p>{t('annuity_payment_advantages')}</p>
            </CardContent>
          </Card>

          {/* How to Use This Calculator */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">
                  {t('how_to_use_calculator')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{t('enter_loan_amount')}</p>
                  <p className="text-muted-foreground">{t('enter_loan_amount_desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                  <Percent className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{t('enter_interest_rate')}</p>
                  <p className="text-muted-foreground">{t('enter_interest_rate_desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{t('enter_loan_term')}</p>
                  <p className="text-muted-foreground">{t('enter_loan_term_desc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {t('additional_information')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="text-muted-foreground">
                {t('annuity_calculator_disclaimer')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnuitniSplatkaPage;
