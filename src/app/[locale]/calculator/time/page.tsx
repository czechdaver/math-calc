'use client';

import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';
import TimeCalculator from '@/components/calculators/TimeCalculator';

export default function TimeCalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={TimeCalculator}
      calculatorId="time"
    />
  );
}
