# API Documentation for Calculator Components

## Overview
This document outlines the API specifications for calculator components in the MathCalc Pro application. All calculator components should follow these guidelines to ensure consistency and maintainability.

## Base Calculator Component

### Props

```typescript
interface CalculatorBaseProps {
  // Unique identifier for the calculator
  id: string;
  
  // Calculator title (for display)
  title: string;
  
  // Calculator description (optional)
  description?: string;
  
  // Category for organization
  category: string;
  
  // SEO metadata
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  
  // Input fields configuration
  inputs: CalculatorInput[];
  
  // Calculation function
  calculate: (inputs: Record<string, any>) => CalculatorResult;
  
  // Optional: Custom component for rendering the result
  resultComponent?: React.ComponentType<{ result: CalculatorResult }>;
}

interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'select' | 'radio' | 'checkbox';
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  placeholder?: string;
  helpText?: string;
  unit?: string;
  defaultValue?: any;
}

interface CalculatorResult {
  // Main result value
  value: any;
  
  // Additional result details
  details?: {
    label: string;
    value: any;
    unit?: string;
  }[];
  
  // Optional: Formatted result as LaTeX for display
  formula?: string;
  
  // Optional: Explanation of the calculation
  explanation?: string;
}
```

## Example Implementation: Percentage Calculator

```typescript
import { CalculatorBase } from '@/components/calculators/CalculatorBase';

const PercentageCalculator = () => {
  const inputs: CalculatorInput[] = [
    {
      id: 'value',
      label: 'Hodnota',
      type: 'number',
      required: true,
      step: 'any',
      placeholder: 'Zadejte hodnotu',
    },
    {
      id: 'percentage',
      label: 'Procento',
      type: 'number',
      required: true,
      step: 'any',
      placeholder: 'Zadejte procento',
      unit: '%',
    },
  ];

  const calculate = (inputs: Record<string, any>) => {
    const value = parseFloat(inputs.value);
    const percentage = parseFloat(inputs.percentage);
    const result = (value * percentage) / 100;
    
    return {
      value: result,
      details: [
        { label: 'Výpočet', value: `${value} × ${percentage}%` },
        { label: 'Výsledek', value: result },
      ],
      formula: `\\text{Výsledek} = ${value} \\times \\frac{${percentage}}{100} = ${result}`,
      explanation: 'Pro výpočet procent z čísla vynásobte číslo zlomkem procenta ku stu.'
    };
  };

  return (
    <CalculatorBase
      id="percentage-calculator"
      title="Výpočet procent z čísla"
      description="Spočítejte X procent z daného čísla"
      category="matematika"
      seo={{
        title: 'Výpočet procent z čísla | MathCalc Pro',
        description: 'Spočítejte si kolik je X procent z daného čísla. Rychlý a přesný výpočet procent online.',
        keywords: ['výpočet procent', 'procenta kalkulačka', 'kolik je X procent']
      }}
      inputs={inputs}
      calculate={calculate}
    />
  );
};

export default PercentageCalculator;
```

## Error Handling

All calculator components should handle errors gracefully:

1. **Input Validation**: Validate all inputs before calculation
2. **Error Messages**: Provide clear, user-friendly error messages
3. **Error Boundaries**: Wrap calculator components in error boundaries
4. **Logging**: Log errors to your error tracking service

## Performance Considerations

1. **Memoization**: Use `React.memo` for calculator components
2. **Debouncing**: Implement debouncing for input changes
3. **Lazy Loading**: Lazy load calculator components
4. **Web Workers**: Consider using Web Workers for complex calculations

## Testing Guidelines

Each calculator should include:

1. Unit tests for calculation logic
2. Component tests for rendering
3. Integration tests for user flows
4. Edge case testing

## Localization

All user-facing strings should be localized using the application's i18n system. Use translation keys for all text content.

## Accessibility

1. Use proper ARIA labels
2. Ensure keyboard navigation works
3. Provide sufficient color contrast
4. Include proper form labels and error messages
