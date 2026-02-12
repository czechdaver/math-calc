'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const AnnuityPaymentCalculator = dynamic(
  () => import('@/components/calculators/AnnuityPaymentCalculator'),
  { ssr: false }
);

export default function AnuitniSplatkaPage() {
  return <CalculatorPageWrapper calculatorComponent={AnnuityPaymentCalculator} calculatorId="annuity-payment" />;
}
