'use client';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const ROICalculator = dynamic(() => import('@/components/calculators/ROICalculator'), { ssr: false });

export default function ROICalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={ROICalculator} calculatorId="roi" />;
}
