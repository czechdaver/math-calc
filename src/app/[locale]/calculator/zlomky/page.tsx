// src/app/[locale]/calculator/zlomky/page.tsx
import React from 'react';
import ZlomkyCalculator from '@/components/calculators/ZlomkyCalculator';

const ZlomkyPage: React.FC = () => {
  return (
    <div>
      <h1>Kalkulátor zlomků</h1>
      <ZlomkyCalculator />
      {/* Zde budou další prvky stránky */}
    </div>
  );
};

export default ZlomkyPage;
