'use client';

import React, { Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import Tooltip from '@/components/ui/tooltip';

// Dynamically import components with loading states
const CalculatorComponent = dynamic(() => import('@/components/calculators/zlomky'), {
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
  const { t, ready } = useTranslation('common');

  // Memoize translations to prevent unnecessary re-renders
  const translations = useMemo(() => ({
    seoTitle: t('zlomky_title') || 'Zlomky',
    seoDescription: t('zlomky_seo_description') || 'Calculator description',
    tip: t('zlomky_tip') || 'Enter values to calculate',
    tipText: t('zlomky_tip_text') || 'Enter values to see the calculation',
    loadingError: t('chyba_nacitani') || 'Failed to load calculator. Please try refreshing the page.'
  }), [t]);

  const { seoTitle, seoDescription, tip, tipText, loadingError } = translations;

  // Loading state for translations
  if (!ready) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Skeleton className="h-10 w-1/2 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{seoTitle}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('kalkulacka') || 'Calculator'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ErrorBoundary 
                fallback={
                  <div className="text-destructive p-4 rounded-lg bg-destructive/10">
                    <p>{loadingError}</p>
                  </div>
                }
              >
                <Suspense fallback={
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-1/2" />
                  </div>
                }>
                  <CalculatorComponent />
                </Suspense>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {t('tip') || 'Tip'}
                <Tooltip 
                  content={tip}
                  position="top"
                >
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {tipText}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;