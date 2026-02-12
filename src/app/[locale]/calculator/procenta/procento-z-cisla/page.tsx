'use client';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const PercentageOfNumberCalculator = dynamic(() => import('@/components/calculators/PercentageOfNumberCalculator'), { ssr: false });

export default function PercentageOfNumberCalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={PercentageOfNumberCalculator} calculatorId="percentage-of-number" />;
}
