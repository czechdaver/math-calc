// src/components/calculators/shared/CalculatorRange.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface CalculatorRangeProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  helpText?: string;
  error?: string;
  className?: string;
  showValue?: boolean;
  showMinMax?: boolean;
  // Enhanced UI options
  labelIcon?: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'amber' | 'yellow' | 'red' | 'violet' | 'indigo';
  formatValue?: (value: number) => string;
}

const CalculatorRange: React.FC<CalculatorRangeProps> = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  helpText,
  error,
  className = '',
  showValue = true,
  showMinMax = true,
  labelIcon: LabelIcon,
  color = 'blue',
  formatValue,
}) => {
  const colors = {
    blue: {
      label: 'text-blue-700',
      icon: 'text-blue-600',
      track: 'bg-blue-200',
      thumb: 'accent-blue-600',
      value: 'text-blue-600',
    },
    green: {
      label: 'text-green-700',
      icon: 'text-green-600',
      track: 'bg-green-200',
      thumb: 'accent-green-600',
      value: 'text-green-600',
    },
    amber: {
      label: 'text-amber-700',
      icon: 'text-amber-600',
      track: 'bg-amber-200',
      thumb: 'accent-amber-600',
      value: 'text-amber-600',
    },
    yellow: {
      label: 'text-yellow-700',
      icon: 'text-yellow-600',
      track: 'bg-yellow-200',
      thumb: 'accent-yellow-600',
      value: 'text-yellow-600',
    },
    red: {
      label: 'text-red-700',
      icon: 'text-red-600',
      track: 'bg-red-200',
      thumb: 'accent-red-600',
      value: 'text-red-600',
    },
    violet: {
      label: 'text-violet-700',
      icon: 'text-violet-600',
      track: 'bg-violet-200',
      thumb: 'accent-violet-600',
      value: 'text-violet-600',
    },
    indigo: {
      label: 'text-indigo-700',
      icon: 'text-indigo-600',
      track: 'bg-indigo-200',
      thumb: 'accent-indigo-600',
      value: 'text-indigo-600',
    }
  } as const;

  const c = colors[color] ?? colors.blue;

  const displayValue = formatValue ? formatValue(value) : value.toString();
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor={id} className={`text-sm font-normal flex items-center gap-2 ${c.label}`}>
          {LabelIcon && (
            <span className="inline-flex items-center justify-center">
              <LabelIcon className={`w-4 h-4 ${c.icon}`} />
            </span>
          )}
          <span>{label}</span>
        </Label>
        {showValue && (
          <span className={`text-lg font-semibold ${c.value}`}>
            {displayValue}{unit && ` ${unit}`}
          </span>
        )}
      </div>
      
      <div className="relative">
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={`w-full h-2 ${c.track} rounded-lg appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${c.thumb} ${
            error ? 'border-red-500' : ''
          }`}
          style={{
            background: `linear-gradient(to right, var(--enhanced-${color}-500) 0%, var(--enhanced-${color}-500) ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
        />
      </div>
      
      {showMinMax && (
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{formatValue ? formatValue(min) : min}{unit && ` ${unit}`}</span>
          <span>{formatValue ? formatValue(max) : max}{unit && ` ${unit}`}</span>
        </div>
      )}
      
      {helpText && (
        <p className="text-sm text-gray-500 mt-2">
          {helpText}
        </p>
      )}
      
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1 mt-2">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export default CalculatorRange;