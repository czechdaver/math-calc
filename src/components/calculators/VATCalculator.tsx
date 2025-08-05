// src/components/calculators/DPHCalculator.refactored.tsx
import React from 'react';
import { useTranslations } from 'next-intl';
import CalculatorBase from './CalculatorBase';
import type { CalculatorInput, CalculatorResult } from './CalculatorBase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
// Using basic select and radio components to avoid additional dependencies
import { Select, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

type CountryCode = 'cr' | 'sk';
type CalculationDirection = 'zaklad-celkem' | 'celkem-zaklad';

const DPHCalculator: React.FC = () => {
  const t = useTranslations();

  const inputs: CalculatorInput[] = [
    {
      id: 'country',
      label: t('country_label'),
      type: 'select',
      required: true,
      options: [
        { value: 'cr', label: t('country_cr') },
        { value: 'sk', label: t('country_sk') },
      ],
      defaultValue: 'cr',
      helpText: t('country_help_text'),
    },
    {
      id: 'direction',
      label: t('calculation_direction'),
      type: 'radio',
      required: true,
      options: [
        { value: 'zaklad-celkem', label: t('without_vat_to_with_vat') },
        { value: 'celkem-zaklad', label: t('with_vat_to_without_vat') },
      ],
      defaultValue: 'zaklad-celkem',
    },
    {
      id: 'amount',
      label: t('amount_without_vat'), // Simplified for now, can be updated based on direction later
      type: 'number',
      required: true,
      min: 0,
      step: '0.01',
      placeholder: '0.00',
      helpText: t('enter_amount_help_text'),
    },
  ];

  const calculate = (inputs: Record<string, any>): CalculatorResult => {
    const country = inputs.country as CountryCode;
    const direction = inputs.direction as CalculationDirection;
    const amount = parseFloat(inputs.amount);
    
    if (isNaN(amount) || amount <= 0) {
      return {
        value: null,
        details: [],
      };
    }

    const vatRate = country === 'cr' ? 0.21 : 0.20; // 21% for CZ, 20% for SK
    let baseAmount, totalAmount, vatAmount;

    if (direction === 'zaklad-celkem') {
      baseAmount = amount;
      totalAmount = baseAmount * (1 + vatRate);
      vatAmount = totalAmount - baseAmount;
    } else {
      totalAmount = amount;
      baseAmount = totalAmount / (1 + vatRate);
      vatAmount = totalAmount - baseAmount;
    }

    return {
      value: direction === 'zaklad-celkem' ? totalAmount : baseAmount,
      details: [
        { 
          label: direction === 'zaklad-celkem' ? t('amount_with_vat') : t('amount_without_vat'),
          value: (direction === 'zaklad-celkem' ? totalAmount : baseAmount).toFixed(2),
          unit: t('currency_czk')
        },
        { 
          label: t('vat_amount'),
          value: vatAmount.toFixed(2),
          unit: t('currency_czk')
          // className is not part of the type, will be handled in the component
        },
        { 
          label: t('vat_rate'),
          value: `${(vatRate * 100).toFixed(0)}%`,
          // description will be handled in the component
        },
      ],
      formula: direction === 'zaklad-celkem'
        ? `${baseAmount.toFixed(2)} × (1 + ${vatRate}) = ${totalAmount.toFixed(2)}`
        : `${totalAmount.toFixed(2)} ÷ (1 + ${vatRate}) = ${baseAmount.toFixed(2)}`,
    };
  };

  const ResultDisplay: React.FC<{ result: CalculatorResult }> = ({ result }) => {
    if (result.value === null) {
      return (
        <Card className="mt-6">
          <CardContent className="pt-6 text-muted-foreground">
            {t('enter_values_to_calculate')}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle>{t('result')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.details?.map((detail, index) => (
                <div key={index} className={`p-4 rounded-lg border ${detail.highlight ? 'font-semibold text-blue-600' : ''} dark:text-blue-400`}>
                  <div className="text-sm font-medium text-muted-foreground">
                    {detail.label}
                  </div>
                  <div className="text-2xl font-bold">
                    {detail.value} {detail.unit || ''}
                  </div>
                  {/* Description removed as it's not part of the type */}
                </div>
              ))}
            </div>
            
            {result.formula && (
              <div className="mt-4 p-4 bg-muted/50 rounded-md">
                <div className="text-sm font-medium mb-1">{t('formula')}</div>
                <code className="text-sm">{result.formula}</code>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{t('vat_calculator_title')}</h1>
      <p className="text-muted-foreground mb-8">
        {t('vat_calculator_description')}
      </p>
      
      <CalculatorBase
        id="vat-calculator"
        title={t('vat_calculator_title')}
        description={t('vat_calculator_description')}
        category="finance"
        seo={{
          title: t('vat_calculator_title'),
          description: t('vat_calculator_seo_description'),
          keywords: ['vat kalkulačka', 'výpočet vat', 'kalkulačka s vat', 'kalkulačka bez vat'],
        }}
        inputs={inputs}
        calculate={calculate}
        resultComponent={ResultDisplay}
      />
      
      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t('about_vat')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p>{t('vat_explanation')}</p>
              
              <h3 className="font-semibold mt-6 mb-3">{t('vat_rates')}:</h3>
              <ul className="space-y-2">
                <li>
                  <span className="font-medium">{t('czech_republic')}:</span> 21% {t('basic_rate')}, 
                  15% {t('reduced_rate')} (potraviny, léky, knihy), 
                  10% (dětské výživy, knihy, časopisy)
                </li>
                <li>
                  <span className="font-medium">{t('slovakia')}:</span> 20% {t('basic_rate')}, 
                  10% {t('reduced_rate')} (léky, knihy, některé potraviny)
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <div className="flex items-start">
                  <Info className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {t('vat_calculation_note')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DPHCalculator;
