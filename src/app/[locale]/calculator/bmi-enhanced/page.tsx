import { Metadata } from 'next';
import EnhancedBMICalculator from '@/components/calculators/enhanced/EnhancedBMICalculator';
import { mockRootProps } from '@/components/calculators/enhanced/enhancedBMIMockData';

export const metadata: Metadata = {
  title: 'Enhanced BMI Calculator | MathCalc Pro',
  description: 'Calculate your Body Mass Index with our modern, enhanced BMI calculator featuring real-time results, examples, and health information.',
};

export default function EnhancedBMIPage() {
  return (
    <EnhancedBMICalculator
      initialHeight={mockRootProps.height}
      initialWeight={mockRootProps.weight}
      showExamples={true}
      showFAQ={true}
      enableAds={true}
      examples={mockRootProps.examples}
      faqItems={mockRootProps.faqItems}
    />
  );
}