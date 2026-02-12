'use client';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const IRRCalculator = dynamic(() => import('@/components/calculators/IRRCalculator'), { ssr: false });

export default function IRRCalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={IRRCalculator} calculatorId="irr" />;
}
