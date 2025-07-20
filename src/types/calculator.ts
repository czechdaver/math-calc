// src/types/calculator.ts

export interface CalculatorData {
  id: string;
  name: string;
  category: string;
  formula?: string;
  explanation?: string;
  examples?: string[];
  relatedCalculators?: { name: string; url: string }[];
  faq?: { question: string; answer: string }[];
  // Add other fields as needed, e.g., inputs, output format, etc.
}

// You might also want interfaces for inputs and outputs if they are complex
// export interface CalculatorInput {
//   id: string;
//   label: string;
//   type: string; // e.g., 'number', 'text', 'select'
//   unit?: string;
// }

// export interface CalculatorOutput {
//   id: string;
//   label: string;
//   unit?: string;
//   format?: string; // e.g., 'number', 'currency', 'percentage'
// }
