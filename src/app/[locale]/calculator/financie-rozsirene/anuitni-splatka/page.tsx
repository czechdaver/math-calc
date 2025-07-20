// src/app/[locale]/calculator/financie-rozsirene/anuitni-splatka/page.tsx
import React from 'react';
import AnuitniSplatkaCalculator from '@/components/calculators/AnuitniSplatkaCalculator';

const AnuitniSplatkaPage: React.FC = () => {
  return (
    <div>
      <h1>Kalkulátor anuitní splátky úvěru</h1>
      <AnuitniSplatkaCalculator />
      {/* Zde budou další prvky stránky */}
    </div>
  );
};

export default AnuitniSplatkaPage;
