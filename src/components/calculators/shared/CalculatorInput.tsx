// src/components/calculators/shared/CalculatorInput.tsx
import React from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface CalculatorInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'number' | 'text';
  placeholder?: string;
  step?: string;
  min?: string;
  max?: string;
  unit?: string;
  helpText?: string;
  error?: string;
  className?: string;
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'number',
  placeholder,
  step = '0.01',
  min,
  max,
  unit,
  helpText,
  error,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </Label>
      <div className="flex items-center space-x-2">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          className={`flex-1 ${error ? 'border-red-500' : ''}`}
        />
        {unit && <span className="text-gray-500">{unit}</span>}
      </div>
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

export default CalculatorInput;
