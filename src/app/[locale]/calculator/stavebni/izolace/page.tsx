'use client';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const InsulationCalculator = dynamic(
  () => import('@/components/calculators/InsulationCalculator'),
  { ssr: false }
);

export default function InsulationCalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={InsulationCalculator} calculatorId="insulation" />;
}
