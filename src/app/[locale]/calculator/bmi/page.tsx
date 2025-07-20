// src/app/[locale]/calculator/bmi/page.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import BMICalculator from '@/components/calculators/BMICalculator';

const BMIPage: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <div>
      <h1>{t('bmi_calculator_title')}</h1>
      <BMICalculator />
      {/* Zde budou další prvky stránky, jako kategorizace a vysvětlení */}
    </div>
  );
};

export default BMIPage;
