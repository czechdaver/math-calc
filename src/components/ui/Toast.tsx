import { toast as sonnerToast } from 'sonner';
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

// Types for our toast API
type ToastOptions = {
  id?: string | number;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  style?: React.CSSProperties;
};

// Map our variants to Sonner's toast types
const variantToType = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  default: 'default',
} as const;

// Icons for each variant
const variantIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  default: Info,
};

// Default toast duration in milliseconds
const DEFAULT_DURATION = 5000;

/**
 * Toast component that wraps Sonner's toast functionality
 * with a more familiar API and consistent styling
 */
const Toast = {
  /**
   * Show a toast notification
   */
  show: (options: ToastOptions | string) => {
    if (typeof options === 'string') {
      return sonnerToast(options);
    }

    const {
      title,
      description,
      variant = 'default',
      duration = DEFAULT_DURATION,
      action,
      className,
      style,
    } = options;

    const Icon = variantIcons[variant];

    return sonnerToast[options.variant || 'info'](
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", {
          'text-green-500': variant === 'success',
          'text-red-500': variant === 'error',
          'text-yellow-500': variant === 'warning',
          'text-blue-500': variant === 'info' || variant === 'default',
        })} />
        <div className="flex-1">
          <div className="font-medium text-foreground">{title}</div>
          {description && (
            <div className="text-sm text-muted-foreground mt-1">{description}</div>
          )}
          {action && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              className="text-sm font-medium text-primary hover:underline mt-2 inline-block"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>,
      {
        duration,
        className: cn(
          'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all',
          'data-[type=success]:bg-green-50 data-[type=success]:border-green-200 data-[type=success]:text-green-800',
          'data-[type=error]:bg-red-50 data-[type=error]:border-red-200 data-[type=error]:text-red-800',
          'data-[type=warning]:bg-yellow-50 data-[type=warning]:border-yellow-200 data-[type=warning]:text-yellow-800',
          'data-[type=info]:bg-blue-50 data-[type=info]:border-blue-200 data-[type=info]:text-blue-800',
          'data-[type=default]:bg-background data-[type=default]:border data-[type=default]:text-foreground',
          className
        ),
        style,
      }
    );
  },

  /**
   * Show a success toast
   */
  success: (title: string, description?: string, options?: Omit<ToastOptions, 'title' | 'description' | 'variant'>) => {
    return Toast.show({
      ...options,
      title,
      description,
      variant: 'success',
    });
  },

  /**
   * Show an error toast
   */
  error: (title: string, description?: string, options?: Omit<ToastOptions, 'title' | 'description' | 'variant'>) => {
    return Toast.show({
      ...options,
      title,
      description,
      variant: 'error',
    });
  },

  /**
   * Show a warning toast
   */
  warning: (title: string, description?: string, options?: Omit<ToastOptions, 'title' | 'description' | 'variant'>) => {
    return Toast.show({
      ...options,
      title,
      description,
      variant: 'warning',
    });
  },

  /**
   * Show an info toast
   */
  info: (title: string, description?: string, options?: Omit<ToastOptions, 'title' | 'description' | 'variant'>) => {
    return Toast.show({
      ...options,
      title,
      description,
      variant: 'info',
    });
  },

  /**
   * Dismiss a toast by its ID
   */
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    sonnerToast.dismiss();
  },

  /**
   * Promise toast - shows a loading toast that updates based on promise state
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error?: string | ((error: unknown) => string);
    },
    options?: Omit<ToastOptions, 'title' | 'description' | 'variant'>
  ) => {
    const loadingId = Toast.show({
      ...options,
      title: messages.loading,
      variant: 'default',
      duration: Infinity, // Don't auto-dismiss loading toasts
    });

    promise
      .then((data) => {
        const successMessage = typeof messages.success === 'function' 
          ? messages.success(data) 
          : messages.success;
        
        Toast.dismiss(loadingId);
        Toast.success(successMessage, '', { ...options, duration: 5000 });
        return data;
      })
      .catch((error) => {
        const errorMessage = (typeof messages.error === 'function' 
          ? messages.error(error)
          : messages.error) || 'An error occurred';
        
        Toast.dismiss(loadingId);
        Toast.error('Error', errorMessage, { ...options, duration: 8000 });
        throw error;
      });

    return promise;
  },
};

// Export the Toast component with all its methods
export { Toast };

// Export the Toaster component from Sonner
export { Toaster } from 'sonner';

export type { ToastVariant, ToastOptions };
