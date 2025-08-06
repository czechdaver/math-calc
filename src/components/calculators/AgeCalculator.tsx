// src/components/calculators/AgeCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Calculator as CalcIcon, Calendar, Clock, User, Gift } from 'lucide-react';

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
  const [birthDate, setBirthDate] = useState<string>('1990-01-01');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<AgeResult | null>(null);
  const [errors, setErrors] = useState<{ 
    birthDate?: string; targetDate?: string;
  }>({});

  // Format number with Czech locale
  const formatNumber = (num: number): string => {
    return num.toLocaleString('cs-CZ');
  };

  // Get zodiac sign
  const getZodiacSign = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Beran ♈';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Býk ♉';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Blíženci ♊';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Rak ♋';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Lev ♌';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Panna ♍';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Váhy ♎';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Štír ♏';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Střelec ♐';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Kozoroh ♑';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Vodnář ♒';
    return 'Ryby ♓';
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
    return date.toLocaleDateString('cs-CZ', {
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
      newErrors.birthDate = 'Zadejte platné datum narození';
    } else if (birthDateObj > today) {
      newErrors.birthDate = 'Datum narození nemůže být v budoucnosti';
    } else if (birthDateObj.getFullYear() < 1900) {
      newErrors.birthDate = 'Datum narození musí být po roce 1900';
    }

    if (!targetDateStr || isNaN(targetDateObj.getTime())) {
      newErrors.targetDate = 'Zadejte platné cílové datum';
    } else if (targetDateObj < birthDateObj) {
      newErrors.targetDate = 'Cílové datum musí být po datu narození';
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
  }, [birthDate, targetDate]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Birth Date */}
      <div className="space-y-2">
        <Label htmlFor="birthDate" className="text-sm font-medium">
          {t('calculators.age.birth_date')}
        </Label>
        <Input
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className={`${errors.birthDate ? 'border-red-500' : ''}`}
          max={new Date().toISOString().split('T')[0]}
        />
        {errors.birthDate && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.birthDate}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.age.birth_date_hint')}
        </p>
      </div>

      {/* Target Date */}
      <div className="space-y-2">
        <Label htmlFor="targetDate" className="text-sm font-medium">
          {t('calculators.age.target_date')}
        </Label>
        <Input
          id="targetDate"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className={`${errors.targetDate ? 'border-red-500' : ''}`}
        />
        {errors.targetDate && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.targetDate}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.age.target_date_hint')}
        </p>
      </div>

      {/* Quick Date Buttons */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t('calculators.age.quick_settings')}</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTargetDate(new Date().toISOString().split('T')[0])}
            className="px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
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
            className="px-3 py-2 text-xs bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100 transition-colors"
          >
            {t('calculators.age.next_year')}
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2">
              Výpočet věku
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-semibold text-blue-900">Narození</div>
                <div className="text-blue-700">{new Date(birthDate).toLocaleDateString('cs-CZ')}</div>
              </div>
              <div>
                <div className="font-semibold text-blue-900">Cílové datum</div>
                <div className="text-blue-700">{new Date(targetDate).toLocaleDateString('cs-CZ')}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Results section
  const resultsSection = result ? (
    <div className="space-y-6">
      {/* Main Result - Age */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">
              {result.years} let
            </div>
            <div className="text-sm text-green-700 mt-1">
              {result.months} měsíců, {result.days} dní
            </div>
            <div className="text-xs text-green-600 mt-1">
              Přesný věk
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
            <div className="text-sm text-blue-700 mt-1">Dní</div>
            <div className="text-xs text-blue-600 mt-1">Celkem</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-purple-800">
              {formatNumber(result.totalWeeks)}
            </div>
            <div className="text-sm text-purple-700 mt-1">Týdnů</div>
            <div className="text-xs text-purple-600 mt-1">Celkem</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-orange-800">
              {formatNumber(result.totalHours)}
            </div>
            <div className="text-sm text-orange-700 mt-1">Hodin</div>
            <div className="text-xs text-orange-600 mt-1">Celkem</div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-red-800">
              {formatNumber(result.totalMinutes)}
            </div>
            <div className="text-sm text-red-700 mt-1">Minut</div>
            <div className="text-xs text-red-600 mt-1">Celkem</div>
          </CardContent>
        </Card>
      </div>

      {/* Birthday Information */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-5 h-5 text-yellow-600" />
            <h4 className="font-semibold text-yellow-900">Další narozeniny</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-yellow-700">Datum:</span>
              <span className="font-mono text-yellow-900">{formatDate(result.nextBirthday)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-700">Za:</span>
              <span className="font-mono text-yellow-900">
                {result.daysUntilBirthday} {result.daysUntilBirthday === 1 ? 'den' : 
                 result.daysUntilBirthday < 5 ? 'dny' : 'dní'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-700">Věk:</span>
              <span className="font-mono text-yellow-900">{result.years + 1} let</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zodiac Sign */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <div className="text-sm font-medium text-indigo-700">Znamení zvěrokruhu</div>
          </div>
          <div className="text-xl font-bold text-indigo-800">
            {result.zodiacSign}
          </div>
          <div className="text-xs text-indigo-600 mt-1">
            Podle data narození
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Detailní informace</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Datum narození:</span>
                  <span className="font-mono">{formatDate(result.birthDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cílové datum:</span>
                  <span className="font-mono">{formatDate(result.targetDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Přesný věk:</span>
                  <span className="font-mono">{result.years} let, {result.months} měsíců, {result.days} dní</span>
                </div>
                <div className="flex justify-between">
                  <span>Celkem dní:</span>
                  <span className="font-mono">{formatNumber(result.totalDays)} dní</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Znamení: {result.zodiacSign} | 
                Další narozeniny za: {result.daysUntilBirthday} dní | 
                Celkem: {formatNumber(result.totalDays)} dní života
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
      seo={{
        title: "Kalkulátor věku - Výpočet přesného věku a dní života | MathCalc",
        description: "Bezplatný kalkulátor věku. Vypočítejte přesný věk, celkový počet dní života, další narozeniny a znamení zvěrokruhu.",
        keywords: ["věk", "kalkulátor věku", "datum narození", "narozeniny", "dny života", "znamení", "zvěrokruh", "výpočet věku"]
      }}
      formula={{
        latex: "Věk = Cílové\\,datum - Datum\\,narození",
        description: "Přesný věk se počítá po letech, měsících a dnech. Celkové dny = (Cílové datum - Datum narození) ÷ 24 hodin."
      }}
      examples={{
        title: "Příklady výpočtu věku",
        description: "Různé způsoby použití kalkulátoru věku",
        scenarios: [
          {
            title: "Současný věk",
            description: "Narození 1990-01-01, dnes",
            example: "34 let, 0 měsíců, 4 dny (přibližně)"
          },
          {
            title: "Věk k určitému datu",
            description: "Kolik let budu mít 1. ledna 2030?",
            example: "Užitečné pro plánování důchodu"
          },
          {
            title: "Dny do narozenin",
            description: "Kdy budou další narozeniny?",
            example: "Za 127 dní, budete mít 35 let"
          }
        ]
      }}
      faq={[
        {
          question: "Jak se počítá přesný věk?",
          answer: "Přesný věk se počítá od data narození po roky, měsíce a dny. Nejdříve se odečtou roky, pak měsíce a nakonec dny s přihlédnutím k délce měsíců."
        },
        {
          question: "Proč je důležité znát přesný věk?",
          answer: "Přesný věk je potřeba pro právní dokumenty, pojištění, důchody, nebo jen ze zvědavosti. Některé věkové limity se počítají přesně na dny."
        },
        {
          question: "Jak funguje výpočet znamení zvěrokruhu?",
          answer: "Znamení zvěrokruhu se určuje podle data narození. Každé znamení má své období v roce, například Beran je od 21. března do 19. dubna."
        },
        {
          question: "Lze počítat věk do budoucnosti?",
          answer: "Ano, můžete zadat budoucí datum a zjistit, kolik let budete mít k určitému datu. To je užitečné pro plánování důležitých životních událostí."
        }
      ]}
      relatedCalculators={[
        {
          title: "Kalkulátor spropitného",
          description: "Výpočet spropitného pro restaurace",
          href: "/calculator/prakticke-vypocty/kalkulacka-1",
          category: "Praktické"
        },
        {
          title: "Kalkulátor slev",
          description: "Výpočet slev a úspor",
          href: "/calculator/prakticke-vypocty/kalkulacka-2",
          category: "Praktické"
        },
        {
          title: "Převodník jednotek",
          description: "Převod mezi různými jednotkami",
          href: "/calculator/prevodnik-jednotek",
          category: "Praktické"
        },
        {
          title: "BMI kalkulátor",
          description: "Výpočet indexu tělesné hmotnosti",
          href: "/calculator/bmi",
          category: "Zdraví"
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
