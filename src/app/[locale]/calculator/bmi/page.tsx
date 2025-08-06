'use client';

import React, { Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Dynamically import components with loading states
const CalculatorComponent = dynamic(() => import('@/components/calculators/BMICalculator'), {
  loading: () => (
    <div className="space-y-4">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  ),
  ssr: false
});

// Error boundary for calculator component
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Calculator error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const CalculatorPage = () => {
  const t = useTranslations();

  // Memoize translations to prevent unnecessary re-renders
  const translations = useMemo(() => ({
    seoTitle: t('bmi_title') || 'Bmi',
    seoDescription: t('bmi_seo_description') || 'Calculator description',
    tip: t('bmi_tip') || 'Enter values to calculate',
    tipText: t('bmi_tip_text') || 'Enter values to see the calculation',
    loadingError: t('chyba_nacitani') || 'Failed to load calculator. Please try refreshing the page.'
  }), [t]);

  const { seoTitle, seoDescription, tip, tipText, loadingError } = translations;

  // Translations are loaded via useTranslations hook

  return (
    <ErrorBoundary 
      fallback={
        <div className="text-destructive p-4 rounded-lg bg-destructive/10">
          <p>{loadingError}</p>
        </div>
      }
    >
      <Suspense fallback={
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      }>
        <CalculatorComponent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default CalculatorPage;