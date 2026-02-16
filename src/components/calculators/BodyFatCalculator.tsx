// src/components/calculators/BodyFatCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Activity, User, Target } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="method" className="text-sm font-medium">{t('bodyfat_label_method')}</Label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger>
            <SelectValue placeholder={t('bodyfat_placeholder_method')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="navy">{t('bodyfat_method_navy')}</SelectItem>
            <SelectItem value="bmi">{t('bodyfat_method_bmi')}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {method === 'navy' ? t('bodyfat_hint_navy') : t('bodyfat_hint_bmi')}
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-700">{t('bodyfat_section_basic')}</div>

        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium">{t('bodyfat_label_weight')}</Label>
          <div className="relative">
            <Input
              id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
              placeholder="70" className={`pr-12 ${errors.weight ? 'border-red-500' : ''}`}
              min="30" max="300" step="0.1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">kg</span>
          </div>
          {errors.weight && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{errors.weight}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium">{t('bodyfat_label_height')}</Label>
          <div className="relative">
            <Input
              id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)}
              placeholder="170" className={`pr-12 ${errors.height ? 'border-red-500' : ''}`}
              min="100" max="250" step="1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">cm</span>
          </div>
          {errors.height && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{errors.height}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium">{t('bodyfat_label_age')}</Label>
          <div className="relative">
            <Input
              id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)}
              placeholder="30" className={`pr-12 ${errors.age ? 'border-red-500' : ''}`}
              min="15" max="120" step="1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">let</span>
          </div>
          {errors.age && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{errors.age}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium">{t('bodyfat_label_gender')}</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder={t('bodyfat_placeholder_gender')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{t('bodyfat_gender_male')}</SelectItem>
              <SelectItem value="female">{t('bodyfat_gender_female')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {method === 'navy' && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">{t('bodyfat_section_measures')}</div>

          <div className="space-y-2">
            <Label htmlFor="neck" className="text-sm font-medium">{t('bodyfat_label_neck')}</Label>
            <div className="relative">
              <Input
                id="neck" type="number" value={neck} onChange={(e) => setNeck(e.target.value)}
                placeholder="37" className={`pr-12 ${errors.neck ? 'border-red-500' : ''}`}
                min="20" max="60" step="0.5"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">cm</span>
            </div>
            {errors.neck && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{errors.neck}
              </p>
            )}
            <p className="text-gray-500 text-xs">{t('bodyfat_hint_neck')}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="waist" className="text-sm font-medium">{t('bodyfat_label_waist')}</Label>
            <div className="relative">
              <Input
                id="waist" type="number" value={waist} onChange={(e) => setWaist(e.target.value)}
                placeholder="85" className={`pr-12 ${errors.waist ? 'border-red-500' : ''}`}
                min="50" max="200" step="0.5"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">cm</span>
            </div>
            {errors.waist && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{errors.waist}
              </p>
            )}
            <p className="text-gray-500 text-xs">
              {gender === 'male' ? t('bodyfat_hint_waist_male') : t('bodyfat_hint_waist_female')}
            </p>
          </div>

          {gender === 'female' && (
            <div className="space-y-2">
              <Label htmlFor="hip" className="text-sm font-medium">{t('bodyfat_label_hip')}</Label>
              <div className="relative">
                <Input
                  id="hip" type="number" value={hip} onChange={(e) => setHip(e.target.value)}
                  placeholder="95" className={`pr-12 ${errors.hip ? 'border-red-500' : ''}`}
                  min="60" max="200" step="0.5"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">cm</span>
              </div>
              {errors.hip && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.hip}
                </p>
              )}
              <p className="text-gray-500 text-xs">{t('bodyfat_hint_hip')}</p>
            </div>
          )}
        </div>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2">{t('bodyfat_summary_title')}</div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-semibold text-blue-900">{t('bodyfat_summary_profile')}</div>
                <div className="text-blue-700">{gender === 'male' ? t('bodyfat_gender_male') : t('bodyfat_gender_female')}, {age} let</div>
              </div>
              <div>
                <div className="font-semibold text-blue-900">{t('bodyfat_summary_body')}</div>
                <div className="text-blue-700">{weight} kg, {height} cm</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              {t('bodyfat_label_method')}: {method === 'navy' ? t('bodyfat_method_navy') : t('bodyfat_method_bmi')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
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
