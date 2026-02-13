// src/components/calculators/ConcreteCalculator.tsx
'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput } from './shared';
import { CalculatorSelect } from './shared';
import { Card, CardContent } from '@/components/ui/Card';
import { Truck, Package, Building, Calculator as CalcIcon } from 'lucide-react';
import { getRelatedCalculators } from '@/lib/calculatorDataUtils';
import { useConcreteCalculator, concreteGrades } from '@/hooks/useConcreteCalculator';

const ConcreteCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const calc = useConcreteCalculator();

  const fmt = (n: number, dec = 0, unit = '') =>
    n.toLocaleString(locale, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (unit ? ` ${unit}` : '');

  const errorMessages: Record<string, string> = {
    length: t('concrete_error_length'), width: t('concrete_error_width'),
    thickness: t('concrete_error_thickness'), diameter: t('concrete_error_diameter'),
    height: t('concrete_error_height'), quantity: t('concrete_error_quantity'),
    cementPrice: t('concrete_error_cement_price'), sandPrice: t('concrete_error_sand_price'),
    gravelPrice: t('concrete_error_gravel_price'),
  };

  useEffect(() => {
    calc.calculate(errorMessages);
  }, [calc.calculationType, calc.concreteGrade, calc.length, calc.width, calc.thickness,
      calc.diameter, calc.height, calc.quantity, calc.cementPrice, calc.sandPrice, calc.gravelPrice]);

  const gradeOptions = Object.entries(concreteGrades).map(([grade, info]) => ({
    value: grade, label: `${grade} – ${t(info.useKey)}`,
  }));

  const typeOptions = [
    { value: 'slab', label: t('concrete_type_slab') },
    { value: 'column', label: t('concrete_type_column') },
  ];

  const relatedCalculators = getRelatedCalculators('concrete', locale, t);

  const resultsSection = calc.result ? (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 dark:bg-green-950 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{fmt(calc.result.volume, 2, 'm³')}</div>
            <div className="text-sm text-green-700 dark:text-green-300 mt-1">{t('concrete_result_volume')}</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              {t('concrete_result_grade')}: {calc.result.concreteType} ({t('concrete_result_waste_note')})
            </div>
          </div>
          <Truck className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { val: calc.result.cement, label: t('concrete_result_cement'), bg: 'gray' },
          { val: calc.result.sand, label: t('concrete_result_sand'), bg: 'yellow' },
          { val: calc.result.gravel, label: t('concrete_result_gravel'), bg: 'stone' },
          { val: calc.result.water, label: t('concrete_result_water'), bg: 'blue' },
        ].map(({ val, label, bg }) => (
          <Card key={label} className={`bg-${bg}-50 dark:bg-${bg}-950 border-${bg}-200 dark:border-${bg}-800`}>
            <CardContent className="p-4 text-center">
              <Package className={`w-6 h-6 text-${bg}-600 dark:text-${bg}-400 mx-auto mb-2`} />
              <div className="text-lg font-bold">{fmt(val, 0, 'kg')}</div>
              <div className="text-sm mt-1">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">{fmt(calc.result.cost, 0, 'Kč')}</div>
          <div className="text-sm text-green-700 dark:text-green-300">{t('concrete_result_total_cost')}</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">{t('concrete_result_without_transport')}</div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-muted-foreground">
      <Building className="w-12 h-12 mx-auto mb-4 opacity-30" />
      <p>{t('concrete_result_empty')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('concrete_title')}
      description={t('concrete_description')}
      category={t('concrete_category')}
      calculatorId="concrete"
      seo={{
        title: t('concrete_seo_title'),
        description: t('concrete_seo_desc'),
        keywords: t('concrete_seo_keywords').split(','),
      }}
      formula={{
        latex: String.raw`V_{beton} = V_{konstrukce} \times 1{,}05 \quad M_{cement} = \frac{V \times r_{cement}}{r_{celk}} \times 1500`,
        description: t('concrete_formula_desc'),
      }}
      resultSection={resultsSection}
      examples={{
        title: t('concrete_examples_title'), description: t('concrete_examples_desc'),
        scenarios: [
          { title: t('concrete_example_1_title'), description: t('concrete_example_1_desc'), example: t('concrete_example_1_example') },
          { title: t('concrete_example_2_title'), description: t('concrete_example_2_desc'), example: t('concrete_example_2_example') },
          { title: t('concrete_example_3_title'), description: t('concrete_example_3_desc'), example: t('concrete_example_3_example') },
        ],
      }}
      faq={[
        { question: t('concrete_faq_1_q'), answer: t('concrete_faq_1_a') },
        { question: t('concrete_faq_2_q'), answer: t('concrete_faq_2_a') },
        { question: t('concrete_faq_3_q'), answer: t('concrete_faq_3_a') },
        { question: t('concrete_faq_4_q'), answer: t('concrete_faq_4_a') },
      ]}
      relatedCalculators={relatedCalculators}
      schemaData={{ applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any' }}
    >
      <div className="space-y-6">
        <CalculatorSelect
          id="calculationType" label={t('concrete_type_label')} value={calc.calculationType}
          onChange={calc.setCalculationType} options={typeOptions}
        />
        <CalculatorSelect
          id="concreteGrade" label={t('concrete_grade_label')} value={calc.concreteGrade}
          onChange={calc.setConcreteGrade} options={gradeOptions}
        />
        {calc.calculationType === 'slab' && (
          <div className="grid grid-cols-2 gap-4">
            <CalculatorInput id="length" label={t('concrete_length_label')} value={calc.length} onChange={calc.setLength} placeholder="10" unit="m" error={calc.errors.length} />
            <CalculatorInput id="width" label={t('concrete_width_label')} value={calc.width} onChange={calc.setWidth} placeholder="8" unit="m" error={calc.errors.width} />
            <CalculatorInput id="thickness" label={t('concrete_thickness_label')} value={calc.thickness} onChange={calc.setThickness} placeholder="0.15" unit="m" error={calc.errors.thickness} />
          </div>
        )}
        {calc.calculationType === 'column' && (
          <div className="grid grid-cols-3 gap-4">
            <CalculatorInput id="diameter" label={t('concrete_diameter_label')} value={calc.diameter} onChange={calc.setDiameter} placeholder="0.3" unit="m" error={calc.errors.diameter} />
            <CalculatorInput id="height" label={t('concrete_height_label')} value={calc.height} onChange={calc.setHeight} placeholder="3" unit="m" error={calc.errors.height} />
            <CalculatorInput id="quantity" label={t('concrete_quantity_label')} value={calc.quantity} onChange={calc.setQuantity} placeholder="4" error={calc.errors.quantity} />
          </div>
        )}
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">{t('concrete_prices_title')}</h4>
          <div className="grid grid-cols-3 gap-4">
            <CalculatorInput id="cementPrice" label={t('concrete_cement_price_label')} value={calc.cementPrice} onChange={calc.setCementPrice} placeholder="150" error={calc.errors.cementPrice} />
            <CalculatorInput id="sandPrice" label={t('concrete_sand_price_label')} value={calc.sandPrice} onChange={calc.setSandPrice} placeholder="400" error={calc.errors.sandPrice} />
            <CalculatorInput id="gravelPrice" label={t('concrete_gravel_price_label')} value={calc.gravelPrice} onChange={calc.setGravelPrice} placeholder="350" error={calc.errors.gravelPrice} />
          </div>
        </div>
      </div>
    </SimpleCalculatorLayout>
  );
};

export default ConcreteCalculator;
