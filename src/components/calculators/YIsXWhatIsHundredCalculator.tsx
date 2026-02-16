// src/components/calculators/YIsXWhatIsHundredCalculator.tsx
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Calculator, AlertCircle } from 'lucide-react';

interface CalculationResult {
  result: number;
  isValid: boolean;
}

const YJeXKolikJeStoCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [y, setY] = useState<string>('25');
  const [x, setX] = useState<string>('15');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<{ y?: string; x?: string }>({});

  const formatNumber = (num: number): string =>
    num.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 4 });

  const validateInputs = (yStr: string, xStr: string): boolean => {
    const newErrors: { y?: string; x?: string } = {};
    const yNum = parseFloat(yStr);
    const xNum = parseFloat(xStr);
    if (!yStr || isNaN(yNum)) newErrors.y = t('y_x_hundred_error_y');
    if (!xStr || isNaN(xNum) || xNum === 0) newErrors.x = t('y_x_hundred_error_x');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (validateInputs(y, x)) {
      const yNum = parseFloat(y);
      const xNum = parseFloat(x);
      setResult({ result: (yNum / xNum) * 100, isValid: true });
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [y, x]);


  return (
    <SimpleCalculatorLayout
      title={t('y_je_x_kolik_je_sto_title')}
      description={t('y_je_x_kolik_je_sto_description')}
      category="finance"
      calculatorId="y-is-x-what-is-hundred"
      seo={{
        title: t('y_je_x_kolik_je_sto_title') + ' | MathCalc',
        description: t('y_je_x_kolik_je_sto_seo_description'),
        keywords: ['percentages', 'calculator', '100%', 'percentage calculation']
      }}
      formula={{
        latex: '\\text{100\\%} = \\frac{Y}{X} \\times 100',
        description: t('y_x_hundred_formula_desc')
      }}
      examples={{
        title: t('y_x_hundred_examples_title'),
        description: t('y_x_hundred_examples_description'),
        scenarios: [
          { title: t('y_x_hundred_example1_title'), description: t('y_x_hundred_example1_description') },
          { title: t('y_x_hundred_example2_title'), description: t('y_x_hundred_example2_description') }
        ]
      }}
      faq={[
        { question: t('y_x_hundred_faq1_q'), answer: t('y_x_hundred_faq1_a') },
        { question: t('y_x_hundred_faq2_q'), answer: t('y_x_hundred_faq2_a') },
        { question: t('y_x_hundred_faq3_q'), answer: t('y_x_hundred_faq3_a') }
      ]}
      schemaData={{
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any"
      }}
      resultSection={result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              {t('y_x_hundred_result_title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formatNumber(result.result)}
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  100% = {formatNumber(result.result)}
                </div>
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <p>
                  {t('y_x_hundred_result_explanation')
                    .replace('{y}', formatNumber(parseFloat(y)))
                    .replace('{x}', formatNumber(parseFloat(x)))
                    .replace('{result}', formatNumber(result.result))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    >
      <div className="space-y-6">
        <div className="mb-4">
          <Label htmlFor="y" className="block text-sm font-medium text-gray-700 mb-2">
            {t('hodnota_y_label_y_is_x_percent')}
          </Label>
          <Input
            id="y"
            type="number"
            value={y}
            onChange={(e) => setY(e.target.value)}
            placeholder="25"
            step="0.01"
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            {t('y_je_x_kolik_je_sto_help_y')}
          </p>
          {errors.y && (
            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />{errors.y}
            </p>
          )}
        </div>
        <div className="mb-6">
          <Label htmlFor="x" className="block text-sm font-medium text-gray-700 mb-2">
            {t('hodnota_x_label_y_is_x_percent')}
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="x"
              type="number"
              value={x}
              onChange={(e) => setX(e.target.value)}
              placeholder="15"
              step="0.01"
              className="flex-1"
            />
            <span className="text-gray-500">%</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {t('y_je_x_kolik_je_sto_help_x')}
          </p>
          {errors.x && (
            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />{errors.x}
            </p>
          )}
        </div>
      </div>
    </SimpleCalculatorLayout>
  );
};

export default YJeXKolikJeStoCalculator;
