'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Calculator, Info, Columns3 } from 'lucide-react';
import BMIFormInputs from './BMIFormInputs';
import BMIResultCard from './BMIResultCard';
import BMICategoryDisplay from './BMICategoryDisplay';
import FAQSection from './FAQSection';
import AdPlaceholder from './AdPlaceholder';

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  isValid: boolean;
}

interface BMIExample {
  title: string;
  height: number;
  weight: number;
  bmi: number;
  category: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface EnhancedBMICalculatorProps {
  initialHeight?: string;
  initialWeight?: string;
  showExamples?: boolean;
  showFAQ?: boolean;
  enableAds?: boolean;
  examples?: BMIExample[];
  faqItems?: FAQItem[];
}

const EnhancedBMICalculator: React.FC<EnhancedBMICalculatorProps> = ({
  initialHeight = '175',
  initialWeight = '70',
  showExamples = true,
  showFAQ = true,
  enableAds = true,
  examples = [],
  faqItems = []
}) => {
  const [height, setHeight] = useState<string>(initialHeight);
  const [weight, setWeight] = useState<string>(initialWeight);
  const [result, setResult] = useState<BMIResult | null>(null);
  const [errors, setErrors] = useState<{ height?: string; weight?: string }>({});

  // Calculate BMI
  const calculateBMI = (heightCm: number, weightKg: number): BMIResult => {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    
    let category = '';
    let categoryColor = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-blue-600';
    } else if (bmi < 25) {
      category = 'Normal weight';
      categoryColor = 'text-green-600';
    } else if (bmi < 30) {
      category = 'Overweight';
      categoryColor = 'text-yellow-600';
    } else {
      category = 'Obese';
      categoryColor = 'text-red-600';
    }

    return {
      bmi,
      category,
      categoryColor,
      isValid: true
    };
  };

  // Validation function
  const validateInputs = (heightStr: string, weightStr: string) => {
    const newErrors: { height?: string; weight?: string } = {};
    
    const heightNum = parseFloat(heightStr);
    const weightNum = parseFloat(weightStr);
    
    if (!heightStr || isNaN(heightNum) || heightNum < 50 || heightNum > 300) {
      newErrors.height = 'Please enter a valid height between 50-300 cm';
    }
    if (!weightStr || isNaN(weightNum) || weightNum < 2 || weightNum > 500) {
      newErrors.weight = 'Please enter a valid weight between 2-500 kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(height, weight)) {
      const heightNum = parseFloat(height);
      const weightNum = parseFloat(weight);
      const calculatedResult = calculateBMI(heightNum, weightNum);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [height, weight]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Enhanced BMI Calculator
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Calculate your Body Mass Index with our modern, easy-to-use calculator. 
                Get instant results with detailed health information and recommendations.
              </p>
            </div>

            {/* Formula Section */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Info className="w-5 h-5 text-indigo-600" />
                  </div>
                  BMI Formula
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl text-center border">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    BMI = weight (kg) ÷ height (m)²
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Body Mass Index is calculated by dividing weight in kilograms by height in meters squared
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Calculator Input Section */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Calculator className="w-5 h-5 text-green-600" />
                  </div>
                  Calculate Your BMI
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <BMIFormInputs
                  height={height}
                  weight={weight}
                  onHeightChange={setHeight}
                  onWeightChange={setWeight}
                  errors={errors}
                />
              </CardContent>
            </Card>

            {/* In-Content Ad */}
            {enableAds && (
              <div className="flex justify-center py-6">
                <AdPlaceholder 
                  size="728x90" 
                  position="In-Content"
                  className="w-full max-w-[728px] h-[90px]"
                />
              </div>
            )}

            {/* Results Section */}
            {result && (
              <BMIResultCard
                result={result}
                height={height}
                weight={weight}
              />
            )}

            {/* Examples Section */}
            {showExamples && examples.length > 0 && (
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Columns3 className="w-5 h-5 text-purple-600" />
                    </div>
                    BMI Examples
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {examples.map((example, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900">{example.title}</h4>
                      <p className="text-gray-600 mt-1">
                        Height: {example.height}cm, Weight: {example.weight}kg → BMI: {example.bmi} ({example.category})
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* FAQ Section */}
            {showFAQ && faqItems.length > 0 && (
              <FAQSection faqItems={faqItems} />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sidebar Ad */}
            {enableAds && (
              <div className="hidden lg:block">
                <AdPlaceholder 
                  size="300x250" 
                  position="Sidebar"
                  className="w-full h-[250px]"
                />
              </div>
            )}

            {/* BMI Categories Overview */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b">
                <CardTitle className="text-lg">BMI Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <BMICategoryDisplay currentBMI={result?.bmi} />
              </CardContent>
            </Card>

            {/* Another Sidebar Ad */}
            {enableAds && (
              <div className="hidden lg:block">
                <AdPlaceholder 
                  size="300x600" 
                  position="Sidebar Bottom"
                  className="w-full h-[600px]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom Ad (Mobile) */}
        {enableAds && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 shadow-lg">
            <div className="flex justify-center p-2">
              <AdPlaceholder 
                size="320x50" 
                position="Sticky Bottom"
                className="w-[320px] h-[50px]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedBMICalculator;