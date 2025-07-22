// src/app/[locale]/calculator/percentages/percentage-of/page.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import LatexRenderer from '@/components/utils/LatexRenderer';
import SeoMetadata from '@/components/seo/SeoMetadata';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dynamically import the calculator component with SSR disabled
const ProcentoZCislaCalculator = dynamic(
  () => import('@/components/calculators/PercentageOfNumberCalculator'),
  { ssr: false }
);

const ProcentoZCislaPage: React.FC = () => {
  const { t } = useTranslation('common');

  // Get translations with fallbacks
  const seoTitle = t('procento_z_cisla_title') || 'Procento z čísla';
  const seoDescription = t('procento_z_cisla_seo_description') || 'Vypočítejte X procent z daného čísla. Zadejte percentages a číslo pro výpočet.';
  const formula = t('procento_z_cisla_formula') || '\\text{Výsledek} = \\frac{\\text{Procenta}}{100} \\times \\text{Číslo}';
  const explanation = t('procento_z_cisla_explanation') || 'Výpočet procent z čísla se používá pro zjištění, jakou hodnotu představuje dané procento z celku. Tento výpočet je užitečný například při výpočtu slev, daní, přirážek a dalších procentuálních hodnot.';

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
              <ProcentoZCislaCalculator />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('jak_pocitat')} {t('procento_z_cisla_title')?.toLowerCase()}</CardTitle>
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
                <li>{t('priklad1_procento_z_cisla') || 'Výpočet slevy z ceny zboží'}</li>
                <li>{t('priklad2_procento_z_cisla') || 'Výpočet daně z přidané hodnoty (DPH)'}</li>
                <li>{t('priklad3_procento_z_cisla') || 'Výpočet provize z prodeje'}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">{t('dalsi_informace') || 'Další informace'}</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>
            {t('procento_z_cisla_dalsi_info') || 
            'Výpočet procent z čísla je základní matematická operace, která se používá v každodenním životě. ' +
            'S touto kalkulačkou můžete snadno vypočítat jakoukoliv procentuální hodnotu z libovolného čísla. ' +
            'Stačí zadat percentages a číslo, ze kterého chcete percentages vypočítat.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcentoZCislaPage;
