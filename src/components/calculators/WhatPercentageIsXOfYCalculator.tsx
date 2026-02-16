// src/components/calculators/WhatPercentageIsXOfYCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput, CalculatorResult } from './shared';

interface PercentageResult {
  percentage: number;
  valueX: number;
  valueY: number;
  isValid: boolean;
}

const WhatPercentageIsXOfYCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  // State - always string for inputs
  const [valueX, setValueX] = useState<string>('');
  const [valueY, setValueY] = useState<string>('');
  const [result, setResult] = useState<PercentageResult | null>(null);
  const [errors, setErrors] = useState<{ valueX?: string; valueY?: string }>({});

  // Calculate percentage: (X / Y) × 100
  const calculatePercentage = (x: number, y: number): PercentageResult => {
    const percentage = (x / y) * 100;

    return {
      percentage,
      valueX: x,
      valueY: y,
      isValid: true
    };
  };

  // Validation function
  const validateInputs = (xStr: string, yStr: string) => {
    const newErrors: { valueX?: string; valueY?: string } = {};

    const xNum = parseFloat(xStr);
    const yNum = parseFloat(yStr);

    if (!xStr || isNaN(xNum)) {
      newErrors.valueX = t('value_validation_error') || 'Zadejte platné číslo';
    }
    if (!yStr || isNaN(yNum) || yNum === 0) {
      newErrors.valueY = t('value_y_validation_error') || 'Zadejte nenulové číslo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time calculation via useEffect
  useEffect(() => {
    if (validateInputs(valueX, valueY)) {
      const xNum = parseFloat(valueX);
      const yNum = parseFloat(valueY);
      const calculatedResult = calculatePercentage(xNum, yNum);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueX, valueY]);

  // Calculator form using shared components
  const calculatorForm = (
    <div className="space-y-6">
      <CalculatorInput
        id="valueX"
        label={t('hodnota_x_label') || 'Hodnota X'}
        value={valueX}
        onChange={setValueX}
        placeholder="25"
        helpText={t('hodnota_x_help_text') || 'Zadejte hodnotu X (část)'}
        error={errors.valueX}
      />

      <CalculatorInput
        id="valueY"
        label={t('hodnota_y_label') || 'Hodnota Y'}
        value={valueY}
        onChange={setValueY}
        placeholder="100"
        helpText={t('hodnota_y_help_text') || 'Zadejte hodnotu Y (celek)'}
        error={errors.valueY}
      />
    </div>
  );

  // Examples for SimpleCalculatorLayout
  const examples = {
    title: t('x_percent_of_y_examples_title') || 'Příklady výpočtu',
    description: t('x_percent_of_y_examples_description') || 'Praktické příklady výpočtu, kolik procent tvoří jedna hodnota z druhé',
    scenarios: [
      {
        title: t('x_percent_of_y_example_1_title') || 'Základní výpočet',
        description: t('x_percent_of_y_example_1_description') || '25 je kolik procent ze 100?',
        example: t('x_percent_of_y_example_1_calculation') || '(25 ÷ 100) × 100 = 25%'
      },
      {
        title: t('x_percent_of_y_example_2_title') || 'Sleva v obchodě',
        description: t('x_percent_of_y_example_2_description') || 'Produkt stojí 1500 Kč, zaplatili jste 1200 Kč. Jakou slevu jste dostali?',
        example: t('x_percent_of_y_example_2_calculation') || '(300 ÷ 1500) × 100 = 20% sleva'
      },
      {
        title: t('x_percent_of_y_example_3_title') || 'Úspěšnost v testu',
        description: t('x_percent_of_y_example_3_description') || 'Z 50 otázek jste odpověděli správně na 42. Jaká je vaše úspěšnost?',
        example: t('x_percent_of_y_example_3_calculation') || '(42 ÷ 50) × 100 = 84%'
      }
    ]
  };

  // FAQ for SimpleCalculatorLayout
  const faq = [
    {
      question: t('x_percent_of_y_faq_1_question') || 'Jak vypočítám, kolik procent je X z Y?',
      answer: t('x_percent_of_y_faq_1_answer') || 'Vydělte hodnotu X hodnotou Y a vynásobte 100. Vzorec: (X ÷ Y) × 100 = výsledek v procentech.'
    },
    {
      question: t('x_percent_of_y_faq_2_question') || 'Kde se tento výpočet používá?',
      answer: t('x_percent_of_y_faq_2_answer') || 'Tento výpočet se běžně používá při výpočtu slev, úspěšnosti testů, poměrů, procentuálního zastoupení a dalších praktických situacích.'
    },
    {
      question: t('x_percent_of_y_faq_3_question') || 'Co když je X větší než Y?',
      answer: t('x_percent_of_y_faq_3_answer') || 'Výsledek bude větší než 100%. To znamená, že hodnota X je větší než hodnota Y. Například 150 je 150% ze 100.'
    },
    {
      question: t('x_percent_of_y_faq_4_question') || 'Může být Y nula?',
      answer: t('x_percent_of_y_faq_4_answer') || 'Ne, hodnota Y nemůže být nula, protože by došlo k dělení nulou, což není matematicky definováno.'
    }
  ];

  // Related calculators - loaded from centralized data

  return (
    <SimpleCalculatorLayout
      title={t('kolik_procent_je_x_z_y_title') || 'Kalkulátor: Kolik procent je X z Y?'}
      description={t('x_percent_of_y_description') || 'Vypočítejte, kolik procent tvoří jedna hodnota z druhé. Ideální pro výpočet slev, úspěšnosti testů a procentuálních poměrů.'}
      category="math"
      calculatorId="x-is-what-percent-of-y"
      seo={{
        title: t('x_percent_of_y_seo_title') || 'Kalkulačka: Kolik procent je X z Y? | Výpočet procent online',
        description: t('x_percent_of_y_seo_description') || 'Bezplatná kalkulačka pro výpočet, kolik procent tvoří jedna hodnota z druhé. Rychlý a přesný výpočet slev, úspěšnosti a procentuálních poměrů.',
        keywords: [
          'kolik procent',
          'procenta kalkulačka',
          'výpočet procent',
          'X z Y',
          'procentuální poměr',
          'sleva kalkulačka',
          'úspěšnost test'
        ]
      }}
      formula={{
        latex: String.raw`\text{Procenta} = \frac{X}{Y} \times 100`,
        description: t('x_percent_of_y_formula_description') || 'Procenta se vypočítají jako podíl hodnoty X a hodnoty Y vynásobený stem.'
      }}
      examples={examples}
      faq={faq}
      resultSection={result && (
        <CalculatorResult
          title={t('vysledek_label') || 'Výsledek'}
          value={result.percentage.toLocaleString(locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          })}
          unit="%"
          description={t('x_percent_of_y_result_description') || 'Procentuální poměr'}
          formula={`(${result.valueX.toLocaleString(locale)} ÷ ${result.valueY.toLocaleString(locale)}) × 100 = ${result.percentage.toLocaleString(locale, { maximumFractionDigits: 2 })}%`}
          additionalInfo={
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                  <div className="text-blue-600 dark:text-blue-400 font-medium mb-1">
                    {t('hodnota_x_label') || 'Hodnota X'}
                  </div>
                  <div className="text-lg font-semibold">
                    {result.valueX.toLocaleString(locale)}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <div className="text-green-600 dark:text-green-400 font-medium mb-1">
                    {t('hodnota_y_label') || 'Hodnota Y'}
                  </div>
                  <div className="text-lg font-semibold">
                    {result.valueY.toLocaleString(locale)}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <p>
                  {result.percentage < 100
                    ? t('x_percent_of_y_interpretation_less') || 'Hodnota X tvoří menší část hodnoty Y.'
                    : result.percentage === 100
                      ? t('x_percent_of_y_interpretation_equal') || 'Hodnota X je stejná jako hodnota Y.'
                      : t('x_percent_of_y_interpretation_more') || 'Hodnota X je větší než hodnota Y.'
                  }
                </p>
              </div>
            </div>
          }
        />
      )}
      schemaData={{
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any'
      }}
    >
      {calculatorForm}
    </SimpleCalculatorLayout>
  );
};

export default WhatPercentageIsXOfYCalculator;
