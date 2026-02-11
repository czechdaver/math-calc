'use client';

import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';
import BMRCalculator from '@/components/calculators/BMRCalculator';

export default function BMRCalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={BMRCalculator}
      calculatorId="bmr"
    />
  );
}
