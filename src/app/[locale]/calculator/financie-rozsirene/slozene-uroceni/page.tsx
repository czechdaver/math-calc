'use client';

import React from 'react';
import CompoundInterestCalculator from '@/components/calculators/CompoundInterestCalculator';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

export default function CompoundInterestPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={CompoundInterestCalculator}
      calculatorId="compound-interest"
    />
  );
}
