// src/app/[locale]/calculator/cista-mzda/page.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import CistaMzdaCalculator from '@/components/calculators/CistaMzdaCalculator';
import SeoMetadata from '@/components/seo/SeoMetadata'; // Odkomentováno

// TODO: Přidat import pro komponenty Ads, až budou k dispozici
// import AdBanner from '@/components/ads/AdBanner';

const CistaMzdaPage: React.FC = () => {
  const { t } = useTranslation('common');

  // TODO: Získat SEO metadata, vysvětlení a příklady pro tuto kalkulačku (např. z JSON souboru nebo databáze)
  const seoTitle = t('cista_mzda_calculator_title');
  const seoDescription = t('cista_mzda_seo_description'); // TODO: Přidat do lokalizace
  const explanation = t('cista_mzda_explanation'); // TODO: Přidat do lokalizace (popis výpočtu a srážek)
  const examples = [
    // Příklady
  ];
  const relatedCalculators = [ // TODO: Přidat dle relevance
    // Související kalkulačky (např. Hrubá vs. čistá mzda vysvětlení)
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Přidáno SeoMetadata komponent */}
      <SeoMetadata title={seoTitle} description={seoDescription} />

      {/* TODO: Přidat AdBanner (header) */}
      {/* <AdBanner placement="header" /> */}

      <h1 className="text-3xl font-bold mb-6">{seoTitle}</h1>

      {/* Sekce pro vysvětlení a vzorce (může obsahovat dílčí vzorce renderované pomocí LatexRenderer)*/}
      {explanation && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">{t('explanation_title')}</h2> {/* TODO: Přidat do lokalizace */}
          {/* TODO: Zde vykreslit vysvětlení výpočtu a srážek */}
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

export default CistaMzdaPage;
