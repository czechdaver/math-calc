// src/app/[locale]/calculator/trojclenka/prima-umera/page.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import LatexRenderer from '@/components/utils/LatexRenderer';
import SeoMetadata from '@/components/seo/SeoMetadata';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dynamically import the calculator component with SSR disabled
const PrimaUmeraCalculator = dynamic(
  () => import('@/components/calculators/PrimaUmeraCalculator.refactored'),
  { ssr: false }
);

const PrimaUmeraPage: React.FC = () => {
  const { t } = useTranslation('common');

  // Get translations with fallbacks
  const seoTitle = t('prima_umera_title') || 'Přímá úměra';
  const seoDescription = t('prima_umera_seo_description') || 'Vypočítejte hodnotu přímé úměry podle vzorce: (C × B) / A';
  const formula = t('prima_umera_formula') || '\\text{Výsledek} = \\frac{C \\times B}{A}';
  const explanation = t('prima_umera_explanation') || 'Přímá úměra popisuje vztah, kdy s rostoucí hodnotou jedné veličiny roste i hodnota druhé veličiny a naopak. Vzorec pro výpočet je (C × B) / A.';

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
              <PrimaUmeraCalculator />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('jak_pocitat')} {t('prima_umera_title')?.toLowerCase()}</CardTitle>
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
                <li>{t('priklad1_prima_umera') || 'Výpočet ceny za určité množství zboží'}</li>
                <li>{t('priklad2_prima_umera') || 'Převod mezi různými měrnými jednotkami'}</li>
                <li>{t('priklad3_prima_umera') || 'Výpočet času na základě rychlosti a vzdálenosti'}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">{t('dalsi_informace') || 'Další informace'}</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>
            {t('prima_umera_dalsi_info') || 
            'Přímá úměra je matematický vztah, který popisuje závislost mezi dvěma veličinami, ' +
            'kdy s rostoucí hodnotou jedné veličiny roste i hodnota druhé veličiny a naopak. ' +
            'Tento vztah se často používá v praktických výpočtech, jako je výpočet ceny zboží, ' +
            'převod jednotek nebo výpočet času a vzdálenosti.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrimaUmeraPage;
