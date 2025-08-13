// src/components/calculators/shared/CalculatorToggle.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface ToggleOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface CalculatorToggleProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ToggleOption[];
  helpText?: string;
  error?: string;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  // Enhanced UI options
  labelIcon?: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'amber' | 'yellow' | 'red' | 'violet' | 'indigo';
  required?: boolean;
}

const CalculatorToggle: React.FC<CalculatorToggleProps> = ({
  name,
  label,
  value,
  onChange,
  options,
  helpText,
  error,
  className = '',
  layout = 'vertical',
  labelIcon: LabelIcon,
  color = 'blue',
  required = false,
}) => {
  const colors = {
    blue: {
      label: 'text-blue-700',
      icon: 'text-blue-600',
      ring: 'focus:ring-blue-500/30',
      accent: 'text-blue-600 border-blue-600',
    },
    green: {
      label: 'text-green-700',
      icon: 'text-green-600',
      ring: 'focus:ring-green-500/30',
      accent: 'text-green-600 border-green-600',
    },
    amber: {
      label: 'text-amber-700',
      icon: 'text-amber-600',
      ring: 'focus:ring-amber-500/30',
      accent: 'text-amber-600 border-amber-600',
    },
    yellow: {
      label: 'text-yellow-700',
      icon: 'text-yellow-600',
      ring: 'focus:ring-yellow-500/30',
      accent: 'text-yellow-600 border-yellow-600',
    },
    red: {
      label: 'text-red-700',
      icon: 'text-red-600',
      ring: 'focus:ring-red-500/30',
      accent: 'text-red-600 border-red-600',
    },
    violet: {
      label: 'text-violet-700',
      icon: 'text-violet-600',
      ring: 'focus:ring-violet-500/30',
      accent: 'text-violet-600 border-violet-600',
    },
    indigo: {
      label: 'text-indigo-700',
      icon: 'text-indigo-600',
      ring: 'focus:ring-indigo-500/30',
      accent: 'text-indigo-600 border-indigo-600',
    }
  } as const;

  const c = colors[color] ?? colors.blue;

  return (
    <div className={`mb-4 ${className}`}>
      <Label className={`block text-sm font-normal mb-3 flex items-center gap-2 ${c.label}`}>
        {LabelIcon && (
          <span className="inline-flex items-center justify-center">
            <LabelIcon className={`w-4 h-4 ${c.icon}`} />
          </span>
        )}
        <span>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </Label>
      
      <div className={`space-y-3 ${layout === 'horizontal' ? 'sm:flex sm:space-y-0 sm:space-x-4' : ''}`}>
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id={`${name}-${option.value}`}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                disabled={option.disabled}
                className={`w-4 h-4 ${c.accent} bg-gray-100 border-gray-300 focus:ring-4 ${c.ring} transition-all duration-200 ${
                  error ? 'border-red-500' : ''
                } ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              />
            </div>
            <div className="ml-3 text-sm">
              <Label 
                htmlFor={`${name}-${option.value}`}
                className={`font-medium text-gray-900 ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option.label}
              </Label>
              {option.description && (
                <p className={`text-gray-500 text-xs mt-1 ${option.disabled ? 'opacity-50' : ''}`}>
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
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

export default CalculatorToggle;