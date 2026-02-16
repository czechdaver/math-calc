// src/components/calculators/AnnuityPaymentCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput, CalculatorResult } from './shared';
import { useFinanceFormatting } from '@/hooks/useFinanceFormatting';

interface AnnuityResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  numPayments: number;
}

const AnnuityPaymentCalculator: React.FC = () => {
  const t = useTranslations();
  const { formatCurrency } = useFinanceFormatting();

  const [loanAmount, setLoanAmount] = useState<string>('100000');
  const [interestRate, setInterestRate] = useState<string>('5.5');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [errors, setErrors] = useState<{ loanAmount?: string; interestRate?: string; loanTerm?: string }>({});
  const [result, setResult] = useState<AnnuityResult | null>(null);

  const validateInputs = (amount: string, rate: string, term: string) => {
    const newErrors: { loanAmount?: string; interestRate?: string; loanTerm?: string } = {};
    const amountNum = parseFloat(amount);
    const rateNum = parseFloat(rate);
    const termNum = parseFloat(term);

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.loanAmount = t('annuity_validation_loan_amount');
    }
    if (!rate || isNaN(rateNum) || rateNum < 0 || rateNum > 100) {
      newErrors.interestRate = t('annuity_validation_interest_rate');
    }
    if (!term || isNaN(termNum) || termNum < 1 || termNum > 50) {
      newErrors.loanTerm = t('annuity_validation_loan_term');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (validateInputs(loanAmount, interestRate, loanTerm)) {
      const principal = parseFloat(loanAmount);
      const rate = parseFloat(interestRate) / 100;
      const months = parseFloat(loanTerm) * 12;
      const monthlyRate = rate / 12;

      let monthlyPayment: number;
      if (monthlyRate === 0) {
        monthlyPayment = principal / months;
      } else {
        monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
      }

      const totalPayment = monthlyPayment * months;
      const totalInterest = totalPayment - principal;

      setResult({ monthlyPayment, totalPayment, totalInterest, numPayments: months });
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanAmount, interestRate, loanTerm]);


  return (
    <SimpleCalculatorLayout
      title={t('annuity_payment_calculator_title')}
      description={t('annuity_payment_calculator_description')}
      category="finance"
      calculatorId="annuity-payment"
      seo={{
        title: t('annuity_seo_title'),
        description: t('annuity_seo_description'),
        keywords: t('annuity_seo_keywords').split(','),
      }}
      formula={{
        latex: String.raw`M = P \cdot \frac{i(1+i)^n}{(1+i)^n - 1}`,
        description: t('annuity_formula_desc'),
      }}
      examples={{
        title: t('annuity_examples_title'),
        description: t('annuity_examples_desc'),
        scenarios: [
          { title: t('annuity_example_1_title'), description: t('annuity_example_1_desc'), example: t('annuity_example_1_calc') },
          { title: t('annuity_example_2_title'), description: t('annuity_example_2_desc'), example: t('annuity_example_2_calc') },
          { title: t('annuity_example_3_title'), description: t('annuity_example_3_desc'), example: t('annuity_example_3_calc') },
        ],
      }}
      faq={[
        { question: t('annuity_faq_1_q'), answer: t('annuity_faq_1_a') },
        { question: t('annuity_faq_2_q'), answer: t('annuity_faq_2_a') },
        { question: t('annuity_faq_3_q'), answer: t('annuity_faq_3_a') },
        { question: t('annuity_faq_4_q'), answer: t('annuity_faq_4_a') },
      ]}
      schemaData={{ applicationCategory: 'FinanceApplication', operatingSystem: 'Any' }}
      resultSection={result && (
        <CalculatorResult
          title={t('annuity_monthly_payment')}
          value={formatCurrency(result.monthlyPayment)}
          formula={`M = ${formatCurrency(parseFloat(loanAmount))} × i(1+i)^${result.numPayments} / ((1+i)^${result.numPayments} - 1)`}
          additionalInfo={
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('annuity_total_payment')}:</span>
                <span className="font-mono">{formatCurrency(result.totalPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('annuity_total_interest')}:</span>
                <span className="font-mono">{formatCurrency(result.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('annuity_loan_term_months')}:</span>
                <span className="font-mono">{result.numPayments}</span>
              </div>
            </div>
          }
        />
      )}
    >
      <div className="space-y-6">
        <CalculatorInput
          id="loanAmount"
          label={t('annuity_loan_amount_label')}
          value={loanAmount}
          onChange={setLoanAmount}
          placeholder="100000"
          min="0"
          step="1000"
          unit={t('finance_currency_label')}
          helpText={t('annuity_loan_amount_help')}
          error={errors.loanAmount}
        />
        <CalculatorInput
          id="interestRate"
          label={t('annuity_interest_rate_label')}
          value={interestRate}
          onChange={setInterestRate}
          placeholder="5.5"
          min="0"
          max="100"
          step="0.1"
          unit="%"
          helpText={t('annuity_interest_rate_help')}
          error={errors.interestRate}
        />
        <CalculatorInput
          id="loanTerm"
          label={t('annuity_loan_term_label')}
          value={loanTerm}
          onChange={setLoanTerm}
          placeholder="30"
          min="1"
          max="50"
          step="1"
          unit={t('finance_years_short')}
          helpText={t('annuity_loan_term_help')}
          error={errors.loanTerm}
        />
      </div>
    </SimpleCalculatorLayout>
  );
};

export default AnnuityPaymentCalculator;
