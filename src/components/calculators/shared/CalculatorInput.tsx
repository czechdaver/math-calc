// src/components/calculators/shared/CalculatorInput.tsx
import React from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
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
  quickAdjustSteps?: number[]; // e.g. [1, 5, 10]
  // Enhanced UI options
  labelIcon?: React.ComponentType<{ className?: string }>; // optional icon to render left of label
  color?: 'blue' | 'green' | 'amber' | 'yellow' | 'red' | 'violet' | 'indigo'; // color accent
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'number',
  placeholder,
  step = '0.1',
  min,
  max,
  unit,
  helpText,
  error,
  className = '',
  quickAdjustSteps,
  labelIcon: LabelIcon,
  color = 'blue',
}) => {
  const colors = {
    blue: {
      ring: 'focus:border-blue-500 focus:ring-blue-500/30 hover:border-blue-400',
      label: 'text-blue-700',
      iconBg: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600'
    },
    green: {
      ring: 'focus:border-green-500 focus:ring-green-500/30 hover:border-green-400',
      label: 'text-green-700',
      iconBg: 'bg-green-50 border-green-200',
      icon: 'text-green-600'
    },
    amber: {
      ring: 'focus:border-amber-500 focus:ring-amber-500/30 hover:border-amber-400',
      label: 'text-amber-700',
      iconBg: 'bg-amber-50 border-amber-200',
      icon: 'text-amber-600'
    },
    yellow: {
      ring: 'focus:border-yellow-500 focus:ring-yellow-500/30 hover:border-yellow-400',
      label: 'text-yellow-700',
      iconBg: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600'
    },
    red: {
      ring: 'focus:border-red-500 focus:ring-red-500/30 hover:border-red-400',
      label: 'text-red-700',
      iconBg: 'bg-red-50 border-red-200',
      icon: 'text-red-600'
    },
    violet: {
      ring: 'focus:border-violet-500 focus:ring-violet-500/30 hover:border-violet-400',
      label: 'text-violet-700',
      iconBg: 'bg-violet-50 border-violet-200',
      icon: 'text-violet-600'
    },
    indigo: {
      ring: 'focus:border-indigo-500 focus:ring-indigo-500/30 hover:border-indigo-400',
      label: 'text-indigo-700',
      iconBg: 'bg-indigo-50 border-indigo-200',
      icon: 'text-indigo-600'
    }
  } as const;

  const c = colors[color] ?? colors.blue;

  const decimalsFromStep = React.useMemo(() => {
    if (!step) return 0;
    const dot = step.toString().split('.')?.[1];
    return dot ? dot.length : 0;
  }, [step]);

  const clampAndFormat = (num: number) => {
    let clamped = num;
    const minNum = min !== undefined && min !== '' ? parseFloat(min as string) : undefined;
    const maxNum = max !== undefined && max !== '' ? parseFloat(max as string) : undefined;
    if (!isNaN(minNum as number) && clamped < (minNum as number)) clamped = minNum as number;
    if (!isNaN(maxNum as number) && clamped > (maxNum as number)) clamped = maxNum as number;
    const fixed = decimalsFromStep > 0 ? clamped.toFixed(decimalsFromStep) : String(Math.round(clamped));
    return fixed;
  };

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = () => {
    if (value !== undefined && value !== null && String(value).trim() !== '') return;
    const minNum = min !== undefined && min !== '' ? parseFloat(min as string) : undefined;
    const initial = !isNaN(minNum as number) ? (minNum as number) : 0;
    onChange(clampAndFormat(initial));
  };

  const handleAdjust = (delta: number) => {
    const current = parseFloat(value || '0');
    const next = isNaN(current) ? delta : current + delta;
    onChange(clampAndFormat(next));
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    const minNum = min !== undefined && min !== '' ? parseFloat(min as string) : undefined;
    const maxNum = max !== undefined && max !== '' ? parseFloat(max as string) : undefined;
    const stepNum = step ? parseFloat(step) : 1;
    const current = parseFloat(value);
    if (isNaN(current)) {
      // Initialize to min (if defined) or 0, then apply the step delta
      let base = !isNaN(minNum as number) ? (minNum as number) : 0;
      const delta = e.key === 'ArrowUp' ? stepNum : -stepNum;
      let next = base + delta;
      if (!isNaN(minNum as number)) next = Math.max(next, minNum as number);
      if (!isNaN(maxNum as number)) next = Math.min(next, maxNum as number);
      onChange(clampAndFormat(next));
      e.preventDefault();
    }
  };
  return (
    <div className={`mb-4 ${className}`}>
      <Label htmlFor={id} className={`block text-sm font-normal mb-2 flex items-center gap-2 ${c.label}`}>
        {LabelIcon && (
          <span className="inline-flex items-center justify-center">
            <LabelIcon className={`w-4 h-4 ${c.icon}`} />
          </span>
        )}
        <span>{label}</span>
      </Label>
      <div className="flex items-center space-x-2">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          className={`flex-1 h-12 text-lg font-medium transition-all duration-300 focus:ring-4 ${
            error
              ? 'border-red-500 ring-red-500/20 focus:border-red-500 focus:ring-red-500/30'
              : `border-gray-300 ${c.ring}`
          }`}
        />
        {unit && <span className="text-gray-600 text-sm px-2 py-1">{unit}</span>}
      </div>
      {quickAdjustSteps && quickAdjustSteps.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {quickAdjustSteps.map((s) => (
            <div key={s} className="flex items-center gap-1">
              <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => handleAdjust(-s)} aria-label={`- ${s}`}>
                -{s}
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => handleAdjust(s)} aria-label={`+ ${s}`}>
                +{s}
              </Button>
            </div>
          ))}
        </div>
      )}
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
