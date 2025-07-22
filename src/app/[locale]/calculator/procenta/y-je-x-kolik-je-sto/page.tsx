// src/app/[locale]/calculator/percentages/find-percentage/page.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import LatexRenderer from '@/components/utils/LatexRenderer';
import SeoMetadata from '@/components/seo/SeoMetadata';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dynamically import the calculator component with SSR disabled
const YJeXKolikJeStoCalculator = dynamic(
  () => import('@/components/calculators/YIsXWhatIsHundredCalculator'),
  { ssr: false }
);

const YJeXKolikJeStoPage: React.FC = () => {
  const { t } = useTranslation('common');

  // Get translations with fallbacks
  const seoTitle = t('y_je_x_kolik_je_sto_title') || 'Y je X% - kolik je 100%?';
  const seoDescription = t('y_je_x_kolik_je_sto_seo_description') || 'Spočítejte si celkovou hodnotu (100%), pokud znáte část (Y) a její procentuální podíl (X%).';
  const formula = t('y_je_x_kolik_je_sto_formula') || '\\text{100\\%} = \\left(\\frac{\\text{Y} \\times 100}{\\text{X}}\\right) \\%';
  const explanation = t('y_je_x_kolik_je_sto_explanation') || 'Tato kalkulačka vám pomůže vypočítat celkovou hodnotu (100%), pokud znáte část (Y) a její procentuální podíl (X%). Tento výpočet je užitečný například při zjišťování původní ceny před slevou nebo celkového množství na základě známého procentuálního podílu.';

  return (
    <div className="container mx-auto p-4">
      <SeoMetadata title={seoTitle} description={seoDescription} />

      <h1 className="text-3xl font-bold mb-6">{seoTitle}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('kalkulacka') || 'Kalkulačka'}</CardTitle>
            </CardHeader>
            <CardContent>
              <YJeXKolikJeStoCalculator />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('jak_pocitat')} {t('y_je_x_kolik_je_sto_title')?.toLowerCase()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>{explanation}</p>
                <div className="mt-4 p-3 bg-muted/50 rounded">
                  <LatexRenderer formula={formula} displayMode={true} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('priklady_pouziti') || 'Příklady použití'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                <li>{t('priklad1_y_je_x_kolik_je_sto') || 'Výpočet původní ceny před slevou'}</li>
                <li>{t('priklad2_y_je_x_kolik_je_sto') || 'Zjištění celkového počtu na základě procentuálního podílu'}</li>
                <li>{t('priklad3_y_je_x_kolik_je_sto') || 'Přepočet mezi různými procentuálními podíly'}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">{t('dalsi_informace') || 'Další informace'}</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>
            {t('y_je_x_kolik_je_sto_dalsi_info') || 
            'Tato kalkulačka je užitečná v mnoha situacích, kdy potřebujete zjistit celkovou hodnotu na základě známého procentuálního podílu. ' +
            'Například pokud víte, že sleva 25% představuje 150 Kč, můžete snadno zjistit původní cenu zboží.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default YJeXKolikJeStoPage;
