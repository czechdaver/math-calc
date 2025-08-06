'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the BMI calculator
const BMICalculator = dynamic(
  () => import('@/components/calculators/BMICalculator'),
  {
    loading: () => (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    ),
    ssr: false
  }
);

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
    console.error('BMI Calculator error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const BMINewPage: React.FC = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Chyba při načítání kalkulátoru
            </h1>
            <p className="text-gray-600">
              Omlouváme se, došlo k chybě při načítání BMI kalkulátoru. 
              Zkuste prosím obnovit stránku.
            </p>
          </div>
        </div>
      }
    >
      <Suspense fallback={
        <div className="space-y-4 p-6">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      }>
        <BMICalculator />
      </Suspense>
    </ErrorBoundary>
  );
};

export default BMINewPage;
