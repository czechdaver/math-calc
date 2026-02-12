'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput, CalculatorSelect } from './shared';
import { getRelatedCalculators } from '@/lib/calculatorDataUtils';

interface WaterResult {
  liters: number;
  glasses: number;
  ml: number;
}

const ACTIVITY_WATER: Record<string, number> = {
  sedentary: 0,
  light: 0.35,
  moderate: 0.5,
  active: 0.7,
  very_active: 1.0,
};

const CLIMATE_WATER: Record<string, number> = {
  cold: -0.2,
  temperate: 0,
  warm: 0.3,
  hot: 0.5,
};

const WaterIntakeCalculator: React.FC = () => {
  const t = useTranslations();
  const { locale } = useParams();

  const [weight, setWeight] = useState('70');
  const [activity, setActivity] = useState('moderate');
  const [climate, setClimate] = useState('temperate');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const relatedCalculators = getRelatedCalculators('water-intake', locale as string, t);

  const result = useMemo<WaterResult | null>(() => {
    const w = parseFloat(weight);
    const newErrors: Record<string, string> = {};

    if (!w || w <= 0 || w > 500) newErrors.weight = t('water_error_weight');
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return null;

    // Base: 33ml per kg of body weight
    const baseLiters = w * 0.033;
    const activityAdd = ACTIVITY_WATER[activity] || 0;
    const climateAdd = CLIMATE_WATER[climate] || 0;
    const totalLiters = Math.max(0.5, baseLiters + activityAdd + climateAdd);

    return {
      liters: Math.round(totalLiters * 10) / 10,
      ml: Math.round(totalLiters * 1000),
      glasses: Math.round(totalLiters / 0.25), // 250ml glass
    };
  }, [weight, activity, climate, t]);

  const activityOptions = [
    { value: 'sedentary', label: t('water_activity_sedentary') },
    { value: 'light', label: t('water_activity_light') },
    { value: 'moderate', label: t('water_activity_moderate') },
    { value: 'active', label: t('water_activity_active') },
    { value: 'very_active', label: t('water_activity_very_active') },
  ];

  const climateOptions = [
    { value: 'cold', label: t('water_climate_cold') },
    { value: 'temperate', label: t('water_climate_temperate') },
    { value: 'warm', label: t('water_climate_warm') },
    { value: 'hot', label: t('water_climate_hot') },
  ];

  const formatNum = (n: number) => n.toLocaleString(locale as string === 'en' ? 'en-US' : 'cs-CZ', { maximumFractionDigits: 1 });

  return (
    <SimpleCalculatorLayout
      title={t('water_title')}
      description={t('water_description')}
      category="fitness-a-zdravi"
      calculatorId="water-intake"
      seo={{
        title: t('water_seo_title'),
        description: t('water_seo_description'),
        keywords: [t('water_keyword_1'), t('water_keyword_2'), t('water_keyword_3'), t('water_keyword_4')]
      }}
      formula={{
        latex: String.raw`V = m \times 0{,}033 + A + K \quad [\text{l}]`,
        description: t('water_formula_desc')
      }}
      examples={{
        title: t('water_examples_title'),
        description: t('water_examples_desc'),
        scenarios: [
          { title: t('water_example_1_title'), description: t('water_example_1_desc'), example: t('water_example_1_calc') },
          { title: t('water_example_2_title'), description: t('water_example_2_desc'), example: t('water_example_2_calc') },
        ]
      }}
      faq={[
        { question: t('water_faq_1_q'), answer: t('water_faq_1_a') },
        { question: t('water_faq_2_q'), answer: t('water_faq_2_a') },
        { question: t('water_faq_3_q'), answer: t('water_faq_3_a') },
      ]}
      relatedCalculators={relatedCalculators}
      schemaData={{ applicationCategory: "HealthApplication", operatingSystem: "Any" }}
      resultSection={result ? (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
            <div className="text-2xl font-bold text-center">
              {formatNum(result.liters)} l / {t('water_per_day')}
            </div>
            <div className="text-sm text-muted-foreground text-center mt-1">
              {result.ml} ml = {result.glasses} {t('water_glasses')}
            </div>
          </div>
        </div>
      ) : undefined}
    >
      <div className="space-y-6">
        <CalculatorInput id="water-weight" label={t('water_weight')} value={weight} onChange={setWeight}
          placeholder="70" min="20" max="500" unit="kg" error={errors.weight} />
        <CalculatorSelect id="water-activity" label={t('water_activity')} value={activity} onChange={setActivity}
          options={activityOptions} helpText={t('water_activity_help')} />
        <CalculatorSelect id="water-climate" label={t('water_climate')} value={climate} onChange={setClimate}
          options={climateOptions} />
      </div>
    </SimpleCalculatorLayout>
  );
};

export default WaterIntakeCalculator;
