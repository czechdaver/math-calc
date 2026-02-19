'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Props for ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Props passed to error fallback components
 */
export interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, reset }) => {
  const t = useTranslations('common.error');
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center bg-card rounded-lg border border-border p-6 shadow-sm">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t('loading_title')}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t('loading_message')}
        </p>
        {error && (
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              {t('technical_details')}
            </summary>
            <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto max-h-32">
              {error.toString()}
            </pre>
          </details>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          {t('try_again')}
        </button>
      </div>
    </div>
  );
};

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors in child component tree, displays fallback UI,
 * and logs error information.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MyCalculator />
 * </ErrorBoundary>
 * ```
 *
 * @example With custom fallback
 * ```tsx
 * <ErrorBoundary fallback={<CustomError />}>
 *   <MyCalculator />
 * </ErrorBoundary>
 * ```
 *
 * @example With error callback
 * ```tsx
 * <ErrorBoundary
 *   onError={(error, errorInfo) => {
 *     console.error('Calculator error:', error, errorInfo);
 *     // Log to error tracking service (e.g., Sentry)
 *   }}
 * >
 *   <MyCalculator />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback: Fallback } = this.props;

    if (hasError) {
      // If fallback is a component, render it with error and reset props
      if (typeof Fallback === 'function') {
        const FallbackComponent = Fallback as React.ComponentType<ErrorFallbackProps>;
        return <FallbackComponent error={error!} reset={this.handleReset} />;
      }

      // If fallback is a ReactNode, render it
      if (Fallback) {
        return <>{Fallback}</>;
      }

      // Otherwise render default fallback
      return <DefaultErrorFallback error={error!} reset={this.handleReset} />;
    }

    return children;
  }
}

export default ErrorBoundary;
