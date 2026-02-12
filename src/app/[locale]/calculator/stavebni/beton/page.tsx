'use client';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const ConcreteCalculator = dynamic(
  () => import('@/components/calculators/ConcreteCalculator'),
  { ssr: false }
);

export default function ConcreteCalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={ConcreteCalculator} calculatorId="concrete" />;
}
