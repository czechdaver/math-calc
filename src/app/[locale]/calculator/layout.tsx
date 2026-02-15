// src/app/[locale]/calculator/layout.tsx
import React from 'react';

interface CalculatorLayoutProps {
  children: React.ReactNode;
}

const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default CalculatorLayout;
