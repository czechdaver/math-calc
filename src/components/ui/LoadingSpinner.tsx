import * as React from 'react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'primary' | 'muted' | 'destructive' | 'success' | 'warning' | 'info';
type SpinnerLabelPosition = 'top' | 'bottom' | 'left' | 'right';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Color variant of the spinner */
  color?: SpinnerColor;
  /** Optional label text to display with the spinner */
  label?: string;
  /** Position of the label relative to the spinner */
  labelPosition?: SpinnerLabelPosition;
  /** Whether to take up the full viewport */
  fullScreen?: boolean;
  /** Whether to show an overlay behind the spinner */
  overlay?: boolean;
  /** Whether to blur the overlay background */
  overlayBlur?: boolean;
  /** Additional class names for the spinner */
  className?: string;
  /** Additional class names for the label */
  labelClassName?: string;
  /** Additional class names for the overlay */
  overlayClassName?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'h-4 w-4 border-2',
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
  xl: 'h-16 w-16 border-4',
};

const colorClasses: Record<SpinnerColor, string> = {
  primary: 'border-t-primary border-r-primary/20 border-b-primary/20 border-l-primary/20',
  muted: 'border-t-muted-foreground/80 border-r-muted-foreground/20 border-b-muted-foreground/20 border-l-muted-foreground/20',
  destructive: 'border-t-destructive border-r-destructive/20 border-b-destructive/20 border-l-destructive/20',
  success: 'border-t-green-500 border-r-green-500/20 border-b-green-500/20 border-l-green-500/20',
  warning: 'border-t-amber-500 border-r-amber-500/20 border-b-amber-500/20 border-l-amber-500/20',
  info: 'border-t-blue-500 border-r-blue-500/20 border-b-blue-500/20 border-l-blue-500/20',
};

const labelPositionClasses: Record<SpinnerLabelPosition, string> = {
  top: 'flex-col-reverse',
  bottom: 'flex-col',
  left: 'flex-row-reverse',
  right: 'flex-row',
};

const labelSizeClasses: Record<SpinnerSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

/**
 * A customizable loading spinner component with optional label and overlay.
 * Built with accessibility in mind and follows shadcn/ui design patterns.
 */
const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  (
    {
      className,
      size = 'md',
      color = 'primary',
      label,
      labelPosition = 'right',
      fullScreen = false,
      overlay = false,
      overlayBlur = true,
      labelClassName,
      overlayClassName,
      ...props
    },
    ref
  ) => {
    const spinner = (
      <div
        className={cn(
          'inline-block animate-spin rounded-full',
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        role="status"
        aria-label={label ? undefined : 'Loading...'}
      >
        {!label && <span className="sr-only">Loading...</span>}
      </div>
    );

    if (label) {
      return (
        <div
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center',
            labelPositionClasses[labelPosition],
            fullScreen && 'h-screen w-screen',
            overlay && 'fixed inset-0 z-50',
            overlay && overlayBlur && 'backdrop-blur-sm bg-background/80',
            overlayClassName
          )}
          {...props}
        >
          {spinner}
          <span
            className={cn(
              labelPosition === 'top' || labelPosition === 'bottom' ? 'mt-2' : 'ml-2',
              labelSizeClasses[size],
              'text-foreground/80',
              fullScreen && 'text-lg',
              labelClassName
            )}
          >
            {label}
          </span>
        </div>
      );
    }

    if (fullScreen || overlay) {
      return (
        <div
          ref={ref}
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center',
            overlay && overlayBlur && 'backdrop-blur-sm bg-background/80',
            overlayClassName,
            className
          )}
          {...props}
        >
          {spinner}
        </div>
      );
    }

    return React.cloneElement(spinner, { ref, ...props });
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

export { LoadingSpinner };
export type { LoadingSpinnerProps };
