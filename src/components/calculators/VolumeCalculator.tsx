// src/components/calculators/VolumeCalculator.tsx
'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput, CalculatorSelect, CalculatorForm } from './shared';
import { Card, CardContent } from '@/components/ui/Card';
import { Box, Circle, Cylinder, Pyramid } from 'lucide-react';
import { useVolumeCalculator } from '@/hooks/useVolumeCalculator';

const shapeIcons: Record<string, React.ReactNode> = {
  cube: <Box className="w-6 h-6 text-green-600 dark:text-green-400" />,
  rectangular: <Box className="w-6 h-6 text-green-600 dark:text-green-400" />,
  sphere: <Circle className="w-6 h-6 text-green-600 dark:text-green-400" />,
  cylinder: <Cylinder className="w-6 h-6 text-green-600 dark:text-green-400" />,
  cone: <Pyramid className="w-6 h-6 text-green-600 dark:text-green-400" />,
};

const VolumeCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const calc = useVolumeCalculator();

  const fmt = (n: number, dec = 2) =>
    n.toLocaleString(locale, { minimumFractionDigits: dec, maximumFractionDigits: dec });

  const shapeKey = (s: string) => `volume_calc_shape_${s}`;
  const errMsg = t('volume_calc_error_invalid');
  const errorMessages: Record<string, string> = {
    length: errMsg, width: errMsg, height: errMsg, radius: errMsg,
    cylRadius: errMsg, cylHeight: errMsg, coneRadius: errMsg, coneHeight: errMsg,
  };

  useEffect(() => {
    calc.calculate(errorMessages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calc.shape, calc.length, calc.width, calc.height, calc.radius,
  calc.cylRadius, calc.cylHeight, calc.coneRadius, calc.coneHeight]);

  const shapeOptions: { value: string; label: string }[] = [
    'cube', 'rectangular', 'sphere', 'cylinder', 'cone',
  ].map(s => ({ value: s, label: t(shapeKey(s)) }));


  const resultsSection = calc.result ? (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 dark:bg-green-950 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{fmt(calc.result.volume)} m³</div>
            <div className="text-sm text-green-700 dark:text-green-300 mt-1">
              {t('volume_calc_result_volume')} {t(shapeKey(calc.result.shape)).toLowerCase()}
            </div>
          </div>
          {shapeIcons[calc.result.shape]}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800 dark:text-blue-200">{fmt(calc.result.volume)} m³</div>
            <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">{t('volume_calc_result_volume')}</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800 dark:text-purple-200">{fmt(calc.result.surfaceArea)} m²</div>
            <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">{t('volume_calc_result_surface')}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">{t('volume_calc_result_conversions')}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {[
              { val: calc.result.volume * 1000, label: t('volume_calc_result_liters'), dec: 0 },
              { val: calc.result.volume * 1000000, label: t('volume_calc_result_cm3'), dec: 0 },
              { val: calc.result.volume / 1000000, label: t('volume_calc_result_km3'), dec: 6 },
              { val: calc.result.volume * 264.172, label: t('volume_calc_result_gallons'), dec: 1 },
            ].map(({ val, label, dec }) => (
              <div key={label} className="p-2 bg-muted rounded text-center">
                <div className="font-medium">{val.toLocaleString(locale, { maximumFractionDigits: dec })}</div>
                <div className="text-muted-foreground text-xs">{label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-muted-foreground">
      <Box className="w-12 h-12 mx-auto mb-4 opacity-30" />
      <p>{t('volume_calc_result_empty')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('volume_calc_title')}
      description={t('volume_calc_description')}
      category="Stavební"
      calculatorId="volume"
      seo={{
        title: t('volume_calc_seo_title'),
        description: t('volume_calc_seo_desc'),
        keywords: ['objem', 'povrch', 'krychle', 'kvádr', 'koule', 'válec', 'kužel', 'kalkulátor objemu'],
      }}
      formula={{
        latex: String.raw`V_{krychle} = a^3 \quad V_{koule} = \frac{4}{3}\pi r^3 \quad V_{válec} = \pi r^2 h`,
        description: t('volume_calc_formula_desc'),
      }}
      resultSection={resultsSection}
      examples={{
        title: t('volume_calc_examples_title'), description: t('volume_calc_examples_desc'),
        scenarios: [
          { title: t('volume_calc_example_1_title'), description: t('volume_calc_example_1_desc'), example: t('volume_calc_example_1_example') },
          { title: t('volume_calc_example_2_title'), description: t('volume_calc_example_2_desc'), example: t('volume_calc_example_2_example') },
          { title: t('volume_calc_example_3_title'), description: t('volume_calc_example_3_desc'), example: t('volume_calc_example_3_example') },
        ],
      }}
      faq={[
        { question: t('volume_calc_faq_1_q'), answer: t('volume_calc_faq_1_a') },
        { question: t('volume_calc_faq_2_q'), answer: t('volume_calc_faq_2_a') },
        { question: t('volume_calc_faq_3_q'), answer: t('volume_calc_faq_3_a') },
        { question: t('volume_calc_faq_4_q'), answer: t('volume_calc_faq_4_a') },
      ]}
      schemaData={{ applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any' }}
    >
      <CalculatorForm columns={1}>
        <CalculatorSelect
          id="shape" label={t('volume_calc_shape_label')} value={calc.shape}
          onChange={calc.setShape} options={shapeOptions}
        />
        {calc.shape === 'cube' && (
          <CalculatorInput id="length" label={t('volume_calc_edge_label')} value={calc.length} onChange={calc.setLength} placeholder="10" unit="m" error={calc.errors.length} />
        )}
        {calc.shape === 'rectangular' && (
          <div className="space-y-4">
            <CalculatorInput id="length" label={t('volume_calc_length_label')} value={calc.length} onChange={calc.setLength} placeholder="10" unit="m" error={calc.errors.length} />
            <CalculatorInput id="width" label={t('volume_calc_width_label')} value={calc.width} onChange={calc.setWidth} placeholder="8" unit="m" error={calc.errors.width} />
            <CalculatorInput id="height" label={t('volume_calc_height_label')} value={calc.height} onChange={calc.setHeight} placeholder="6" unit="m" error={calc.errors.height} />
          </div>
        )}
        {calc.shape === 'sphere' && (
          <CalculatorInput id="radius" label={t('volume_calc_radius_label')} value={calc.radius} onChange={calc.setRadius} placeholder="5" unit="m" error={calc.errors.radius} />
        )}
        {calc.shape === 'cylinder' && (
          <div className="space-y-4">
            <CalculatorInput id="cylRadius" label={t('volume_calc_radius_label')} value={calc.cylRadius} onChange={calc.setCylRadius} placeholder="4" unit="m" error={calc.errors.cylRadius} />
            <CalculatorInput id="cylHeight" label={t('volume_calc_height_label')} value={calc.cylHeight} onChange={calc.setCylHeight} placeholder="10" unit="m" error={calc.errors.cylHeight} />
          </div>
        )}
        {calc.shape === 'cone' && (
          <div className="space-y-4">
            <CalculatorInput id="coneRadius" label={t('volume_calc_base_radius_label')} value={calc.coneRadius} onChange={calc.setConeRadius} placeholder="3" unit="m" error={calc.errors.coneRadius} />
            <CalculatorInput id="coneHeight" label={t('volume_calc_height_label')} value={calc.coneHeight} onChange={calc.setConeHeight} placeholder="8" unit="m" error={calc.errors.coneHeight} />
          </div>
        )}
      </CalculatorForm>
    </SimpleCalculatorLayout>
  );
};

export default VolumeCalculator;
