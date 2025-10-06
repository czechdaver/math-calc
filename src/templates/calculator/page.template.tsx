'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Template: duplicate and move to src/app/[locale]/calculator/<slug>/page.tsx
// Then update import to '@/components/calculators/<Name>Calculator'
const CalculatorComponent = dynamic(() => import('./CalculatorTemplateComponent'), {
  loading: () => (
    <div className="space-y-4">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  ),
  ssr: false
});

class ErrorBoundary extends React.Component<{ fallback: React.ReactNode; children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Calculator error:', error, errorInfo);
  }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

export default function PageTemplate() {
  return (
    <ErrorBoundary fallback={<div className="text-destructive p-4 rounded-lg bg-destructive/10">Failed to load calculator.</div>}>
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
}
