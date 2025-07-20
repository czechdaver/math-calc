// src/app/[locale]/calculator/layout.tsx
import React from 'react';

interface CalculatorLayoutProps {
  children: React.ReactNode;
}

const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Zde může být společná navigace nebo jiné prvky pro všechny kalkulačky */}
      {children}
    </div>
  );
};

export default CalculatorLayout;
