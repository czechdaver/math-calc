'use client';

import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';
import BodyFatCalculator from '@/components/calculators/BodyFatCalculator';

export default function BodyFatCalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={BodyFatCalculator}
      calculatorId="body-fat"
    />
  );
}
