// src/components/calculators/IRRCalculator.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput, CashFlowEditor } from './shared';
import { getRelatedCalculators } from '@/lib/calculatorDataUtils';
import { useFinanceFormatting } from '@/hooks/useFinanceFormatting';
import { useIRRCalculator } from '@/hooks/useIRRCalculator';
import { Card, CardContent } from '@/components/ui/Card';
import { TrendingUp, Calculator as CalcIcon } from 'lucide-react';

const IRRCalculator: React.FC = () => {
  const t = useTranslations();
  const { formatCurrency, formatPercentage, formatYears, locale } = useFinanceFormatting();

  const { cashFlows, setCashFlows, discountRate, setDiscountRate, result, errors } = useIRRCalculator({
    discountRate: t('irr_validation_discount_rate'),
    cashFlows: t('irr_validation_cash_flows'),
    cashFlow: t('irr_validation_cash_flow'),
  });

  const relatedCalculators = getRelatedCalculators('irr', locale, t);

  const resultsSection = result ? (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">{formatPercentage(result.irr)}</div>
            <div className="text-sm text-green-700 mt-1">{t('calculators.irr.irr_result')}</div>
            <div className="text-xs text-green-600 mt-1">
              {result.irr > parseFloat(discountRate) ? t('calculators.irr.investment_profitable') : t('calculators.irr.investment_unprofitable')}
            </div>
          </div>
          <TrendingUp className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className={`${result.npv > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <CardContent className="p-4 text-center">
            <div className={`text-lg font-bold ${result.npv > 0 ? 'text-green-800' : 'text-red-800'}`}>{formatCurrency(result.npv)}</div>
            <div className={`text-sm mt-1 ${result.npv > 0 ? 'text-green-700' : 'text-red-700'}`}>{t('calculators.irr.npv_result')}</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">{formatYears(result.paybackPeriod)}</div>
            <div className="text-sm text-blue-700 mt-1">{t('calculators.irr.payback_period')}</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800">{formatCurrency(result.netProfit)}</div>
            <div className="text-sm text-purple-700 mt-1">{t('calculators.irr.net_profit')}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="w-full">
              <h4 className="font-semibold text-foreground mb-2">{t('finance_detailed_analysis')}</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>{t('irr_irr_label')}:</span>
                  <span className="font-mono">{formatPercentage(result.irr)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('calculators.irr.npv_result')}:</span>
                  <span className={`font-mono ${result.npv > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(result.npv)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('calculators.irr.payback_period')}:</span>
                  <span className="font-mono">{formatYears(result.paybackPeriod)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('finance_returns_to_investment_ratio')}:</span>
                  <span className="font-mono">
                    {result.totalInvestment > 0
                      ? (result.totalReturns / result.totalInvestment).toLocaleString(undefined, { maximumFractionDigits: 2 }) + '×'
                      : 'N/A'}
                  </span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>{t('finance_recommendation')}:</span>
                  <span className={`font-mono ${result.irr > parseFloat(discountRate) ? 'text-green-600' : 'text-red-600'}`}>
                    {result.irr > parseFloat(discountRate) ? t('finance_accept') : t('finance_reject')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-foreground mb-3">{t('finance_cash_flow_timeline')}</h4>
          <div className="space-y-2">
            {cashFlows.map((flow, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div className="text-sm font-medium">
                  {flow.period === 0 ? t('finance_beginning') : `${t('finance_year')} ${flow.period}`}
                </div>
                <div className={`text-sm font-mono ${flow.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {flow.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(flow.amount))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ) : null;

  return (
    <SimpleCalculatorLayout
      title={t('irr_calculator_title')}
      description={t('irr_calculator_description')}
      category="finance"
      calculatorId="irr"
      seo={{
        title: t('irr_seo_title'),
        description: t('irr_seo_description'),
        keywords: t('irr_seo_keywords').split(','),
      }}
      formula={{
        latex: String.raw`NPV = \sum_{t=0}^{n} \frac{CF_t}{(1+IRR)^t} = 0`,
        description: t('irr_formula_desc'),
      }}
      examples={{
        title: t('irr_examples_title'),
        description: t('irr_examples_desc'),
        scenarios: [
          { title: t('irr_example_1_title'), description: t('irr_example_1_desc'), example: t('irr_example_1_calc') },
          { title: t('irr_example_2_title'), description: t('irr_example_2_desc'), example: t('irr_example_2_calc') },
          { title: t('irr_example_3_title'), description: t('irr_example_3_desc'), example: t('irr_example_3_calc') },
        ],
      }}
      faq={[
        { question: t('irr_faq_1_q'), answer: t('irr_faq_1_a') },
        { question: t('irr_faq_2_q'), answer: t('irr_faq_2_a') },
        { question: t('irr_faq_3_q'), answer: t('irr_faq_3_a') },
        { question: t('irr_faq_4_q'), answer: t('irr_faq_4_a') },
      ]}
      relatedCalculators={relatedCalculators}
      schemaData={{ applicationCategory: 'FinanceApplication', operatingSystem: 'Any' }}
      resultSection={resultsSection}
    >
      <div className="space-y-6">
        <CalculatorInput
          id="discountRate"
          label={t('calculators.irr.discount_rate')}
          value={discountRate}
          onChange={setDiscountRate}
          placeholder="10"
          min="0"
          step="0.1"
          unit="%"
          helpText={t('calculators.irr.discount_rate_hint')}
          error={errors.discountRate}
        />
        <CashFlowEditor
          cashFlows={cashFlows}
          onChange={setCashFlows}
          errors={errors}
          labels={{
            title: t('calculators.irr.cash_flows'),
            addPeriod: t('calculators.irr.add_period'),
            beginning: t('finance_beginning'),
            year: t('finance_year'),
            currency: t('finance_currency_label'),
            negativeHint: t('calculators.irr.negative_values'),
            positiveHint: t('calculators.irr.positive_values'),
            periodZeroHint: t('calculators.irr.period_zero'),
          }}
        />
      </div>
    </SimpleCalculatorLayout>
  );
};

export default IRRCalculator;
