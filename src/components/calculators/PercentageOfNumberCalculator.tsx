// src/components/calculators/PercentageOfNumberCalculator.tsx
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Info, AlertCircle } from 'lucide-react';
import { CalculatorForm, CalculatorInput } from './shared';

interface PercentageResult {
  result: number;
  percentage: number;
  number: number;
  isValid: boolean;
}

const PercentageOfNumberCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [percentage, setPercentage] = useState<string>('15');
  const [number, setNumber] = useState<string>('1000');
  const [result, setResult] = useState<PercentageResult | null>(null);
  const [errors, setErrors] = useState<{ percentage?: string; number?: string }>({});

  const validateInputs = React.useCallback((percentageStr: string, numberStr: string) => {
    const newErrors: { percentage?: string; number?: string } = {};
    const percentageNum = parseFloat(percentageStr);
    const numberNum = parseFloat(numberStr);
    if (!percentageStr || isNaN(percentageNum) || percentageNum < 0 || percentageNum > 1000) {
      newErrors.percentage = t('pct_of_num_percentage_error');
    }
    if (!numberStr || isNaN(numberNum) || numberNum < 0) {
      newErrors.number = t('pct_of_num_number_error');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [t]);

  useEffect(() => {
    if (validateInputs(percentage, number)) {
      const pNum = parseFloat(percentage);
      const nNum = parseFloat(number);
      setResult({ result: (pNum / 100) * nNum, percentage: pNum, number: nNum, isValid: true });
    } else {
      setResult(null);
    }
  }, [percentage, number, validateInputs]);


  return (
    <SimpleCalculatorLayout
      title={t('procento_z_cisla_title')}
      description={t('pct_of_num_description')}
      category="math"
      calculatorId="percentage-of-number"
      seo={{
        title: t('pct_of_num_seo_title'),
        description: t('pct_of_num_seo_description'),
        keywords: t('pct_of_num_seo_keywords').split(',')
      }}
      formula={{
        latex: t('procento_z_cisla_formula'),
        description: t('pct_of_num_formula_desc')
      }}
      examples={{
        title: t('pct_of_num_examples_title'),
        description: t('pct_of_num_examples_description'),
        scenarios: [
          { title: t('pct_of_num_example1_title'), description: t('pct_of_num_example1_description'), example: t('pct_of_num_example1_example') },
          { title: t('pct_of_num_example2_title'), description: t('pct_of_num_example2_description'), example: t('pct_of_num_example2_example') }
        ]
      }}
      faq={[
        { question: t('pct_of_num_faq1_q'), answer: t('pct_of_num_faq1_a') },
        { question: t('pct_of_num_faq2_q'), answer: t('pct_of_num_faq2_a') },
        { question: t('pct_of_num_faq3_q'), answer: t('pct_of_num_faq3_a') }
      ]}
      schemaData={{
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any"
      }}
      resultSection={result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              {t('vysledek_label')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {result.result.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {result.percentage}% {t('z')} {result.number.toLocaleString(locale)}
                </div>
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <p><strong>{t('pct_of_num_result_calculation')}:</strong> {result.percentage}% × {result.number.toLocaleString(locale)} = {result.result.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    >
      <CalculatorForm columns={1}>
        <CalculatorInput
          id="percentage"
          label={t('percentages_label')}
          value={percentage}
          onChange={(val) => setPercentage(val)}
          placeholder="15"
          min="0"
          max="1000"
          step="0.01"
          unit="%"
          error={errors.percentage}
          helpText={t('pct_of_num_percentage_help')}
        />

        <CalculatorInput
          id="number"
          label={t('cislo_label')}
          value={number}
          onChange={(val) => setNumber(val)}
          placeholder="1000"
          min="0"
          step="0.01"
          error={errors.number}
          helpText={t('pct_of_num_number_help')}
        />
      </CalculatorForm>
    </SimpleCalculatorLayout>
  );
};

export default PercentageOfNumberCalculator;
