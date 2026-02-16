// src/components/calculators/IdealWeightCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Scale, User, Target, TrendingUp } from 'lucide-react';

interface IdealWeightResult {
  robinson: number; miller: number; devine: number; hamwi: number;
  healthy: { min: number; max: number };
  current?: number; height: number; gender: string; age: number; isValid: boolean;
}

const calculateByFormula = (heightCm: number, isMale: boolean) => {
  const inches = heightCm / 2.54;
  return {
    robinson: isMale ? 52 + 1.9 * (inches - 60) : 49 + 1.7 * (inches - 60),
    miller: isMale ? 56.2 + 1.41 * (inches - 60) : 53.1 + 1.36 * (inches - 60),
    devine: isMale ? 50 + 2.3 * (inches - 60) : 45.5 + 2.3 * (inches - 60),
    hamwi: isMale ? 48 + 2.7 * (inches - 60) : 45.5 + 2.2 * (inches - 60),
  };
};

const IdealWeightCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [height, setHeight] = useState<string>('170');
  const [gender, setGender] = useState<string>('male');
  const [age, setAge] = useState<string>('30');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [formula, setFormula] = useState<string>('robinson');
  const [result, setResult] = useState<IdealWeightResult | null>(null);
  const [errors, setErrors] = useState<{ height?: string; age?: string; currentWeight?: string }>({});

  const fmt = (num: number, decimals: number = 1): string =>
    num.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const getFormulaDesc = (f: string): string => {
    const map: Record<string, string> = {
      robinson: t('ideal_weight_formula_robinson_desc'),
      miller: t('ideal_weight_formula_miller_desc'),
      devine: t('ideal_weight_formula_devine_desc'),
      hamwi: t('ideal_weight_formula_hamwi_desc'),
    };
    return map[f] || map.robinson;
  };

  const getPrimary = (r: IdealWeightResult): number =>
    ({ miller: r.miller, devine: r.devine, hamwi: r.hamwi }[formula] ?? r.robinson);

  const getWeightStatus = (current: number, ideal: number) => {
    const diff = current - ideal;
    const pct = Math.abs(diff) / ideal * 100;
    if (pct <= 5) return { status: t('ideal_weight_status_ideal'), color: 'text-green-600', icon: <Target className="w-4 h-4" /> };
    if (diff > 0) return pct <= 15
      ? { status: t('ideal_weight_status_slightly_overweight'), color: 'text-yellow-600', icon: <TrendingUp className="w-4 h-4" /> }
      : { status: t('ideal_weight_status_overweight'), color: 'text-red-600', icon: <TrendingUp className="w-4 h-4" /> };
    return pct <= 15
      ? { status: t('ideal_weight_status_slightly_underweight'), color: 'text-blue-600', icon: <Target className="w-4 h-4" /> }
      : { status: t('ideal_weight_status_underweight'), color: 'text-red-600', icon: <Target className="w-4 h-4" /> };
  };

  const validateInputs = (h: string, a: string, cw: string) => {
    const errs: { height?: string; age?: string; currentWeight?: string } = {};
    const hN = parseFloat(h), aN = parseFloat(a), cwN = cw ? parseFloat(cw) : undefined;
    if (!h || isNaN(hN) || hN < 100 || hN > 250) errs.height = t('ideal_weight_height_error');
    if (!a || isNaN(aN) || aN < 15 || aN > 120) errs.age = t('ideal_weight_age_error');
    if (cw && cwN !== undefined && (cwN < 30 || cwN > 300)) errs.currentWeight = t('ideal_weight_current_weight_error');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  useEffect(() => {
    if (validateInputs(height, age, currentWeight)) {
      const hN = parseFloat(height), aN = parseFloat(age);
      const cwN = currentWeight ? parseFloat(currentWeight) : undefined;
      const isMale = gender === 'male';
      const calcs = calculateByFormula(hN, isMale);
      const hM = hN / 100;
      setResult({
        ...Object.fromEntries(Object.entries(calcs).map(([k, v]) => [k, Math.round(v * 10) / 10])) as Pick<IdealWeightResult, 'robinson' | 'miller' | 'devine' | 'hamwi'>,
        healthy: { min: 18.5 * hM * hM, max: 24.9 * hM * hM },
        current: cwN, height: hN, gender, age: aN, isValid: true,
      });
    } else { setResult(null); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, gender, age, currentWeight, formula]);

  const formulaCards = [
    { key: 'robinson', color: 'green', label: t('ideal_weight_most_used') },
    { key: 'miller', color: 'blue', label: t('ideal_weight_modern') },
    { key: 'devine', color: 'purple', label: t('ideal_weight_original') },
    { key: 'hamwi', color: 'orange', label: t('ideal_weight_conservative') },
  ];

  const resultsSection = result ? (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">{fmt(getPrimary(result))} kg</div>
            <div className="text-sm text-green-700 mt-1">{t('ideal_weight_result_label')}</div>
            <div className="text-xs text-green-600 mt-1">{getFormulaDesc(formula).split(' ')[0]} {t('ideal_weight_formula_label_result')}</div>
          </div>
          <Scale className="w-8 h-8 text-green-600" />
        </div>
      </div>
      {result.current && (() => {
        const ws = getWeightStatus(result.current, getPrimary(result)); return (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {ws.icon}<div className={`text-sm font-medium ${ws.color}`}>{ws.status}</div>
              </div>
              <div className="text-lg font-bold text-gray-800">{t('ideal_weight_difference')}: {fmt(result.current - getPrimary(result), 1)} kg</div>
              <div className="text-xs text-gray-600 mt-1">{t('ideal_weight_current')}: {fmt(result.current)} kg</div>
            </CardContent>
          </Card>
        );
      })()}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {formulaCards.map(({ key, color, label }) => {
          const active = formula === key;
          const val = result[key as keyof Pick<IdealWeightResult, 'robinson' | 'miller' | 'devine' | 'hamwi'>];
          return (
            <Card key={key} className={`${active ? `bg-${color}-50 border-${color}-200` : 'bg-gray-50 border-gray-200'}`}>
              <CardContent className="p-3 text-center">
                <div className={`text-sm font-medium mb-1 ${active ? `text-${color}-700` : 'text-gray-700'}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                <div className={`text-lg font-bold ${active ? `text-${color}-800` : 'text-gray-800'}`}>{fmt(val)} kg</div>
                <div className={`text-xs mt-1 ${active ? `text-${color}-600` : 'text-gray-600'}`}>{label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm text-blue-800 font-medium mb-3">{t('ideal_weight_healthy_range_title')}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center"><span className="text-blue-700">{t('ideal_weight_min_healthy')}</span><span className="font-mono text-blue-900 font-semibold">{fmt(result.healthy.min)} kg</span></div>
              <div className="flex justify-between items-center"><span className="text-blue-700">{t('ideal_weight_max_healthy')}</span><span className="font-mono text-blue-900 font-semibold">{fmt(result.healthy.max)} kg</span></div>
              <div className="flex justify-between items-center"><span className="text-blue-700">{t('ideal_weight_range')}</span><span className="font-mono text-blue-900">{fmt(result.healthy.max - result.healthy.min)} kg</span></div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('ideal_weight_what_is')}</h4>
              <p className="text-gray-600 text-sm">{t('ideal_weight_what_is_desc')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <CalcIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('ideal_weight_enter_data')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('ideal_weight_title')}
      description={t('ideal_weight_description')}
      category={t('ideal_weight_category')}
      calculatorId="ideal-weight"
      seo={{ title: t('ideal_weight_seo_title'), description: t('ideal_weight_seo_description'), keywords: t('ideal_weight_seo_keywords').split(',') }}
      formula={{ latex: t('ideal_weight_latex'), description: t('ideal_weight_latex_desc') }}
      examples={{
        title: t('ideal_weight_examples_title'), description: t('ideal_weight_examples_description'), scenarios: [
          { title: t('ideal_weight_example1_title'), description: t('ideal_weight_example1_description'), example: t('ideal_weight_example1_example') },
          { title: t('ideal_weight_example2_title'), description: t('ideal_weight_example2_description'), example: t('ideal_weight_example2_example') },
          { title: t('ideal_weight_example3_title'), description: t('ideal_weight_example3_description'), example: t('ideal_weight_example3_example') },
        ]
      }}
      faq={[
        { question: t('ideal_weight_faq1_q'), answer: t('ideal_weight_faq1_a') },
        { question: t('ideal_weight_faq2_q'), answer: t('ideal_weight_faq2_a') },
        { question: t('ideal_weight_faq3_q'), answer: t('ideal_weight_faq3_a') },
        { question: t('ideal_weight_faq4_q'), answer: t('ideal_weight_faq4_a') },
      ]}
      schemaData={{ applicationCategory: "HealthApplication", operatingSystem: "Any" }}
      resultSection={resultsSection}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="formula" className="text-sm font-medium">{t('ideal_weight_formula_label')}</Label>
          <Select value={formula} onValueChange={setFormula}>
            <SelectTrigger><SelectValue placeholder={t('ideal_weight_formula_placeholder')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="robinson">{t('ideal_weight_formula_robinson')}</SelectItem>
              <SelectItem value="miller">{t('ideal_weight_formula_miller')}</SelectItem>
              <SelectItem value="devine">{t('ideal_weight_formula_devine')}</SelectItem>
              <SelectItem value="hamwi">{t('ideal_weight_formula_hamwi')}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-gray-500 text-xs">{getFormulaDesc(formula)}</p>
        </div>
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">{t('ideal_weight_personal_info')}</div>
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium">{t('ideal_weight_height_label')}</Label>
            <div className="relative">
              <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" className={`pr-12 ${errors.height ? 'border-red-500' : ''}`} min="100" max="250" step="1" />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">cm</span>
            </div>
            {errors.height && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.height}</p>}
            <p className="text-gray-500 text-xs">{t('ideal_weight_height_help')}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium">{t('ideal_weight_gender_label')}</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger><SelectValue placeholder={t('ideal_weight_gender_placeholder')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t('ideal_weight_gender_male')}</SelectItem>
                <SelectItem value="female">{t('ideal_weight_gender_female')}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-gray-500 text-xs">{t('ideal_weight_gender_help')}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium">{t('ideal_weight_age_label')}</Label>
            <div className="relative">
              <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="30" className={`pr-12 ${errors.age ? 'border-red-500' : ''}`} min="15" max="120" step="1" />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">{t('ideal_weight_unit_years')}</span>
            </div>
            {errors.age && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.age}</p>}
            <p className="text-gray-500 text-xs">{t('ideal_weight_age_help')}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentWeight" className="text-sm font-medium">{t('ideal_weight_current_weight_label')}</Label>
            <div className="relative">
              <Input id="currentWeight" type="number" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} placeholder="70" className={`pr-12 ${errors.currentWeight ? 'border-red-500' : ''}`} min="30" max="300" step="0.1" />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">kg</span>
            </div>
            {errors.currentWeight && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.currentWeight}</p>}
            <p className="text-gray-500 text-xs">{t('ideal_weight_current_weight_help')}</p>
          </div>
        </div>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm font-medium text-blue-800 mb-2">{t('ideal_weight_your_data')}</div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div><div className="font-semibold text-blue-900">{t('ideal_weight_profile')}</div><div className="text-blue-700">{gender === 'male' ? t('ideal_weight_gender_male') : t('ideal_weight_gender_female')}, {age} {t('ideal_weight_unit_years')}</div></div>
                <div><div className="font-semibold text-blue-900">{t('ideal_weight_height')}</div><div className="text-blue-700">{height} cm</div></div>
              </div>
              <div className="mt-2 text-xs text-blue-600">{t('ideal_weight_formula')}: {getFormulaDesc(formula)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SimpleCalculatorLayout>
  );
};

export default IdealWeightCalculator;
