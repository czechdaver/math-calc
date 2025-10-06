// src/components/calculators/BMICalculatorV3.tsx
import React, { useState, useEffect } from 'react';
import { useTranslations, useMessages } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Ruler, Scale } from 'lucide-react';
import Message from '@/components/ui/Message';
import { CalculatorInput, CalculatorResult } from './shared';
import { getRelatedCalculators } from '@/lib/calculatorDataUtils';
import { useUnits } from '@/contexts/UnitsContext';

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  isValid: boolean;
}

const BMICalculatorV3: React.FC = () => {
  const t = useTranslations();
  type BmiMessages = { calculators?: { bmi_v3?: { formula?: { latex?: string } } } } | undefined;
  const messages = (useMessages() as unknown) as BmiMessages;
  const params = useParams();
  const locale = params.locale as string;
  const { units, preference } = useUnits();
  const isUS = preference.unitSet === 'imperial_us';
  const heightUnit = units.length === 'in' ? 'in' : 'cm';
  const weightUnit = units.weight === 'lb' ? 'lb' : 'kg';

  const [height, setHeight] = useState<string>(heightUnit === 'in' ? '67' : '170');
  const [weight, setWeight] = useState<string>(weightUnit === 'lb' ? '154' : '70');
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

  // Validation function (unit-aware)
  const validateInputs = (heightStr: string, weightStr: string) => {
    const newErrors: { height?: string; weight?: string } = {};
    
    const heightNum = parseFloat(heightStr);
    const weightNum = parseFloat(weightStr);
    
    // Convert inputs to metric for validation bounds
    const heightCm = heightUnit === 'in' ? heightNum * 2.54 : heightNum;
    const weightKg = weightUnit === 'lb' ? weightNum / 2.20462262185 : weightNum;

    if (!heightStr || isNaN(heightNum) || heightCm < 50 || heightCm > 300) {
      newErrors.height = t('height_validation_error');
    }
    if (!weightStr || isNaN(weightNum) || weightKg < 2 || weightKg > 500) {
      newErrors.weight = t('weight_validation_error');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Effect for real-time calculation (unit-aware)
  useEffect(() => {
    if (validateInputs(height, weight)) {
      const heightNum = parseFloat(height);
      const weightNum = parseFloat(weight);
      // Convert to metric for computation
      const heightCm = heightUnit === 'in' ? heightNum * 2.54 : heightNum;
      const weightKg = weightUnit === 'lb' ? weightNum / 2.20462262185 : weightNum;
      const calculatedResult = calculateBMI(heightCm, weightKg);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [height, weight, heightUnit, weightUnit]);

  // Calculator form using shared components
  const calculatorForm = (
    <div className="space-y-6">
      <CalculatorInput
        id="height"
        label={t('height_label') || 'Výška'}
        value={height}
        onChange={setHeight}
        placeholder={heightUnit === 'in' ? '67' : '170'}
        step="0.1"
        min={heightUnit === 'in' ? (50 / 2.54).toFixed(1) : '50'}
        max={heightUnit === 'in' ? (300 / 2.54).toFixed(1) : '300'}
        unit={heightUnit}
        helpText={t('height_help_text') || 'Zadejte svou výšku v centimetrech (50-300 cm)'}
        error={errors.height}
        quickAdjustSteps={[1, 5, 10]}
        labelIcon={Ruler}
        color="blue"
      />
      
      <CalculatorInput
        id="weight"
        label={t('weight_label') || 'Váha'}
        value={weight}
        onChange={setWeight}
        placeholder={weightUnit === 'lb' ? '154' : '70'}
        step="0.1"
        min={weightUnit === 'lb' ? (2 * 2.20462262185).toFixed(1) : '2'}
        max={weightUnit === 'lb' ? (500 * 2.20462262185).toFixed(0) : '500'}
        unit={weightUnit}
        helpText={t('weight_help_text') || 'Zadejte svou váhu v kilogramech (2-500 kg)'}
        error={errors.weight}
        quickAdjustSteps={[1, 5, 10]}
        labelIcon={Scale}
        color="green"
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
      calculatorId="bmi-v3"
      enhanced={true}
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
        latex: isUS
          ? 'BMI = 703 \\times \\dfrac{\\text{weight}\\,(\\mathrm{lb})}{(\\text{height}\\,(\\mathrm{in}))^2}'
          : (messages?.calculators?.bmi_v3?.formula?.latex || 'BMI = \\dfrac{\\text{weight}\\,(\\mathrm{kg})}{(\\text{height}\\,(\\mathrm{m}))^2}'),
        description: t('calculators.bmi_v3.formula.description')
      }}
      examples={examples}
      faq={faq}
      relatedCalculators={relatedCalculators}
      resultSection={result && (
        <CalculatorResult
          title={t('your_bmi_label') || 'Váš BMI'}
          value={result.bmi.toFixed(1)}
          description={result.category}
          formula={(() => {
            const h = parseFloat(height);
            const w = parseFloat(weight);
            if (isUS) {
              const bmiVal = result.bmi.toFixed(1);
              return `BMI = 703 × ${w.toFixed(1)} ${weightUnit} ÷ (${h.toFixed(1)} ${heightUnit})² = ${bmiVal}`;
            }
            return `BMI = ${w.toFixed(1)} ${weightUnit} ÷ (${(h / 100).toFixed(2)} m)² = ${result.bmi.toFixed(1)}`;
          })()}
          additionalInfo={
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className={`enhanced-result-grid blue ${result.bmi < 18.5 ? 'active' : ''}`}>
                  <div className="font-bold text-blue-600 text-sm">&lt; 18.5</div>
                  <div className="text-xs text-gray-700">{t('bmi_category_underweight') || 'Podváha'}</div>
                </div>
                <div className={`enhanced-result-grid green ${result.bmi >= 18.5 && result.bmi < 25 ? 'active' : ''}`}>
                  <div className="font-bold text-green-600 text-sm">18.5 - 24.9</div>
                  <div className="text-xs text-gray-700">{t('bmi_category_normal') || 'Normální'}</div>
                </div>
                <div className={`enhanced-result-grid yellow ${result.bmi >= 25 && result.bmi < 30 ? 'active' : ''}`}>
                  <div className="font-bold text-yellow-600 text-sm">25.0 - 29.9</div>
                  <div className="text-xs text-gray-700">{t('bmi_category_overweight') || 'Nadváha'}</div>
                </div>
                <div className={`enhanced-result-grid red ${result.bmi >= 30 ? 'active' : ''}`}>
                  <div className="font-bold text-red-600 text-sm">≥ 30.0</div>
                  <div className="text-xs text-gray-700">{t('bmi_category_obese') || 'Obezita'}</div>
                </div>
              </div>

              <Message variant="warning">
                {t('bmi_disclaimer_text') || 'BMI je pouze orientační ukazatel. Pro přesné posouzení zdravotního stavu se obraťte na lékaře.'}
              </Message>
            </div>
          }
        />
      )}
    >
      {calculatorForm}
    </SimpleCalculatorLayout>
  );
};

export default BMICalculatorV3;
