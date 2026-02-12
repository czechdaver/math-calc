'use client';

import React from 'react';
import InverseProportionCalculator from '@/components/calculators/InverseProportionCalculator';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

export default function InverseProportionPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={InverseProportionCalculator}
      calculatorId="inverse-proportion"
    />
  );
}
