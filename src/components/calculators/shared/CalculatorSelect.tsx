// src/components/calculators/shared/CalculatorSelect.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface CalculatorSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  helpText?: string;
  error?: string;
  className?: string;
  // Enhanced UI options
  labelIcon?: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'amber' | 'yellow' | 'red' | 'violet' | 'indigo';
  required?: boolean;
}

const CalculatorSelect: React.FC<CalculatorSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Vyberte možnost",
  helpText,
  error,
  className = '',
  labelIcon: LabelIcon,
  color = 'blue',
  required = false,
}) => {
  const colors = {
    blue: {
      label: 'text-blue-700',
      icon: 'text-blue-600',
      ring: 'focus:border-blue-500 focus:ring-blue-500/30',
    },
    green: {
      label: 'text-green-700',
      icon: 'text-green-600',
      ring: 'focus:border-green-500 focus:ring-green-500/30',
    },
    amber: {
      label: 'text-amber-700',
      icon: 'text-amber-600',
      ring: 'focus:border-amber-500 focus:ring-amber-500/30',
    },
    yellow: {
      label: 'text-yellow-700',
      icon: 'text-yellow-600',
      ring: 'focus:border-yellow-500 focus:ring-yellow-500/30',
    },
    red: {
      label: 'text-red-700',
      icon: 'text-red-600',
      ring: 'focus:border-red-500 focus:ring-red-500/30',
    },
    violet: {
      label: 'text-violet-700',
      icon: 'text-violet-600',
      ring: 'focus:border-violet-500 focus:ring-violet-500/30',
    },
    indigo: {
      label: 'text-indigo-700',
      icon: 'text-indigo-600',
      ring: 'focus:border-indigo-500 focus:ring-indigo-500/30',
    }
  } as const;

  const c = colors[color] ?? colors.blue;

  return (
    <div className={`mb-4 ${className}`}>
      <Label htmlFor={id} className={`block text-sm font-normal mb-2 flex items-center gap-2 ${c.label}`}>
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
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          id={id}
          className={`text-lg font-medium transition-all duration-300 focus:ring-4 ${
            error
              ? 'border-red-500 ring-red-500/20 focus:border-red-500 focus:ring-red-500/30'
              : `border-gray-300 ${c.ring} hover:border-gray-400`
          }`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
              className="py-3"
            >
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                {option.description && (
                  <span className="text-xs text-gray-500 mt-1">{option.description}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {helpText && (
        <p className="text-sm text-gray-500 mt-1">
          {helpText}
        </p>
      )}
      
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export default CalculatorSelect;
