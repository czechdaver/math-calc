// src/components/calculators/ROICalculator.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorForm, CalculatorInput, CalculatorSelect, CalculatorInputGroup } from './shared';
import { useFinanceFormatting } from '@/hooks/useFinanceFormatting';
import { useROICalculator } from '@/hooks/useROICalculator';
import { Card, CardContent } from '@/components/ui/Card';
import { TrendingUp, Calculator as CalcIcon } from 'lucide-react';

const ROICalculator: React.FC = () => {
  const t = useTranslations();
  const { formatCurrency, formatPercentage, formatYears } = useFinanceFormatting();

  const { state, setField, result, errors } = useROICalculator({
    initialInvestment: t('roi_validation_initial_investment'),
    finalValue: t('roi_validation_final_value'),
    annualReturn: t('roi_validation_annual_return'),
    additionalCosts: t('roi_validation_additional_costs'),
    timePeriod: t('roi_validation_time_period'),
  });


  const resultsSection = result ? (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className={`inline-flex items-center gap-4 p-6 rounded-xl ${result.roi > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="text-center">
            <div className={`text-3xl font-bold ${result.roi > 0 ? 'text-green-900' : 'text-red-900'}`}>
              {formatPercentage(result.roi)}
            </div>
            <div className={`text-sm mt-1 ${result.roi > 0 ? 'text-green-700' : 'text-red-700'}`}>
              {t('calculators.roi.title')}
            </div>
            <div className={`text-xs mt-1 ${result.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {result.roi > 0 ? t('calculators.roi.profitable_investment') : t('calculators.roi.unprofitable_investment')}
            </div>
          </div>
          <TrendingUp className={`w-8 h-8 ${result.roi > 0 ? 'text-green-600' : 'text-red-600'}`} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">{formatPercentage(result.annualizedROI)}</div>
            <div className="text-sm text-blue-700 mt-1">{t('roi_annualized_roi_result')}</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800">{formatCurrency(result.netProfit)}</div>
            <div className="text-sm text-purple-700 mt-1">{t('calculators.roi.net_profit')}</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-orange-800">
              {result.breakEvenPoint === Infinity ? 'N/A' : formatYears(result.breakEvenPoint)}
            </div>
            <div className="text-sm text-orange-700 mt-1">{t('calculators.roi.breakeven_point')}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">{t('finance_detailed_analysis')}</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>{t('roi_total_roi')}:</span>
                  <span className={`font-mono ${result.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatPercentage(result.roi)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('roi_annual_roi')}:</span>
                  <span className={`font-mono ${result.annualizedROI > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatPercentage(result.annualizedROI)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('roi_investment_duration')}:</span>
                  <span className="font-mono">{formatYears(result.investmentPeriod)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('roi_net_profit_label')}:</span>
                  <span className={`font-mono ${result.netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(result.netProfit)}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>{t('finance_recommendation')}:</span>
                  <span className={`font-mono ${result.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.roi > 0 ? t('finance_profitable') : t('finance_unprofitable')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : null;

  return (
    <SimpleCalculatorLayout
      title={t('roi_calculator_title')}
      description={t('roi_calculator_description')}
      category="finance"
      calculatorId="roi"
      seo={{
        title: t('roi_seo_title'),
        description: t('roi_seo_description'),
        keywords: t('roi_seo_keywords').split(','),
      }}
      formula={{
        latex: String.raw`ROI = \frac{\text{Gain} - \text{Cost}}{\text{Cost}} \times 100\%`,
        description: t('roi_formula_desc'),
      }}
      examples={{
        title: t('roi_examples_title'),
        description: t('roi_examples_desc'),
        scenarios: [
          { title: t('roi_example_1_title'), description: t('roi_example_1_desc'), example: t('roi_example_1_calc') },
          { title: t('roi_example_2_title'), description: t('roi_example_2_desc'), example: t('roi_example_2_calc') },
          { title: t('roi_example_3_title'), description: t('roi_example_3_desc'), example: t('roi_example_3_calc') },
        ],
      }}
      faq={[
        { question: t('roi_faq_1_q'), answer: t('roi_faq_1_a') },
        { question: t('roi_faq_2_q'), answer: t('roi_faq_2_a') },
        { question: t('roi_faq_3_q'), answer: t('roi_faq_3_a') },
        { question: t('roi_faq_4_q'), answer: t('roi_faq_4_a') },
      ]}
      schemaData={{ applicationCategory: 'FinanceApplication', operatingSystem: 'Any' }}
      resultSection={resultsSection}
    >
      <CalculatorForm columns={1}>
        <CalculatorSelect
          id="calculationType"
          label={t('calculators.roi.calculation_type')}
          value={state.calculationType}
          onChange={(v) => setField('calculationType', v)}
          options={[
            { value: 'simple', label: t('calculators.roi.simple_investment') },
            { value: 'annualized', label: t('calculators.roi.regular_returns') }
          ]}
          helpText={state.calculationType === 'simple' ? t('calculators.roi.simple_hint') : t('calculators.roi.annualized_hint')}
        />

        <CalculatorInput
          id="initialInvestment"
          label={t('calculators.roi.initial_investment')}
          value={state.initialInvestment}
          onChange={(v) => setField('initialInvestment', v)}
          placeholder="100000"
          min="0"
          step="1000"
          unit={t('finance_currency_label')}
          helpText={t('calculators.roi.initial_investment_hint')}
          error={errors.initialInvestment}
        />

        {state.calculationType === 'simple' ? (
          <CalculatorInput
            id="finalValue"
            label={t('calculators.roi.final_value')}
            value={state.finalValue}
            onChange={(v) => setField('finalValue', v)}
            placeholder="125000"
            min="0"
            step="1000"
            unit={t('finance_currency_label')}
            helpText={t('calculators.roi.final_value_hint')}
            error={errors.finalValue}
          />
        ) : (
          <CalculatorInput
            id="annualReturn"
            label={t('calculators.roi.annualized_roi')}
            value={state.annualReturn}
            onChange={(v) => setField('annualReturn', v)}
            placeholder="12000"
            step="1000"
            unit={t('finance_currency_label')}
            helpText={t('calculators.roi.annual_return_hint')}
            error={errors.annualReturn}
          />
        )}

        <CalculatorInput
          id="additionalCosts"
          label={t('calculators.roi.additional_costs')}
          value={state.additionalCosts}
          onChange={(v) => setField('additionalCosts', v)}
          placeholder="5000"
          min="0"
          step="1000"
          unit={t('finance_currency_label')}
          helpText={t('calculators.roi.additional_costs_hint')}
          error={errors.additionalCosts}
        />

        <CalculatorInputGroup label={t('calculators.roi.investment_period')}>
          <div className="grid grid-cols-2 gap-4">
            <CalculatorInput
              id="timePeriod"
              label=""
              value={state.timePeriod}
              onChange={(v) => setField('timePeriod', v)}
              placeholder="2"
              min="0"
              step="0.1"
              error={errors.timePeriod}
            />
            <CalculatorSelect
              id="timeUnit"
              label=""
              value={state.timeUnit}
              onChange={(v) => setField('timeUnit', v)}
              options={[
                { value: 'years', label: t('calculators.roi.years') },
                { value: 'months', label: t('calculators.roi.months') },
                { value: 'days', label: t('common.days') }
              ]}
            />
          </div>
          <p className="text-muted-foreground text-xs mt-2">{t('calculators.roi.time_period_hint')}</p>
        </CalculatorInputGroup>
      </CalculatorForm>
    </SimpleCalculatorLayout>
  );
};

export default ROICalculator;
