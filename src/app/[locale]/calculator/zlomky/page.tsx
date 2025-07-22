// src/app/[locale]/calculator/zlomky/page.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import LatexRenderer from '@/components/utils/LatexRenderer';
import SeoMetadata from '@/components/seo/SeoMetadata';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dynamically import the calculator component with SSR disabled
const ZlomkyCalculator = dynamic(
  () => import('@/components/calculators/ZlomkyCalculator.refactored'),
  { ssr: false }
);

const ZlomkyPage: React.FC = () => {
  const { t } = useTranslation('common');

  // Get translations with fallbacks
  const seoTitle = t('zlomky_calculator_title') || 'Kalkulačka zlomků';
  const seoDescription = t('zlomky_seo_description') || 'Výkonná kalkulačka pro práci se zlomky. Sčítání, odčítání, násobení, dělení, krácení a převod zlomků na desetinná čísla.';
  const explanation = t('zlomky_explanation') || 'Kalkulačka zlomků umožňuje provádět základní matematické operace se zlomky. Vyberte požadovanou operaci z rozbalovací nabídky a zadejte potřebné hodnoty. Kalkulačka vám poskytne podrobný postup řešení včetně mezivýpočtů.';

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
              <ZlomkyCalculator />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('jak_pocitat')} {t('zlomky_calculator_title')?.toLowerCase()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>{explanation}</p>
                <div className="mt-4 p-3 bg-muted/50 rounded">
                  <h4 className="font-medium mb-2">{t('dostupne_operace') || 'Dostupné operace:'}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('zlomky_operation_scitani') || 'Sčítání zlomků'}</li>
                    <li>{t('zlomky_operation_odcitani') || 'Odčítání zlomků'}</li>
                    <li>{t('zlomky_operation_nasobeni') || 'Násobení zlomků'}</li>
                    <li>{t('zlomky_operation_deleni') || 'Dělení zlomků'}</li>
                    <li>{t('zlomky_operation_zkracovani') || 'Krácení zlomků'}</li>
                    <li>{t('zlomky_operation_prevod') || 'Převod zlomku na desetinné číslo'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('priklady_pouziti') || 'Příklady použití'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="p-3 bg-muted/30 rounded">
                  <h4 className="font-medium">{t('priklad1_zlomky') || 'Sčítání zlomků'}</h4>
                  <div className="text-sm text-muted-foreground mt-1">
                    <LatexRenderer formula="\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}" />
                  </div>
                </li>
                <li className="p-3 bg-muted/30 rounded">
                  <h4 className="font-medium">{t('priklad2_zlomky') || 'Násobení zlomků'}</h4>
                  <div className="text-sm text-muted-foreground mt-1">
                    <LatexRenderer formula="\\frac{2}{3} \\times \\frac{3}{4} = \\frac{6}{12} = \\frac{1}{2}" />
                  </div>
                </li>
                <li className="p-3 bg-muted/30 rounded">
                  <h4 className="font-medium">{t('priklad3_zlomky') || 'Převod na desetinné číslo'}</h4>
                  <div className="text-sm text-muted-foreground mt-1">
                    <LatexRenderer formula="\\frac{3}{8} = 0.375" />
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">{t('dalsi_informace') || 'Další informace'}</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>
            {t('zlomky_dalsi_info') || 
            'Zlomky jsou základním matematickým konceptem používaným k vyjádření části celku. ' +
            'Skládají se z čitatele (horní část) a jmenovatele (dolní část). ' +
            'Při práci se zlomky je důležité znát základní pravidla pro jejich sčítání, odčítání, násobení a dělení.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZlomkyPage;
