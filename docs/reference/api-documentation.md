---
title: API Documentation
category: Reference
version: 1.3.0
updated: 2025-07-29
---

# API Documentation

**AI Documentation Rule:** This API documentation must be maintained in English and regularly updated.

## Calculator Components API

### Percentage Calculator API

#### Basic Usage
```typescript
import { PercentageCalculator } from '@/components/calculators/PercentageCalculator';

// Component usage
<PercentageCalculator 
  locale="en"
  onCalculate={(result) => console.log(result)}
/>
```

#### Props Interface
```typescript
interface PercentageCalculatorProps {
  locale: string;
  onCalculate?: (result: CalculationResult) => void;
  initialValues?: {
    value?: number;
    percentage?: number;
    calculationType?: 'percentage_of' | 'what_percentage' | 'percentage_to_whole';
  };
}
```

#### Calculation Methods
```typescript
// X% of Y calculation
function calculatePercentageOf(value: number, percentage: number): CalculationResult {
  const result = (value * percentage) / 100;
  
  return {
    result,
    steps: [
      { label: 'Calculation', value: `${value} × ${percentage}%` },
      { label: 'Result', value: result },
    ],
    formula: `\\text{Result} = ${value} \\times \\frac{${percentage}}{100} = ${result}`,
    explanation: 'To calculate percentage of a number, multiply the number by the percentage fraction.'
  };
}
```

#### SEO Metadata
```typescript
export const percentageCalculatorSEO = {
  metadata: {
    title: 'Percentage Calculator | MathCalc Pro',
    description: 'Calculate what percentage a number is of another number. Fast and accurate percentage calculations online.',
    keywords: ['percentage calculator', 'percent calculator', 'what is X percent']
  }
};
```

### BMI Calculator API

#### Component Interface
```typescript
interface BMICalculatorProps {
  locale: string;
  units?: 'metric' | 'imperial';
  onCalculate?: (result: BMIResult) => void;
}

interface BMIResult {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  categoryLabel: string;
  recommendations: string[];
}
```

#### Calculation Method
```typescript
function calculateBMI(weight: number, height: number, units: 'metric' | 'imperial' = 'metric'): BMIResult {
  let bmi: number;
  
  if (units === 'metric') {
    // height in cm, weight in kg
    const heightInMeters = height / 100;
    bmi = weight / (heightInMeters * heightInMeters);
  } else {
    // height in inches, weight in pounds
    bmi = (weight / (height * height)) * 703;
  }
  
  const category = getBMICategory(bmi);
  
  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    categoryLabel: getBMICategoryLabel(category),
    recommendations: getBMIRecommendations(category)
  };
}
```

### Unit Converter API

#### Supported Units
```typescript
interface UnitConversions {
  length: {
    mm: number;
    cm: number;
    m: number;
    km: number;
  };
  weight: {
    g: number;
    kg: number;
    t: number;
  };
  volume: {
    ml: number;
    l: number;
  };
  temperature: {
    celsius: number;
    fahrenheit: number;
    kelvin: number;
  };
}
```

#### Conversion Methods
```typescript
// Length conversions (base unit: meters)
const lengthConversions = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000
};

function convertLength(value: number, fromUnit: string, toUnit: string): number {
  const baseValue = value * lengthConversions[fromUnit];
  return baseValue / lengthConversions[toUnit];
}

// Temperature conversions
function convertTemperature(value: number, fromUnit: string, toUnit: string): number {
  // Convert to Celsius first
  let celsius: number;
  
  switch (fromUnit) {
    case 'fahrenheit':
      celsius = (value - 32) * 5/9;
      break;
    case 'kelvin':
      celsius = value - 273.15;
      break;
    default:
      celsius = value;
  }
  
  // Convert from Celsius to target unit
  switch (toUnit) {
    case 'fahrenheit':
      return celsius * 9/5 + 32;
    case 'kelvin':
      return celsius + 273.15;
    default:
      return celsius;
  }
}
```

### VAT Calculator API

#### Regional Settings
```typescript
interface VATSettings {
  country: 'CZ' | 'SK';
  rate: number;
  currency: string;
}

const vatSettings: Record<string, VATSettings> = {
  CZ: { country: 'CZ', rate: 21, currency: 'CZK' },
  SK: { country: 'SK', rate: 20, currency: 'EUR' }
};
```

#### Calculation Methods
```typescript
function calculateVATFromBase(baseAmount: number, vatRate: number): VATCalculation {
  const vatAmount = baseAmount * (vatRate / 100);
  const totalAmount = baseAmount + vatAmount;
  
  return {
    baseAmount,
    vatAmount,
    totalAmount,
    vatRate,
    steps: [
      { label: 'Base Amount', value: formatCurrency(baseAmount) },
      { label: 'VAT Rate', value: `${vatRate}%` },
      { label: 'VAT Amount', value: formatCurrency(vatAmount) },
      { label: 'Total Amount', value: formatCurrency(totalAmount) }
    ]
  };
}

function calculateVATFromTotal(totalAmount: number, vatRate: number): VATCalculation {
  const baseAmount = totalAmount / (1 + vatRate / 100);
  const vatAmount = totalAmount - baseAmount;
  
  return {
    baseAmount,
    vatAmount,
    totalAmount,
    vatRate,
    steps: [
      { label: 'Total Amount', value: formatCurrency(totalAmount) },
      { label: 'VAT Rate', value: `${vatRate}%` },
      { label: 'Base Amount', value: formatCurrency(baseAmount) },
      { label: 'VAT Amount', value: formatCurrency(vatAmount) }
    ]
  };
}
```

