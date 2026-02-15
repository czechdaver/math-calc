import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput } from './shared';
import { Info } from 'lucide-react';

interface InverseProportionResult {
  value: number;
  a: number;
  b: number;
  c: number;
  isValid: boolean;
}

const InverseProportionCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [a, setA] = useState<string>('6');
  const [b, setB] = useState<string>('4');
  const [c, setC] = useState<string>('3');
  const [result, setResult] = useState<InverseProportionResult | null>(null);
  const [errors, setErrors] = useState<{ a?: string; b?: string; c?: string }>({});

  const calculate = (aVal: number, bVal: number, cVal: number): InverseProportionResult => {
    if (isNaN(aVal) || isNaN(bVal) || isNaN(cVal) || cVal === 0) {
      return { value: 0, a: aVal, b: bVal, c: cVal, isValid: false };
    }
    const x = (aVal * bVal) / cVal;
    return { value: x, a: aVal, b: bVal, c: cVal, isValid: true };
  };

  const validateInputs = () => {
    const newErrors: { a?: string; b?: string; c?: string } = {};
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    const cNum = parseFloat(c);

    if (!a || isNaN(aNum) || aNum <= 0) {
      newErrors.a = t('inverse_proportion_validation_positive');
    }
    if (!b || isNaN(bNum) || bNum <= 0) {
      newErrors.b = t('inverse_proportion_validation_positive');
    }
    if (!c || isNaN(cNum) || cNum <= 0) {
      newErrors.c = t('inverse_proportion_validation_positive');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (validateInputs()) {
      setResult(calculate(parseFloat(a), parseFloat(b), parseFloat(c)));
    } else {
      setResult(null);
    }
  }, [a, b, c]);


  return (
    <SimpleCalculatorLayout
      title={t('inverse_proportion_title')}
      description={t('inverse_proportion_description')}
      category="matematika"
      calculatorId="inverse-proportion"
      seo={{
        title: t('inverse_proportion_seo_title'),
        description: t('inverse_proportion_seo_description'),
        keywords: [
          t('inverse_proportion_keyword_1'),
          t('inverse_proportion_keyword_2'),
          t('inverse_proportion_keyword_3'),
          t('inverse_proportion_keyword_4')
        ]
      }}
      formula={{
        latex: String.raw`x = \frac{A \times B}{C}`,
        description: t('inverse_proportion_formula_desc')
      }}
      examples={{
        title: t('inverse_proportion_examples_title'),
        description: t('inverse_proportion_examples_desc'),
        scenarios: [
          {
            title: t('inverse_proportion_example_1_title'),
            description: t('inverse_proportion_example_1_desc'),
            example: t('inverse_proportion_example_1_calc')
          },
          {
            title: t('inverse_proportion_example_2_title'),
            description: t('inverse_proportion_example_2_desc'),
            example: t('inverse_proportion_example_2_calc')
          },
          {
            title: t('inverse_proportion_example_3_title'),
            description: t('inverse_proportion_example_3_desc'),
            example: t('inverse_proportion_example_3_calc')
          }
        ]
      }}
      faq={[
        { question: t('inverse_proportion_faq_1_q'), answer: t('inverse_proportion_faq_1_a') },
        { question: t('inverse_proportion_faq_2_q'), answer: t('inverse_proportion_faq_2_a') },
        { question: t('inverse_proportion_faq_3_q'), answer: t('inverse_proportion_faq_3_a') }
      ]}
      schemaData={{ applicationCategory: "UtilityApplication", operatingSystem: "Any" }}
      resultSection={result && result.isValid && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">{t('inverse_proportion_value_a')}</div>
              <div className="text-2xl font-bold text-blue-600">{result.a}</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">{t('inverse_proportion_value_b')}</div>
              <div className="text-2xl font-bold text-green-600">{result.b}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">{t('inverse_proportion_value_c')}</div>
              <div className="text-2xl font-bold text-purple-600">{result.c}</div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2"><strong>{t('inverse_proportion_result_label')}:</strong></p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-xl font-semibold">x = {result.value.toFixed(4)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                ({result.a} × {result.b}) / {result.c} = <strong>{result.value.toFixed(4)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-6">
        <CalculatorInput
          id="a"
          label={t('inverse_proportion_value_a')}
          type="number"
          value={a}
          onChange={setA}
          placeholder="6"
          min="0.0001"
          step="any"
          helpText={t('inverse_proportion_help_a')}
          error={errors.a}
        />
        <CalculatorInput
          id="b"
          label={t('inverse_proportion_value_b')}
          type="number"
          value={b}
          onChange={setB}
          placeholder="4"
          min="0.0001"
          step="any"
          helpText={t('inverse_proportion_help_b')}
          error={errors.b}
        />
        <CalculatorInput
          id="c"
          label={t('inverse_proportion_value_c')}
          type="number"
          value={c}
          onChange={setC}
          placeholder="3"
          min="0.0001"
          step="any"
          helpText={t('inverse_proportion_help_c')}
          error={errors.c}
        />
      </div>
    </SimpleCalculatorLayout>
  );
};

export default InverseProportionCalculator;
