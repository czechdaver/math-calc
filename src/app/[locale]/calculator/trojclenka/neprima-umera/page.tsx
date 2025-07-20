// src/app/[locale]/calculator/trojclenka/neprima-umera/page.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import NeprimaUmeraCalculator from '@/components/calculators/NeprimaUmeraCalculator';
import LatexRenderer from '@/components/utils/LatexRenderer';
import SeoMetadata from '@/components/seo/SeoMetadata';
import AdBanner from '@/components/ads/AdBanner'; // Odkomentováno

// TODO: Získat SEO metadata, vysvětlení a příklady pro tuto kalkulačku (např. z JSON souboru nebo databáze)
  const seoTitle = t('neprima_umera_title');
  const seoDescription = t('neprima_umera_seo_description'); // TODO: Přidat do lokalizace
  const formula = t('neprima_umera_formula');
  const explanation = t('neprima_umera_explanation'); // TODO: Přidat do lokalizace
  const examples = [
    // Příklady
  ];
  const relatedCalculators = [ // TODO: Přidat dle relevance
    { name: t('prima_umera_title'), href: '/calculator/trojclenka/prima-umera' }
    // Další související kalkulačky
  ];

const NeprimaUmeraPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto p-4">
      <SeoMetadata title={seoTitle} description={seoDescription} />

      {/* Přidáno AdBanner (header) */}
      <AdBanner placement="header" />

      <h1 className="text-3xl font-bold mb-6">{seoTitle}</h1>

      {/* Zobrazit matematický vzorec */}
      <div className="mb-6 border p-4 rounded">
         <h2 className="text-xl font-semibold mb-2">{t('formula_title')}</h2> {/* TODO: Přidat do lokalizace */}
        {formula && <LatexRenderer formula={formula} displayMode={true} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <NeprimaUmeraCalculator />
        </div>
         <div>
          {/* Přidáno AdBanner (sidebar na desktopu) */}
          <AdBanner placement="sidebar" />
        </div>
      </div>

      {/* Přidáno AdBanner (in-content mezi sekcemi) */}
      <AdBanner placement="in-content" />

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

      {/* Přidáno AdBanner (sticky bottom na mobilu) */}
      <AdBanner placement="sticky-bottom" />

    </div>
  );
};

export default NeprimaUmeraPage;
