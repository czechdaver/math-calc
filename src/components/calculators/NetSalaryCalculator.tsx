import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput, CalculatorSelect } from './shared';
import { useNetSalaryCalculator } from '@/hooks/useNetSalaryCalculator';
import { Info } from 'lucide-react';

const NetSalaryCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const {
    grossSalary, setGrossSalary, country, setCountry,
    result, errors, validate, calculate
  } = useNetSalaryCalculator();

  useEffect(() => {
    if (validate(t('net_salary_validation_gross'))) {
      calculate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grossSalary, country]);


  const countryOptions = [
    { value: 'cz', label: t('net_salary_country_cz') },
    { value: 'sk', label: t('net_salary_country_sk') }
  ];

  const currencyLabel = country === 'cz' ? 'Kč' : '€';

  const formatNum = (value: number): string => {
    return value.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <SimpleCalculatorLayout
      title={t('net_salary_title')}
      description={t('net_salary_description')}
      category="finance"
      calculatorId="net-salary"
      seo={{
        title: t('net_salary_seo_title'),
        description: t('net_salary_seo_description'),
        keywords: [
          t('net_salary_keyword_1'),
          t('net_salary_keyword_2'),
          t('net_salary_keyword_3'),
          t('net_salary_keyword_4')
        ]
      }}
      formula={{
        latex: String.raw`\text{Čistá mzda} = \text{Hrubá} - \text{SP} - \text{ZP} - \text{Daň}`,
        description: t('net_salary_formula_desc')
      }}
      examples={{
        title: t('net_salary_examples_title'),
        description: t('net_salary_examples_desc'),
        scenarios: [
          { title: t('net_salary_example_1_title'), description: t('net_salary_example_1_desc'), example: t('net_salary_example_1_calc') },
          { title: t('net_salary_example_2_title'), description: t('net_salary_example_2_desc'), example: t('net_salary_example_2_calc') },
          { title: t('net_salary_example_3_title'), description: t('net_salary_example_3_desc'), example: t('net_salary_example_3_calc') }
        ]
      }}
      faq={[
        { question: t('net_salary_faq_1_q'), answer: t('net_salary_faq_1_a') },
        { question: t('net_salary_faq_2_q'), answer: t('net_salary_faq_2_a') },
        { question: t('net_salary_faq_3_q'), answer: t('net_salary_faq_3_a') },
        { question: t('net_salary_faq_4_q'), answer: t('net_salary_faq_4_a') }
      ]}
      schemaData={{ applicationCategory: "FinanceApplication", operatingSystem: "Any" }}
      resultSection={result && result.isValid && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border">
              <div className="text-sm font-medium text-muted-foreground">{t('net_salary_gross_label')}</div>
              <div className="text-xl font-bold">{formatNum(result.grossSalary)} {currencyLabel}</div>
            </div>
            <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
              <div className="text-sm font-medium text-muted-foreground">{t('net_salary_net_label')}</div>
              <div className="text-xl font-bold text-primary">{formatNum(result.netSalary)} {currencyLabel}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg border">
              <div className="text-sm font-medium text-muted-foreground">{t('net_salary_total_deductions')}</div>
              <div className="text-lg font-semibold">{formatNum(result.totalDeductions)} {currencyLabel}</div>
              <div className="text-xs text-muted-foreground">{result.deductionPercent.toFixed(1)}%</div>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="text-sm font-medium text-muted-foreground">{t('net_salary_tax_label')}</div>
              <div className="text-lg font-semibold">{formatNum(result.tax)} {currencyLabel}</div>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="text-sm font-medium text-muted-foreground">{t('net_salary_social_label')}</div>
              <div className="text-lg font-semibold">{formatNum(result.socialInsurance)} {currencyLabel}</div>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="text-sm font-medium text-muted-foreground">{t('net_salary_health_label')}</div>
              <div className="text-lg font-semibold">{formatNum(result.healthInsurance)} {currencyLabel}</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground flex items-start gap-2 p-3 bg-muted/30 rounded-md">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>{t('net_salary_disclaimer')}</p>
          </div>
        </div>
      )}
    >
      <div className="space-y-6">
        <CalculatorSelect
          id="country"
          label={t('net_salary_country_label')}
          value={country}
          onChange={(v) => setCountry(v as 'cz' | 'sk')}
          options={countryOptions}
          helpText={t('net_salary_country_help')}
        />
        <CalculatorInput
          id="grossSalary"
          label={t('net_salary_gross_input_label')}
          value={grossSalary}
          onChange={setGrossSalary}
          placeholder="30000"
          min="0"
          step="100"
          unit={currencyLabel}
          helpText={t('net_salary_gross_input_help')}
          error={errors.grossSalary}
        />
      </div>
    </SimpleCalculatorLayout>
  );
};

export default NetSalaryCalculator;
