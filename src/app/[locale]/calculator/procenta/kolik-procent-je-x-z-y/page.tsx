// src/app/[locale]/calculator/procenta/kolik-procent-je-x-z-y/page.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import KolikProcentJeXZYCalculator from '@/components/calculators/KolikProcentJeXZYCalculator';

const KolikProcentJeXZYPage: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <div>
      <h1>{t('kolik_procent_je_x_z_y_title')}</h1>
      <KolikProcentJeXZYCalculator />
      {/* Zde budou další prvky stránky */}
    </div>
  );
};

export default KolikProcentJeXZYPage;
