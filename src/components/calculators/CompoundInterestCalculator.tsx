// src/components/calculators/CompoundInterestCalculator.refactored.tsx
import React from 'react';
import { useTranslations } from 'next-intl';
import CalculatorBase from './CalculatorBase';
import type { CalculatorInput, CalculatorResult } from './CalculatorBase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Info } from 'lucide-react';

// Define the type for frequency options
type Frequency = 'rocne' | 'mesicne' | 'ctvrtletne' | 'pololetne' | 'denne';

const CompoundInterestCalculator: React.FC = () => {
  const t = useTranslations('calculator');

  const inputs: CalculatorInput[] = [
    {
      id: 'principal',
      label: t('principal'),
      type: 'number',
      required: true,
      min: 0,
      step: 'any',
      placeholder: '10000',
      helpText: t('principal_description')
    },
    {
      id: 'interestRate',
      label: t('interest_rate'),
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      step: '0.01',
      placeholder: '5',
      unit: '%',
      helpText: t('interest_rate_description')
    },
    {
      id: 'frequency',
      label: t('compounding_frequency'),
      type: 'select',
      required: true,
      options: [
        { value: 'rocne', label: t('annually') },
        { value: 'pololetne', label: t('semi_annually') },
        { value: 'ctvrtletne', label: t('quarterly') },
        { value: 'mesicne', label: t('monthly') },
        { value: 'denne', label: t('daily') },
      ],
      defaultValue: 'rocne',
      helpText: t('compounding_frequency_description')
    },
    {
      id: 'years',
      label: t('investment_period'),
      type: 'number',
      required: true,
      min: 1,
      step: '1',
      placeholder: '10',
      unit: t('years'),
      helpText: t('investment_period_description')
    },
    {
      id: 'monthlyContribution',
      label: t('monthly_contribution'),
      type: 'number',
      required: false,
      min: 0,
      step: 'any',
      placeholder: '0',
      helpText: t('monthly_contribution_description')
    }
  ];

  const calculate = (inputs: Record<string, any>): CalculatorResult => {
    const principal = parseFloat(inputs.principal) || 0;
    const annualRate = parseFloat(inputs.interestRate) / 100 || 0;
    const years = parseFloat(inputs.years) || 0;
    const frequency = (inputs.frequency as Frequency) || 'rocne';
    const monthlyContribution = parseFloat(inputs.monthlyContribution) || 0;

    // Map frequency to number of compounding periods per year
    const periodsPerYear: Record<Frequency, number> = {
      denne: 365,
      mesicne: 12,
      ctvrtletne: 4,
      pololetne: 2,
      rocne: 1
    };

    const n = periodsPerYear[frequency];
    const ratePerPeriod = annualRate / n;
    const totalPeriods = years * n;
    
    // Calculate future value with compound interest
    let futureValue = principal * Math.pow(1 + ratePerPeriod, totalPeriods);
    
    // Add monthly contributions if any
    if (monthlyContribution > 0) {
      const monthlyRate = annualRate / 12;
      futureValue += monthlyContribution * ((Math.pow(1 + monthlyRate, years * 12) - 1) / (monthlyRate));
    }

    const totalContributions = principal + (monthlyContribution * 12 * years);
    const interestEarned = futureValue - totalContributions;

    return {
      value: futureValue.toFixed(2),
      details: [
        { 
          label: t('total_contributions'), 
          value: totalContributions.toFixed(2), 
          unit: t('currency_czk') 
        },
        { 
          label: t('interest_earned'), 
          value: interestEarned.toFixed(2), 
          unit: t('currency_czk') 
        },
        { 
          label: t('compounding_frequency'), 
          value: t(frequency === 'rocne' ? 'annually' : 
                 frequency === 'pololetne' ? 'semi_annually' :
                 frequency === 'ctvrtletne' ? 'quarterly' :
                 frequency === 'mesicne' ? 'monthly' : 'daily')
        }
      ]
    };
  };

  // Custom result component to display the calculation results
  const ResultComponent = ({ result }: { result: CalculatorResult }) => (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t('results')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="text-sm font-medium text-muted-foreground">
                {t('future_value')}
              </div>
              <div className="text-2xl font-bold">
                {result.value} {t('currency_czk')}
              </div>
            </div>
            
            {result.details?.map((detail, index) => (
              <div key={index} className="p-4 rounded-lg border">
                <div className="text-sm font-medium text-muted-foreground">
                  {detail.label}
                </div>
                <div className="text-lg font-semibold">
                  {detail.value} {detail.unit || ''}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground flex items-start gap-2 mt-4">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>{t('compound_interest_disclaimer')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <CalculatorBase
      id="compound-interest-calculator"
      title={t('compound_interest_calculator')}
      description={t('compound_interest_calculator_description')}
      category="finance"
      seo={{
        title: t('seo.compound_interest_calculator_title'),
        description: t('seo.compound_interest_calculator_description'),
        keywords: [
          t('seo.compound_interest_keyword_1'),
          t('seo.compound_interest_keyword_2'),
          t('seo.compound_interest_keyword_3')
        ]
      }}
      inputs={inputs}
      calculate={calculate}
      resultComponent={ResultComponent}
    />
  );
};

export default CompoundInterestCalculator;
