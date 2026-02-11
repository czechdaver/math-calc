'use client';

import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';
import IdealWeightCalculator from '@/components/calculators/IdealWeightCalculator';

export default function IdealWeightCalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={IdealWeightCalculator}
      calculatorId="ideal-weight"
    />
  );
}
