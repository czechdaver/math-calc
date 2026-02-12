'use client';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const YIsXWhatIsHundredCalculator = dynamic(() => import('@/components/calculators/YIsXWhatIsHundredCalculator'), { ssr: false });

export default function YIsXWhatIsHundredCalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={YIsXWhatIsHundredCalculator} calculatorId="y-is-x-what-is-hundred" />;
}
