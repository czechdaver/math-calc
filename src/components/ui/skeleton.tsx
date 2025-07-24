'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const skeletonVariants = cva(
  'animate-pulse rounded-md bg-muted',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        card: 'rounded-lg',
        text: 'h-4',
        heading: 'h-6 w-3/4',
        button: 'h-10 w-24',
        input: 'h-10 w-full',
        avatar: 'rounded-full h-10 w-10',
        image: 'aspect-video w-full',
        paragraph: 'space-y-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  asChild?: boolean;
}

/**
 * A simple loading skeleton component that can be used as a placeholder
 * while content is loading.
 * 
 * @example
 * ```tsx
 * <Skeleton className="h-12 w-12 rounded-full" />
 * <Skeleton variant="text" className="w-[250px]" />
 * ```
 */
function Skeleton({
  className,
  variant,
  asChild = false,
  ...props
}: SkeletonProps) {
  const Comp = asChild ? 'div' : 'div';
  
  return (
    <Comp
      className={cn(skeletonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Skeleton, skeletonVariants };

/**
 * A container for multiple skeleton loaders with consistent spacing
 */
export function SkeletonContainer({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * A text skeleton with configurable number of lines
 */
export function TextSkeleton({
  lines = 3,
  className,
  ...props
}: { lines?: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" className="w-full" />
      ))}
    </div>
  );
}

/**
 * A card skeleton with header and content areas
 */
export function CardSkeleton({
  className,
  hasHeader = true,
  ...props
}: { hasHeader?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-lg border p-4', className)} {...props}>
      {hasHeader && (
        <div className="mb-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}
