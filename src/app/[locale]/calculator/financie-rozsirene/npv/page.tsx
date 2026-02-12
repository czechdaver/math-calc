'use client';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const NPVCalculator = dynamic(() => import('@/components/calculators/NPVCalculator'), { ssr: false });

export default function NPVCalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={NPVCalculator} calculatorId="npv" />;
}
