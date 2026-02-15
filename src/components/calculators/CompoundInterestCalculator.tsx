import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput, CalculatorSelect } from './shared';
import { useCompoundInterestCalculator } from '@/hooks/useCompoundInterestCalculator';
import { Info } from 'lucide-react';

const CompoundInterestCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const {
    principal, setPrincipal, interestRate, setInterestRate,
    years, setYears, frequency, setFrequency,
    monthlyContribution, setMonthlyContribution,
    result, errors, validate, calculate
  } = useCompoundInterestCalculator();

  useEffect(() => {
    if (validate({
      principal: t('compound_interest_validation_principal'),
      interestRate: t('compound_interest_validation_rate'),
      years: t('compound_interest_validation_years')
    })) {
      calculate();
    }
  }, [principal, interestRate, years, frequency, monthlyContribution]);


  const frequencyOptions = [
    { value: 'annually', label: t('compound_interest_freq_annually') },
    { value: 'semi-annually', label: t('compound_interest_freq_semi_annually') },
    { value: 'quarterly', label: t('compound_interest_freq_quarterly') },
    { value: 'monthly', label: t('compound_interest_freq_monthly') },
    { value: 'daily', label: t('compound_interest_freq_daily') }
  ];

  const formatCurrency = (value: number): string => {
    return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <SimpleCalculatorLayout
      title={t('compound_interest_title')}
      description={t('compound_interest_description')}
      category="finance"
      calculatorId="compound-interest"
      seo={{
        title: t('compound_interest_seo_title'),
        description: t('compound_interest_seo_description'),
        keywords: [
          t('compound_interest_keyword_1'),
          t('compound_interest_keyword_2'),
          t('compound_interest_keyword_3'),
          t('compound_interest_keyword_4')
        ]
      }}
      formula={{
        latex: String.raw`A = P\left(1 + \frac{r}{n}\right)^{nt}`,
        description: t('compound_interest_formula_desc')
      }}
      examples={{
        title: t('compound_interest_examples_title'),
        description: t('compound_interest_examples_desc'),
        scenarios: [
          { title: t('compound_interest_example_1_title'), description: t('compound_interest_example_1_desc'), example: t('compound_interest_example_1_calc') },
          { title: t('compound_interest_example_2_title'), description: t('compound_interest_example_2_desc'), example: t('compound_interest_example_2_calc') },
          { title: t('compound_interest_example_3_title'), description: t('compound_interest_example_3_desc'), example: t('compound_interest_example_3_calc') }
        ]
      }}
      faq={[
        { question: t('compound_interest_faq_1_q'), answer: t('compound_interest_faq_1_a') },
        { question: t('compound_interest_faq_2_q'), answer: t('compound_interest_faq_2_a') },
        { question: t('compound_interest_faq_3_q'), answer: t('compound_interest_faq_3_a') },
        { question: t('compound_interest_faq_4_q'), answer: t('compound_interest_faq_4_a') }
      ]}
      schemaData={{ applicationCategory: "FinanceApplication", operatingSystem: "Any" }}
      resultSection={result && result.isValid && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
              <div className="text-sm font-medium text-muted-foreground">{t('compound_interest_future_value')}</div>
              <div className="text-2xl font-bold text-primary">{formatCurrency(result.futureValue)} {t('common.currency')}</div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-sm font-medium text-muted-foreground">{t('compound_interest_total_contributions')}</div>
              <div className="text-lg font-semibold">{formatCurrency(result.totalContributions)} {t('common.currency')}</div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-sm font-medium text-muted-foreground">{t('compound_interest_interest_earned')}</div>
              <div className="text-lg font-semibold text-green-600">{formatCurrency(result.interestEarned)} {t('common.currency')}</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground flex items-start gap-2 p-3 bg-muted/30 rounded-md">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>{t('compound_interest_disclaimer')}</p>
          </div>
        </div>
      )}
    >
      <div className="space-y-6">
        <CalculatorInput
          id="principal"
          label={t('compound_interest_principal_label')}
          value={principal}
          onChange={setPrincipal}
          placeholder="10000"
          min="0"
          step="any"
          unit={t('common.currency')}
          helpText={t('compound_interest_principal_help')}
          error={errors.principal}
        />
        <CalculatorInput
          id="interestRate"
          label={t('compound_interest_rate_label')}
          value={interestRate}
          onChange={setInterestRate}
          placeholder="5"
          min="0"
          max="100"
          step="0.01"
          unit="%"
          helpText={t('compound_interest_rate_help')}
          error={errors.interestRate}
        />
        <CalculatorSelect
          id="frequency"
          label={t('compound_interest_frequency_label')}
          value={frequency}
          onChange={(v) => setFrequency(v as 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily')}
          options={frequencyOptions}
          helpText={t('compound_interest_frequency_help')}
        />
        <CalculatorInput
          id="years"
          label={t('compound_interest_years_label')}
          value={years}
          onChange={setYears}
          placeholder="10"
          min="1"
          max="100"
          step="1"
          unit={t('common.years')}
          helpText={t('compound_interest_years_help')}
          error={errors.years}
        />
        <CalculatorInput
          id="monthlyContribution"
          label={t('compound_interest_monthly_label')}
          value={monthlyContribution}
          onChange={setMonthlyContribution}
          placeholder="0"
          min="0"
          step="any"
          unit={t('common.currency')}
          helpText={t('compound_interest_monthly_help')}
        />
      </div>
    </SimpleCalculatorLayout>
  );
};

export default CompoundInterestCalculator;
