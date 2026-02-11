'use client';

import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';
import CaloriesCalculator from '@/components/calculators/CaloriesCalculator';

export default function CaloriesCalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={CaloriesCalculator}
      calculatorId="calories"
    />
  );
}
