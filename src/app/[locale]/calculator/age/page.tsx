'use client';

import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';
import AgeCalculator from '@/components/calculators/AgeCalculator';

export default function AgeCalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={AgeCalculator}
      calculatorId="age"
    />
  );
}
