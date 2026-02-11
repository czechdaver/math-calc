import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Props for CalculatorSkeleton component
 */
export interface CalculatorSkeletonProps {
  variant?: 'page' | 'sidebar' | 'compact';
  className?: string;
}

/**
 * CalculatorSkeleton Component
 *
 * Provides consistent loading states across all calculators.
 *
 * @example
 * ```tsx
 * <CalculatorSkeleton variant="page" />
 * ```
 *
 * @param variant - Display variant: 'page' (default), 'sidebar', or 'compact'
 * @param className - Optional additional CSS classes
 */
export const CalculatorSkeleton: React.FC<CalculatorSkeletonProps> = ({
  variant = 'page',
  className = ''
}) => {
  const baseClassName = 'space-y-4 p-6';

  if (variant === 'compact') {
    return (
      <div className={`${baseClassName} ${className}`.trim()}>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`${baseClassName} ${className}`.trim()}>
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full mb-3" />
        <Skeleton className="h-10 w-full mb-3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  // Default: 'page' variant
  return (
    <div className={`${baseClassName} ${className}`.trim()}>
      {/* Title skeleton */}
      <Skeleton className="h-8 w-1/2 mb-2" />

      {/* Description skeleton */}
      <Skeleton className="h-4 w-3/4 mb-6" />

      {/* Input fields skeletons */}
      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Result section skeleton */}
      <Skeleton className="h-32 w-full" />

      {/* Additional content skeleton */}
      <Skeleton className="h-40 w-full mt-4" />
    </div>
  );
};

export default CalculatorSkeleton;
