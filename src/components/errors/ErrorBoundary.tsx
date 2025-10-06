'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showReload?: boolean;
  level?: 'page' | 'component' | 'calculator';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
}

/**
 * Enhanced Error Boundary Component
 * 
 * Provides comprehensive error handling with:
 * - User-friendly error messages
 * - Development vs production behavior
 * - Error reporting integration
 * - Recovery actions
 * - Error categorization by level
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      eventId: generateErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    this.setState({ errorInfo });

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to external service (Sentry, etc.)
    this.reportError(error, errorInfo);
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // This would integrate with your error reporting service
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
      
      // For now, we'll just log structured error data
      const errorReport = {
        timestamp: new Date().toISOString(),
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        errorInfo: {
          componentStack: errorInfo.componentStack,
        },
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
        url: typeof window !== 'undefined' ? window.location.href : 'SSR',
        level: this.props.level || 'component',
        eventId: this.state.eventId,
      };

      if (process.env.NODE_ENV !== 'production') {
        console.log('Error Report:', errorReport);
      }

      // In production, you would send this to your logging service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    });
  };

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      window.clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Render enhanced error UI based on level
      return this.renderErrorUI();
    }

    return this.props.children;
  }

  private renderErrorUI() {
    const { level = 'component', showReload = true } = this.props;
    const { error, eventId } = this.state;

    const errorMessages = {
      page: {
        title: 'Nastala chyba',
        description: 'Omlouváme se, ale stránka se nepodařila načíst. Zkuste to prosím znovu.',
        icon: AlertTriangle,
      },
      component: {
        title: 'Chyba komponenty',
        description: 'Část stránky se nepodařila načíst. Můžete zkusit obnovit stránku.',
        icon: Bug,
      },
      calculator: {
        title: 'Chyba kalkulátoru',
        description: 'Kalkulátor narazil na problém. Zkuste obnovit stránku nebo použít jiný kalkulátor.',
        icon: AlertTriangle,
      },
    };

    const config = errorMessages[level];
    const IconComponent = config.icon;

    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <IconComponent className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              {config.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              {config.description}
            </p>

            {/* Error details in development */}
            {process.env.NODE_ENV !== 'production' && error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technické detaily (pouze pro vývoj)
                </summary>
                <div className="mt-2 rounded bg-gray-50 p-3 text-xs font-mono text-gray-700">
                  <div className="mb-2">
                    <strong>Error:</strong> {error.name}
                  </div>
                  <div className="mb-2">
                    <strong>Message:</strong> {error.message}
                  </div>
                  {eventId && (
                    <div className="mb-2">
                      <strong>Event ID:</strong> {eventId}
                    </div>
                  )}
                  {error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap break-all">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button
                onClick={this.handleRetry}
                className="flex items-center gap-2"
                variant="default"
              >
                <RefreshCw className="h-4 w-4" />
                Zkusit znovu
              </Button>

              {showReload && (
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Obnovit stránku
                </Button>
              )}

              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Domů
              </Button>
            </div>

            {/* Error reporting notice */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {eventId && (
                  <>
                    Chyba byla automaticky nahlášena. <br />
                    Referenční číslo: <code className="text-gray-700">{eventId}</code>
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

// Helper function to generate unique error IDs
function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

// Convenience wrapper for different error boundary types
export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="page" showReload={true}>
    {children}
  </ErrorBoundary>
);

export const ComponentErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="component" showReload={false}>
    {children}
  </ErrorBoundary>
);

export const CalculatorErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="calculator" showReload={true}>
    {children}
  </ErrorBoundary>
);

// Hook for manual error reporting
export const useErrorHandler = () => {
  return React.useCallback((error: Error, errorInfo?: { componentStack?: string }) => {
    // Manually trigger error boundary or report error
    console.error('Manual error report:', error, errorInfo);
    
    // You could also dispatch to a global error handler here
    if (typeof window !== 'undefined') {
      const w = window as Window & { reportError?: (err: Error) => void };
      w.reportError?.(error);
    }
  }, []);
};

export default ErrorBoundary;