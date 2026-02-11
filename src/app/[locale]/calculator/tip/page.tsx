'use client';

import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';
import TipCalculator from '@/components/calculators/TipCalculator';

export default function TipCalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={TipCalculator}
      calculatorId="tip"
    />
  );
}
