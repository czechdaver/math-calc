"use client";

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export type PanelColor = 'blue' | 'green' | 'purple' | 'indigo' | 'amber' | 'gray';

const headerBgByVariant: Record<PanelColor, string> = {
  blue: 'enhanced-card-header',
  green: 'enhanced-card-header-green',
  purple: 'enhanced-card-header-purple',
  indigo: 'enhanced-card-header-indigo',
  amber: 'enhanced-card-header-amber',
  gray: 'enhanced-card-header-gray',
};

const textColorByColor: Record<PanelColor, string> = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  indigo: 'text-indigo-600',
  amber: 'text-amber-600',
  gray: 'text-gray-700',
};

interface PanelHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ElementType | React.ReactNode;
  color?: PanelColor;        // controls title/icon color
  variant?: PanelColor;      // controls gradient background
  right?: React.ReactNode;   // right-aligned content (e.g., rating)
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  subtitle,
  icon,
  color = 'blue',
  variant = 'blue',
  right,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
}) => {
  const headerBg = headerBgByVariant[variant] || headerBgByVariant.blue;
  const textColor = textColorByColor[color] || textColorByColor.blue;

  const renderIcon = () => {
    if (!icon) return null;
    // If a React element was passed (e.g., <Icon />), clone it to apply sizing/color
    if (React.isValidElement(icon)) {
      const el = icon as React.ReactElement<{ className?: string }>;
      return (
        <div className="enhanced-icon-wrapper">
          {React.cloneElement(
            el,
            { className: cn('w-5 h-5', textColor, el.props.className || '') }
          )}
        </div>
      );
    }
    // Otherwise assume a React component type (including forwardRef exotic components)
    const Icon = icon as React.ElementType;
    return (
      <div className="enhanced-icon-wrapper">
        <Icon className={cn('w-5 h-5', textColor)} />
      </div>
    );
  };

  return (
    <CardHeader className={cn(headerBg, '!py-3 !px-4 items-center !gap-0', className)}>
      {right ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {renderIcon()}
            <div>
              <CardTitle className={cn(textColor, titleClassName)}>{title}</CardTitle>
              {subtitle ? (
                <CardDescription className={cn('mt-0.5', descriptionClassName)}>{subtitle}</CardDescription>
              ) : null}
            </div>
          </div>
          <div className="ml-4 flex items-center">{right}</div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {renderIcon()}
          <div>
            <CardTitle className={cn(textColor, titleClassName)}>{title}</CardTitle>
            {subtitle ? (
              <CardDescription className={cn('mt-0.5', descriptionClassName)}>{subtitle}</CardDescription>
            ) : null}
          </div>
        </div>
      )}
    </CardHeader>
  );
};

export default PanelHeader;
