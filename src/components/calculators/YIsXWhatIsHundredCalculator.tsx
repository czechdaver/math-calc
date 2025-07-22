// src/components/calculators/YJeXKolikJeStoCalculator.refactored.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import { CalculatorInput, CalculatorResult } from './CalculatorBase';
import dynamic from 'next/dynamic';

// Dynamically import CalculatorBase with SSR disabled
const CalculatorBase = dynamic(
  () => import('./CalculatorBase').then(mod => mod.default),
  { ssr: false }
);

interface YJeXKolikJeStoValues {
  y: string;
  x: string;
}

const YJeXKolikJeStoCalculator: React.FC = () => {
  const { t } = useTranslation('common');

  // Define the calculator inputs
  const inputs: CalculatorInput[] = [
    {
      id: 'y',
      label: t('hodnota_y_label_y_is_x_percent') || 'Hodnota Y',
      type: 'number',
      required: true,
      step: 0.01,
      placeholder: t('enter_value') || 'Zadejte hodnotu Y',
      helpText: t('y_je_x_kolik_je_sto_help_y') || 'Zadejte hodnotu Y (např. 25 pokud Y = 25)',
    },
    {
      id: 'x',
      label: t('hodnota_x_label_y_is_x_percent') || 'Hodnota X',
      type: 'number',
      required: true,
      step: 0.01,
      placeholder: t('enter_percentage') || 'Zadejte percentages',
      helpText: t('y_je_x_kolik_je_sto_help_x') || 'Zadejte procentuální hodnotu X (např. 15 pro 15%)',
    },
  ];

  // Format number with spaces as thousand separators and comma as decimal separator
  const formatNumber = (num: number): string => {
    return num.toLocaleString('cs-CZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  };

  // Calculation function
  const calculate = (values: Record<string, any>): CalculatorResult => {
    const y = parseFloat(values.y || '0');
    const x = parseFloat(values.x || '0');
    
    if (isNaN(y) || isNaN(x) || x === 0) {
      return { value: null };
    }

    const result = (y / x) * 100;
    const formattedY = formatNumber(y);
    const formattedX = formatNumber(x);
    const formattedResult = formatNumber(result);

    return {
      value: result,
      details: [
        { label: t('vysledek') || 'Výsledek', value: formattedResult, unit: '%', highlight: true },
      ],
      formula: `\\text{${t('vysledek') || 'Výsledek'}} = \\left(\\frac{${formattedY}}{${formattedX}}\\right) \\times 100 = ${formattedResult}\\%`,
      explanation: t('y_je_x_kolik_je_sto_explanation_result') || 
        `Pokud ${formattedY} je ${formattedX}%, pak 100% je ${formattedResult}.`,
    };
  };

  return (
    <CalculatorBase
      id="find-percentage"
      title={t('y_je_x_kolik_je_sto_title') || 'Y je X% - kolik je 100%?'}
      description={t('y_je_x_kolik_je_sto_description') || 
        'Výpočet celkové hodnoty (100%), pokud znáte část (Y) a její procentuální podíl (X%).'}
      category="finance"
      seo={{
        title: t('y_je_x_kolik_je_sto_title') || 'Y je X% - kolik je 100%? | Kalkulačka',
        description: t('y_je_x_kolik_je_sto_seo_description') || 
          'Spočítejte si celkovou hodnotu (100%), pokud znáte část (Y) a její procentuální podíl (X%).',
        keywords: [
          'percentages', 'výpočet', 'kalkulačka', '100%', 'celková hodnota', 'procentuální podíl',
          'finance', 'matematika', 'výpočet procent', 'kolik je 100%'
        ],
      }}
      inputs={inputs}
      calculate={calculate}
    />
  );
};

export default YJeXKolikJeStoCalculator;
