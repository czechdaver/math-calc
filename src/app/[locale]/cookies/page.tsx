// src/app/[locale]/cookies/page.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const CookiesPage: React.FC = () => {
  const t = useTranslations();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{t('footer.cookies_tracking')}</h1>
      <p className="text-gray-700 mb-6">
        {t('footer.ads_note')}
      </p>
      <p className="text-sm text-gray-500">
        This is a placeholder page. Detailed cookie policy and partner list will be added here.
      </p>
    </div>
  );
};

export default CookiesPage;
