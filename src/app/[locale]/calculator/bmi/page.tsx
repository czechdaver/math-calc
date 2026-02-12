'use client';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const BMICalculator = dynamic(() => import('@/components/calculators/BMICalculator'), { ssr: false });

export default function BMICalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={BMICalculator} calculatorId="bmi" />;
}
