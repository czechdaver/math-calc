'use client';

import React from 'react';
import EnhancedBMICalculator from '@/components/calculators/enhanced/EnhancedBMICalculator';
import { mockRootProps } from '@/components/calculators/enhanced/enhancedBMIMockData';

export default function EnhancedBMIPreviewPage() {
  return (
    <div className="min-h-screen">
      <EnhancedBMICalculator
        initialHeight={mockRootProps.height}
        initialWeight={mockRootProps.weight}
        showExamples={true}
        showFAQ={true}
        enableAds={true}
        examples={mockRootProps.examples}
        faqItems={mockRootProps.faqItems}
      />
    </div>
  );
}