// src/components/shared/SimpleBadge.tsx
import React, { ReactNode } from 'react';

export interface SimpleBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}

/**
 * SimpleBadge component for displaying badge variants.
 * Used for categories, labels, and status indicators.
 *
 * @param children - Badge content
 * @param variant - Badge style variant (default, secondary, outline)
 * @param className - Additional CSS classes
 */
const SimpleBadge: React.FC<SimpleBadgeProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';

  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-border text-foreground'
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default SimpleBadge;
