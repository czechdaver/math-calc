'use client';

import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';
import LoanCalculator from '@/components/calculators/LoanCalculator';

export default function LoanCalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={LoanCalculator}
      calculatorId="loan"
    />
  );
}
