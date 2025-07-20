// src/app/[locale]/calculator/procenta/procento-z-cisla/page.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import ProcentoZCislaCalculator from '@/components/calculators/ProcentoZCislaCalculator';

const ProcentoZCislaPage: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <div>
      <h1>{t('procento_z_cisla_title')}</h1>
      <ProcentoZCislaCalculator />
      {/* Zde budou další prvky stránky jako vysvětlení, příklady, FAQ atd. */}
    </div>
  );
};

export default ProcentoZCislaPage;
