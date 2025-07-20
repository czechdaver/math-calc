// src/app/[locale]/calculator/procenta/y-je-x-kolik-je-sto/page.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import YJeXKolikJeStoCalculator from '@/components/calculators/YJeXKolikJeStoCalculator';

const YJeXKolikJeStoPage: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <div>
      <h1>{t('y_je_x_kolik_je_sto_title')}</h1>
      <YJeXKolikJeStoCalculator />
      {/* Zde budou další prvky stránky */}
    </div>
  );
};

export default YJeXKolikJeStoPage;
