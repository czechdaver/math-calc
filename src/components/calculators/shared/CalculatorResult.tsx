// src/components/calculators/shared/CalculatorResult.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Calculator } from 'lucide-react';

interface CalculatorResultProps {
  title?: string;
  value: string | number;
  unit?: string;
  description?: string;
  formula?: string;
  additionalInfo?: React.ReactNode;
  className?: string;
}

const CalculatorResult: React.FC<CalculatorResultProps> = ({
  title = 'Výsledek',
  value,
  unit,
  description,
  formula,
  additionalInfo,
  className = ''
}) => {
  return (
    <Card className={`mt-6 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {typeof value === 'number' ? value.toLocaleString('cs-CZ') : value}
              {unit && <span className="text-lg ml-1">{unit}</span>}
            </div>
            {description && (
              <div className="text-lg font-semibold text-gray-700 mt-2">
                {description}
              </div>
            )}
          </div>
          
          {formula && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <p>{formula}</p>
            </div>
          )}
          
          {additionalInfo && (
            <div className="mt-4">
              {additionalInfo}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatorResult;
