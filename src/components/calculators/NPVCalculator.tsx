// src/components/calculators/NPVCalculator.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorForm, CalculatorInput, CashFlowEditor } from './shared';
import { useFinanceFormatting } from '@/hooks/useFinanceFormatting';
import { useNPVCalculator, calculatePresentValue } from '@/hooks/useNPVCalculator';
import { Card, CardContent } from '@/components/ui/Card';
import { TrendingUp, Calculator as CalcIcon } from 'lucide-react';

const NPVCalculator: React.FC = () => {
  const t = useTranslations();
  const { formatCurrency, formatPercentage, formatRatio } = useFinanceFormatting();

  const { cashFlows, setCashFlows, discountRate, setDiscountRate, result, errors } = useNPVCalculator({
    discountRate: t('npv_validation_discount_rate'),
    cashFlow: t('npv_validation_cash_flow'),
  });


  const resultsSection = result ? (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className={`inline-flex items-center gap-4 p-6 rounded-xl ${result.npv > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="text-center">
            <div className={`text-3xl font-bold ${result.npv > 0 ? 'text-green-900' : 'text-red-900'}`}>
              {formatCurrency(result.npv)}
            </div>
            <div className={`text-sm mt-1 ${result.npv > 0 ? 'text-green-700' : 'text-red-700'}`}>
              {t('calculators.npv.npv_result')}
            </div>
            <div className={`text-xs mt-1 ${result.npv > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {result.npv > 0 ? t('calculators.npv.investment_profitable') : t('calculators.npv.investment_unprofitable')}
            </div>
          </div>
          <TrendingUp className={`w-8 h-8 ${result.npv > 0 ? 'text-green-600' : 'text-red-600'}`} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">{formatRatio(result.profitabilityIndex)}</div>
            <div className="text-sm text-blue-700 mt-1">{t('finance_pi_label')}</div>
            <div className="text-xs text-blue-600 mt-1">
              {result.profitabilityIndex > 1 ? t('calculators.npv.profitable') : t('calculators.npv.unprofitable')}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800">{formatCurrency(result.presentValueOfReturns)}</div>
            <div className="text-sm text-purple-700 mt-1">{t('finance_pv_returns')}</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-orange-800">{formatPercentage(result.discountRate)}</div>
            <div className="text-sm text-orange-700 mt-1">{t('calculators.npv.discount_rate')}</div>
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
                  <span>{t('finance_pi_label')}:</span>
                  <span className={`font-mono ${result.profitabilityIndex > 1 ? 'text-green-600' : 'text-red-600'}`}>{formatRatio(result.profitabilityIndex)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('finance_pv_returns')}:</span>
                  <span className="font-mono">{formatCurrency(result.presentValueOfReturns)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('finance_npv_to_investment_ratio')}:</span>
                  <span className="font-mono">{result.totalInvestment > 0 ? formatRatio(result.npv / result.totalInvestment) : 'N/A'}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>{t('finance_recommendation')}:</span>
                  <span className={`font-mono ${result.npv > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.npv > 0 ? t('finance_accept') : t('finance_reject')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-foreground mb-3">{t('finance_pv_breakdown')}</h4>
          <div className="space-y-2">
            {cashFlows.map((flow, index) => {
              const pv = calculatePresentValue(flow.amount, flow.period, result.discountRate);
              return (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="text-sm font-medium">
                    {flow.period === 0 ? t('finance_beginning') : `${t('finance_year')} ${flow.period}`}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-mono ${flow.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {flow.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(flow.amount))}
                    </span>
                    <span className="text-muted-foreground">&rarr;</span>
                    <span className={`font-mono ${pv < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {pv < 0 ? '-' : '+'}{formatCurrency(Math.abs(pv))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-2 border-t flex justify-between font-semibold">
            <span>{t('calculators.npv.total_npv')}:</span>
            <span className={`font-mono ${result.npv < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(result.npv)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : null;

  return (
    <SimpleCalculatorLayout
      title={t('npv_calculator_title')}
      description={t('npv_calculator_description')}
      category="finance"
      calculatorId="npv"
      seo={{
        title: t('npv_seo_title'),
        description: t('npv_seo_description'),
        keywords: t('npv_seo_keywords').split(','),
      }}
      formula={{
        latex: String.raw`NPV = \sum_{t=0}^{n} \frac{CF_t}{(1+r)^t}`,
        description: t('npv_formula_desc'),
      }}
      examples={{
        title: t('npv_examples_title'),
        description: t('npv_examples_desc'),
        scenarios: [
          { title: t('npv_example_1_title'), description: t('npv_example_1_desc'), example: t('npv_example_1_calc') },
          { title: t('npv_example_2_title'), description: t('npv_example_2_desc'), example: t('npv_example_2_calc') },
          { title: t('npv_example_3_title'), description: t('npv_example_3_desc'), example: t('npv_example_3_calc') },
        ],
      }}
      faq={[
        { question: t('npv_faq_1_q'), answer: t('npv_faq_1_a') },
        { question: t('npv_faq_2_q'), answer: t('npv_faq_2_a') },
        { question: t('npv_faq_3_q'), answer: t('npv_faq_3_a') },
        { question: t('npv_faq_4_q'), answer: t('npv_faq_4_a') },
      ]}
      schemaData={{ applicationCategory: 'FinanceApplication', operatingSystem: 'Any' }}
      resultSection={resultsSection}
    >
      <CalculatorForm columns={1}>
        <CalculatorInput
          id="discountRate"
          label={t('calculators.npv.discount_rate')}
          value={discountRate}
          onChange={setDiscountRate}
          placeholder="10"
          min="0"
          step="0.1"
          unit="%"
          helpText={t('calculators.npv.discount_rate_hint')}
          error={errors.discountRate}
        />
        <CashFlowEditor
          cashFlows={cashFlows}
          onChange={setCashFlows}
          errors={errors}
          labels={{
            title: t('calculators.npv.cash_flows'),
            addPeriod: t('calculators.npv.add_period'),
            beginning: t('finance_beginning'),
            year: t('finance_year'),
            currency: t('finance_currency_label'),
            negativeHint: t('calculators.npv.negative_values'),
            positiveHint: t('calculators.npv.positive_values'),
            periodZeroHint: t('calculators.npv.period_zero'),
          }}
        />
      </CalculatorForm>
    </SimpleCalculatorLayout>
  );
};

export default NPVCalculator;
