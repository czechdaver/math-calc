// src/components/calculators/AnuitniSplatkaCalculator.refactored.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import CalculatorBase, { CalculatorInput, CalculatorResult } from './CalculatorBase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

const AnuitniSplatkaCalculator: React.FC = () => {
  const { t } = useTranslation('common');
  
  // Define inputs for the calculator
  const inputs: CalculatorInput[] = [
    {
      id: 'loanAmount',
      label: t('loan_amount_label'),
      type: 'number',
      required: true,
      min: 0,
      step: 'any',
      placeholder: '100000',
      helpText: t('loan_amount_help')
    },
    {
      id: 'interestRate',
      label: t('annual_interest_rate_label'),
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      step: '0.01',
      placeholder: '5.5',
      helpText: t('annual_interest_rate_help'),
      unit: '%'
    },
    {
      id: 'loanTerm',
      label: t('loan_term_label'),
      type: 'number',
      required: true,
      min: 1,
      max: 50,
      step: '1',
      placeholder: '30',
      helpText: t('loan_term_help'),
      unit: t('years')
    }
  ];

  // Format number to 2 decimal places as string
  const formatCurrency = (value: number): string => {
    return value.toFixed(2);
  };

  // Calculate the monthly payment
  const calculate = (values: Record<string, any>): CalculatorResult => {
    const J = parseFloat(values.loanAmount || '0'); // Principal amount
    const r = parseFloat(values.interestRate || '0') / 100; // Annual interest rate as decimal
    const t = parseFloat(values.loanTerm || '0'); // Loan term in years

    if (isNaN(J) || isNaN(r) || isNaN(t) || J <= 0 || r < 0 || t <= 0) {
      return { value: null };
    }

    // Convert annual rate to monthly and years to months
    const monthlyRate = r / 12;
    const numPayments = t * 12;

    let monthlyPayment: number;
    if (monthlyRate === 0) {
      // Special case for 0% interest
      monthlyPayment = J / numPayments;
    } else {
      // Standard annuity formula: M = P * [i(1 + i)^n] / [(1 + i)^n - 1]
      monthlyPayment = J * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                     (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    // Calculate total payment and total interest
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - J;

    return {
      value: monthlyPayment,
      details: [
        { label: t('monthly_payment'), value: formatCurrency(monthlyPayment), unit: t('currency'), highlight: true },
        { label: t('total_payment'), value: formatCurrency(totalPayment), unit: t('currency') },
        { label: t('total_interest'), value: formatCurrency(totalInterest), unit: t('currency') },
        { label: t('loan_term_months'), value: numPayments.toString(), unit: t('months') }
      ],
      formula: 'M = P * [i(1 + i)^n] / [(1 + i)^n - 1]',
      explanation: t('monthly_payment_explanation')
    };
  };

  // Custom result component to display the calculation details
  const ResultComponent = ({ result }: { result: CalculatorResult }) => {
    if (result.value === null) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          {t('enter_valid_values')}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <div className="text-sm font-medium text-primary/80 mb-1">
            {t('monthly_payment')}
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(Number(result.value))} {t('currency')}
          </div>
        </div>

        {result.details && result.details.length > 0 && (
          <div className="space-y-2">
            {result.details.map((detail, index) => (
              <div key={index} className={`flex justify-between ${detail.highlight ? 'font-medium' : ''}`}>
                <span className="text-muted-foreground">{detail.label}:</span>
                <span>
                  {detail.value} {detail.unit}
                </span>
              </div>
            ))}
          </div>
        )}

        {result.formula && (
          <div className="mt-4 p-3 bg-muted/50 rounded text-xs font-mono">
            <div className="font-medium mb-1">{t('formula')}:</div>
            <div>{result.formula}</div>
            {result.explanation && (
              <div className="mt-2 text-muted-foreground">{result.explanation}</div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <CalculatorBase
      id="annuity-payment"
      title={t('anuitni_splatka_title')}
      description={t('anuitni_splatka_description')}
      category="finance"
      seo={{
        title: t('anuitni_splatka_seo_title'),
        description: t('anuitni_splatka_seo_description'),
        keywords: [
          t('anuitni_splatka_keyword_1'),
          t('anuitni_splatka_keyword_2'),
          t('anuitni_splatka_keyword_3')
        ]
      }}
      inputs={inputs}
      calculate={calculate}
      resultComponent={ResultComponent}
    />
  );
};

export default AnuitniSplatkaCalculator;
