'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const MacroCalculator = dynamic(
  () => import('@/components/calculators/MacroCalculator'),
  { ssr: false }
);

export default function MacroCalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={MacroCalculator} calculatorId="macro-calculator" />;
}
