'use client';

// Enhanced version of the original BMI calculator with modern UI
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorResult } from './shared';
import { getRelatedCalculators } from '@/lib/calculatorDataUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Calculator, Info, Ruler, Scale, Heart } from 'lucide-react';

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  isValid: boolean;
}

const BMICalculatorEnhanced: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [height, setHeight] = useState<string>('170');
  const [weight, setWeight] = useState<string>('70');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [errors, setErrors] = useState<{ height?: string; weight?: string }>({});

  // Calculate BMI
  const calculateBMI = (heightCm: number, weightKg: number): BMIResult => {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    
    let category = '';
    let categoryColor = '';

    if (bmi < 18.5) {
      category = t('bmi_category_underweight') || 'Underweight';
      categoryColor = 'text-blue-600';
    } else if (bmi < 25) {
      category = t('bmi_category_normal') || 'Normal weight';
      categoryColor = 'text-green-600';
    } else if (bmi < 30) {
      category = t('bmi_category_overweight') || 'Overweight';
      categoryColor = 'text-yellow-600';
    } else {
      category = t('bmi_category_obese') || 'Obese';
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
      newErrors.height = t('height_validation_error') || 'Please enter a valid height between 50-300 cm';
    }
    if (!weightStr || isNaN(weightNum) || weightNum < 2 || weightNum > 500) {
      newErrors.weight = t('weight_validation_error') || 'Please enter a valid weight between 2-500 kg';
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

  // Enhanced calculator form with modern styles
  const calculatorForm = (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="text-center space-y-4 pb-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          {t('enhanced_bmi_calculator') || 'Enhanced BMI Calculator'}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('enhanced_description') || 'Calculate your Body Mass Index with our modern, easy-to-use calculator. Get instant results with detailed health information.'}
        </p>
      </div>
      {/* Formula Card */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Info className="w-5 h-5 text-indigo-600" />
            </div>
            {t('formula_label') || 'BMI Formula'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl text-center border-2 border-indigo-100 shadow-inner">
            <div className="text-2xl font-bold text-gray-800 font-mono">
              BMI = {t('weight_label') || 'weight'} (kg) ÷ {t('height_label') || 'height'} (m)²
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {t('formula_description') || 'Body Mass Index is calculated by dividing weight in kilograms by height in meters squared'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Calculator Input Card */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Calculator className="w-5 h-5 text-green-600" />
            </div>
            {t('calculate_your_bmi') || 'Calculate Your BMI'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Height Input */}
            <div className="group">
              <Label 
                htmlFor="height" 
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
              >
                <Ruler className="w-4 h-4 text-blue-600" />
                {t('height_label') || 'Height'}
              </Label>
              <div className="relative">
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
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
                {t('height_help_text') || 'Enter your height in centimeters (50-300 cm)'}
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
                {t('weight_label') || 'Weight'}
              </Label>
              <div className="relative">
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
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
                {t('weight_help_text') || 'Enter your weight in kilograms (2-500 kg)'}
              </p>
              {errors.weight && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.weight}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Result Card */}
      {result && (
        <Card className="overflow-hidden border-0 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              {t('your_bmi_label') || 'Your BMI Result'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-gray-900">
                  {result.bmi.toFixed(1)}
                </div>
                <div className={`text-xl font-semibold ${result.categoryColor}`}>
                  {result.category}
                </div>
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <strong>{t('calculation') || 'Calculation'}:</strong> {parseFloat(weight).toFixed(1)} kg ÷ ({(parseFloat(height) / 100).toFixed(2)} m)² = {result.bmi.toFixed(1)}
              </div>
            </div>

            {/* Enhanced BMI Categories Grid */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">{t('bmi_categories') || 'BMI Categories'}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className={`text-center p-3 rounded-lg border-2 transition-all ${
                  result.bmi < 18.5 ? 'border-blue-300 bg-blue-50 shadow-lg scale-105' : 'border-blue-100 bg-blue-50/50'
                }`}>
                  <div className="font-bold text-blue-600 text-sm">&lt; 18.5</div>
                  <div className="text-xs text-gray-700">{t('bmi_category_underweight') || 'Underweight'}</div>
                </div>
                <div className={`text-center p-3 rounded-lg border-2 transition-all ${
                  result.bmi >= 18.5 && result.bmi < 25 ? 'border-green-300 bg-green-50 shadow-lg scale-105' : 'border-green-100 bg-green-50/50'
                }`}>
                  <div className="font-bold text-green-600 text-sm">18.5 - 24.9</div>
                  <div className="text-xs text-gray-700">{t('bmi_category_normal') || 'Normal'}</div>
                </div>
                <div className={`text-center p-3 rounded-lg border-2 transition-all ${
                  result.bmi >= 25 && result.bmi < 30 ? 'border-yellow-300 bg-yellow-50 shadow-lg scale-105' : 'border-yellow-100 bg-yellow-50/50'
                }`}>
                  <div className="font-bold text-yellow-600 text-sm">25.0 - 29.9</div>
                  <div className="text-xs text-gray-700">{t('bmi_category_overweight') || 'Overweight'}</div>
                </div>
                <div className={`text-center p-3 rounded-lg border-2 transition-all ${
                  result.bmi >= 30 ? 'border-red-300 bg-red-50 shadow-lg scale-105' : 'border-red-100 bg-red-50/50'
                }`}>
                  <div className="font-bold text-red-600 text-sm">≥ 30.0</div>
                  <div className="text-xs text-gray-700">{t('bmi_category_obese') || 'Obese'}</div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mt-4 border">
              <p className="font-medium">{t('bmi_disclaimer') || 'Important Note:'}</p>
              <p className="mt-1">
                {t('bmi_disclaimer_text') || 'BMI is only an indicative measure. For accurate health assessment, consult with a healthcare professional.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Examples for SimpleCalculatorLayout
  const examples = {
    title: t('bmi_examples_title') || 'BMI Examples',
    description: t('bmi_examples_description') || 'See how BMI is calculated with different examples',
    scenarios: [
      {
        title: t('bmi_example_1_title') || 'Normal Weight Example',
        description: t('bmi_example_1_description') || 'Person with height 170cm and weight 65kg',
        example: t('bmi_example_1_calculation') || 'BMI = 65 ÷ (1.7)² = 22.5 (Normal weight)'
      },
      {
        title: t('bmi_example_2_title') || 'Overweight Example',
        description: t('bmi_example_2_description') || 'Person with height 175cm and weight 85kg',
        example: t('bmi_example_2_calculation') || 'BMI = 85 ÷ (1.75)² = 27.8 (Overweight)'
      }
    ]
  };

  // FAQ for SimpleCalculatorLayout
  const faq = [
    {
      question: t('bmi_faq_1_question') || 'What is BMI?',
      answer: t('bmi_faq_1_answer') || 'Body Mass Index (BMI) is a measure of body fat based on height and weight that applies to adult men and women.'
    },
    {
      question: t('bmi_faq_2_question') || 'Is BMI accurate for everyone?',
      answer: t('bmi_faq_2_answer') || 'BMI is a screening tool but doesn\'t measure body fat directly. It may not be accurate for athletes, elderly, or children.'
    },
    {
      question: t('bmi_faq_3_question') || 'What should I do if my BMI is outside the normal range?',
      answer: t('bmi_faq_3_answer') || 'Consider consulting with a healthcare provider for personalized advice based on your overall health and lifestyle.'
    }
  ];

  // Related calculators - loaded from centralized data
  const relatedCalculators = getRelatedCalculators('bmi', locale, t);

  return (
    <SimpleCalculatorLayout
        title={t('bmi_calculator_title') || 'BMI Calculator'}
        description={t('bmi_calculator_description') || 'Calculate your Body Mass Index (BMI) and determine your weight category.'}
        category="health"
        calculatorId="bmi-enhanced"
        seo={{
          title: (t('bmi_calculator_title') || 'BMI Calculator') + ' - Enhanced Body Mass Index | MathCalc',
          description: 'Free enhanced BMI calculator for calculating Body Mass Index. Determine your weight category according to WHO standards.',
          keywords: [
            'BMI calculator',
            'Body Mass Index',
            'weight category',
            'healthy weight',
            'overweight'
          ]
        }}
        formula={{
          latex: 'BMI = \\frac{weight (kg)}{height (m)^2}',
          description: t('formula_description') || 'BMI is calculated as weight in kilograms divided by height in meters squared.'
        }}
        examples={examples}
        faq={faq}
        relatedCalculators={relatedCalculators}
        resultSection={null} // We handle results inside the form component
      >
        <div className="space-y-8 relative">
          {/* Enhanced Background for Main Content */}
          <div className="absolute inset-0 -m-6 bg-gradient-to-br from-blue-100/80 via-white to-purple-100/80 rounded-3xl shadow-inner"></div>
          <div className="absolute inset-0 -m-4 bg-gradient-to-tr from-indigo-50/60 via-transparent to-pink-50/60 rounded-2xl"></div>
          <div className="relative z-10">
            {calculatorForm}
          </div>
        </div>
      </SimpleCalculatorLayout>
  );
};

export default BMICalculatorEnhanced;