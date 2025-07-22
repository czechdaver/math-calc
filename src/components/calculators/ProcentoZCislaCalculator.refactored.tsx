// src/components/calculators/ProcentoZCislaCalculator.refactored.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import { CalculatorInput, CalculatorResult } from './CalculatorBase';
import dynamic from 'next/dynamic';

// Dynamically import CalculatorBase with SSR disabled
const CalculatorBase = dynamic(
  () => import('./CalculatorBase').then(mod => mod.default),
  { ssr: false }
);

interface ProcentoZCislaValues {
  value: string;
  number: string;
}

const ProcentoZCislaCalculator: React.FC = () => {
  const { t } = useTranslation('common');

  // Define the calculator inputs
  const inputs: CalculatorInput[] = [
    {
      id: 'value',
      label: t('procenta_label') || 'Procenta',
      type: 'number',
      required: true,
      step: 0.01,
      placeholder: t('enter_percentage') || 'Zadejte procenta',
      helpText: t('enter_percentage_help') || 'Zadejte procentuální hodnotu (např. 15 pro 15%)',
      unit: '%',
      min: 0,
      max: 1000,
    },
    {
      id: 'number',
      label: t('cislo_label') || 'Číslo',
      type: 'number',
      required: true,
      step: 0.01,
      placeholder: t('enter_number') || 'Zadejte číslo',
      helpText: t('enter_number_help') || 'Zadejte číslo, ze kterého chcete vypočítat procenta',
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
    const percentage = parseFloat(values.value || '0');
    const number = parseFloat(values.number || '0');
    
    if (isNaN(percentage) || isNaN(number)) {
      return { value: null };
    }

    const result = (percentage / 100) * number;
    const formattedPercentage = formatNumber(percentage);
    const formattedNumber = formatNumber(number);
    const formattedResult = formatNumber(result);

    return {
      value: result,
      details: [
        { 
          label: t('vypocet') || 'Výpočet', 
          value: `${formattedPercentage}% × ${formattedNumber}`,
          highlight: true
        },
        { 
          label: t('vysledek') || 'Výsledek', 
          value: formattedResult,
          highlight: true
        },
        { 
          label: t('vzorec') || 'Vzorec', 
          value: `(${formattedPercentage} / 100) × ${formattedNumber} = ${formattedResult}`
        },
      ],
      formula: `\text{${t('vysledek') || 'Výsledek'}} = \\frac{${formattedPercentage}}{100} \\times ${formattedNumber} = ${formattedResult}`,
      explanation: t('percentage_calculation_explanation', { 
        percentage: formattedPercentage, 
        number: formattedNumber, 
        result: formattedResult
      }) || `${formattedPercentage}% z čísla ${formattedNumber} je ${formattedResult}`,
    };
  };

  // Custom result component to display the calculation details
  const ResultComponent = ({ result }: { result: CalculatorResult }) => {
    if (result.value === null) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          {t('zadejte_platne_hodnoty') || 'Zadejte platné hodnoty pro výpočet'}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <div className="text-sm font-medium text-primary/80 mb-1">
            {t('vysledek') || 'Výsledek'}
          </div>
          <div className="text-2xl font-bold">
            {Number(result.value).toLocaleString('cs-CZ', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}
          </div>
        </div>

        {result.details && result.details.length > 0 && (
          <div className="space-y-2">
            {result.details.map((detail, index) => (
              <div 
                key={index} 
                className={`flex justify-between ${detail.highlight ? 'font-medium' : ''}`}
              >
                <span className="text-muted-foreground">{detail.label}:</span>
                <span>
                  {detail.value} {detail.unit || ''}
                </span>
              </div>
            ))}
          </div>
        )}

        {result.formula && (
          <div className="mt-4 p-3 bg-muted/50 rounded text-sm font-mono">
            <div className="font-semibold mb-1">{t('pouzity_vzorec') || 'Použitý vzorec'}:</div>
            <div>{result.formula}</div>
          </div>
        )}

        {result.explanation && (
          <div className="mt-3 text-sm text-muted-foreground">
            {result.explanation}
          </div>
        )}
      </div>
    );
  };

  return (
    <CalculatorBase
      id="procento-z-cisla"
      title={t('procento_z_cisla_title') || 'Procento z čísla'}
      description={
        t('procento_z_cisla_description') || 
        'Vypočítejte X procent z daného čísla. Zadejte procenta a číslo pro výpočet.'
      }
      category="matematika"
      seo={{
        title: t('seo.procento_z_cisla_title') || 'Kalkulačka: Procento z čísla',
        description: 
          t('seo.procento_z_cisla_description') || 
          'Snadno vypočítejte X procent z daného čísla. Ideální pro výpočty slev, daní, přirážek a dalších procentuálních výpočtů.',
        keywords: [
          t('seo.klicove_slovo_procenta') || 'procenta',
          t('seo.klicove_slovo_kalkulacka') || 'kalkulačka',
          t('seo.klicove_slovo_vypocet') || 'výpočet',
          t('seo.klicove_slovo_matematika') || 'matematika',
          t('seo.klicove_slovo_sleva') || 'sleva',
        ],
      }}
      inputs={inputs}
      calculate={calculate}
      resultComponent={ResultComponent}
    />
  );
};

export default ProcentoZCislaCalculator;
