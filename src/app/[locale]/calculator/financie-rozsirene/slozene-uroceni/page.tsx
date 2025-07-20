// src/app/[locale]/calculator/financie-rozsirene/slozene-uroceni/page.tsx
import React from 'react';
import CompoundInterestCalculator from '@/components/calculators/CompoundInterestCalculator';

const SlozeneUroceniPage: React.FC = () => {
  return (
    <div>
      <h1>Kalkulátor složeného úročení</h1>
      <CompoundInterestCalculator />
      {/* Zde budou další prvky stránky */}
    </div>
  );
};

export default SlozeneUroceniPage;
