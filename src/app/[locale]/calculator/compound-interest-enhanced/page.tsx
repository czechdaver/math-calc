'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { CalculatorErrorBoundary } from '@/components/errors/ErrorBoundary';

// Dynamic import with loading state
const EnhancedCompoundInterestCalculator = dynamic(
  () => import('@/components/calculators/enhanced/EnhancedCompoundInterestCalculator'), 
  {
    loading: () => (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    ),
    ssr: false
  }
);

/**
 * Enhanced Compound Interest Calculator Page
 * 
 * This page demonstrates advanced chart visualization patterns:
 * - Time-series data visualization with line charts
 * - Composition breakdown with pie charts
 * - Investment analysis with complex calculations
 * - Interactive scenarios and parameters
 * 
 * Pattern: Chart-driven investment calculator page
 */
export default function EnhancedCompoundInterestCalculatorPage() {
  return (
    <CalculatorErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen">
          <div className="container mx-auto px-4 pt-20 pb-24">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <Skeleton className="h-12 w-2/3 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
              <div className="max-w-6xl mx-auto space-y-8">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
      }>
        <EnhancedCompoundInterestCalculator />
      </Suspense>
    </CalculatorErrorBoundary>
  );
}