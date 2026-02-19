// src/components/calculators/AgeCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Calculator as CalcIcon, Calendar, Clock, User, Gift } from 'lucide-react';
import { CalculatorForm, CalculatorInputGroup } from './shared';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  nextBirthday: Date;
  daysUntilBirthday: number;
  zodiacSign: string;
  birthDate: Date;
  targetDate: Date;
  isValid: boolean;
}

const AgeCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [birthDate, setBirthDate] = useState<string>('1990-01-01');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<AgeResult | null>(null);
  const [errors, setErrors] = useState<{
    birthDate?: string; targetDate?: string;
  }>({});

  // Format number with current locale
  const formatNumber = (num: number): string => {
    return num.toLocaleString(locale);
  };

  // Get zodiac sign
  const getZodiacSign = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return t('age_zodiac_aries');
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return t('age_zodiac_taurus');
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return t('age_zodiac_gemini');
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return t('age_zodiac_cancer');
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return t('age_zodiac_leo');
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return t('age_zodiac_virgo');
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return t('age_zodiac_libra');
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return t('age_zodiac_scorpio');
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return t('age_zodiac_sagittarius');
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return t('age_zodiac_capricorn');
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return t('age_zodiac_aquarius');
    return t('age_zodiac_pisces');
  };

  // Calculate next birthday
  const getNextBirthday = (birthDate: Date, targetDate: Date): Date => {
    const nextBirthday = new Date(targetDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (nextBirthday <= targetDate) {
      nextBirthday.setFullYear(targetDate.getFullYear() + 1);
    }

    return nextBirthday;
  };

  // Calculate days until birthday
  const getDaysUntilBirthday = (nextBirthday: Date, targetDate: Date): number => {
    const timeDiff = nextBirthday.getTime() - targetDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Calculate precise age
  const calculateAge = (birthDateObj: Date, targetDateObj: Date): AgeResult => {
    let years = targetDateObj.getFullYear() - birthDateObj.getFullYear();
    let months = targetDateObj.getMonth() - birthDateObj.getMonth();
    let days = targetDateObj.getDate() - birthDateObj.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const lastMonth = new Date(targetDateObj.getFullYear(), targetDateObj.getMonth(), 0);
      days += lastMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total values
    const totalDays = Math.floor((targetDateObj.getTime() - birthDateObj.getTime()) / (1000 * 3600 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    const nextBirthday = getNextBirthday(birthDateObj, targetDateObj);
    const daysUntilBirthday = getDaysUntilBirthday(nextBirthday, targetDateObj);
    const zodiacSign = getZodiacSign(birthDateObj);

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      nextBirthday,
      daysUntilBirthday,
      zodiacSign,
      birthDate: birthDateObj,
      targetDate: targetDateObj,
      isValid: true
    };
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Validation function
  const validateInputs = (birthDateStr: string, targetDateStr: string) => {
    const newErrors: { birthDate?: string; targetDate?: string } = {};

    const birthDateObj = new Date(birthDateStr);
    const targetDateObj = new Date(targetDateStr);
    const today = new Date();

    if (!birthDateStr || isNaN(birthDateObj.getTime())) {
      newErrors.birthDate = t('age_error_birth_date');
    } else if (birthDateObj > today) {
      newErrors.birthDate = t('age_error_birth_future');
    } else if (birthDateObj.getFullYear() < 1900) {
      newErrors.birthDate = t('age_error_birth_before_1900');
    }

    if (!targetDateStr || isNaN(targetDateObj.getTime())) {
      newErrors.targetDate = t('age_error_target_date');
    } else if (targetDateObj < birthDateObj) {
      newErrors.targetDate = t('age_error_target_before_birth');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(birthDate, targetDate)) {
      const birthDateObj = new Date(birthDate);
      const targetDateObj = new Date(targetDate);

      setResult(calculateAge(birthDateObj, targetDateObj));
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthDate, targetDate]);

  // Calculator input form
  const calculatorForm = (
    <CalculatorForm columns={2}>
      {/* Birth Date Section */}
      <CalculatorInputGroup label={t('calculators.age.birth_date')}>
        <div className="space-y-2">
          {/* <Label htmlFor="birthDate" className="text-sm font-medium">
            {t('calculators.age.birth_date')}
          </Label> */}
          <Input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className={`${errors.birthDate ? 'border-destructive' : ''}`}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.birthDate && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.birthDate}
            </p>
          )}
          <p className="text-muted-foreground text-xs">
            {t('calculators.age.birth_date_hint')}
          </p>
        </div>
      </CalculatorInputGroup>

      {/* Target Date Section */}
      <CalculatorInputGroup label={t('calculators.age.target_date')}>
        <div className="space-y-4">
          <div className="space-y-2">
            {/* <Label htmlFor="targetDate" className="text-sm font-medium">
              {t('calculators.age.target_date')}
            </Label> */}
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className={`${errors.targetDate ? 'border-destructive' : ''}`}
            />
            {errors.targetDate && (
              <p className="text-destructive text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.targetDate}
              </p>
            )}
            <p className="text-muted-foreground text-xs">
              {t('calculators.age.target_date_hint')}
            </p>
          </div>

          {/* Quick Date Buttons */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">{t('calculators.age.quick_settings')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTargetDate(new Date().toISOString().split('T')[0])}
                className="px-3 py-2 text-xs bg-muted hover:bg-muted/80 text-foreground rounded border border-border/50 transition-colors"
              >
                {t('calculators.age.today')}
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextYear = new Date();
                  nextYear.setFullYear(nextYear.getFullYear() + 1);
                  setTargetDate(nextYear.toISOString().split('T')[0]);
                }}
                className="px-3 py-2 text-xs bg-muted hover:bg-muted/80 text-foreground rounded border border-border/50 transition-colors"
              >
                {t('calculators.age.next_year')}
              </button>
            </div>
          </div>
        </div>
      </CalculatorInputGroup>

      {/* Summary Card */}
      <div className="md:col-span-2">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm font-medium text-primary mb-2">
                {t('age_summary_title')}
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-semibold text-foreground">{t('age_summary_birth')}</div>
                  <div className="text-muted-foreground">{new Date(birthDate).toLocaleDateString(locale)}</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{t('age_summary_target')}</div>
                  <div className="text-muted-foreground">{new Date(targetDate).toLocaleDateString(locale)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorForm>
  );

  // Results section
  const resultsSection = result ? (
    <div className="space-y-6">
      {/* Main Result - Age */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">
              {result.years} {t('age_unit_years')}
            </div>
            <div className="text-sm text-green-700 mt-1">
              {result.months} {t('age_unit_months')}, {result.days} {t('age_unit_days')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {t('age_exact_age')}
            </div>
          </div>
          <User className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Time Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-blue-800">
              {formatNumber(result.totalDays)}
            </div>
            <div className="text-sm text-blue-700 mt-1">{t('age_unit_days')}</div>
            <div className="text-xs text-blue-600 mt-1">{t('age_total')}</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-purple-800">
              {formatNumber(result.totalWeeks)}
            </div>
            <div className="text-sm text-purple-700 mt-1">{t('age_unit_weeks')}</div>
            <div className="text-xs text-purple-600 mt-1">{t('age_total')}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-orange-800">
              {formatNumber(result.totalHours)}
            </div>
            <div className="text-sm text-orange-700 mt-1">{t('age_unit_hours')}</div>
            <div className="text-xs text-orange-600 mt-1">{t('age_total')}</div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-red-800">
              {formatNumber(result.totalMinutes)}
            </div>
            <div className="text-sm text-red-700 mt-1">{t('age_unit_minutes')}</div>
            <div className="text-xs text-red-600 mt-1">{t('age_total')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Birthday Information */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-5 h-5 text-yellow-600" />
            <h4 className="font-semibold text-yellow-900">{t('age_next_birthday')}</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-yellow-700">{t('age_label_date')}</span>
              <span className="font-mono text-yellow-900">{formatDate(result.nextBirthday)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-700">{t('age_label_in')}</span>
              <span className="font-mono text-yellow-900">
                {result.daysUntilBirthday} {result.daysUntilBirthday === 1 ? t('age_day_1') :
                  result.daysUntilBirthday < 5 ? t('age_day_2_4') : t('age_day_5_plus')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-700">{t('age_label_age')}</span>
              <span className="font-mono text-yellow-900">{result.years + 1} {t('age_unit_years')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zodiac Sign */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <div className="text-sm font-medium text-indigo-700">{t('age_zodiac_sign')}</div>
          </div>
          <div className="text-xl font-bold text-indigo-800">
            {result.zodiacSign}
          </div>
          <div className="text-xs text-indigo-600 mt-1">
            {t('age_zodiac_based_on_birth')}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('age_detail_title')}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>{t('age_detail_birth_date')}</span>
                  <span className="font-mono">{formatDate(result.birthDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('age_detail_target_date')}</span>
                  <span className="font-mono">{formatDate(result.targetDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('age_detail_exact_age')}</span>
                  <span className="font-mono">{result.years} {t('age_unit_years')}, {result.months} {t('age_unit_months')}, {result.days} {t('age_unit_days')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('age_detail_total_days')}</span>
                  <span className="font-mono">{formatNumber(result.totalDays)} {t('age_unit_days')}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {t('age_zodiac_sign')}: {result.zodiacSign} |
                {t('age_next_birthday')} {t('age_label_in')}: {result.daysUntilBirthday} {t('age_unit_days')} |
                {t('age_total')}: {formatNumber(result.totalDays)} {t('age_unit_days')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <CalcIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('common.enter_values')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('calculators.age.title')}
      description={t('calculators.age.description')}
      category={t('categories.practical')}
      calculatorId="age"
      seo={{
        title: t('age_seo_title'),
        description: t('age_seo_description'),
        keywords: t('age_seo_keywords').split(',')
      }}
      formula={{
        latex: t('age_formula_latex'),
        description: t('age_formula_description')
      }}
      examples={{
        title: t('age_examples_title'),
        description: t('age_examples_description'),
        scenarios: [
          {
            title: t('age_example_1_title'),
            description: t('age_example_1_description'),
            example: t('age_example_1_example')
          },
          {
            title: t('age_example_2_title'),
            description: t('age_example_2_description'),
            example: t('age_example_2_example')
          },
          {
            title: t('age_example_3_title'),
            description: t('age_example_3_description'),
            example: t('age_example_3_example')
          }
        ]
      }}
      faq={[
        {
          question: t('age_faq_1_q'),
          answer: t('age_faq_1_a')
        },
        {
          question: t('age_faq_2_q'),
          answer: t('age_faq_2_a')
        },
        {
          question: t('age_faq_3_q'),
          answer: t('age_faq_3_a')
        },
        {
          question: t('age_faq_4_q'),
          answer: t('age_faq_4_a')
        }
      ]}
      schemaData={{
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any"
      }}
      resultSection={resultsSection}
    >
      {calculatorForm}
    </SimpleCalculatorLayout>
  );
};

export default AgeCalculator;
