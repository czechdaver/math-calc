// src/components/calculators/shared/CalculatorSelect.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface CalculatorSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  helpText?: string;
  error?: string;
  className?: string;
}

const CalculatorSelect: React.FC<CalculatorSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  helpText,
  error,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : ''
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
