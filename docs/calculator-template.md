# Calculator Template

This guide shows how to create a new calculator following the MathCalc Pro architecture. The BMI Calculator v2 (`bmi-new`) is the reference implementation.

## Prerequisites

- Read [Architecture](architecture.md) for project structure overview
- Understand [SimpleCalculatorLayout](../design/calculator-layout.md) specification
- Have your calculator logic and formulas ready

## Step 1: Page Wrapper

Create the page wrapper at `src/app/[locale]/calculator/{category}/{name}/page.tsx`:

```tsx
'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic import with SSR disabled for calculators
const MyCalculator = dynamic(
  () => import('@/components/calculators/MyCalculator'),
  {
    loading: () => (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    ),
    ssr: false  // Important: Calculators run client-side only
  }
);

// Error Boundary
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MyCalculator error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const MyCalculatorPage: React.FC = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Chyba při načítání kalkulátoru
            </h1>
            <p className="text-gray-600">
              Omlouváme se, došlo k chybě. Zkuste prosím obnovit stránku.
            </p>
          </div>
        </div>
      }
    >
      <Suspense fallback={
        <div className="space-y-4 p-6">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      }>
        <MyCalculator />
      </Suspense>
    </ErrorBoundary>
  );
};

export default MyCalculatorPage;
```

**Key Points:**
- `'use client'` directive at the top
- Dynamic import with `ssr: false` (calculators are client-side only)
- ErrorBoundary for graceful error handling
- Suspense with Skeleton loading state

## Step 2: Calculator Component

Create the calculator component at `src/components/calculators/MyCalculator.tsx`:

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput, CalculatorResult } from './shared';
import { getRelatedCalculators } from '@/lib/calculatorDataUtils';

// Define result interface
interface MyResult {
  value: number;
  category: string;
  isValid: boolean;
}

const MyCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  // State for inputs (strings for form control)
  const [input1, setInput1] = useState<string>('');
  const [input2, setInput2] = useState<string>('');

  // State for validation errors
  const [errors, setErrors] = useState<{ input1?: string; input2?: string }>({});

  // State for calculation result
  const [result, setResult] = useState<MyResult | null>(null);

  // Validation function
  const validateInputs = (val1: string, val2: string): boolean => {
    const newErrors: { input1?: string; input2?: string } = {};

    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);

    if (!val1 || isNaN(num1) || num1 < min || num1 > max) {
      newErrors.input1 = t('input1_validation_error');
    }
    // ... more validation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Core calculation logic
  const calculate = (val1: number, val2: number): MyResult => {
    // Your calculation here
    const value = val1 * val2; // example
    let category = '';

    if (value < x) {
      category = t('category_low');
    } else if (value < y) {
      category = t('category_medium');
    } else {
      category = t('category_high');
    }

    return {
      value,
      category,
      isValid: true
    };
  };

  // Real-time calculation on input change
  useEffect(() => {
    if (validateInputs(input1, input2)) {
      const num1 = parseFloat(input1);
      const num2 = parseFloat(input2);
      const calculatedResult = calculate(num1, num2);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [input1, input2]);

  // Get related calculators from centralized data
  const relatedCalculators = getRelatedCalculators('my-calculator-id', locale, t);

  // Examples section content
  const examples = {
    title: t('my_calculator_examples_title'),
    description: t('my_calculator_examples_description'),
    scenarios: [
      {
        title: t('my_example_1_title'),
        description: t('my_example_1_description'),
        example: t('my_example_1_calculation')
      }
    ]
  };

  // FAQ section content
  const faq = [
    {
      question: t('my_faq_1_question'),
      answer: t('my_faq_1_answer')
    }
  ];

  // Render using SimpleCalculatorLayout
  return (
    <SimpleCalculatorLayout
      title={t('my_calculator_title')}
      description={t('my_calculator_description')}
      category="Category Name"
      calculatorId="my-calculator-id"
      seo={{
        title: t('my_calculator_seo_title'),
        description: t('my_calculator_seo_description'),
        keywords: ['keyword1', 'keyword2']
      }}
      formula={{
        latex: String.raw`a = b \times c`, // LaTeX formula
        description: t('my_formula_description')
      }}
      resultSection={
        result && result.isValid && (
          <>
            <CalculatorResult
              label={t('result_label')}
              value={result.value}
              unit="unit"
            />
            <p className="text-gray-600 mt-2">
              {t('result_description')}: <strong>{result.category}</strong>
            </p>
          </>
        )
      }
      examples={examples}
      faq={faq}
      relatedCalculators={relatedCalculators}
      schemaData={{
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any"
      }}
    >
      {/* Calculator form inputs */}
      <div className="space-y-6">
        <CalculatorInput
          id="input1"
          label={t('input1_label')}
          value={input1}
          onChange={setInput1}
          placeholder="0"
          min="0"
          max="100"
          unit="unit"
          helpText={t('input1_help')}
          error={errors.input1}
        />
        <CalculatorInput
          id="input2"
          label={t('input2_label')}
          value={input2}
          onChange={setInput2}
          placeholder="0"
          min="0"
          max="100"
          unit="unit"
          helpText={t('input2_help')}
          error={errors.input2}
        />
      </div>
    </SimpleCalculatorLayout>
  );
};

export default MyCalculator;
```

## Step 3: Translations

Add translations to `src/messages/cs.json` and `src/messages/en.json`:

```json
{
  "my_calculator_title": "Můj Kalkulátor",
  "my_calculator_description": "Popis kalkulátoru pro SEO",

  "input1_label": "První vstup",
  "input1_help": "Nápověda pro první vstup",
  "input1_validation_error": "Prosím zadejte platnou hodnotu (0-100)",

  "input2_label": "Druhý vstup",
  "input2_help": "Nápověda pro druhý vstup",
  "input2_validation_error": "Prosím zadejte platnou hodnotu (0-100)",

  "result_label": "Výsledek",
  "result_description": "Kategorie",

  "category_low": "Nízká",
  "category_medium": "Střední",
  "category_high": "Vysoká",

  "my_formula_description": "Vzorec pro výpočet",

  "my_calculator_examples_title": "Příklady použití",
  "my_calculator_examples_description": "Zde jsou příklady, jak kalkulátor používat:",

  "my_example_1_title": "Základní příklad",
  "my_example_1_description": "Pokud zadáte 10 a 20, výsledek bude 200.",
  "my_example_1_calculation": "10 × 20 = 200",

  "my_faq_1_question": "Jak se kalkulátor používá?",
  "my_faq_1_answer": "Jednoduše zadáte hodnoty a kalkulátor okamžitě zobrazí výsledek.",

  "my_calculator_seo_title": "Můj Kalkulátor - Online výpočet",
  "my_calculator_seo_description": "Vypočítejte cokoliv chcete s naším online kalkulátorem"
}
```

## Step 4: Data Configuration

Add your calculator to the centralized data files:

### src/data/calculators.json

```json
{
  "calculators": {
    "my-calculator-id": {
      "id": "my-calculator-id",
      "slug": "my-calculator",
      "category": "category-slug",
      "popularity": 80,
      "titleKey": "my_calculator_title",
      "descriptionKey": "my_calculator_description",
      "path": "/calculator/category/my-calculator",
      "tags": ["tag1", "tag2", "category-slug"],
      "relatedCategories": ["category-slug", "related-category"]
    }
  }
}
```

### src/data/calculator-relationships.json

```json
{
  "relationships": {
    "my-calculator-id": {
      "related": ["related-calc-1", "related-calc-2", "related-calc-3"],
      "maxCount": 3,
      "priorityOrder": ["related-calc-1", "related-calc-2", "related-calc-3"]
    }
  }
}
```

## Step 5: Testing

Create tests at `src/components/calculators/__tests__/MyCalculator.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import MyCalculator from '@/components/calculators/MyCalculator';

describe('MyCalculator', () => {
  it('renders without errors', () => {
    render(<MyCalculator />);
    expect(screen.getByText('První vstup')).toBeInTheDocument();
  });

  it('validates input ranges', () => {
    render(<MyCalculator />);
    const input = screen.getByLabelText('První vstup');

    fireEvent.change(input, { target: { value: '150' } });
    expect(screen.queryByText('Prosím zadejte platnou hodnotu')).toBeInTheDocument();
  });

  it('calculates correctly', () => {
    render(<MyCalculator />);
    const input1 = screen.getByLabelText('První vstup');
    const input2 = screen.getByLabelText('Druhý vstup');

    fireEvent.change(input1, { target: { value: '10' } });
    fireEvent.change(input2, { target: { value: '20' } });

    expect(screen.getByText('200')).toBeInTheDocument();
  });
});
```

Run tests:
```bash
npm test -- MyCalculator
```

## Quality Checklist

Before considering a calculator complete, verify:

- [ ] **Page wrapper** created with ErrorBoundary + Suspense
- [ ] **Calculator component** uses SimpleCalculatorLayout
- [ ] **Shared components** used (CalculatorInput, CalculatorResult)
- [ ] **Real-time calculation** (no submit button)
- [ ] **Input validation** with error messages
- [ ] **Result display** with proper formatting
- [ ] **LaTeX formula** displayed
- [ ] **Examples section** with at least 2 scenarios
- [ ] **FAQ section** with at least 2 questions
- [ ] **Related calculators** via getRelatedCalculators()
- [ ] **Translations** in both cs.json and en.json
- [ ] **Data entries** in calculators.json and relationships.json
- [ ] **SEO metadata** (title, description, keywords)
- [ ] **Schema.org** structured data
- [ ] **Responsive** on mobile (test at 375px width)
- [ ] **Dark mode** compatible
- [ ] **Tests written** and passing
- [ ] **No duplicate files** (no -new, -old suffixes)
- [ ] **Component under 250 lines** (extract logic if longer)

## Common Patterns

### Handling Multiple Values

If your calculator has multiple related values, use an object for state:

```tsx
interface Values {
  input1: number;
  input2: number;
  option: 'a' | 'b' | 'c';
}

const [values, setValues] = useState<Values>({
  input1: 0,
  input2: 0,
  option: 'a'
});
```

### Select Dropdowns

Use CalculatorSelect for dropdowns:

```tsx
import { CalculatorSelect } from './shared';

<CalculatorSelect
  id="option"
  label={t('option_label')}
  value={option}
  onChange={setOption}
  options={[
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' }
  ]}
/>
```

### Unit Conversion

For unit converters, map units to conversion factors:

```tsx
const UNITS = {
  km: { factor: 1, symbol: 'km' },
  mi: { factor: 0.621371, symbol: 'mi' },
  // ...
};

const convert = (value: number, from: string, to: string): number => {
  return value * UNITS[to].factor / UNITS[from].factor;
};
```

---

For reference implementation, see `src/components/calculators/BMICalculator.tsx`.
For layout details, see [Calculator Layout Specification](design/calculator-layout.md).
