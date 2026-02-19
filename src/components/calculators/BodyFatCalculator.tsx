// src/components/calculators/BodyFatCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Calculator as CalcIcon, Activity, User, Target } from 'lucide-react';
import { CalculatorForm, CalculatorInput, CalculatorSelect } from './shared';

interface BodyFatResult {
  bodyFatPercentage: number;
  category: string;
  categoryColor: string;
  fatMass: number;
  leanMass: number;
  bmi: number;
  method: string;
  isHealthy: boolean;
  isValid: boolean;
}

const BodyFatCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('170');
  const [age, setAge] = useState<string>('30');
  const [gender, setGender] = useState<string>('male');
  const [method, setMethod] = useState<string>('navy');
  const [neck, setNeck] = useState<string>('37');
  const [waist, setWaist] = useState<string>('85');
  const [hip, setHip] = useState<string>('95');
  const [result, setResult] = useState<BodyFatResult | null>(null);
  const [errors, setErrors] = useState<{
    weight?: string; height?: string; age?: string;
    neck?: string; waist?: string; hip?: string;
  }>({});

  const formatNumber = (num: number, decimals: number = 1): string => {
    return num.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const calculateNavyMethod = (heightCm: number, neckCm: number, waistCm: number, hipCm: number, isMale: boolean): number => {
    if (isMale) {
      const bodyDensity = 1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm);
      return (495 / bodyDensity) - 450;
    } else {
      const bodyDensity = 1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm);
      return (495 / bodyDensity) - 450;
    }
  };

  const calculateBMIMethod = (bmi: number, age: number, isMale: boolean): number => {
    if (isMale) {
      return (1.20 * bmi) + (0.23 * age) - 16.2;
    } else {
      return (1.20 * bmi) + (0.23 * age) - 5.4;
    }
  };

  const getBodyFatCategory = (bodyFat: number, isMale: boolean): { category: string; color: string; isHealthy: boolean } => {
    if (isMale) {
      if (bodyFat < 6) return { category: t('bodyfat_category_very_low'), color: 'text-red-600', isHealthy: false };
      if (bodyFat < 14) return { category: t('bodyfat_category_athletic'), color: 'text-green-600', isHealthy: true };
      if (bodyFat < 18) return { category: t('bodyfat_category_fitness'), color: 'text-blue-600', isHealthy: true };
      if (bodyFat < 25) return { category: t('bodyfat_category_average'), color: 'text-yellow-600', isHealthy: true };
      return { category: t('bodyfat_category_obese'), color: 'text-red-600', isHealthy: false };
    } else {
      if (bodyFat < 16) return { category: t('bodyfat_category_very_low'), color: 'text-red-600', isHealthy: false };
      if (bodyFat < 21) return { category: t('bodyfat_category_athletic'), color: 'text-green-600', isHealthy: true };
      if (bodyFat < 25) return { category: t('bodyfat_category_fitness'), color: 'text-blue-600', isHealthy: true };
      if (bodyFat < 32) return { category: t('bodyfat_category_average'), color: 'text-yellow-600', isHealthy: true };
      return { category: t('bodyfat_category_obese'), color: 'text-red-600', isHealthy: false };
    }
  };

  const calculateBodyFat = (
    weightNum: number, heightNum: number, ageNum: number, genderStr: string,
    methodStr: string, neckNum: number, waistNum: number, hipNum: number
  ): BodyFatResult => {
    const isMale = genderStr === 'male';
    const bmi = weightNum / Math.pow(heightNum / 100, 2);

    let bodyFatPercentage: number;
    if (methodStr === 'navy') {
      bodyFatPercentage = calculateNavyMethod(heightNum, neckNum, waistNum, hipNum, isMale);
    } else {
      bodyFatPercentage = calculateBMIMethod(bmi, ageNum, isMale);
    }

    bodyFatPercentage = Math.max(3, Math.min(50, bodyFatPercentage));
    const { category, color, isHealthy } = getBodyFatCategory(bodyFatPercentage, isMale);
    const fatMass = (bodyFatPercentage / 100) * weightNum;
    const leanMass = weightNum - fatMass;

    return {
      bodyFatPercentage: Math.round(bodyFatPercentage * 10) / 10,
      category, categoryColor: color, fatMass: Math.round(fatMass * 10) / 10,
      leanMass: Math.round(leanMass * 10) / 10, bmi: Math.round(bmi * 10) / 10,
      method: methodStr, isHealthy, isValid: true
    };
  };

  const validateInputs = (weightStr: string, heightStr: string, ageStr: string, neckStr: string, waistStr: string, hipStr: string) => {
    const newErrors: any = {};
    const weightNum = parseFloat(weightStr);
    const heightNum = parseFloat(heightStr);
    const ageNum = parseFloat(ageStr);

    if (!weightStr || isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
      newErrors.weight = t('bodyfat_error_weight');
    }
    if (!heightStr || isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      newErrors.height = t('bodyfat_error_height');
    }
    if (!ageStr || isNaN(ageNum) || ageNum < 15 || ageNum > 120) {
      newErrors.age = t('bodyfat_error_age');
    }

    if (method === 'navy') {
      const neckNum = parseFloat(neckStr);
      const waistNum = parseFloat(waistStr);
      const hipNum = parseFloat(hipStr);

      if (!neckStr || isNaN(neckNum) || neckNum < 20 || neckNum > 60) {
        newErrors.neck = t('bodyfat_error_neck');
      }
      if (!waistStr || isNaN(waistNum) || waistNum < 50 || waistNum > 200) {
        newErrors.waist = t('bodyfat_error_waist');
      }
      if (gender === 'female' && (!hipStr || isNaN(hipNum) || hipNum < 60 || hipNum > 200)) {
        newErrors.hip = t('bodyfat_error_hip');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (validateInputs(weight, height, age, neck, waist, hip)) {
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height);
      const ageNum = parseFloat(age);
      const neckNum = parseFloat(neck);
      const waistNum = parseFloat(waist);
      const hipNum = parseFloat(hip);

      setResult(calculateBodyFat(weightNum, heightNum, ageNum, gender, method, neckNum, waistNum, hipNum));
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weight, height, age, gender, method, neck, waist, hip]);

  const calculatorForm = (
    <CalculatorForm columns={1}>
      <CalculatorSelect
        id="method"
        label={t('bodyfat_label_method')}
        value={method}
        onChange={setMethod}
        options={[
          { value: 'navy', label: t('bodyfat_method_navy') },
          { value: 'bmi', label: t('bodyfat_method_bmi') }
        ]}
        helpText={method === 'navy' ? t('bodyfat_hint_navy') : t('bodyfat_hint_bmi')}
      />

      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-700">{t('bodyfat_section_basic')}</div>

        <CalculatorInput
          id="weight"
          label={t('bodyfat_label_weight')}
          value={weight}
          onChange={(val) => setWeight(val)}
          placeholder="70"
          min="30"
          max="300"
          step="0.1"
          unit="kg"
          error={errors.weight}
        />

        <CalculatorInput
          id="height"
          label={t('bodyfat_label_height')}
          value={height}
          onChange={(val) => setHeight(val)}
          placeholder="170"
          min="100"
          max="250"
          step="1"
          unit="cm"
          error={errors.height}
        />

        <CalculatorInput
          id="age"
          label={t('bodyfat_label_age')}
          value={age}
          onChange={(val) => setAge(val)}
          placeholder="30"
          min="15"
          max="120"
          step="1"
          unit="let"
          error={errors.age}
        />

        <CalculatorSelect
          id="gender"
          label={t('bodyfat_label_gender')}
          value={gender}
          onChange={setGender}
          options={[
            { value: 'male', label: t('bodyfat_gender_male') },
            { value: 'female', label: t('bodyfat_gender_female') }
          ]}
        />
      </div>

      {method === 'navy' && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">{t('bodyfat_section_measures')}</div>

          <CalculatorInput
            id="neck"
            label={t('bodyfat_label_neck')}
            value={neck}
            onChange={(val) => setNeck(val)}
            placeholder="37"
            min="20"
            max="60"
            step="0.5"
            unit="cm"
            error={errors.neck}
            helpText={t('bodyfat_hint_neck')}
          />

          <CalculatorInput
            id="waist"
            label={t('bodyfat_label_waist')}
            value={waist}
            onChange={(val) => setWaist(val)}
            placeholder="85"
            min="50"
            max="200"
            step="0.5"
            unit="cm"
            error={errors.waist}
            helpText={gender === 'male' ? t('bodyfat_hint_waist_male') : t('bodyfat_hint_waist_female')}
          />

          {gender === 'female' && (
            <CalculatorInput
              id="hip"
              label={t('bodyfat_label_hip')}
              value={hip}
              onChange={(val) => setHip(val)}
              placeholder="95"
              min="60"
              max="200"
              step="0.5"
              unit="cm"
              error={errors.hip}
              helpText={t('bodyfat_hint_hip')}
            />
          )}
        </div>
      )}

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-primary mb-2">{t('bodyfat_summary_title')}</div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-semibold text-foreground">{t('bodyfat_summary_profile')}</div>
                <div className="text-muted-foreground">{gender === 'male' ? t('bodyfat_gender_male') : t('bodyfat_gender_female')}, {age} let</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">{t('bodyfat_summary_body')}</div>
                <div className="text-muted-foreground">{weight} kg, {height} cm</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-primary">
              {t('bodyfat_label_method')}: {method === 'navy' ? t('bodyfat_method_navy') : t('bodyfat_method_bmi')}
            </div>
          </div>
        </CardContent>
      </Card>
    </CalculatorForm>
  );

  const resultsSection = result ? (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">
              {formatNumber(result.bodyFatPercentage)}%
            </div>
            <div className="text-sm text-green-700 mt-1">{t('bodyfat_result_body_fat')}</div>
            <div className="text-xs text-green-600 mt-1">
              {result.method === 'navy' ? t('bodyfat_method_navy') : t('bodyfat_method_bmi')}
            </div>
          </div>
          <Activity className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <Card className={`${result.isHealthy ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-5 h-5" />
            <div className={`text-sm font-medium ${result.categoryColor}`}>
              {result.category}
            </div>
          </div>
          <div className="text-xs text-gray-600">
            {result.isHealthy ? t('bodyfat_healthy_range') : t('bodyfat_unhealthy_range')}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">
              {formatNumber(result.fatMass)} kg
            </div>
            <div className="text-sm text-blue-700 mt-1">{t('bodyfat_result_fat_mass')}</div>
            <div className="text-xs text-blue-600 mt-1">
              {formatNumber(result.bodyFatPercentage)}% {t('bodyfat_of_total_weight')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-green-800">
              {formatNumber(result.leanMass)} kg
            </div>
            <div className="text-sm text-green-700 mt-1">{t('bodyfat_result_lean_mass')}</div>
            <div className="text-xs text-green-600 mt-1">
              {formatNumber(100 - result.bodyFatPercentage)}% {t('bodyfat_of_total_weight')}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4 text-center">
          <div className="text-sm text-gray-700 mb-2">{t('bodyfat_comparison')}</div>
          <div className="text-lg font-bold text-gray-800">
            BMI: {formatNumber(result.bmi)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {t('bodyfat_vs_bmi_note')}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('bodyfat_what_is_title')}</h4>
              <p className="text-gray-600 text-sm">
                {t('bodyfat_what_is_desc')}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                {t('bodyfat_label_method')}: {result.method === 'navy' ? t('bodyfat_method_navy') : t('bodyfat_method_bmi')} |
                {t('bodyfat_result_body_fat')}: {formatNumber(result.bodyFatPercentage)}% |
                {result.category}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <CalcIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('bodyfat_empty_message')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('bodyfat_page_title')}
      description={t('bodyfat_page_description')}
      category={t('bodyfat_page_category')}
      calculatorId="body-fat"
      seo={{
        title: t('bodyfat_seo_title'),
        description: t('bodyfat_seo_description'),
        keywords: t('bodyfat_seo_keywords').split(',')
      }}
      formula={{
        latex: t('bodyfat_formula_latex'),
        description: t('bodyfat_formula_description')
      }}
      examples={{
        title: t('bodyfat_examples_title'),
        description: t('bodyfat_examples_description'),
        scenarios: [
          {
            title: t('bodyfat_example_1_title'),
            description: t('bodyfat_example_1_description'),
            example: t('bodyfat_example_1_example')
          },
          {
            title: t('bodyfat_example_2_title'),
            description: t('bodyfat_example_2_description'),
            example: t('bodyfat_example_2_example')
          },
          {
            title: t('bodyfat_example_3_title'),
            description: t('bodyfat_example_3_description'),
            example: t('bodyfat_example_3_example')
          }
        ]
      }}
      faq={[
        {
          question: t('bodyfat_faq_1_q'),
          answer: t('bodyfat_faq_1_a')
        },
        {
          question: t('bodyfat_faq_2_q'),
          answer: t('bodyfat_faq_2_a')
        },
        {
          question: t('bodyfat_faq_3_q'),
          answer: t('bodyfat_faq_3_a')
        },
        {
          question: t('bodyfat_faq_4_q'),
          answer: t('bodyfat_faq_4_a')
        }
      ]}
      schemaData={{
        applicationCategory: "HealthApplication",
        operatingSystem: "Any"
      }}
      resultSection={resultsSection}
    >
      {calculatorForm}
    </SimpleCalculatorLayout>
  );
};

export default BodyFatCalculator;
