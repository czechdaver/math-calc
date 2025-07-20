// src/lib/calculatorData.ts

import { CalculatorData } from '@/types/calculator';

export async function getCalculatorData(
  locale: string,
  calculatorId: string
): Promise<CalculatorData | null> {
  try {
    // Dynamically import the JSON file based on locale and calculatorId
    const data = await import(`@/data/calculators/${locale}/${calculatorId}.json`);
    return data.default as CalculatorData; // Assuming the JSON structure matches CalculatorData
  } catch (error) {
    console.error(
      `Error fetching calculator data for ${locale}/${calculatorId}:`,
      error
    );
    return null;
  }
}
