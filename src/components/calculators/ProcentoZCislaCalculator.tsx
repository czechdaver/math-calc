// src/components/calculators/ProcentoZCislaCalculator.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import CalculatorBase, { CalculatorInput, CalculatorResult } from './CalculatorBase';

const ProcentoZCislaCalculator: React.FC = () => {
  const { t } = useTranslation('common');

  // Define the calculator inputs
  const inputs: CalculatorInput[] = [
    {
      id: 'value',
      label: t('procenta_label'),
      type: 'number',
      required: true,
      step: 'any',
      placeholder: t('enter_percentage'),
      helpText: t('enter_percentage_help'),
      unit: '%',
    },
    {
      id: 'number',
      label: t('cislo_label'),
      type: 'number',
      required: true,
      step: 'any',
      placeholder: t('enter_number'),
      helpText: t('enter_number_help'),
    },
  ];

  // Calculation function
  const calculate = (values: Record<string, any>): CalculatorResult => {
    const percentage = parseFloat(values.value);
    const number = parseFloat(values.number);
    const result = (percentage / 100) * number;

    return {
      value: result.toFixed(2),
      details: [
        { label: t('calculation'), value: `${percentage}% × ${number}` },
        { label: t('result'), value: result.toFixed(2) },
      ],
      formula: `\\text{${t('result')}} = \\frac{${percentage}}{100} \\times ${number} = ${result.toFixed(2)}`,
      explanation: t('percentage_calculation_explanation', { percentage, number, result: result.toFixed(2) }),
    };
  };

  return (
    <CalculatorBase
      id="percentage-of-number"
      title={t('procento_z_cisla_title')}
      description={t('procento_z_cisla_description')}
      category="mathematics"
      seo={{
        title: t('seo.percentage_of_number.title'),
        description: t('seo.percentage_of_number.description'),
        keywords: [t('seo.percentage_of_number.keyword1'), t('seo.percentage_of_number.keyword2')],
      }}
      inputs={inputs}
      calculate={calculate}
    />
  );
};

export default ProcentoZCislaCalculator;
