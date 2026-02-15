'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput, CalculatorSelect } from './shared';

interface MacroResult {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUSTMENTS: Record<string, { calMult: number; proteinPct: number; carbsPct: number; fatPct: number }> = {
  lose: { calMult: 0.8, proteinPct: 0.40, carbsPct: 0.30, fatPct: 0.30 },
  maintain: { calMult: 1.0, proteinPct: 0.30, carbsPct: 0.40, fatPct: 0.30 },
  gain: { calMult: 1.15, proteinPct: 0.30, carbsPct: 0.45, fatPct: 0.25 },
};

const MacroCalculator: React.FC = () => {
  const t = useTranslations();
  const { locale } = useParams();

  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [errors, setErrors] = useState<Record<string, string>>({});


  const result = useMemo<MacroResult | null>(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const newErrors: Record<string, string> = {};

    if (!w || w <= 0 || w > 500) newErrors.weight = t('macro_error_weight');
    if (!h || h <= 0 || h > 300) newErrors.height = t('macro_error_height');
    if (!a || a <= 0 || a > 150) newErrors.age = t('macro_error_age');
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return null;

    // Mifflin-St Jeor BMR
    const bmr = gender === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    const tdee = bmr * (ACTIVITY_MULTIPLIERS[activity] || 1.55);
    const goalConfig = GOAL_ADJUSTMENTS[goal] || GOAL_ADJUSTMENTS.maintain;
    const calories = Math.round(tdee * goalConfig.calMult);

    const protein = Math.round((calories * goalConfig.proteinPct) / 4); // 4 kcal/g
    const carbs = Math.round((calories * goalConfig.carbsPct) / 4);    // 4 kcal/g
    const fat = Math.round((calories * goalConfig.fatPct) / 9);        // 9 kcal/g

    return { bmr: Math.round(bmr), tdee: Math.round(tdee), calories, protein, carbs, fat };
  }, [weight, height, age, gender, activity, goal, t]);

  const genderOptions = [
    { value: 'male', label: t('macro_gender_male') },
    { value: 'female', label: t('macro_gender_female') },
  ];

  const activityOptions = [
    { value: 'sedentary', label: t('macro_activity_sedentary') },
    { value: 'light', label: t('macro_activity_light') },
    { value: 'moderate', label: t('macro_activity_moderate') },
    { value: 'active', label: t('macro_activity_active') },
    { value: 'very_active', label: t('macro_activity_very_active') },
  ];

  const goalOptions = [
    { value: 'lose', label: t('macro_goal_lose') },
    { value: 'maintain', label: t('macro_goal_maintain') },
    { value: 'gain', label: t('macro_goal_gain') },
  ];

  const formatNum = (n: number) => n.toLocaleString(locale as string === 'en' ? 'en-US' : 'cs-CZ');

  return (
    <SimpleCalculatorLayout
      title={t('macro_title')}
      description={t('macro_description')}
      category="fitness-a-zdravi"
      calculatorId="macro-calculator"
      seo={{
        title: t('macro_seo_title'),
        description: t('macro_seo_description'),
        keywords: [t('macro_keyword_1'), t('macro_keyword_2'), t('macro_keyword_3'), t('macro_keyword_4')]
      }}
      formula={{
        latex: String.raw`\text{TDEE} = \text{BMR} \times \text{AF} \qquad P = \frac{\text{kcal} \times \%_P}{4} \qquad F = \frac{\text{kcal} \times \%_F}{9}`,
        description: t('macro_formula_desc')
      }}
      examples={{
        title: t('macro_examples_title'),
        description: t('macro_examples_desc'),
        scenarios: [
          { title: t('macro_example_1_title'), description: t('macro_example_1_desc'), example: t('macro_example_1_calc') },
          { title: t('macro_example_2_title'), description: t('macro_example_2_desc'), example: t('macro_example_2_calc') },
        ]
      }}
      faq={[
        { question: t('macro_faq_1_q'), answer: t('macro_faq_1_a') },
        { question: t('macro_faq_2_q'), answer: t('macro_faq_2_a') },
        { question: t('macro_faq_3_q'), answer: t('macro_faq_3_a') },
      ]}
      schemaData={{ applicationCategory: "HealthApplication", operatingSystem: "Any" }}
      resultSection={result ? (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
            <div className="text-2xl font-bold text-center mb-2">
              {formatNum(result.calories)} kcal / {t('macro_per_day')}
            </div>
            <div className="text-sm text-muted-foreground text-center">
              BMR: {formatNum(result.bmr)} kcal | TDEE: {formatNum(result.tdee)} kcal
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border text-center">
              <div className="text-xs text-muted-foreground mb-1">{t('macro_protein')}</div>
              <div className="text-xl font-bold">{result.protein}g</div>
              <div className="text-xs text-muted-foreground">{result.protein * 4} kcal</div>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <div className="text-xs text-muted-foreground mb-1">{t('macro_carbs')}</div>
              <div className="text-xl font-bold">{result.carbs}g</div>
              <div className="text-xs text-muted-foreground">{result.carbs * 4} kcal</div>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <div className="text-xs text-muted-foreground mb-1">{t('macro_fat')}</div>
              <div className="text-xl font-bold">{result.fat}g</div>
              <div className="text-xs text-muted-foreground">{result.fat * 9} kcal</div>
            </div>
          </div>
        </div>
      ) : undefined}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <CalculatorInput id="macro-weight" label={t('macro_weight')} value={weight} onChange={setWeight}
            placeholder="70" min="20" max="500" unit="kg" error={errors.weight} />
          <CalculatorInput id="macro-height" label={t('macro_height')} value={height} onChange={setHeight}
            placeholder="170" min="50" max="300" unit="cm" error={errors.height} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CalculatorInput id="macro-age" label={t('macro_age')} value={age} onChange={setAge}
            placeholder="30" min="1" max="150" step="1" error={errors.age} />
          <CalculatorSelect id="macro-gender" label={t('macro_gender')} value={gender} onChange={setGender}
            options={genderOptions} />
        </div>
        <CalculatorSelect id="macro-activity" label={t('macro_activity')} value={activity} onChange={setActivity}
          options={activityOptions} helpText={t('macro_activity_help')} />
        <CalculatorSelect id="macro-goal" label={t('macro_goal')} value={goal} onChange={setGoal}
          options={goalOptions} helpText={t('macro_goal_help')} />
      </div>
    </SimpleCalculatorLayout>
  );
};

export default MacroCalculator;
