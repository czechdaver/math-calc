// src/app/[locale]/calculator/prevodnik-jednotek/page.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import UnitConverter from '@/components/calculators/UnitConverter';

const PrevodnikJednotekPage: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <div>
      <h1>{t('unit_converter_title')}</h1>
      <UnitConverter />
      {/* Zde budou další prvky stránky */}
    </div>
  );
};

export default PrevodnikJednotekPage;
