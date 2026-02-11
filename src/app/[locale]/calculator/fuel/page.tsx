'use client';

import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';
import FuelCalculator from '@/components/calculators/FuelCalculator';

export default function FuelCalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={FuelCalculator}
      calculatorId="fuel"
    />
  );
}
