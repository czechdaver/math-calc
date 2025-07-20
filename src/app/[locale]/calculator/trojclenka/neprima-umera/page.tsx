// src/app/[locale]/calculator/trojclenka/neprima-umera/page.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import NeprimaUmeraCalculator from '@/components/calculators/NeprimaUmeraCalculator';

const NeprimaUmeraPage: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <div>
      <h1>{t('neprima_umera_title')}</h1>
      <NeprimaUmeraCalculator />
      {/* Zde budou další prvky stránky, včetně vysvětlení nepřímé úměry */}
    </div>
  );
};

export default NeprimaUmeraPage;
