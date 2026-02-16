import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
// import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput } from './shared';
import { Info } from 'lucide-react';

interface DirectProportionResult {
  value: number;
  a: number;
  b: number;
  c: number;
  isValid: boolean;
}

const DirectProportionCalculator: React.FC = () => {
  const t = useTranslations();
  // const params = useParams();
  // const locale = params.locale as string;
  const [a, setA] = useState<string>('1');
  const [b, setB] = useState<string>('2');
  const [c, setC] = useState<string>('10');
  const [result, setResult] = useState<DirectProportionResult | null>(null);
  const [errors, setErrors] = useState<{ a?: string; b?: string; c?: string }>({});

  const calculate = (aVal: number, bVal: number, cVal: number): DirectProportionResult => {
    if (isNaN(aVal) || isNaN(bVal) || isNaN(cVal) || bVal === 0) {
      return { value: null as unknown as number, a: aVal, b: bVal, c: cVal, isValid: false };
    }
    const x = (cVal * bVal) / aVal;
    return { value: x, a: aVal, b: bVal, c: cVal, isValid: true };
  };

  const validateInputs = () => {
    const newErrors: { a?: string; b?: string; c?: string } = {};
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    const cNum = parseFloat(c);

    if (!a || isNaN(aNum) || aNum <= 0) {
      newErrors.a = t('direct_proportion_validation_positive');
    }
    if (!b || isNaN(bNum) || bNum <= 0) {
      newErrors.b = t('direct_proportion_validation_positive');
    }
    if (!c || isNaN(cNum) || cNum <= 0) {
      newErrors.c = t('direct_proportion_validation_positive');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (validateInputs()) {
      const aNum = parseFloat(a);
      const bNum = parseFloat(b);
      const cNum = parseFloat(c);
      const calculatedResult = calculate(aNum, bNum, cNum);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c]);


  return (
    <SimpleCalculatorLayout
      title={t('direct_proportion_title')}
      description={t('direct_proportion_description')}
      category="matematika"
      calculatorId="direct-proportion"
      seo={{
        title: t('direct_proportion_seo_title'),
        description: t('direct_proportion_seo_description'),
        keywords: [
          t('direct_proportion_keyword_1'),
          t('direct_proportion_keyword_2'),
          t('direct_proportion_keyword_3'),
          t('direct_proportion_keyword_4')
        ]
      }}
      formula={{
        latex: String.raw`x = \frac{c \times b}{a}`,
        description: t('direct_proportion_formula_desc')
      }}
      examples={{
        title: t('direct_proportion_examples_title'),
        description: t('direct_proportion_examples_desc'),
        scenarios: [
          {
            title: t('direct_proportion_example_1_title'),
            description: t('direct_proportion_example_1_desc'),
            example: t('direct_proportion_example_1_calc')
          },
          {
            title: t('direct_proportion_example_2_title'),
            description: t('direct_proportion_example_2_desc'),
            example: t('direct_proportion_example_2_calc')
          }
        ]
      }}
      faq={[
        {
          question: t('direct_proportion_faq_1_q'),
          answer: t('direct_proportion_faq_1_a')
        },
        {
          question: t('direct_proportion_faq_2_q'),
          answer: t('direct_proportion_faq_2_a')
        },
        {
          question: t('direct_proportion_faq_3_q'),
          answer: t('direct_proportion_faq_3_a')
        }
      ]}
      schemaData={{ applicationCategory: "UtilityApplication", operatingSystem: "Any" }}
      resultSection={result && result.isValid && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">{t('direct_proportion_value_a')}</div>
              <div className="text-2xl font-bold text-blue-600">{result.a}</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">{t('direct_proportion_value_b')}</div>
              <div className="text-2xl font-bold text-green-600">{result.b}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">{t('direct_proportion_value_c')}</div>
              <div className="text-2xl font-bold text-purple-600">{result.c}</div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2"><strong>{t('direct_proportion_result_label')}:</strong></p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-xl font-semibold">x = {result.value.toFixed(4)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {result.c} × {result.b} / {result.a} = <strong>{result.value.toFixed(4)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-6">
        <CalculatorInput
          id="a"
          label={t('direct_proportion_value_a')}
          type="number"
          value={a}
          onChange={setA}
          placeholder="1"
          min="0.0001"
          step="any"
          helpText={t('direct_proportion_help_a')}
          error={errors.a}
        />
        <CalculatorInput
          id="b"
          label={t('direct_proportion_value_b')}
          type="number"
          value={b}
          onChange={setB}
          placeholder="1"
          min="0.0001"
          step="any"
          helpText={t('direct_proportion_help_b')}
          error={errors.b}
        />
        <CalculatorInput
          id="c"
          label={t('direct_proportion_value_c')}
          type="number"
          value={c}
          onChange={setC}
          placeholder="1"
          min="0.0001"
          step="any"
          helpText={t('direct_proportion_help_c')}
          error={errors.c}
        />
      </div>
    </SimpleCalculatorLayout>
  );
};

export default DirectProportionCalculator;
