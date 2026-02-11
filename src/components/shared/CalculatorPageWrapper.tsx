'use client';

import React, { ComponentType, ReactNode, Suspense } from 'react';
import dynamic from 'next/dynamic';
import ErrorBoundary, { ErrorFallbackProps } from './ErrorBoundary';
import { CalculatorSkeleton } from './CalculatorSkeleton';

/**
 * Props for CalculatorPageWrapper component
 */
export interface CalculatorPageWrapperProps {
  calculatorComponent: ComponentType;
  calculatorId: string;
  fallback?: ReactNode | ComponentType<ErrorFallbackProps>;
  loadingComponent?: ComponentType;
}

/**
 * CalculatorPageWrapper Component
 *
 * Standardized page wrapper that combines ErrorBoundary + Suspense + dynamic import.
 * Eliminates 80+ lines of duplicate code per page wrapper.
 *
 * @example
 * ```tsx
 * // In your page.tsx:
 * import BMICalculator from '@/components/calculators/BMICalculator';
 * import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';
 *
 * export default function BMIPage() {
 *   return (
 *     <CalculatorPageWrapper
 *       calculatorComponent={BMICalculator}
 *       calculatorId="bmi"
 *     />
 *   );
 * }
 * ```
 *
 * @param calculatorComponent - The calculator component to wrap
 * @param calculatorId - Unique identifier for the calculator (for error tracking)
 * @param fallback - Optional custom error fallback component
 * @param loadingComponent - Optional custom loading component (defaults to CalculatorSkeleton)
 */
export const CalculatorPageWrapper: React.FC<CalculatorPageWrapperProps> = ({
  calculatorComponent,
  calculatorId,
  fallback,
  loadingComponent: LoadingComponent = CalculatorSkeleton
}) => {
  // Dynamic import with SSR disabled for client-side only calculator
  const DynamicCalculator = dynamic(
    () => Promise.resolve(calculatorComponent),
    {
      loading: () => <LoadingComponent />,
      ssr: false
    }
  );

  return (
    <ErrorBoundary
      fallback={fallback}
      onError={(error, errorInfo) => {
        console.error(`Calculator error (${calculatorId}):`, error, errorInfo);
        // Future: Send to error tracking service (e.g., Sentry)
        // Sentry.captureException(error, { tags: { calculatorId } });
      }}
    >
      <Suspense fallback={<LoadingComponent />}>
        <DynamicCalculator />
      </Suspense>
    </ErrorBoundary>
  );
};

export default CalculatorPageWrapper;
