'use client';

import React from 'react';
import UnitConverter from '@/components/calculators/UnitConverter';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

export default function UnitConverterPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={UnitConverter}
      calculatorId="unit-converter"
    />
  );
}
