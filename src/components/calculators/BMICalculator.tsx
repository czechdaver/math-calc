// src/components/calculators/BMICalculator.refactored.tsx
import React from 'react';
import { useTranslations } from 'next-intl';
import CalculatorBase, { CalculatorInput, CalculatorResult } from './CalculatorBase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const BMICalculator: React.FC = () => {
  const t = useTranslations();

  const inputs: CalculatorInput[] = [
    {
      id: 'height',
      label: t('height_label'),
      type: 'number',
      required: true,
      min: 50,
      max: 300,
      step: 0.1,
      unit: 'cm',
      helpText: t('height_help_text'),
      defaultValue: 170,
    },
    {
      id: 'weight',
      label: t('weight_label'),
      type: 'number',
      required: true,
      min: 2,
      step: 0.1,
      unit: 'kg',
      helpText: t('weight_help_text'),
      defaultValue: 70,
    },
  ];

  const calculate = (inputs: Record<string, any>): CalculatorResult => {
    const heightM = parseFloat(inputs.height) / 100; // Convert cm to m
    const weight = parseFloat(inputs.weight);
    
    if (isNaN(heightM) || isNaN(weight) || heightM <= 0 || weight <= 0) {
      return {
        value: null,
        details: [],
      };
    }

    const bmi = weight / (heightM * heightM);
    let category = '';
    let categoryClass = '';

    if (bmi < 18.5) {
      category = t('bmi_category_underweight');
      categoryClass = 'text-blue-500';
    } else if (bmi < 25) {
      category = t('bmi_category_normal');
      categoryClass = 'text-green-500';
    } else if (bmi < 30) {
      category = t('bmi_category_overweight');
      categoryClass = 'text-yellow-500';
    } else {
      category = t('bmi_category_obese');
      categoryClass = 'text-red-500';
    }

    return {
      value: bmi,
      details: [
        { label: t('bmi'), value: bmi.toFixed(1), unit: 'kg/m²' },
        { label: t('bmi_category'), value: category, highlight: true },
      ],
      formula: `${inputs.weight} / ((${inputs.height}/100)²) = ${bmi.toFixed(1)}`,
      explanation: t('bmi_explanation', { bmi: bmi.toFixed(1), category }),
    };
  };

  const ResultDisplay: React.FC<{ result: CalculatorResult }> = ({ result }) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">{t('result')}</CardTitle>
      </CardHeader>
      <CardContent>
        {result.value !== null ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {result.details?.map((detail, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    {detail.label}
                  </div>
                  <div className={`text-lg font-semibold ${detail.highlight ? 'text-primary' : ''}`}>
                    {detail.value} {detail.unit || ''}
                  </div>
                </div>
              ))}
            </div>
            
            {result.formula && (
              <div className="mt-4 p-4 bg-muted/50 rounded-md">
                <div className="text-sm font-medium mb-1">{t('formula')}</div>
                <code className="text-sm">{result.formula}</code>
              </div>
            )}
            
            {result.explanation && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div className="flex items-start">
                  <Info className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm">{result.explanation}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">{t('enter_values_to_calculate')}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{t('bmi_calculator_title')}</h1>
      <p className="text-muted-foreground mb-8">
        {t('bmi_calculator_description')}
      </p>
      
      <CalculatorBase
        id="bmi-calculator"
        title={t('bmi_calculator_title')}
        description={t('bmi_calculator_description')}
        category="health"
        seo={{
          title: t('bmi_calculator_title'),
          description: t('bmi_calculator_seo_description'),
          keywords: ['bmi calculator', 'body mass index', 'health calculator'],
        }}
        inputs={inputs}
        calculate={calculate}
        resultComponent={ResultDisplay}
      />
      
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">{t('about_bmi')}</h2>
        <p>{t('bmi_about_text')}</p>
        
        <h3 className="text-lg font-semibold mt-6">{t('bmi_categories')}</h3>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="w-24 font-medium">{t('bmi_category_underweight')}:</span>
            <span> &lt; 18.5</span>
          </li>
          <li className="flex items-center">
            <span className="w-24 font-medium">{t('bmi_category_normal')}:</span>
            <span>18.5 - 24.9</span>
          </li>
          <li className="flex items-center">
            <span className="w-24 font-medium">{t('bmi_category_overweight')}:</span>
            <span>25.0 - 29.9</span>
          </li>
          <li className="flex items-center">
            <span className="w-24 font-medium">{t('bmi_category_obese')}:</span>
            <span>≥ 30.0</span>
          </li>
        </ul>
        
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {t('bmi_limitation_notice')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
