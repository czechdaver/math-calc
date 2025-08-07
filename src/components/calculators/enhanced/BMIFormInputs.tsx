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
    <div className={`space-y-6 ${className}`}>
      {/* Height Input */}
      <div className="group">
        <Label 
          htmlFor="height" 
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
        >
          <Ruler className="w-4 h-4 text-blue-600" />
          Height
        </Label>
        <div className="relative">
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            placeholder="170"
            min="50"
            max="300"
            className={`
              h-12 text-lg font-medium transition-all duration-300
              ${errors.height 
                ? 'border-red-500 ring-red-500/20' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
              }
              hover:border-blue-400 focus:ring-4
            `}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            cm
          </div>
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
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
        >
          <Scale className="w-4 h-4 text-green-600" />
          Weight
        </Label>
        <div className="relative">
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            placeholder="70"
            min="2"
            max="500"
            className={`
              h-12 text-lg font-medium transition-all duration-300
              ${errors.weight 
                ? 'border-red-500 ring-red-500/20' 
                : 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
              }
              hover:border-green-400 focus:ring-4
            `}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            kg
          </div>
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