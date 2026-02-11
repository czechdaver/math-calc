'use client';

import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';
import CurrencyCalculator from '@/components/calculators/CurrencyCalculator';

export default function CurrencyCalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={CurrencyCalculator}
      calculatorId="currency"
    />
  );
}
