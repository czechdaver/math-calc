// src/components/calculators/BMRCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Heart, User, Flame, Activity } from 'lucide-react';

interface BMRResult {
  bmr: number;
  bmrMifflin: number;
  bmrHarris: number;
  bmrKatch: number;
  age: number;
  weight: number;
  height: number;
  gender: string;
  bodyFat?: number;
  isValid: boolean;
}

const BMRCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [age, setAge] = useState<string>('30');
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('170');
  const [gender, setGender] = useState<string>('male');
  const [bodyFat, setBodyFat] = useState<string>('');
  const [formula, setFormula] = useState<string>('mifflin');
  const [result, setResult] = useState<BMRResult | null>(null);
  const [errors, setErrors] = useState<{
    age?: string; weight?: string; height?: string; bodyFat?: string
  }>({});

  // Format number with Czech locale
  const formatNumber = (num: number): string => {
    return num.toLocaleString('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Calculate BMR using Mifflin-St Jeor Equation (most accurate)
  const calculateMifflinBMR = (
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

  // Calculate BMR using Harris-Benedict Equation (original)
  const calculateHarrisBMR = (
    weightKg: number,
    heightCm: number,
    ageYears: number,
    isMale: boolean
  ): number => {
    if (isMale) {
      return 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageYears);
    } else {
      return 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageYears);
    }
  };

  // Calculate BMR using Katch-McArdle Equation (requires body fat %)
  const calculateKatchBMR = (
    weightKg: number,
    bodyFatPercent: number
  ): number => {
    const leanBodyMass = weightKg * (1 - bodyFatPercent / 100);
    return 370 + (21.6 * leanBodyMass);
  };

  // Get formula description
  const getFormulaDescription = (formulaType: string): string => {
    switch (formulaType) {
      case 'mifflin': return t('calculators.bmr.help_formula_mifflin');
      case 'harris': return t('calculators.bmr.help_formula_harris');
      case 'katch': return t('calculators.bmr.help_formula_katch');
      default: return t('calculators.bmr.help_formula_mifflin');
    }
  };

  // Calculate BMR with all formulas
  const calculateBMR = (
    ageNum: number,
    weightNum: number,
    heightNum: number,
    genderStr: string,
    bodyFatNum?: number
  ): BMRResult => {
    const isMale = genderStr === 'male';

    const bmrMifflin = calculateMifflinBMR(weightNum, heightNum, ageNum, isMale);
    const bmrHarris = calculateHarrisBMR(weightNum, heightNum, ageNum, isMale);
    const bmrKatch = bodyFatNum ? calculateKatchBMR(weightNum, bodyFatNum) : 0;

    // Use selected formula as primary BMR
    let primaryBMR = bmrMifflin;
    switch (formula) {
      case 'harris':
        primaryBMR = bmrHarris;
        break;
      case 'katch':
        primaryBMR = bodyFatNum ? bmrKatch : bmrMifflin;
        break;
      default:
        primaryBMR = bmrMifflin;
    }

    return {
      bmr: Math.round(primaryBMR),
      bmrMifflin: Math.round(bmrMifflin),
      bmrHarris: Math.round(bmrHarris),
      bmrKatch: Math.round(bmrKatch),
      age: ageNum,
      weight: weightNum,
      height: heightNum,
      gender: genderStr,
      bodyFat: bodyFatNum,
      isValid: true
    };
  };

  // Validation function
  const validateInputs = (ageStr: string, weightStr: string, heightStr: string, bodyFatStr: string) => {
    const newErrors: { age?: string; weight?: string; height?: string; bodyFat?: string } = {};

    const ageNum = parseFloat(ageStr);
    const weightNum = parseFloat(weightStr);
    const heightNum = parseFloat(heightStr);
    const bodyFatNum = bodyFatStr ? parseFloat(bodyFatStr) : undefined;

    if (!ageStr || isNaN(ageNum) || ageNum < 15 || ageNum > 120) {
      newErrors.age = t('calculators.bmr.error_age_invalid');
    }

    if (!weightStr || isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
      newErrors.weight = t('calculators.bmr.error_weight_invalid');
    }

    if (!heightStr || isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      newErrors.height = t('calculators.bmr.error_height_invalid');
    }

    if (bodyFatStr && (!isNaN(bodyFatNum!) && (bodyFatNum! < 5 || bodyFatNum! > 50))) {
      newErrors.bodyFat = t('calculators.bmr.error_bodyfat_invalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(age, weight, height, bodyFat)) {
      const ageNum = parseFloat(age);
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height);
      const bodyFatNum = bodyFat ? parseFloat(bodyFat) : undefined;

      setResult(calculateBMR(ageNum, weightNum, heightNum, gender, bodyFatNum));
    } else {
      setResult(null);
    }
  }, [age, weight, height, gender, bodyFat, formula]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Formula Selection */}
      <div className="space-y-2">
        <Label htmlFor="formula" className="text-sm font-medium">
          {t('calculators.bmr.label_formula')}
        </Label>
        <Select value={formula} onValueChange={setFormula}>
          <SelectTrigger>
            <SelectValue placeholder={t('calculators.bmr.placeholder_select_formula')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mifflin">{t('calculators.bmr.result_mifflin')} ({t('calculators.bmr.result_most_accurate')})</SelectItem>
            <SelectItem value="harris">{t('calculators.bmr.result_harris')}</SelectItem>
            <SelectItem value="katch">{t('calculators.bmr.result_katch')}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {getFormulaDescription(formula)}
        </p>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-700">{t('calculators.bmr.label_personal_data')}</div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium">
            {t('calculators.bmr.label_age')}
          </Label>
          <div className="relative">
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder={t('calculators.bmr.placeholder_age')}
              className={`pr-12 ${errors.age ? 'border-red-500' : ''}`}
              min="15"
              max="120"
              step="1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {t('calculators.bmr.unit_years')}
            </span>
          </div>
          {errors.age && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.age}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            {t('calculators.bmr.help_age')}
          </p>
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium">
            {t('calculators.bmr.label_weight')}
          </Label>
          <div className="relative">
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={t('calculators.bmr.placeholder_weight')}
              className={`pr-12 ${errors.weight ? 'border-red-500' : ''}`}
              min="30"
              max="300"
              step="0.1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {t('calculators.bmr.unit_kg')}
            </span>
          </div>
          {errors.weight && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.weight}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            {t('calculators.bmr.help_weight')}
          </p>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium">
            {t('calculators.bmr.label_height')}
          </Label>
          <div className="relative">
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={t('calculators.bmr.placeholder_height')}
              className={`pr-12 ${errors.height ? 'border-red-500' : ''}`}
              min="100"
              max="250"
              step="1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {t('calculators.bmr.unit_cm')}
            </span>
          </div>
          {errors.height && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.height}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            {t('calculators.bmr.help_height')}
          </p>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium">
            {t('calculators.bmr.label_gender')}
          </Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder={t('calculators.bmr.placeholder_select_formula')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{t('calculators.bmr.summary_male')}</SelectItem>
              <SelectItem value="female">{t('calculators.bmr.summary_female')}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-gray-500 text-xs">
            {t('calculators.bmr.help_age')}
          </p>
        </div>

        {/* Body Fat (optional, required for Katch-McArdle) */}
        <div className="space-y-2">
          <Label htmlFor="bodyFat" className="text-sm font-medium">
            {t('calculators.bmr.label_bodyfat')} {formula === 'katch' && <span className="text-red-500">*</span>}
          </Label>
          <div className="relative">
            <Input
              id="bodyFat"
              type="number"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              placeholder={t('calculators.bmr.placeholder_bodyfat')}
              className={`pr-12 ${errors.bodyFat ? 'border-red-500' : ''}`}
              min="5"
              max="50"
              step="0.1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {t('calculators.bmr.unit_percent')}
            </span>
          </div>
          {errors.bodyFat && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.bodyFat}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            {formula === 'katch'
              ? t('calculators.bmr.help_formula_katch')
              : t('calculators.bmr.help_formula_mifflin')}
          </p>
        </div>
      </div>

      {/* Personal Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2">
              {t('calculators.bmr.summary_title')}
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-semibold text-blue-900">{t('calculators.bmr.summary_age_gender')}</div>
                <div className="text-blue-700">{age} {t('calculators.bmr.unit_years')}, {gender === 'male' ? t('calculators.bmr.summary_male') : t('calculators.bmr.summary_female')}</div>
              </div>
              <div>
                <div className="font-semibold text-blue-900">{t('calculators.bmr.label_weight')}/{t('calculators.bmr.label_height')}</div>
                <div className="text-blue-700">{weight} {t('calculators.bmr.unit_kg')}, {height} {t('calculators.bmr.unit_cm')}</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              {t('calculators.bmr.summary_formula_label')} {getFormulaDescription(formula)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Results section
  const resultsSection = result ? (
    <div className="space-y-6">
      {/* Main Result - Primary BMR */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-red-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-900">
              {formatNumber(result.bmr)}
            </div>
            <div className="text-sm text-red-700 mt-1">
              {t('calculators.bmr.result_bmr')}
            </div>
            <div className="text-xs text-red-600 mt-1">
              BMR ({getFormulaDescription(formula).split(' ')[0]})
            </div>
          </div>
          <Heart className="w-8 h-8 text-red-600" />
        </div>
      </div>

      {/* Formula Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`${formula === 'mifflin' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className={`w-4 h-4 ${formula === 'mifflin' ? 'text-green-600' : 'text-gray-600'}`} />
              <div className={`text-sm font-medium ${formula === 'mifflin' ? 'text-green-700' : 'text-gray-700'}`}>
                {t('calculators.bmr.result_mifflin')}
              </div>
            </div>
            <div className={`text-xl font-bold ${formula === 'mifflin' ? 'text-green-800' : 'text-gray-800'}`}>
              {formatNumber(result.bmrMifflin)} {t('calculators.bmr.result_kcal')}
            </div>
            <div className={`text-xs mt-1 ${formula === 'mifflin' ? 'text-green-600' : 'text-gray-600'}`}>
              {t('calculators.bmr.result_most_accurate')}
            </div>
          </CardContent>
        </Card>

        <Card className={`${formula === 'harris' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className={`w-4 h-4 ${formula === 'harris' ? 'text-blue-600' : 'text-gray-600'}`} />
              <div className={`text-sm font-medium ${formula === 'harris' ? 'text-blue-700' : 'text-gray-700'}`}>
                {t('calculators.bmr.result_harris')}
              </div>
            </div>
            <div className={`text-xl font-bold ${formula === 'harris' ? 'text-blue-800' : 'text-gray-800'}`}>
              {formatNumber(result.bmrHarris)} {t('calculators.bmr.result_kcal')}
            </div>
            <div className={`text-xs mt-1 ${formula === 'harris' ? 'text-blue-600' : 'text-gray-600'}`}>
              {t('calculators.bmr.result_original_formula')}
            </div>
          </CardContent>
        </Card>

        <Card className={`${formula === 'katch' ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <User className={`w-4 h-4 ${formula === 'katch' ? 'text-purple-600' : 'text-gray-600'}`} />
              <div className={`text-sm font-medium ${formula === 'katch' ? 'text-purple-700' : 'text-gray-700'}`}>
                {t('calculators.bmr.result_katch')}
              </div>
            </div>
            <div className={`text-xl font-bold ${formula === 'katch' ? 'text-purple-800' : 'text-gray-800'}`}>
              {result.bmrKatch > 0 ? formatNumber(result.bmrKatch) : '---'} {t('calculators.bmr.result_kcal')}
            </div>
            <div className={`text-xs mt-1 ${formula === 'katch' ? 'text-purple-600' : 'text-gray-600'}`}>
              {result.bmrKatch > 0 ? t('calculators.bmr.result_based_on_fat') : t('calculators.bmr.result_requires_fat')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BMR Breakdown */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm text-gray-800 font-medium mb-3">{t('calculators.bmr.breakdown_title')}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{t('calculators.bmr.breakdown_bmr')}</span>
                <span className="font-mono text-gray-900 font-semibold">{formatNumber(result.bmr)} {t('calculators.bmr.breakdown_per_day')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{t('calculators.bmr.breakdown_per_hour')}</span>
                <span className="font-mono text-gray-900">{formatNumber(result.bmr / 24)} {t('calculators.bmr.breakdown_per_hour_unit')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{t('calculators.bmr.breakdown_per_minute')}</span>
                <span className="font-mono text-gray-900">{(result.bmr / 24 / 60).toFixed(2)} {t('calculators.bmr.breakdown_per_minute_unit')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BMR Information */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('calculators.bmr.info_title')}</h4>
              <p className="text-gray-600 text-sm">
                {t('calculators.bmr.info_description')}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                {t('calculators.bmr.summary_formula_label')} {getFormulaDescription(formula)} |
                BMR: {formatNumber(result.bmr)} {t('calculators.bmr.breakdown_per_day')} |
                {t('calculators.bmr.label_age')}: {result.age} {t('calculators.bmr.unit_years')}, {result.gender === 'male' ? t('calculators.bmr.summary_male') : t('calculators.bmr.summary_female')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <CalcIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('calculators.bmr.empty_message')}</p>
    </div>
  );


  return (
    <SimpleCalculatorLayout
      title={t('calculators.bmr.title')}
      description={t('calculators.bmr.description')}
      category={t('categories.health')}
      calculatorId="bmr"
      seo={{
        title: t('calculators.bmr.seo.title'),
        description: t('calculators.bmr.seo.description'),
        keywords: t('calculators.bmr.seo.keywords').split(',')
      }}
      formula={{
        latex: t('calculators.bmr.formula.latex'),
        description: t('calculators.bmr.formula.description')
      }}
      examples={{
        title: t('calculators.bmr.examples.title'),
        description: t('calculators.bmr.examples.description'),
        scenarios: [
          {
            title: t('calculators.bmr.examples.scenario1.title'),
            description: t('calculators.bmr.examples.scenario1.description'),
            example: t('calculators.bmr.examples.scenario1.example')
          },
          {
            title: t('calculators.bmr.examples.scenario2.title'),
            description: t('calculators.bmr.examples.scenario2.description'),
            example: t('calculators.bmr.examples.scenario2.example')
          },
          {
            title: t('calculators.bmr.examples.scenario3.title'),
            description: t('calculators.bmr.examples.scenario3.description'),
            example: t('calculators.bmr.examples.scenario3.example')
          }
        ]
      }}
      faq={[
        {
          question: t('calculators.bmr.faq.q1.question'),
          answer: t('calculators.bmr.faq.q1.answer')
        },
        {
          question: t('calculators.bmr.faq.q2.question'),
          answer: t('calculators.bmr.faq.q2.answer')
        },
        {
          question: t('calculators.bmr.faq.q3.question'),
          answer: t('calculators.bmr.faq.q3.answer')
        },
        {
          question: t('calculators.bmr.faq.q4.question'),
          answer: t('calculators.bmr.faq.q4.answer')
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

export default BMRCalculator;
