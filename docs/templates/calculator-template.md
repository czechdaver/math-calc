# Calculator Template System

This template system provides everything needed to create new calculators using the **MathCalc Pro Design System**. All templates follow the enhanced UI patterns established by the Homepage and BMI-v3 calculator.

## 🎯 Goals
- **Consistent UX** across all calculators using the enhanced design system
- **Rapid development** with pre-built, tested components
- **Professional quality** with color theming, animations, and accessibility
- **Strong i18n** using `next-intl` with systematic translation keys
- **SEO optimization** with structured data and meta tags
- **Mobile-first** responsive design with touch optimization

## 📚 Available Templates

### 1. **Basic Template** (`CalculatorTemplateComponent.tsx`)
**Use for:** Simple calculators with 2-4 inputs and single result
- Enhanced CalculatorInput components
- Real-time validation and error handling
- Professional result display with CalculatorResult
- Color theming and proper spacing

### 2. **Complex Template** (`ComplexCalculatorTemplate.tsx`) 
**Use for:** Advanced calculators with multiple input types and visualizations
- All shared components (Input, Select, Toggle, Range, Chart)
- Multi-step calculations with sectioned layouts
- Chart visualization with CalculatorChart
- Advanced validation patterns
- Risk assessment and complex business logic

---

## 1. File Structure
Create a new route under `src/app/[locale]/calculator/<slug>/`:

- `src/app/[locale]/calculator/<slug>/page.tsx`
  - Minimal page wrapper
  - Dynamic import of the calculator component with loading and error boundary

Place the calculator component under `src/components/calculators/`:

- `src/components/calculators/<Name>Calculator.tsx`
  - UI + logic using `SimpleCalculatorLayout`

See scaffold in `src/templates/calculator/`.

---

## 2. Page Boilerplate
Use this pattern in `page.tsx`:

```tsx
'use client';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const CalculatorComponent = dynamic(() => import('@/components/calculators/<Name>Calculator'), {
  loading: () => (
    <div className="space-y-4">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  ),
  ssr: false
});

class ErrorBoundary extends React.Component<{ fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { console.error('Calculator error:', error, errorInfo); }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

export default function Page() {
  return (
    <ErrorBoundary fallback={<div className="text-destructive p-4 rounded-lg bg-destructive/10">Failed to load calculator.</div>}>
      <Suspense fallback={
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      }>
        <CalculatorComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

## 3. Enhanced Component Pattern

**Use the enhanced shared components for professional results:**

```tsx
'use client';
import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator, Plus } from 'lucide-react';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { 
  CalculatorInput,
  CalculatorResult,
  CalculatorDisclaimer
} from '@/components/calculators/shared';

