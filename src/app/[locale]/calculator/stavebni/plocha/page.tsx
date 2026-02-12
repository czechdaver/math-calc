'use client';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const AreaCalculator = dynamic(
  () => import('@/components/calculators/AreaCalculator'),
  { ssr: false }
);

export default function AreaCalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={AreaCalculator} calculatorId="area" />;
}
