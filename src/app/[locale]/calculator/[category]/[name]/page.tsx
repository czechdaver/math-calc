import React from 'react';
import { notFound } from 'next/navigation';
import { useTranslation } from 'react-i18next'; // Assuming you still need useTranslation for client components within the layout
import CalculatorLayout from '@/components/layouts/CalculatorLayout';
import { getCalculatorData } from '@/lib/calculatorData'; // Import the data fetching utility
import dynamic from 'next/dynamic'; // Import dynamic for dynamic component loading
import { type CalculatorData } from '@/types/calculator';

interface CalculatorPageProps {
  params: { locale: string; category: string; name: string };
}

// Map calculator names to component paths
// This mapping should ideally be more dynamic, maybe generated from your data files
const calculatorComponentMap: Record<string, string> = {
  'bmi': '@/components/calculators/BMICalculator',
  'cista-mzda': '@/components/calculators/CistaMzdaCalculator',
  'dph': '@/components/calculators/DPHCalculator',
  // Add mappings for all your calculators
};

const CalculatorPage = async ({ params }: CalculatorPageProps) => {
  const { locale, category, name } = params;

  // Fetch calculator data based on locale and name (as calculatorId)
  const calculatorData = await getCalculatorData(locale, name);

  // Handle case where calculator data is not found
  if (!calculatorData) {
    notFound();
  }

  // Dynamically import the calculator component
  const componentPath = calculatorComponentMap[name];

  if (!componentPath) {
    // Handle case where component is not found for the given name
    console.error(`Calculator component not found for: ${name}`);
    notFound(); // Or render a specific error component
  }

  const SpecificCalculator = dynamic(() => import(componentPath));

  // You might still need useTranslation if your calculator components use it
  // const { t } = useTranslation(locale, 'common'); 

  return (
    <CalculatorLayout
      title={calculatorData.name}
      category={calculatorData.category}
      formula={calculatorData.formula}
      explanation={calculatorData.explanation}
      examples={calculatorData.examples}
      relatedCalculators={calculatorData.relatedCalculators}
      faq={calculatorData.faq}
    >
      {/* Render the dynamically imported component */}
      <SpecificCalculator />
    </CalculatorLayout>
  );
};

export default CalculatorPage;
