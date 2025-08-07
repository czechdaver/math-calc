'use client';

import React, { Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the enhanced BMI calculator component
const BMICalculatorEnhanced = dynamic(() => import('@/components/calculators/BMICalculatorEnhanced'), {
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
    console.error('Enhanced BMI Calculator error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const EnhancedBMICalculatorPage = () => {
  const t = useTranslations();

  // Memoize translations to prevent unnecessary re-renders
  const translations = useMemo(() => ({
    loadingError: t('loading_error') || 'Failed to load calculator. Please try refreshing the page.'
  }), [t]);

  const { loadingError } = translations;

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
        <BMICalculatorEnhanced />
      </Suspense>
    </ErrorBoundary>
  );
};

export default EnhancedBMICalculatorPage;