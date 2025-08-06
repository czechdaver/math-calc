// src/components/calculators/BMICalculator.tsx
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput, CalculatorResult } from './shared';
import { getRelatedCalculators } from '@/lib/calculatorDataUtils';
import { Info } from 'lucide-react';

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  isValid: boolean;
}

const BMICalculator: React.FC = () => {
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
      category = t('bmi_category_underweight');
      categoryColor = 'text-blue-600';
    } else if (bmi < 25) {
      category = t('bmi_category_normal');
      categoryColor = 'text-green-600';
    } else if (bmi < 30) {
      category = t('bmi_category_overweight');
      categoryColor = 'text-yellow-600';
    } else {
      category = t('bmi_category_obese');
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
      newErrors.height = t('height_validation_error');
    }
    if (!weightStr || isNaN(weightNum) || weightNum < 2 || weightNum > 500) {
      newErrors.weight = t('weight_validation_error');
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

  // Calculator form using shared components
  const calculatorForm = (
    <div className="space-y-6">
      <CalculatorInput
        id="height"
        label={t('height_label') || 'Výška'}
        value={height}
        onChange={setHeight}
        placeholder="170"
        min="50"
        max="300"
        unit="cm"
        helpText={t('height_help_text') || 'Zadejte svou výšku v centimetrech (50-300 cm)'}
        error={errors.height}
      />
      
      <CalculatorInput
        id="weight"
        label={t('weight_label') || 'Váha'}
        value={weight}
        onChange={setWeight}
        placeholder="70"
        min="2"
        max="500"
        unit="kg"
        helpText={t('weight_help_text') || 'Zadejte svou váhu v kilogramech (2-500 kg)'}
        error={errors.weight}
      />
    </div>
  );

  // Examples for SimpleCalculatorLayout
  const examples = {
    title: t('bmi_examples_title'),
    description: t('bmi_examples_description'),
    scenarios: [
      {
        title: t('bmi_example_1_title'),
        description: t('bmi_example_1_description'),
        example: t('bmi_example_1_calculation')
      },
      {
        title: t('bmi_example_2_title'),
        description: t('bmi_example_2_description'),
        example: t('bmi_example_2_calculation')
      }
    ]
  };

  // FAQ for SimpleCalculatorLayout
  const faq = [
    {
      question: t('bmi_faq_1_question'),
      answer: t('bmi_faq_1_answer')
    },
    {
      question: t('bmi_faq_2_question'),
      answer: t('bmi_faq_2_answer')
    },
    {
      question: t('bmi_faq_3_question'),
      answer: t('bmi_faq_3_answer')
    }
  ];

  // Related calculators - loaded from centralized data
  const relatedCalculators = getRelatedCalculators('bmi', locale, t);

  return (
    <SimpleCalculatorLayout
      title={t('bmi_calculator_title')}
      description={t('bmi_calculator_description') || 'Vypočítejte svůj Body Mass Index (BMI) a zjistěte svou váhovou kategorii.'}
      category="health"
      calculatorId="bmi"
      seo={{
        title: t('bmi_calculator_title') + ' - Výpočet Body Mass Index | MathCalc',
        description: 'Bezplatný BMI kalkulátor pro výpočet Body Mass Index. Zjistěte svou váhovou kategorii podle WHO standardů.',
        keywords: [
          'BMI kalkulátor',
          'Body Mass Index',
          'váhová kategorie',
          'zdravá váha',
          'nadváha'
        ]
      }}
      formula={{
        latex: 'BMI = \\frac{váha (kg)}{výška (m)^2}',
        description: 'BMI se vypočítá jako váha v kilogramech dělená druhou mocninou výšky v metrech.'
      }}
      examples={examples}
      faq={faq}
      relatedCalculators={relatedCalculators}
      resultSection={result && (
        <CalculatorResult
          title={t('your_bmi_label') || 'Váš BMI'}
          value={result.bmi.toFixed(1)}
          description={result.category}
          formula={`BMI = ${parseFloat(weight).toFixed(1)} kg ÷ (${(parseFloat(height) / 100).toFixed(2)} m)² = ${result.bmi.toFixed(1)}`}
          additionalInfo={
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-medium text-blue-600">&lt; 18.5</div>
                  <div>{t('bmi_category_underweight') || 'Podváha'}</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-medium text-green-600">18.5 - 24.9</div>
                  <div>{t('bmi_category_normal') || 'Normální'}</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="font-medium text-yellow-600">25.0 - 29.9</div>
                  <div>{t('bmi_category_overweight') || 'Nadváha'}</div>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <div className="font-medium text-red-600">≥ 30.0</div>
                  <div>{t('bmi_category_obese') || 'Obezita'}</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <p>BMI je pouze orientační ukazatel. Pro přesné posouzení zdravotního stavu se obraťte na lékaře.</p>
              </div>
            </div>
          }
        />
      )}
    >
      {calculatorForm}
    </SimpleCalculatorLayout>
  );
};

export default BMICalculator;
