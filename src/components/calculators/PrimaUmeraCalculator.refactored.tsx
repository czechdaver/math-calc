// src/components/calculators/PrimaUmeraCalculator.refactored.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import CalculatorBase, { CalculatorInput, CalculatorResult } from './CalculatorBase';

const PrimaUmeraCalculator: React.FC = () => {
  const { t } = useTranslation('common');

  // Define calculator inputs
  const inputs: CalculatorInput[] = [
    {
      id: 'a',
      label: t('label_a') || 'Hodnota A',
      type: 'number',
      required: true,
      placeholder: t('zadejte_hodnotu') || 'Zadejte hodnotu',
      step: 'any',
      helpText: t('zadejte_cislo_vetsi_než_nula') || 'Zadejte číslo větší než nula',
    },
    {
      id: 'b',
      label: t('label_b') || 'Hodnota B',
      type: 'number',
      required: true,
      placeholder: t('zadejte_hodnotu') || 'Zadejte hodnotu',
      step: 'any',
      helpText: t('zadejte_cislo') || 'Zadejte číslo',
    },
    {
      id: 'c',
      label: t('label_c') || 'Hodnota C',
      type: 'number',
      required: true,
      placeholder: t('zadejte_hodnotu') || 'Zadejte hodnotu',
      step: 'any',
      helpText: t('zadejte_cislo') || 'Zadejte číslo',
    },
  ];

  // Calculate the direct proportion (přímá úměra)
  const calculate = (values: Record<string, any>): CalculatorResult => {
    const a = parseFloat(values.a || '1');
    const b = parseFloat(values.b || '0');
    const c = parseFloat(values.c || '0');
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
      return { value: null };
    }

    const result = (c * b) / a;

    return {
      value: result,
      details: [
        { 
          label: t('vysledek') || 'Výsledek', 
          value: result.toFixed(4), 
          highlight: true 
        },
        { 
          label: t('vypocet') || 'Výpočet', 
          value: `(${c} × ${b}) / ${a} = ${result.toFixed(4)}` 
        },
      ],
      formula: 'výsledek = (C × B) / A',
      explanation: t('prima_umera_explanation') || 'Výpočet přímé úměry: (C × B) / A',
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
            {Number(result.value).toFixed(4)}
          </div>
        </div>

        {result.details && result.details.length > 0 && (
          <div className="space-y-2">
            {result.details.map((detail, index) => (
              <div key={index} className={`flex justify-between ${detail.highlight ? 'font-medium' : ''}`}>
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
      id="prima-umera"
      title={t('prima_umera_title') || 'Přímá úměra'}
      description={
        t('prima_umera_description') || 
        'Vypočítejte hodnotu přímé úměry podle vzorce: (C × B) / A. Zadejte hodnoty A, B a C pro výpočet.'
      }
      category="matematika"
      seo={{
        title: t('seo.prima_umera_title') || 'Kalkulačka: Přímá úměra',
        description: 
          t('seo.prima_umera_description') || 
          'Snadno vypočítejte hodnotu přímé úměry podle vzorce (C × B) / A. Ideální pro výpočty s přímými úměrami.',
        keywords: [
          t('seo.klicove_slovo_prima_umera') || 'přímá úměra',
          t('seo.klicove_slovo_kalkulacka') || 'kalkulačka',
          t('seo.klicove_slovo_vypocet') || 'výpočet',
          t('seo.klicove_slovo_matematika') || 'matematika',
          t('seo.klicove_slovo_vzorec') || 'vzorec',
        ],
      }}
      inputs={inputs}
      calculate={calculate}
      resultComponent={ResultComponent}
    />
  );
};

export default PrimaUmeraCalculator;
