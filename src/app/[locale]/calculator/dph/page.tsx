// src/app/[locale]/calculator/dph/page.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import DPHCalculator from '@/components/calculators/DPHCalculator';
import LatexRenderer from '@/components/utils/LatexRenderer';
import SeoMetadata from '@/components/seo/SeoMetadata'; // Odkomentováno

// TODO: Přidat import pro komponenty Ads, až budou k dispozici
// import AdBanner from '@/components/ads/AdBanner';

const DPHPage: React.FC = () => {
  const { t } = useTranslation('common');

  // TODO: Získat SEO metadata, vysvětlení a příklady pro tuto kalkulačku (např. z JSON souboru nebo databáze)
  const seoTitle = t('dph_calculator_title');
  const seoDescription = t('dph_seo_description'); // TODO: Přidat do lokalizace
  const formulaBaseToTotal = t('dph_formula_base_to_total');
  const formulaTotalToBase = t('dph_formula_total_to_base');
  const explanation = t('dph_explanation'); // TODO: Přidat do lokalizace
  const examples = [
    // Příklady
  ];
  const relatedCalculators = [ // TODO: Přidat dle relevance
    // Související kalkulačky
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Přidáno SeoMetadata komponent */}
      <SeoMetadata title={seoTitle} description={seoDescription} />

      {/* TODO: Přidat AdBanner (header) */}
      {/* <AdBanner placement="header" /> */}

      <h1 className="text-3xl font-bold mb-6">{seoTitle}</h1>

      {/* Zobrazit matematické vzorce */}
      <div className="mb-6 border p-4 rounded">
         <h2 className="text-xl font-semibold mb-2">{t('formula_title')}</h2> {/* TODO: Přidat do lokalizace */}
        {formulaBaseToTotal && (
          <div className="mb-4">
             <p className="text-lg font-medium">{t('direction_base_to_total')}:</p>
            <LatexRenderer formula={formulaBaseToTotal} displayMode={true} />
          </div>
        )}
        {formulaTotalToBase && (
          <div>
            <p className="text-lg font-medium">{t('direction_total_to_base')}:</p>
            <LatexRenderer formula={formulaTotalToBase} displayMode={true} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <DPHCalculator />
        </div>
         <div>
          {/* TODO: Přidat AdBanner (sidebar na desktopu) */}
          {/* <AdBanner placement="sidebar" /> */}
        </div>
      </div>

      {/* TODO: Přidat AdBanner (in-content mezi sekcemi) */}
      {/* <AdBanner placement="in-content" /> */}

      {explanation && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">{t('explanation_title')}</h2> {/* TODO: Přidat do lokalizace */}
          {/* TODO: Zde vykreslit vysvětlení */}
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

export default DPHPage;
