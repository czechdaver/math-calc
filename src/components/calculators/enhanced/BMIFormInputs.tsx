'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Ruler, Scale } from 'lucide-react';

interface BMIFormInputsProps {
  height: string;
  weight: string;
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  errors: {
    height?: string;
    weight?: string;
  };
  className?: string;
}

const BMIFormInputs: React.FC<BMIFormInputsProps> = ({
  height,
  weight,
  onHeightChange,
  onWeightChange,
  errors,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {/* Height Input */}
      <div className="group">
        <Label 
          htmlFor="height" 
          className="flex items-center gap-2 text-sm font-normal text-gray-700 mb-3"
        >
          <Ruler className="w-4 h-4 text-blue-600" />
          Height
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="height"
            type="number"
            step="0.1"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            placeholder="170"
            min="50"
            max="300"
            onFocus={() => {
              const v = (height ?? '').trim();
              if (v !== '') return;
              onHeightChange('50');
            }}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
              const current = parseFloat(height as string);
              const step = 0.1;
              let next: number;
              if (isNaN(current)) {
                next = 50 + (e.key === 'ArrowUp' ? step : 0);
              } else {
                next = current + (e.key === 'ArrowUp' ? step : -step);
              }
              next = Math.max(50, Math.min(300, next));
              onHeightChange(next.toFixed(1));
              e.preventDefault();
            }}
            className={`
              h-12 text-lg font-medium transition-all duration-300
              ${errors.height 
                ? 'border-red-500 ring-red-500/20' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
              }
              hover:border-blue-400 focus:ring-4
            `}
          />
          <span className="text-gray-500 font-medium select-none">cm</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {[1, 5, 10].map((s) => (
            <div key={`h-${s}`} className="flex items-center gap-1">
              <button
                type="button"
                className="px-2 py-1 text-xs rounded border hover:bg-gray-50"
                onClick={() => onHeightChange(String(Math.max(50, Math.min(300, (parseFloat(height || '0') || 0) - s))))}
                aria-label={`- ${s}`}
              >
                -{s}
              </button>
              <button
                type="button"
                className="px-2 py-1 text-xs rounded border hover:bg-gray-50"
                onClick={() => onHeightChange(String(Math.max(50, Math.min(300, (parseFloat(height || '0') || 0) + s))))}
                aria-label={`+ ${s}`}
              >
                +{s}
              </button>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Enter your height in centimeters (50-300 cm)
        </p>
        {errors.height && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.height}
          </p>
        )}
      </div>

      {/* Weight Input */}
      <div className="group">
        <Label 
          htmlFor="weight" 
          className="flex items-center gap-2 text-sm font-normal text-gray-700 mb-3"
        >
          <Scale className="w-4 h-4 text-green-600" />
          Weight
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="weight"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            placeholder="70"
            min="2"
            max="500"
            onFocus={() => {
              const v = (weight ?? '').trim();
              if (v !== '') return;
              onWeightChange('2');
            }}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
              const current = parseFloat(weight as string);
              const step = 0.1;
              let next: number;
              if (isNaN(current)) {
                next = 2 + (e.key === 'ArrowUp' ? step : 0);
              } else {
                next = current + (e.key === 'ArrowUp' ? step : -step);
              }
              next = Math.max(2, Math.min(500, next));
              onWeightChange(next.toFixed(1));
              e.preventDefault();
            }}
            className={`
              h-12 text-lg font-medium transition-all duration-300
              ${errors.weight 
                ? 'border-red-500 ring-red-500/20' 
                : 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
              }
              hover:border-green-400 focus:ring-4
            `}
          />
          <span className="text-gray-500 font-medium select-none">kg</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {[1, 5, 10].map((s) => (
            <div key={`w-${s}`} className="flex items-center gap-1">
              <button
                type="button"
                className="px-2 py-1 text-xs rounded border hover:bg-gray-50"
                onClick={() => onWeightChange(String(Math.max(2, Math.min(500, (parseFloat(weight || '0') || 0) - s))))}
                aria-label={`- ${s}`}
              >
                -{s}
              </button>
              <button
                type="button"
                className="px-2 py-1 text-xs rounded border hover:bg-gray-50"
                onClick={() => onWeightChange(String(Math.max(2, Math.min(500, (parseFloat(weight || '0') || 0) + s))))}
                aria-label={`+ ${s}`}
              >
                +{s}
              </button>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Enter your weight in kilograms (2-500 kg)
        </p>
        {errors.weight && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.weight}
          </p>
        )}
      </div>
    </div>
  );
};

export default BMIFormInputs;