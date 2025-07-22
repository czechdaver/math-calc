// src/app/[locale]/calculator/percentages/percentage-of-number/page.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import LatexRenderer from '@/components/utils/LatexRenderer';
import SeoMetadata from '@/components/seo/SeoMetadata';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dynamically import the calculator component with SSR disabled
const KolikProcentJeXZYCalculator = dynamic(
  () => import('@/components/calculators/WhatPercentageIsXOfYCalculator'),
  { ssr: false }
);

const KolikProcentJeXZYPage: React.FC = () => {
  const { t } = useTranslation('common');

  // TODO: Získat SEO metadata, vysvětlení a příklady pro tuto kalkulačku (např. z JSON souboru nebo databáze)
  const seoTitle = t('kolik_procent_je_x_z_y_title');
  const seoDescription = t('kolik_procent_je_x_z_y_seo_description'); // TODO: Přidat do lokalizace
  const formula = t('kolik_procent_je_x_z_y_formula');
  const explanation = t('kolik_procent_je_x_z_y_explanation'); // TODO: Přidat do lokalizace
  const examples = [
    // Příklady
  ];
  const relatedCalculators = [ // TODO: Přidat dle relevance
    { name: t('procento_z_cisla_title'), href: '/calculator/percentages/percentage-of' }
    // Další související kalkulačky
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Přidáno SeoMetadata komponent */}
      <SeoMetadata title={seoTitle} description={seoDescription} />

      {/* TODO: Přidat AdBanner (header) */}
      {/* <AdBanner placement="header" /> */}

      <h1 className="text-3xl font-bold mb-6">{seoTitle}</h1>

      {/* Zobrazit matematický vzorec */}
      <div className="mb-6 border p-4 rounded">
         <h2 className="text-xl font-semibold mb-2">{t('formula_title')}</h2> {/* TODO: Přidat do lokalizace */}
        {formula && <LatexRenderer formula={formula} displayMode={true} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('kalkulacka')}</CardTitle>
            </CardHeader>
            <CardContent>
              <KolikProcentJeXZYCalculator />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('jak_pocitat')} {t('kolik_procent_je_x_z_y_title')?.toLowerCase()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>{t('kolik_procent_je_x_z_y_explanation')}</p>
                <div className="mt-4 p-3 bg-muted/50 rounded">
                  <LatexRenderer formula={formula} displayMode={true} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('priklady_pouziti')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                <li>{t('priklad1_kolik_procent_je_x_z_y')}</li>
                <li>{t('priklad2_kolik_procent_je_x_z_y')}</li>
                <li>{t('priklad3_kolik_procent_je_x_z_y')}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* TODO: Přidat AdBanner (in-content mezi sekcemi) */}
      {/* <AdBanner placement="in-content" /> */}

      {explanation && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">{t('explanation_title')}</h2> {/* TODO: Přidat do lokalizace */}
          {/* TODO: Zde vykreslit vysvětlení. Může obsahovat text a LatexRenderer pro jednotlivé převody */}
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

export default KolikProcentJeXZYPage;
