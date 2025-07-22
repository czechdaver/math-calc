import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider as ShadcnTooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';
type TooltipVariant = 'default' | 'light' | 'dark' | 'primary' | 'success' | 'warning' | 'error';

interface TooltipProps {
  /**
   * The content of the tooltip
   */
  content: React.ReactNode;
  /**
   * The element that triggers the tooltip
   */
  children: React.ReactElement;
  /**
   * Position of the tooltip relative to the trigger element
   * @default 'top'
   */
  position?: TooltipPosition;
  /**
   * Visual style variant of the tooltip
   * @default 'default'
   */
  variant?: TooltipVariant;
  /**
   * Delay in milliseconds before showing the tooltip
   * @default 100
   */
  delay?: number;
  /**
   * Whether the tooltip should be disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Additional class names for the tooltip
   */
  className?: string;
  /**
   * Additional class names for the tooltip content
   */
  contentClassName?: string;
  /**
   * Whether the tooltip should be interactive (stays open when hovering over the tooltip)
   * @default false
   */
  interactive?: boolean;
  /**
   * Maximum width of the tooltip in pixels
   * @default 200
   */
  maxWidth?: number;
}

// Map our position prop to shadcn's side prop
const positionToSide = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
} as const;

// Map our variant prop to shadcn's variant classes
const variantClasses: Record<TooltipVariant, string> = {
  default: 'bg-popover text-popover-foreground border border-border',
  light: 'bg-white text-gray-800 border border-gray-200',
  dark: 'bg-gray-900 text-white',
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-destructive text-destructive-foreground',
};

/**
 * A customizable tooltip component built on top of shadcn/ui's Tooltip.
 * Provides a simple API with additional features like variants and custom styling.
 */
const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  variant = 'default',
  delay = 100,
  disabled = false,
  className = '',
  contentClassName = '',
  interactive = false,
  maxWidth = 200,
  ...props
}) => {
  if (disabled) {
    return children;
  }

  return (
    <ShadcnTooltip delayDuration={delay}>
      <TooltipTrigger asChild>
        <span>{children}</span>
      </TooltipTrigger>
      <TooltipContent 
        side={positionToSide[position]}
        className={cn(
          'max-w-[200px] text-sm',
          variantClasses[variant],
          contentClassName
        )}
        style={{ maxWidth: `${maxWidth}px` }}
        {...props}
      >
        {content}
      </TooltipContent>
    </ShadcnTooltip>
  );
};

// Re-export shadcn's Tooltip components for more advanced usage
export {
  ShadcnTooltip as TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  ShadcnTooltipProvider as TooltipProvider,
};

export default Tooltip;

export type { TooltipPosition, TooltipVariant, TooltipProps };
