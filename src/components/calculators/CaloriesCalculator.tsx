// src/components/calculators/CaloriesCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator as CalcIcon, Activity, User, Zap, Target, TrendingUp } from 'lucide-react';
import { CalculatorInput, CalculatorForm, CalculatorInputGroup } from './shared';

interface CaloriesResult {
  bmr: number;
  tdee: number;
  weightLoss: number;
  weightGain: number;
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
  isValid: boolean;
}

const CaloriesCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [age, setAge] = useState<string>('30');
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('170');
  const [gender, setGender] = useState<string>('male');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [result, setResult] = useState<CaloriesResult | null>(null);
  const [errors, setErrors] = useState<{
    age?: string; weight?: string; height?: string
  }>({});

  // Format number with locale
  const formatNumber = (num: number): string => {
    return num.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = (
    weightKg: number,
    heightCm: number,
    ageYears: number,
    isMale: boolean
  ): number => {
    if (isMale) {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
    } else {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
    }
  };

  // Get activity multiplier
  const getActivityMultiplier = (level: string): number => {
    switch (level) {
      case 'sedentary': return 1.2;    // Sedentary (little/no exercise)
      case 'light': return 1.375;      // Light activity (light exercise 1-3 days/week)
      case 'moderate': return 1.55;    // Moderate activity (moderate exercise 3-5 days/week)
      case 'active': return 1.725;     // Very active (hard exercise 6-7 days/week)
      case 'extreme': return 1.9;      // Extremely active (very hard exercise, physical job)
      default: return 1.55;
    }
  };

  // Get activity level description
  const getActivityDescription = (level: string): string => {
    switch (level) {
      case 'sedentary': return t('calories_activity_sedentary_desc');
      case 'light': return t('calories_activity_light_desc');
      case 'moderate': return t('calories_activity_moderate_desc');
      case 'active': return t('calories_activity_active_desc');
      case 'extreme': return t('calories_activity_extreme_desc');
      default: return t('calories_activity_moderate_desc');
    }
  };

  // Calculate calories
  const calculateCalories = (
    ageNum: number,
    weightNum: number,
    heightNum: number,
    genderStr: string,
    activityStr: string
  ): CaloriesResult => {
    const isMale = genderStr === 'male';
    const bmr = calculateBMR(weightNum, heightNum, ageNum, isMale);
    const activityMultiplier = getActivityMultiplier(activityStr);
    const tdee = bmr * activityMultiplier;

    // Weight loss: 500 cal deficit per day = ~0.5kg per week
    const weightLoss = tdee - 500;
    // Weight gain: 500 cal surplus per day = ~0.5kg per week
    const weightGain = tdee + 500;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      weightLoss: Math.round(Math.max(1200, weightLoss)), // Minimum 1200 cal for health
      weightGain: Math.round(weightGain),
      age: ageNum,
      weight: weightNum,
      height: heightNum,
      gender: genderStr,
      activityLevel: activityStr,
      isValid: true
    };
  };

  // Validation function
  const validateInputs = (ageStr: string, weightStr: string, heightStr: string) => {
    const newErrors: { age?: string; weight?: string; height?: string } = {};

    const ageNum = parseFloat(ageStr);
    const weightNum = parseFloat(weightStr);
    const heightNum = parseFloat(heightStr);

    if (!ageStr || isNaN(ageNum) || ageNum < 15 || ageNum > 120) {
      newErrors.age = t('calories_error_age');
    }

    if (!weightStr || isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
      newErrors.weight = t('calories_error_weight');
    }

    if (!heightStr || isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      newErrors.height = t('calories_error_height');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(age, weight, height)) {
      const ageNum = parseFloat(age);
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height);

      setResult(calculateCalories(ageNum, weightNum, heightNum, gender, activityLevel));
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age, weight, height, gender, activityLevel]);

  // Calculator input form
  const calculatorForm = (
    <CalculatorForm columns={1}>
      {/* Personal Information */}
      <CalculatorInputGroup label={t('calories_section_personal')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age */}
          <CalculatorInput
            id="age"
            label={t('calories_label_age')}
            value={age}
            onChange={(e) => setAge(e)}
            placeholder="30"
            type="number"
            min="15"
            max="120"
            step="1"
            unit={t('calories_unit_years')}
            error={errors.age}
            helpText={t('calories_hint_age')}
          />

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium">
              {t('calories_label_gender')}
            </Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder={t('calories_placeholder_gender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t('calories_gender_male')}</SelectItem>
                <SelectItem value="female">{t('calories_gender_female')}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              {t('calories_hint_gender')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Weight */}
          <CalculatorInput
            id="weight"
            label={t('calories_label_weight')}
            value={weight}
            onChange={(e) => setWeight(e)}
            placeholder="70"
            type="number"
            min="30"
            max="300"
            step="0.1"
            unit={t('common.kg')}
            error={errors.weight}
            helpText={t('calories_hint_weight')}
          />

          {/* Height */}
          <CalculatorInput
            id="height"
            label={t('calories_label_height')}
            value={height}
            onChange={(e) => setHeight(e)}
            placeholder="170"
            type="number"
            min="100"
            max="250"
            step="1"
            unit={t('common.cm')}
            error={errors.height}
            helpText={t('calories_hint_height')}
          />
        </div>

        {/* Activity Level */}
        <div className="space-y-2 mt-6">
          <Label htmlFor="activityLevel" className="text-sm font-medium">
            {t('calories_label_activity')}
          </Label>
          <Select value={activityLevel} onValueChange={setActivityLevel}>
            <SelectTrigger>
              <SelectValue placeholder={t('calories_placeholder_activity')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">{t('calories_activity_sedentary')}</SelectItem>
              <SelectItem value="light">{t('calories_activity_light')}</SelectItem>
              <SelectItem value="moderate">{t('calories_activity_moderate')}</SelectItem>
              <SelectItem value="active">{t('calories_activity_active')}</SelectItem>
              <SelectItem value="extreme">{t('calories_activity_extreme')}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs">
            {getActivityDescription(activityLevel)}
          </p>
        </div>
      </CalculatorInputGroup>

      {/* Personal Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-primary mb-2">
              {t('calories_summary_title')}
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-semibold text-foreground">{t('calories_summary_age_gender')}</div>
                <div className="text-muted-foreground">{age} {t('calories_unit_years')}, {gender === 'male' ? t('calories_gender_male').toLowerCase() : t('calories_gender_female').toLowerCase()}</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">{t('calories_summary_body')}</div>
                <div className="text-muted-foreground">{weight} {t('common.kg')}, {height} {t('common.cm')}</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {getActivityDescription(activityLevel)}
            </div>
          </div>
        </CardContent>
      </Card>
    </CalculatorForm>
  );

  // Results section
  const resultsSection = result ? (
    <div className="space-y-6">
      {/* Main Result - TDEE */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">
              {formatNumber(result.tdee)}
            </div>
            <div className="text-sm text-green-700 mt-1">
              {t('calories_result_tdee_label')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {t('calories_result_tdee_desc')}
            </div>
          </div>
          <Zap className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Calorie Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-4 h-4 text-red-600" />
              <div className="text-sm text-red-700 font-medium">{t('calories_result_weight_loss')}</div>
            </div>
            <div className="text-xl font-bold text-red-800">
              {formatNumber(result.weightLoss)} {t('common.kcal')}
            </div>
            <div className="text-xs text-red-600 mt-1">
              {t('calories_result_weight_loss_05')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <div className="text-sm text-blue-700 font-medium">{t('calories_result_maintain')}</div>
            </div>
            <div className="text-xl font-bold text-blue-800">
              {formatNumber(result.tdee)} {t('common.kcal')}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {t('calories_result_maintain_current')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div className="text-sm text-green-700 font-medium">{t('calories_result_weight_gain')}</div>
            </div>
            <div className="text-xl font-bold text-green-800">
              {formatNumber(result.weightGain)} {t('common.kcal')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {t('calories_result_weight_gain_05')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm text-gray-800 font-medium mb-3">{t('calories_breakdown_title')}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{t('calories_breakdown_bmr')}</span>
                <span className="font-mono text-gray-900">{formatNumber(result.bmr)} {t('common.kcal')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{t('calories_breakdown_activity')} ({getActivityMultiplier(result.activityLevel)}×):</span>
                <span className="font-mono text-gray-900">+{formatNumber(result.tdee - result.bmr)} {t('common.kcal')}</span>
              </div>
              <div className="border-t border-gray-300 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{t('calories_breakdown_total')}</span>
                <span className="font-mono text-gray-900 font-semibold">{formatNumber(result.tdee)} {t('common.kcal')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BMR Information */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('calories_info_title')}</h4>
              <p className="text-gray-600 text-sm">
                {t('calories_info_description')}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                BMR: {formatNumber(result.bmr)} kcal |
                {t('calories_breakdown_activity')}: {getActivityDescription(result.activityLevel)} |
                TDEE: {formatNumber(result.tdee)} kcal
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <CalcIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('calories_empty_message')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('calculators.calories.title')}
      description={t('calculators.calories.description')}
      category={t('categories.health')}
      calculatorId="calories"
      seo={{
        title: t('calculators.calories.seo.title'),
        description: t('calculators.calories.seo.description'),
        keywords: t('calculators.calories.seo.keywords').split(',')
      }}
      formula={{
        latex: t('calculators.calories.formula.latex'),
        description: t('calculators.calories.formula.description')
      }}
      examples={{
        title: t('calculators.calories.examples.title'),
        description: t('calculators.calories.examples.description'),
        scenarios: [
          {
            title: t('calculators.calories.examples.scenario1.title'),
            description: t('calculators.calories.examples.scenario1.description'),
            example: t('calculators.calories.examples.scenario1.example')
          },
          {
            title: t('calculators.calories.examples.scenario2.title'),
            description: t('calculators.calories.examples.scenario2.description'),
            example: t('calculators.calories.examples.scenario2.example')
          },
          {
            title: t('calculators.calories.examples.scenario3.title'),
            description: t('calculators.calories.examples.scenario3.description'),
            example: t('calculators.calories.examples.scenario3.example')
          }
        ]
      }}
      faq={[
        {
          question: t('calculators.calories.faq.q1.question'),
          answer: t('calculators.calories.faq.q1.answer')
        },
        {
          question: t('calculators.calories.faq.q2.question'),
          answer: t('calculators.calories.faq.q2.answer')
        },
        {
          question: t('calculators.calories.faq.q3.question'),
          answer: t('calculators.calories.faq.q3.answer')
        },
        {
          question: t('calculators.calories.faq.q4.question'),
          answer: t('calculators.calories.faq.q4.answer')
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

export default CaloriesCalculator;
