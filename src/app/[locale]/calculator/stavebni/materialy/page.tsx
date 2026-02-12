'use client';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const MaterialCalculator = dynamic(() => import('@/components/calculators/MaterialCalculator'), { ssr: false });

export default function MaterialCalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={MaterialCalculator} calculatorId="materials" />;
}
