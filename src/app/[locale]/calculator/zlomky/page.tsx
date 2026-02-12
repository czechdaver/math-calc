'use client';

import React from 'react';
import FractionsCalculator from '@/components/calculators/FractionsCalculator';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

export default function FractionsPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={FractionsCalculator}
      calculatorId="fractions"
    />
  );
}
