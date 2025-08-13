'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { CalculatorErrorBoundary } from '@/components/errors/ErrorBoundary';

// Dynamic import with loading state
const EnhancedVATCalculator = dynamic(
  () => import('@/components/calculators/enhanced/EnhancedVATCalculator'), 
  {
    loading: () => (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    ),
    ssr: false
  }
);

/**
 * Enhanced VAT Calculator Page
 * 
 * This page demonstrates the enhanced calculator patterns:
 * - Professional error boundary integration
 * - Optimized dynamic loading
 * - Enhanced UI with loading states
 * 
 * Pattern: Complete page wrapper for enhanced calculators
 */
export default function EnhancedVATCalculatorPage() {
  return (
    <CalculatorErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 pt-20 pb-24">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <Skeleton className="h-12 w-2/3 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
              <div className="max-w-4xl mx-auto">
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </div>
      }>
        <EnhancedVATCalculator />
      </Suspense>
    </CalculatorErrorBoundary>
  );
}