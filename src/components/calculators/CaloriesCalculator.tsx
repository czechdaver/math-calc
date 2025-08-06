// src/components/calculators/CaloriesCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Activity, User, Zap, Target, TrendingUp } from 'lucide-react';

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
  const [age, setAge] = useState<string>('30');
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('170');
  const [gender, setGender] = useState<string>('male');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [result, setResult] = useState<CaloriesResult | null>(null);
  const [errors, setErrors] = useState<{ 
    age?: string; weight?: string; height?: string 
  }>({});

  // Format number with Czech locale
  const formatNumber = (num: number): string => {
    return num.toLocaleString('cs-CZ', {
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
      case 'sedentary': return 'Sedavý životní styl (žádné cvičení)';
      case 'light': return 'Lehká aktivita (cvičení 1-3× týdně)';
      case 'moderate': return 'Střední aktivita (cvičení 3-5× týdně)';
      case 'active': return 'Vysoká aktivita (cvičení 6-7× týdně)';
      case 'extreme': return 'Extrémní aktivita (intenzivní cvičení + fyzická práce)';
      default: return 'Střední aktivita';
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
      newErrors.age = 'Zadejte platný věk (15-120 let)';
    }

    if (!weightStr || isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
      newErrors.weight = 'Zadejte platnou váhu (30-300 kg)';
    }

    if (!heightStr || isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      newErrors.height = 'Zadejte platnou výšku (100-250 cm)';
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
  }, [age, weight, height, gender, activityLevel]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-700">Osobní údaje</div>
        
        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium">
            Věk
          </Label>
          <div className="relative">
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="30"
              className={`pr-12 ${errors.age ? 'border-red-500' : ''}`}
              min="15"
              max="120"
              step="1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              let
            </span>
          </div>
          {errors.age && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.age}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            Váš věk v letech
          </p>
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium">
            Váha
          </Label>
          <div className="relative">
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              className={`pr-12 ${errors.weight ? 'border-red-500' : ''}`}
              min="30"
              max="300"
              step="0.1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              kg
            </span>
          </div>
          {errors.weight && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.weight}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            Vaše současná váha v kilogramech
          </p>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium">
            Výška
          </Label>
          <div className="relative">
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
              className={`pr-12 ${errors.height ? 'border-red-500' : ''}`}
              min="100"
              max="250"
              step="1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              cm
            </span>
          </div>
          {errors.height && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.height}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            Vaše výška v centimetrech
          </p>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium">
            Pohlaví
          </Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="Vyberte pohlaví" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Muž</SelectItem>
              <SelectItem value="female">Žena</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-gray-500 text-xs">
            Pohlaví ovlivňuje bazální metabolismus
          </p>
        </div>

        {/* Activity Level */}
        <div className="space-y-2">
          <Label htmlFor="activityLevel" className="text-sm font-medium">
            Úroveň aktivity
          </Label>
          <Select value={activityLevel} onValueChange={setActivityLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Vyberte úroveň aktivity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedavý životní styl</SelectItem>
              <SelectItem value="light">Lehká aktivita</SelectItem>
              <SelectItem value="moderate">Střední aktivita</SelectItem>
              <SelectItem value="active">Vysoká aktivita</SelectItem>
              <SelectItem value="extreme">Extrémní aktivita</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-gray-500 text-xs">
            {getActivityDescription(activityLevel)}
          </p>
        </div>
      </div>

      {/* Personal Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2">
              Vaše údaje
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-semibold text-blue-900">Věk/Pohlaví</div>
                <div className="text-blue-700">{age} let, {gender === 'male' ? 'muž' : 'žena'}</div>
              </div>
              <div>
                <div className="font-semibold text-blue-900">Tělo</div>
                <div className="text-blue-700">{weight} kg, {height} cm</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              {getActivityDescription(activityLevel)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
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
              Denní potřeba kalorií
            </div>
            <div className="text-xs text-green-600 mt-1">
              TDEE (Total Daily Energy Expenditure)
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
              <div className="text-sm text-red-700 font-medium">Hubnutí</div>
            </div>
            <div className="text-xl font-bold text-red-800">
              {formatNumber(result.weightLoss)} kcal
            </div>
            <div className="text-xs text-red-600 mt-1">
              -0.5 kg týdně
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <div className="text-sm text-blue-700 font-medium">Udržení váhy</div>
            </div>
            <div className="text-xl font-bold text-blue-800">
              {formatNumber(result.tdee)} kcal
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Současná váha
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div className="text-sm text-green-700 font-medium">Přibírání</div>
            </div>
            <div className="text-xl font-bold text-green-800">
              {formatNumber(result.weightGain)} kcal
            </div>
            <div className="text-xs text-green-600 mt-1">
              +0.5 kg týdně
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm text-gray-800 font-medium mb-3">Rozpis metabolismu:</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">BMR (bazální metabolismus):</span>
                <span className="font-mono text-gray-900">{formatNumber(result.bmr)} kcal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Aktivita ({getActivityMultiplier(result.activityLevel)}×):</span>
                <span className="font-mono text-gray-900">+{formatNumber(result.tdee - result.bmr)} kcal</span>
              </div>
              <div className="border-t border-gray-300 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Celková denní potřeba:</span>
                <span className="font-mono text-gray-900 font-semibold">{formatNumber(result.tdee)} kcal</span>
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
              <h4 className="font-semibold text-gray-900 mb-2">Informace o metabolismu</h4>
              <p className="text-gray-600 text-sm">
                BMR (bazální metabolismus) je množství energie, které vaše tělo potřebuje v klidu. 
                TDEE zahrnuje BMR plus energii spotřebovanou aktivitou. Výpočet používá Mifflin-St Jeor rovnici.
              </p>
              <div className="mt-2 text-xs text-gray-500">
                BMR: {formatNumber(result.bmr)} kcal | 
                Aktivita: {getActivityDescription(result.activityLevel)} | 
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
      <p>Zadejte vaše údaje pro výpočet denní potřeby kalorií</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('calculators.calories.title')}
      description={t('calculators.calories.description')}
      category={t('categories.health')}
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
      relatedCalculators={[
        {
          title: t('calculators.calories.related.bmi.title'),
          description: t('calculators.calories.related.bmi.description'),
          href: "/calculator/bmi",
          category: t('categories.health')
        },
        {
          title: t('calculators.calories.related.percentage.title'),
          description: t('calculators.calories.related.percentage.description'),
          href: "/calculator/procenta/procento-z-cisla",
          category: t('categories.percentages')
        },
        {
          title: t('calculators.calories.related.unit_converter.title'),
          description: t('calculators.calories.related.unit_converter.description'),
          href: "/calculator/prevodnik-jednotek",
          category: t('categories.practical')
        },
        {
          title: t('calculators.calories.related.net_salary.title'),
          description: t('calculators.calories.related.net_salary.description'),
          href: "/calculator/cista-mzda",
          category: t('categories.financial')
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
