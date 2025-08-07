import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Heart, Calculator } from 'lucide-react';
import BMICategoryDisplay from './BMICategoryDisplay';

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  isValid: boolean;
}

interface BMIResultCardProps {
  result: BMIResult | null;
  height: string;
  weight: string;
  className?: string;
}

const BMIResultCard: React.FC<BMIResultCardProps> = ({
  result,
  height,
  weight,
  className = ''
}) => {
  if (!result || !result.isValid) {
    return null;
  }

  const formula = `BMI = ${parseFloat(weight).toFixed(1)} kg ÷ (${(parseFloat(height) / 100).toFixed(2)} m)² = ${result.bmi.toFixed(1)}`;

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Calculator className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-xl font-bold text-gray-900">Your BMI Result</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Main Result Display */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {result.bmi.toFixed(1)}
            </div>
            <div className="absolute inset-0 blur-sm text-5xl font-bold text-blue-200 -z-10">
              {result.bmi.toFixed(1)}
            </div>
          </div>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-lg ${result.categoryColor} bg-white border-2 border-current`}>
            <Heart className="w-5 h-5" />
            {result.category}
          </div>
        </div>

        {/* Formula Display */}
        <div className="bg-gray-50 p-4 rounded-xl border">
          <h4 className="font-semibold text-gray-700 mb-2">Calculation:</h4>
          <p className="text-sm text-gray-600 font-mono bg-white p-3 rounded border">
            {formula}
          </p>
        </div>

        {/* BMI Categories */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            BMI Categories
          </h4>
          <BMICategoryDisplay currentBMI={result.bmi} />
        </div>

        {/* Health Information */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-amber-100 rounded-full">
              <Heart className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-1">Important Note</h4>
              <p className="text-sm text-amber-700">
                BMI is only an indicator. For accurate health assessment, consult with a healthcare professional.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BMIResultCard;