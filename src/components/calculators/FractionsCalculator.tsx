import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorSelect } from './shared';
import { getRelatedCalculators } from '@/lib/calculatorDataUtils';

const FractionAddition = dynamic(() => import('./fractionOperations/FractionAddition'), { ssr: false });
const FractionSubtraction = dynamic(() => import('./fractionOperations/FractionSubtraction'), { ssr: false });
const FractionMultiplication = dynamic(() => import('./fractionOperations/FractionMultiplication'), { ssr: false });
const FractionDivision = dynamic(() => import('./fractionOperations/FractionDivision'), { ssr: false });
const FractionSimplification = dynamic(() => import('./fractionOperations/FractionSimplification'), { ssr: false });
const FractionConversion = dynamic(() => import('./fractionOperations/FractionConversion'), { ssr: false });

const FractionsCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [operation, setOperation] = useState<string>('');

  const relatedCalculators = getRelatedCalculators('fractions', locale, t);

  const operationOptions = [
    { value: '', label: t('fractions_select_default') },
    { value: 'scitani', label: t('fractions_operation_scitani') },
    { value: 'odcitani', label: t('fractions_operation_odcitani') },
    { value: 'nasobeni', label: t('fractions_operation_nasobeni') },
    { value: 'deleni', label: t('fractions_operation_deleni') },
    { value: 'zkracovani', label: t('fractions_operation_zkracovani') },
    { value: 'prevod', label: t('fractions_operation_prevod') }
  ];

  const renderOperationForm = () => {
    switch (operation) {
      case 'scitani': return <FractionAddition />;
      case 'odcitani': return <FractionSubtraction />;
      case 'nasobeni': return <FractionMultiplication />;
      case 'deleni': return <FractionDivision />;
      case 'zkracovani': return <FractionSimplification />;
      case 'prevod': return <FractionConversion />;
      default: return (
        <div className="p-4 text-center text-muted-foreground">
          {t('fractions_select_operation')}
        </div>
      );
    }
  };

  return (
    <SimpleCalculatorLayout
      title={t('fractions_title')}
      description={t('fractions_description')}
      category="matematika"
      calculatorId="fractions"
      seo={{
        title: t('fractions_seo_title'),
        description: t('fractions_seo_description'),
        keywords: [
          t('fractions_keyword_1'),
          t('fractions_keyword_2'),
          t('fractions_keyword_3'),
          t('fractions_keyword_4')
        ]
      }}
      formula={{
        latex: String.raw`\frac{a}{b} + \frac{c}{d} = \frac{a \cdot d + b \cdot c}{b \cdot d}`,
        description: t('fractions_formula_desc')
      }}
      examples={{
        title: t('fractions_examples_title'),
        description: t('fractions_examples_desc'),
        scenarios: [
          { title: t('fractions_example_1_title'), description: t('fractions_example_1_desc'), example: t('fractions_example_1_calc') },
          { title: t('fractions_example_2_title'), description: t('fractions_example_2_desc'), example: t('fractions_example_2_calc') }
        ]
      }}
      faq={[
        { question: t('fractions_faq_1_q'), answer: t('fractions_faq_1_a') },
        { question: t('fractions_faq_2_q'), answer: t('fractions_faq_2_a') },
        { question: t('fractions_faq_3_q'), answer: t('fractions_faq_3_a') }
      ]}
      relatedCalculators={relatedCalculators}
      schemaData={{ applicationCategory: "UtilityApplication", operatingSystem: "Any" }}
      resultSection={operation ? (
        <div className="mt-2">
          {renderOperationForm()}
        </div>
      ) : undefined}
    >
      <div className="space-y-6">
        <CalculatorSelect
          id="operation"
          label={t('fractions_select_operation_label')}
          value={operation}
          onChange={setOperation}
          options={operationOptions}
          helpText={t('fractions_select_help')}
        />
      </div>
    </SimpleCalculatorLayout>
  );
};

export default FractionsCalculator;
