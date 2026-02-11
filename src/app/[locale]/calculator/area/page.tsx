'use client';

import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';
import AreaCalculator from '@/components/calculators/AreaCalculator';

export default function AreaCalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={AreaCalculator}
      calculatorId="area"
    />
  );
}
