import React from 'react';
import { notFound } from 'next/navigation';
import CalculatorLayout from '@/components/layouts/CalculatorLayout';
import { getCalculatorData } from '@/lib/calculatorData'; // Import the data fetching utility
import dynamic from 'next/dynamic'; // Import dynamic for dynamic component loading
import { type CalculatorData } from '@/types/calculator';

interface CalculatorPageProps {
  params: { locale: string; category: string; name: string };
}

// Map calculator names to component paths
const calculatorComponentMap: Record<string, string> = {
  'anuitni-splatka': '@/components/calculators/AnuitniSplatkaCalculator',
  'bmi': '@/components/calculators/BMICalculator',
  'cista-mzda': '@/components/calculators/CistaMzdaCalculator',
  'compound-interest': '@/components/calculators/CompoundInterestCalculator',
  'dph': '@/components/calculators/DPHCalculator',
  'kolik-procent-je-x-z-y': '@/components/calculators/KolikProcentJeXZYCalculator',
  'neprima-umera': '@/components/calculators/NeprimaUmeraCalculator',
  'prima-umera': '@/components/calculators/PrimaUmeraCalculator',
  'procento-z-cisla': '@/components/calculators/ProcentoZCislaCalculator',
  'prevodnik-jednotek': '@/components/calculators/UnitConverter',
  'y-je-x-kolik-je-sto': '@/components/calculators/YJeXKolikJeStoCalculator',
  'zlomky': '@/components/calculators/ZlomkyCalculator',
  // Add mappings for other calculators
};

// Define a type that represents the expected props for any calculator component
// This assumes all calculator components will accept these two props
type CalculatorComponentProps = {
  calculatorData: CalculatorData;
  locale: string;
};

// Define a loading component to show while the calculator component is loading
const Loading = () => <p>Loading calculator...</p>;


const CalculatorPage = async ({ params }: CalculatorPageProps) => {
  const { locale, category, name } = params;

  const calculatorData = await getCalculatorData(locale, name);

  if (!calculatorData) {
    notFound();
  }

  const componentPath = calculatorComponentMap[name];

  if (!componentPath) {
    console.error(`Calculator component not found for: ${name}`);
    notFound();
  }

  // Dynamically import the component, specifying the expected props type
  // and providing a loading component
  const SpecificCalculator = dynamic<CalculatorComponentProps>(
    () => import(componentPath),
    {
      ssr: false, // Ensure client-side rendering
      loading: Loading, // Show the Loading component while importing
    }
  );

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
      {/* Pass the props to the dynamically imported component */}
      <SpecificCalculator calculatorData={calculatorData} locale={locale} />
    </CalculatorLayout>
  );
};

export default CalculatorPage;
