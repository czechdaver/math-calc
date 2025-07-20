// src/app/[locale]/calculator/trojclenka/prima-umera/page.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import PrimaUmeraCalculator from '@/components/calculators/PrimaUmeraCalculator';

const PrimaUmeraPage: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <div>
      <h1>{t('prima_umera_title')}</h1>
      <PrimaUmeraCalculator />
      {/* Zde budou další prvky stránky, včetně vysvětlení přímé úměry */}
    </div>
  );
};

export default PrimaUmeraPage;
