'use client';

import React from 'react';
import NetSalaryCalculator from '@/components/calculators/NetSalaryCalculator';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

export default function NetSalaryPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={NetSalaryCalculator}
      calculatorId="net-salary"
    />
  );
}
