'use client';

import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';
import DiscountCalculator from '@/components/calculators/DiscountCalculator';

export default function DiscountCalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={DiscountCalculator}
      calculatorId="discount"
    />
  );
}