### Net Salary Calculator API

#### Country-Specific Tax Systems
```typescript
interface TaxSystem {
  country: 'CZ' | 'SK';
  socialInsurance: number;
  healthInsurance: number;
  taxBrackets: TaxBracket[];
  currency: string;
}

interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

const taxSystems: Record<string, TaxSystem> = {
  CZ: {
    country: 'CZ',
    socialInsurance: 6.5,
    healthInsurance: 4.5,
    taxBrackets: [
      { min: 0, max: 48840, rate: 15 },
      { min: 48840, max: null, rate: 23 }
    ],
    currency: 'CZK'
  },
  SK: {
    country: 'SK',
    socialInsurance: 9.4,
    healthInsurance: 4.0,
    taxBrackets: [
      { min: 0, max: 37163, rate: 19 },
      { min: 37163, max: null, rate: 25 }
    ],
    currency: 'EUR'
  }
};
```

## Common Interfaces

### Calculation Result
```typescript
interface CalculationResult {
  result: number | string;
  steps: CalculationStep[];
  formula?: string;
  explanation?: string;
  metadata?: {
    calculationType: string;
    timestamp: Date;
    locale: string;
  };
}

interface CalculationStep {
  label: string;
  value: string | number;
  description?: string;
}
```

### Error Handling
```typescript
interface CalculationError {
  code: string;
  message: string;
  field?: string;
  suggestions?: string[];
}

// Common error types
const ErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  DIVISION_BY_ZERO: 'DIVISION_BY_ZERO',
  OUT_OF_RANGE: 'OUT_OF_RANGE',
  UNSUPPORTED_OPERATION: 'UNSUPPORTED_OPERATION'
} as const;
```

### Internationalization
```typescript
interface CalculatorMessages {
  title: string;
  description: string;
  labels: Record<string, string>;
  errors: Record<string, string>;
  placeholders: Record<string, string>;
  results: Record<string, string>;
}

// Usage with next-intl
import { useTranslations } from 'next-intl';

function CalculatorComponent() {
  const t = useTranslations('calculators.percentage');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

## Validation Rules

### Input Validation
```typescript
interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  type: 'number' | 'string' | 'email';
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

const validationRules: Record<string, ValidationRule> = {
  percentage: {
    required: true,
    type: 'number',
    min: 0,
    max: 100000
  },
  weight: {
    required: true,
    type: 'number',
    min: 0.1,
    max: 1000
  },
  height: {
    required: true,
    type: 'number',
    min: 1,
    max: 300
  }
};
```

## Performance Optimization

### Memoization
```typescript
import { useMemo } from 'react';

function OptimizedCalculator({ inputs }) {
  const result = useMemo(() => {
    return performExpensiveCalculation(inputs);
  }, [inputs]);
  
  return <div>{result}</div>;
}
```

### Debounced Calculations
```typescript
import { useDebounce } from '@/hooks/useDebounce';

function RealTimeCalculator() {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 300);
  
  useEffect(() => {
    if (debouncedInput) {
      performCalculation(debouncedInput);
    }
  }, [debouncedInput]);
}
```

## Testing

### Unit Tests
```typescript
import { calculatePercentageOf } from '@/lib/calculators/percentage';

describe('Percentage Calculator', () => {
  test('calculates 20% of 100 correctly', () => {
    const result = calculatePercentageOf(100, 20);
    expect(result.result).toBe(20);
  });
  
  test('handles edge cases', () => {
    expect(() => calculatePercentageOf(0, 50)).not.toThrow();
    expect(calculatePercentageOf(0, 50).result).toBe(0);
  });
});
```

### Integration Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PercentageCalculator } from '@/components/calculators/PercentageCalculator';

test('calculator updates result on input change', async () => {
  render(<PercentageCalculator locale="en" />);
  
  const valueInput = screen.getByLabelText(/value/i);
  const percentageInput = screen.getByLabelText(/percentage/i);
  
  fireEvent.change(valueInput, { target: { value: '100' } });
  fireEvent.change(percentageInput, { target: { value: '20' } });
  
  expect(screen.getByText('20')).toBeInTheDocument();
});
```

## AI Development Guidelines

### Code Generation Rules
1. **Always use TypeScript** for type safety
2. **Implement proper error handling** for all calculations
3. **Add JSDoc comments** for public methods
4. **Use consistent naming conventions** across all calculators
5. **Include validation** for all user inputs
6. **Provide clear error messages** in the user's language
7. **Optimize for performance** with memoization and debouncing
8. **Write comprehensive tests** for all calculation logic

### Documentation Requirements
- All public APIs must have TypeScript interfaces
- Include usage examples for each component
- Document error handling and edge cases
- Provide internationalization examples
- Include performance optimization notes

---

**API Status:** ✅ All MVP calculators have defined APIs, TypeScript interfaces, and validation rules

**Next Steps:** Implement remaining calculator APIs, add comprehensive error handling, optimize performance
