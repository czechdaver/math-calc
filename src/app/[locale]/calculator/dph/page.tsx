'use client';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const VATCalculator = dynamic(() => import('@/components/calculators/VATCalculator'), { ssr: false });

export default function VATCalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={VATCalculator} calculatorId="vat" />;
}
