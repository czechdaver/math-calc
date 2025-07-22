// src/components/calculators/ZlomkyCalculator.refactored.tsx
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { CalculatorInput, CalculatorResult } from './CalculatorBase';
import dynamic from 'next/dynamic';

// Dynamically import CalculatorBase with SSR disabled
const CalculatorBase = dynamic(
  () => import('./CalculatorBase').then(mod => mod.default),
  { ssr: false }
);

// Dynamically import fraction operation components
const FractionAddition = dynamic(
  () => import('./fractionOperations/FractionAddition'),
  { ssr: false }
);
const FractionSubtraction = dynamic(
  () => import('./fractionOperations/FractionSubtraction'),
  { ssr: false }
);
const FractionMultiplication = dynamic(
  () => import('./fractionOperations/FractionMultiplication'),
  { ssr: false }
);
const FractionDivision = dynamic(
  () => import('./fractionOperations/FractionDivision'),
  { ssr: false }
);
const FractionSimplification = dynamic(
  () => import('./fractionOperations/FractionSimplification'),
  { ssr: false }
);
const FractionConversion = dynamic(
  () => import('./fractionOperations/FractionConversion'),
  { ssr: false }
);

const ZlomkyCalculator: React.FC = () => {
  const { t } = useTranslation('common');
  const [operace, setOperace] = useState('');

  const handleOperaceChange = (value: string) => {
    setOperace(value);
  };

  // Define the calculator inputs
  const operationInput: CalculatorInput = {
    id: 'operation',
    label: t('fractions_select_operation_label') || 'Operace se fractions',
    type: 'select',
    required: true,
    options: [
      { value: '', label: t('select_option_default') || '-- Vyberte operaci --' },
      { value: 'scitani', label: t('fractions_operation_scitani') || 'Sčítání zlomků' },
      { value: 'odcitani', label: t('fractions_operation_odcitani') || 'Odčítání zlomků' },
      { value: 'nasobeni', label: t('fractions_operation_nasobeni') || 'Násobení zlomků' },
      { value: 'deleni', label: t('fractions_operation_deleni') || 'Dělení zlomků' },
      { value: 'zkracovani', label: t('fractions_operation_zkracovani') || 'Krácení zlomků' },
      { value: 'prevod', label: t('fractions_operation_prevod') || 'Převod zlomku na desetinné číslo' },
    ],
  };

  // Update operation when form values change
  const handleFormValuesChange = (values: Record<string, any>) => {
    if (values.operation && values.operation !== operace) {
      setOperace(values.operation);
    }
    // Return empty result to prevent any calculation display
    return { value: null, details: [] };
  };

  // Render the appropriate operation form based on the selected operation
  const renderOperationForm = () => {
    switch (operace) {
      case 'scitani':
        return <FractionAddition />;
      case 'odcitani':
        return <FractionSubtraction />;
      case 'nasobeni':
        return <FractionMultiplication />;
      case 'deleni':
        return <FractionDivision />;
      case 'zkracovani':
        return <FractionSimplification />;
      case 'prevod':
        return <FractionConversion />;
      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            {t('fractions_select_operation') || 'Vyberte operaci se fractions'}
          </div>
        );
    }
  };

  // Since this is a container component, we'll return a simple result
  const calculate = (): CalculatorResult => ({
    value: null,
    details: [],
  });

  return (
    <div>
      <CalculatorBase
        id="fractions"
        title={t('fractions_calculator_title') || 'Kalkulačka zlomků'}
        description={t('fractions_description') || 'Provádějte základní operace se fractions: sčítání, odčítání, násobení, dělení, krácení a převod na desetinná čísla.'}
        category="matematika"
        seo={{
          title: t('fractions_calculator_title') || 'Kalkulačka zlomků | Matematické nástroje',
          description: t('fractions_seo_description') || 
            'Výkonná kalkulačka pro práci se fractions. Sčítání, odčítání, násobení, dělení, krácení a převod zlomků na desetinná čísla.',
          keywords: [
            'fractions', 'kalkulačka', 'matematika', 'sčítání zlomků', 'odčítání zlomků',
            'násobení zlomků', 'dělení zlomků', 'krácení zlomků', 'převod zlomků', 'zlomková kalkulačka'
          ],
        }}
        inputs={[operationInput]}
        calculate={handleFormValuesChange}
        showResult={false}
      />
      <div className="mt-6">
        {renderOperationForm()}
      </div>
    </div>
  );
};

export default ZlomkyCalculator;
