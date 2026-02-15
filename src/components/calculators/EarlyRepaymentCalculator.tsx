// src/components/calculators/EarlyRepaymentCalculator.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput } from './shared';
import { useFinanceFormatting } from '@/hooks/useFinanceFormatting';
import { useEarlyRepaymentCalculator } from '@/hooks/useEarlyRepaymentCalculator';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Calculator as CalcIcon } from 'lucide-react';

const EarlyRepaymentCalculator: React.FC = () => {
  const t = useTranslations();
  const { formatCurrency, formatMonths, locale } = useFinanceFormatting();

  const { state, setField, result, errors } = useEarlyRepaymentCalculator({
    loanAmount: t('early_repayment_validation_loan_amount'),
    interestRate: t('early_repayment_validation_interest_rate'),
    loanTerm: t('early_repayment_validation_loan_term'),
    paidMonths: t('early_repayment_validation_paid_months'),
    paidMonthsOverflow: t('early_repayment_validation_paid_months_overflow'),
    repaymentAmount: t('early_repayment_validation_repayment_amount'),
  });


  const resultsSection = result ? (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">{formatCurrency(result.totalSavings)}</div>
            <div className="text-sm text-green-700 mt-1">{t('calculators.early_repayment.total_interest_savings')}</div>
            <div className="text-xs text-green-600 mt-1">
              {result.repaymentType === 'reduce_term' ? t('calculators.early_repayment.term_reduction') : t('calculators.early_repayment.payment_reduction')}
            </div>
          </div>
          <TrendingUp className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">{formatCurrency(result.newMonthlyPayment)}</div>
            <div className="text-sm text-blue-700 mt-1">{t('calculators.early_repayment.new_monthly_payment')}</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800">{formatMonths(result.newLoanTerm)}</div>
            <div className="text-sm text-purple-700 mt-1">{t('calculators.early_repayment.new_loan_term')}</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-orange-800">{formatCurrency(result.remainingBalance)}</div>
            <div className="text-sm text-orange-700 mt-1">{t('finance_balance_before_repayment')}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-red-800 mb-3">{t('calculators.early_repayment.results.original_loan')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('calculators.early_repayment.results.monthly_payment')}:</span>
                <span className="font-mono">{formatCurrency(result.originalMonthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('calculators.early_repayment.results.loan_term')}:</span>
                <span className="font-mono">{formatMonths(parseFloat(state.loanTerm) * 12)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>{t('calculators.early_repayment.results.total_interest')}:</span>
                <span className="font-mono">{formatCurrency(result.originalTotalInterest)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-green-800 mb-3">{t('calculators.early_repayment.results.after_repayment')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('calculators.early_repayment.results.monthly_payment')}:</span>
                <span className="font-mono">{formatCurrency(result.newMonthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('calculators.early_repayment.results.loan_term')}:</span>
                <span className="font-mono">{formatMonths(result.newLoanTerm)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>{t('calculators.early_repayment.results.total_interest')}:</span>
                <span className="font-mono">{formatCurrency(result.newTotalInterest)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="w-full">
              <h4 className="font-semibold text-foreground mb-2">{t('calculators.early_repayment.results.detailed_analysis')}</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>{t('calculators.early_repayment.results.remaining_balance')}:</span>
                  <span className="font-mono">{formatCurrency(result.remainingBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('calculators.early_repayment.results.early_payment')}:</span>
                  <span className="font-mono">{formatCurrency(result.earlyRepaymentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('calculators.early_repayment.results.new_balance')}:</span>
                  <span className="font-mono">{formatCurrency(result.remainingBalance - result.earlyRepaymentAmount)}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>{t('calculators.early_repayment.results.total_savings')}:</span>
                  <span className="font-mono text-green-600">{formatCurrency(result.totalSavings)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-foreground mb-3">{t('calculators.early_repayment.results.tips_title')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-green-50 rounded">
              <div className="font-medium text-green-800 mb-1">{t('calculators.early_repayment.results.tips.term_reduction.title')}</div>
              <div className="text-green-700">{t('calculators.early_repayment.results.tips.term_reduction.description')}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <div className="font-medium text-blue-800 mb-1">{t('calculators.early_repayment.results.tips.payment_reduction.title')}</div>
              <div className="text-blue-700">{t('calculators.early_repayment.results.tips.payment_reduction.description')}</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <div className="font-medium text-yellow-800 mb-1">{t('calculators.early_repayment.results.tips.fees.title')}</div>
              <div className="text-yellow-700">{t('calculators.early_repayment.results.tips.fees.description')}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <div className="font-medium text-purple-800 mb-1">{t('calculators.early_repayment.results.tips.alternatives.title')}</div>
              <div className="text-purple-700">{t('calculators.early_repayment.results.tips.alternatives.description')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : null;

  return (
    <SimpleCalculatorLayout
      title={t('calculators.early_repayment.title')}
      description={t('calculators.early_repayment.description')}
      category="finance"
      calculatorId="early-repayment"
      seo={{
        title: t('calculators.early_repayment.seo.title'),
        description: t('calculators.early_repayment.seo.description'),
        keywords: t('calculators.early_repayment.seo.keywords').split(','),
      }}
      formula={{
        latex: String.raw`S = \sum_{t=1}^{n_1} PMT - \sum_{t=1}^{n_2} PMT_{new}`,
        description: t('calculators.early_repayment.formula.description'),
      }}
      examples={{
        title: t('calculators.early_repayment.examples.title'),
        description: t('calculators.early_repayment.examples.description'),
        scenarios: [
          { title: t('calculators.early_repayment.examples.scenario1.title'), description: t('calculators.early_repayment.examples.scenario1.description'), example: t('calculators.early_repayment.examples.scenario1.example') },
          { title: t('calculators.early_repayment.examples.scenario2.title'), description: t('calculators.early_repayment.examples.scenario2.description'), example: t('calculators.early_repayment.examples.scenario2.example') },
          { title: t('calculators.early_repayment.examples.scenario3.title'), description: t('calculators.early_repayment.examples.scenario3.description'), example: t('calculators.early_repayment.examples.scenario3.example') },
        ],
      }}
      faq={[
        { question: t('calculators.early_repayment.faq.q1.question'), answer: t('calculators.early_repayment.faq.q1.answer') },
        { question: t('calculators.early_repayment.faq.q2.question'), answer: t('calculators.early_repayment.faq.q2.answer') },
        { question: t('calculators.early_repayment.faq.q3.question'), answer: t('calculators.early_repayment.faq.q3.answer') },
        { question: t('calculators.early_repayment.faq.q4.question'), answer: t('calculators.early_repayment.faq.q4.answer') },
      ]}
      schemaData={{ applicationCategory: 'FinanceApplication', operatingSystem: 'Any' }}
      resultSection={resultsSection}
    >
      <div className="space-y-6">
        <CalculatorInput
          id="loanAmount"
          label={t('calculators.early_repayment.loan_amount')}
          value={state.loanAmount}
          onChange={(v) => setField('loanAmount', v)}
          placeholder="2000000"
          min="0"
          step="10000"
          unit={t('finance_currency_label')}
          helpText={t('calculators.early_repayment.loan_amount_hint')}
          error={errors.loanAmount}
        />
        <CalculatorInput
          id="interestRate"
          label={t('calculators.early_repayment.interest_rate')}
          value={state.interestRate}
          onChange={(v) => setField('interestRate', v)}
          placeholder="4.5"
          min="0"
          step="0.1"
          unit="%"
          helpText={t('calculators.early_repayment.interest_rate_hint')}
          error={errors.interestRate}
        />
        <CalculatorInput
          id="loanTerm"
          label={t('calculators.early_repayment.loan_term')}
          value={state.loanTerm}
          onChange={(v) => setField('loanTerm', v)}
          placeholder="25"
          min="1"
          step="1"
          unit={t('finance_years_short')}
          helpText={t('calculators.early_repayment.loan_term_hint')}
          error={errors.loanTerm}
        />
        <CalculatorInput
          id="paidMonths"
          label={t('calculators.early_repayment.paid_months')}
          value={state.paidMonths}
          onChange={(v) => setField('paidMonths', v)}
          placeholder="36"
          min="0"
          step="1"
          helpText={t('calculators.early_repayment.paid_months_hint')}
          error={errors.paidMonths}
        />
        <CalculatorInput
          id="repaymentAmount"
          label={t('calculators.early_repayment.repayment_amount')}
          value={state.repaymentAmount}
          onChange={(v) => setField('repaymentAmount', v)}
          placeholder="300000"
          min="0"
          step="10000"
          unit={t('finance_currency_label')}
          helpText={t('calculators.early_repayment.repayment_amount_hint')}
          error={errors.repaymentAmount}
        />

        <div className="space-y-2">
          <Label htmlFor="repaymentType" className="text-sm font-medium">{t('calculators.early_repayment.repayment_type')}</Label>
          <Select value={state.repaymentType} onValueChange={(v) => setField('repaymentType', v)}>
            <SelectTrigger><SelectValue placeholder={t('calculators.early_repayment.select_type')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="reduce_term">{t('calculators.early_repayment.reduce_term')}</SelectItem>
              <SelectItem value="reduce_payment">{t('calculators.early_repayment.reduce_payment')}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs">
            {state.repaymentType === 'reduce_term'
              ? t('calculators.early_repayment.keep_payment_reduce_term')
              : t('calculators.early_repayment.keep_term_reduce_payment')}
          </p>
        </div>
      </div>
    </SimpleCalculatorLayout>
  );
};

export default EarlyRepaymentCalculator;