export default function <Name>Calculator() {
  const t = useTranslations();
  const [inputs, setInputs] = useState({ a: '10', b: '5' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Enhanced validation
  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    const a = parseFloat(inputs.a.replace(',', '.'));
    const b = parseFloat(inputs.b.replace(',', '.'));
    
    if (!inputs.a || isNaN(a)) newErrors.a = 'Zadejte platnou hodnotu A';
    if (!inputs.b || isNaN(b)) newErrors.b = 'Zadejte platnou hodnotu B';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced calculation with error handling
  const result = useMemo(() => {
    if (!validateInputs()) return null;
    
    const a = parseFloat(inputs.a.replace(',', '.'));
    const b = parseFloat(inputs.b.replace(',', '.'));
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    
    return { sum: a + b, isValid: true };
  }, [inputs]);

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <SimpleCalculatorLayout
      title={t('calculators.<slug>.title')}
      description={t('calculators.<slug>.description')}
      category="mathematics"
      calculatorId="<slug>"
      enhanced={true}
      seo={{
        title: t('calculators.<slug>.seo.title'),
        description: t('calculators.<slug>.seo.description'),
        keywords: t('calculators.<slug>.seo.keywords').split(',').map(s => s.trim()),
      }}
      formula={{
        latex: t('calculators.<slug>.formula.latex'),
        description: t('calculators.<slug>.formula.description'),
      }}
      resultSection={result && (
        <CalculatorResult
          title={t('calculators.<slug>.result.title')}
          value={result.sum.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })}
          description={t('calculators.<slug>.result.description')}
          formula={`${inputs.a} + ${inputs.b} = ${result.sum.toLocaleString('cs-CZ')}`}
        />
      )}
      examples={{
        title: t('calculators.<slug>.examples.title'),
        description: t('calculators.<slug>.examples.description'),
        scenarios: [
          { title: t('calculators.<slug>.examples.s1.title'), description: t('calculators.<slug>.examples.s1.description') },
        ],
      }}
      faq={[
        { question: t('calculators.<slug>.faq.q1.q'), answer: t('calculators.<slug>.faq.q1.a') },
      ]}
      relatedCalculators={[]}
    >
      <div className="space-y-6">
        <div className="calc-form-grid calc-form-grid-2">
          <CalculatorInput
            id="value-a"
            label={t('calculators.<slug>.fields.a')}
            value={inputs.a}
            onChange={(value) => handleInputChange('a', value)}
            placeholder="10"
            helpText={t('calculators.<slug>.help.a')}
            error={errors.a}
            labelIcon={Calculator}
            color="blue"
          />
          
          <CalculatorInput
            id="value-b"
            label={t('calculators.<slug>.fields.b')}
            value={inputs.b}
            onChange={(value) => handleInputChange('b', value)}
            placeholder="5"
            helpText={t('calculators.<slug>.help.b')}
            error={errors.b}
            labelIcon={Plus}
            color="green"
          />
        </div>

        <CalculatorDisclaimer type="info">
          {t('calculators.<slug>.disclaimer')}
        </CalculatorDisclaimer>
      </div>
    </SimpleCalculatorLayout>
  );
}
```

### 🎨 Design System Components

**Available shared components:**
- `CalculatorInput` - Enhanced input with validation, color theming, icons
- `CalculatorSelect` - Dropdown with descriptions and color theming  
- `CalculatorToggle` - Radio buttons with enhanced styling
- `CalculatorRange` - Slider with visual feedback and formatting
- `CalculatorResult` - Professional result display with additional info
- `CalculatorChart` - Data visualization (bar, pie, line charts)
- `CalculatorDisclaimer` - Styled notices (info, warning, legal, help)

**See `/docs/design-system.md` for complete component documentation.**

---

## 4. i18n Keys (src/messages/*.json)
Add keys for `cs` and `en` under `calculators.<slug>`:

```json
{
  "calculators": {
    "<slug>": {
      "title": "My Calculator",
      "description": "Short description of the calculator.",
      "seo": {
        "title": "My Calculator — Title",
        "description": "SEO description.",
        "keywords": "calculator, math, example"
      },
      "fields": {
        "a": "First value",
        "b": "Second value"
      },
      "formula": {
        "latex": "a + b",
        "description": "Sum of two numbers."
      },
      "result": "Result: {value}",
      "examples": {
        "title": "Examples",
        "description": "How to use this calculator.",
        "s1": { "title": "Basic", "description": "Add 2 and 3 to get 5." }
      },
      "faq": {
        "q1": { "q": "What is this?", "a": "An example calculator." }
      }
    }
  }
}
```

---

## 5. Ads via AdSlot
Use the centralized `AdSlot` component for placements:

- Header: `calc-header`
- In content: `calc-in-content`
- Sidebar: `calc-sidebar`
- Sticky bottom (mobile): `calc-sticky-bottom`

These map internally to `AdBanner` placements and support custom `adSlot` IDs.

---

## 6. SEO and Metadata
Populate the `seo` prop (`title`, `description`, `keywords`). For advanced needs, you may also define Next.js route metadata in `generateMetadata`, but prefer the layout props for consistency.

---

## 7. Testing
- Unit test calculation logic separately
- Render test: page renders with i18n
- Edge cases: invalid inputs, empty values

---

## 8. Checklist
- [ ] Files created under `src/app/[locale]/calculator/<slug>/`
- [ ] Component created under `src/components/calculators/`
- [ ] i18n keys added in `src/messages/cs.json` and `src/messages/en.json`
- [ ] Uses `SimpleCalculatorLayout`
- [ ] Accessible inputs/labels
- [ ] Ads via `AdSlot` where appropriate
- [ ] Basic tests added
