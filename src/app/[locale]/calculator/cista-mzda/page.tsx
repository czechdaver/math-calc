// src/app/[locale]/calculator/cista-mzda/page.tsx
import React from 'react';
import CistaMzdaCalculator from '@/components/calculators/CistaMzdaCalculator';

const CistaMzdaPage: React.FC = () => {
  return (
    <div>
      <h1>Kalkulátor čisté mzdy</h1>
      <CistaMzdaCalculator />
      {/* Zde budou další prvky stránky */}
    </div>
  );
};

export default CistaMzdaPage;
