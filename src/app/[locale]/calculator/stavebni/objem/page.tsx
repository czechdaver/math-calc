'use client';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const VolumeCalculator = dynamic(
  () => import('@/components/calculators/VolumeCalculator'),
  { ssr: false }
);

export default function VolumeCalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={VolumeCalculator} calculatorId="volume" />;
}
