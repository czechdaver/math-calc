import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

interface BMICategoryDisplayProps {
  currentBMI?: number;
  className?: string;
}

const BMICategoryDisplay: React.FC<BMICategoryDisplayProps> = ({ 
  currentBMI, 
  className = '' 
}) => {
  const categories = [
    {
      range: '< 18.5',
      label: 'Underweight',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      isActive: currentBMI && currentBMI < 18.5
    },
    {
      range: '18.5 - 24.9',
      label: 'Normal weight',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      isActive: currentBMI && currentBMI >= 18.5 && currentBMI < 25
    },
    {
      range: '25.0 - 29.9',
      label: 'Overweight',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      isActive: currentBMI && currentBMI >= 25 && currentBMI < 30
    },
    {
      range: '≥ 30.0',
      label: 'Obese',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      isActive: currentBMI && currentBMI >= 30
    }
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
      {categories.map((category, index) => (
        <div
          key={index}
          className={`
            relative overflow-hidden rounded-xl p-4 text-center transition-all duration-300
            ${category.bgColor} ${category.borderColor}
            ${category.isActive 
              ? 'ring-2 ring-offset-2 ring-current scale-105 shadow-lg' 
              : 'border hover:shadow-md'
            }
          `}
        >
          <div className={`font-bold text-sm ${category.color}`}>
            {category.range}
          </div>
          <div className={`text-xs mt-1 ${category.color}`}>
            {category.label}
          </div>
          {category.isActive && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
          )}
        </div>
      ))}
    </div>
  );
};

export default BMICategoryDisplay;