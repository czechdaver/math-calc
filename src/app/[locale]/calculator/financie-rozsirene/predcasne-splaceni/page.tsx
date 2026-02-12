'use client';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const EarlyRepaymentCalculator = dynamic(() => import('@/components/calculators/EarlyRepaymentCalculator'), { ssr: false });

export default function EarlyRepaymentCalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={EarlyRepaymentCalculator} calculatorId="early-repayment" />;
}
