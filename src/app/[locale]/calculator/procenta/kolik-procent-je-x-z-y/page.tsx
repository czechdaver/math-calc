// src/app/[locale]/calculator/procenta/kolik-procent-je-x-z-y/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const WhatPercentageIsXOfYCalculator = dynamic(
  () => import('@/components/calculators/WhatPercentageIsXOfYCalculator'),
  { ssr: false }
);

export default function WhatPercentageIsXOfYPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={WhatPercentageIsXOfYCalculator}
      calculatorId="x-is-what-percent-of-y"
    />
  );
}
