// src/app/[locale]/calculator/dph/page.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import DPHCalculator from '@/components/calculators/DPHCalculator';

const DPHPage: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <div>
      <h1>{t('dph_calculator_title')}</h1>
      <DPHCalculator />
      {/* Zde budou další prvky stránky */}
    </div>
  );
};

export default DPHPage;
