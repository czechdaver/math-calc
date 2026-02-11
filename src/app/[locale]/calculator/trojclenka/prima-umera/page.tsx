'use client';

import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';
import DirectProportionCalculator from '@/components/calculators/DirectProportionCalculator';

export default function DirectProportionPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={DirectProportionCalculator}
      calculatorId="direct-proportion"
    />
  );
}
