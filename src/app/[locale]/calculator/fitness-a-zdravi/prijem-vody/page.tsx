'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const WaterIntakeCalculator = dynamic(
  () => import('@/components/calculators/WaterIntakeCalculator'),
  { ssr: false }
);

export default function WaterIntakeCalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={WaterIntakeCalculator} calculatorId="water-intake" />;
}
