'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const TimeCalculator = dynamic(
  () => import('@/components/calculators/TimeCalculator'),
  { ssr: false }
);

export default function TimeCalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={TimeCalculator}
      calculatorId="time"
    />
  );
}
