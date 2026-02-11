# Architecture

This document describes the architecture of MathCalc Pro, a Next.js-based multi-language calculator application.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                            MathCalc Pro Architecture                               │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌─────────────┐   │
│  │   Next.js  │    │ Middleware  │    │   App      │    │  Build &    │   │
│  │   App Router │◄──►│ (next-intl) │◄──►│ Router     │◄──►│  Deploy      │   │
│  │            │    │            │    │ (Dynamic)  │    │  (Vercel)   │   │
│  └────────────┘    └────────────┘    └────────────┘    └─────────────┘   │
│         │                                    │                    │                   │
│         ▼                                    ▼                    ▼                   │
│  ┌────────────────────────────────────────────────────────────────────────────────┐      │
│  │                     Server-Side Rendering                          │      │
│  │  - Static Generation (build time)                                    │      │
│  │  - Dynamic Rendering (request time)                                 │      │
│  │  - Locale-based routing                                            │      │
│  └────────────────────────────────────────────────────────────────────────────────┘      │
│         │                                                                  │
│         ▼                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────────┐      │
│  │                       Client-Side Components                       │      │
│  │  - React Components (Client Components with 'use client')            │      │
│  │  - Real-time Calculations (useState + useEffect)                   │      │
│  │  - State Management (Local per component)                           │      │
│  │  - Theme Switching (next-themes)                                     │      │
│  └────────────────────────────────────────────────────────────────────────────────┘      │
│         │                                                                  │
│         ▼                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────────┐      │
│  │                       Data Layer                                    │      │
│  │  - JSON: Calculator Metadata, Relationships, Categories              │      │
│  │  - Translations: cs.json, en.json, sk.json, pl.json, hu.json      │      │
│  │  - Utilities: getRelatedCalculators(), getCalculatorCategories()        │      │
│  └────────────────────────────────────────────────────────────────────────────────┘      │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
mathcalc-pro/
├── src/
│   ├── app/                          # Next.js 14+ App Router
│   │   ├── [locale]/              # Dynamic locale routing (cs, en, sk, pl, hu)
│   │   │   ├── calculator/        # All calculator routes
│   │   │   │   ├── bmi-new/    # BMI Calculator (reference implementation)
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── dph/
│   │   │   │   ├── procenta/
│   │   │   │   ├── fitness-a-zdravi/
│   │   │   │   ├── financie-rozsirene/
│   │   │   │   ├── prakticke-vypocty/
│   │   │   │   ├── stavebni/
│   │   │   │   ├── trojclenka/
│   │   │   │   ├── zlomky/
│   │   │   │   ├── cista-mzda/
│   │   │   │   ├── prevodnik-jednotek/
│   │   │   │   └── currency/
│   │   │   ├── layout.tsx       # Locale-specific layout wrapper
│   │   │   └── page.tsx        # Homepage
│   │   ├── api/                 # API routes (ratings, etc.)
│   │   ├── layout.tsx           # Root layout with providers
│   │   └── globals.css          # Global styles
│   │
│   ├── components/                 # All React components
│   │   ├── calculators/           # Calculator components (43 total)
│   │   │   ├── shared/        # Reusable calculator components
│   │   │   │   ├── CalculatorInput.tsx      # Input field with validation
│   │   │   │   ├── CalculatorResult.tsx     # Result display
│   │   │   │   ├── CalculatorRating.tsx     # Star rating
│   │   │   │   └── CalculatorSelect.tsx      # Dropdown select
│   │   │   ├── fractionOperations/    # Fraction-specific calculators
│   │   │   └── unitConverters/        # Unit conversion components
│   │   ├── layout/                # Layout components
│   │   │   └── SimpleCalculatorLayout.tsx  # Main calculator layout
│   │   ├── ui/                    # shadcn/ui components (24 components)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ... (Accordion, Tabs, Toast, etc.)
│   │   ├── ads/                   # Ad placeholders and components
│   │   ├── analytics/             # Google Analytics integration
│   │   ├── navigation/            # Navigation, header, footer
│   │   ├── seo/                   # SEO components (Meta, OpenGraph)
│   │   └── theme/                 # Theme provider
│   │
│   ├── config/                    # Configuration files
│   │   └── site.ts                # Site metadata, navigation, social links
│   ├── context/                   # React contexts
│   │   └── ThemeContext.tsx       # Theme management
│   ├── data/                      # Static data
│   │   ├── calculators.json         # Calculator metadata
│   │   ├── calculator-relationships.json  # Related calculator mappings
│   │   └── calculator-categories.json   # Category definitions
│   ├── hooks/                     # Custom React hooks
│   ├── i18n/                      # Internationalization setup
│   │   ├── index.ts               # Locale definitions (5 locales)
│   │   ├── settings.ts            # Locale validation (incomplete)
│   │   └── utils.ts               # Locale utilities
│   ├── lib/                       # Utility functions
│   │   └── calculatorDataUtils.ts  # Data access functions
│   ├── messages/                  # Translation files (next-intl)
│   │   ├── cs.json               # Czech (850 lines, complete)
│   │   ├── en.json               # English (839 lines, complete)
│   │   └── [sk, pl, hu]/       # Incomplete translations
│   ├── styles/                    # Global styles
│   │   └── globals.css            # Tailwind + custom CSS
│   └── types/                     # TypeScript type definitions
│
├── public/                         # Static assets
│   ├── locales/                 # Legacy translation location (common.json only)
│   └── images/
│
├── docs/                          # Documentation
├── middleware.ts                   # Locale detection routing
├── next.config.js                 # Next.js configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                    # Dependencies and scripts
```

## Data Flow in a Calculator

```
User Input (onChange)
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│                 useState Hook                        │
│  - height: string                                    │
│  - weight: string                                   │
│  - result: TResult | null                            │
│  - errors: { field?: string }                        │
└─────────────────────────────────────────────────────────────┘
        │
        │ useEffect (triggers on input change)
        ▼
┌─────────────────────────────────────────────────────────────┐
│              Validation Logic                        │
│  - Parse string → number                             │
│  - Check ranges (min/max)                             │
│  - Set errors if invalid                           │
└─────────────────────────────────────────────────────────────┘
        │
        │ (if valid)
        ▼
┌─────────────────────────────────────────────────────────────┐
│              Calculation Function                   │
│  - Apply mathematical formula                        │
│  - Determine category/value                             │
│  - Return typed result                              │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│              Result Display                     │
│  - CalculatorResult component                        │
│  - Conditional rendering based on result                    │
│  - Color-coded categories                              │
└─────────────────────────────────────────────────────────────┘
```

## Shared Components

### CalculatorInput

Reusable input component with built-in validation support:

```tsx
<CalculatorInput
  id="height"
  label={t('height_label')}
  value={height}
  onChange={setHeight}
  placeholder="170"
  min="50"
  max="300"
  unit="cm"
  helpText={t('height_help')}
  error={errors.height}
/>
```

**Features:**
- Automatic error display
- Unit label
- Help text
- Min/max validation hints
- Styled with Tailwind CSS

### CalculatorResult

Reusable result display component:

```tsx
<CalculatorResult
  label={t('bmi_result_label')}
  value={result?.bmi.toFixed(1)}
  unit="kg/m²"
  color={result?.categoryColor}
/>
```

**Features:**
- Automatic formatting
- Unit display
- Color coding
- Null-safe rendering

### CalculatorRating

Star rating component with localStorage persistence:

```tsx
<CalculatorRating calculatorId="bmi" />
```

**Features:**
- 1-5 star rating
- Anti-abuse (one vote per calculator)
- localStorage persistence
- Aggregate rating display

### SimpleCalculatorLayout

Main layout wrapper for all calculators. Provides:

1. **SEO**: Meta tags, structured data (Schema.org)
2. **Navigation**: Breadcrumbs, back to home
3. **Formula Display**: LaTeX rendering with KaTeX
4. **Content Sections**:
   - Calculator form (children)
   - Results section
   - Examples with scenarios
   - FAQ accordion
   - Related calculators
5. **Sidebar**: Quick links, categories
6. **Ads**: Header, in-content, sidebar, sticky footer
7. **Adblock Detection**: Modal for adblock users

## Data Management

### Centralized Calculator Data

Located in `src/data/`:

**calculators.json**
```json
{
  "calculators": {
    "bmi": {
      "id": "bmi",
      "slug": "bmi",
      "category": "health",
      "popularity": 95,
      "titleKey": "bmi_calculator_title",
      "descriptionKey": "bmi_calculator_description",
      "path": "/calculator/bmi-new",
      "tags": ["health", "fitness", "weight", "body"],
      "relatedCategories": ["health", "fitness"]
    }
  }
}
```

**calculator-relationships.json**
```json
{
  "relationships": {
    "bmi": {
      "related": ["bmr", "ideal-weight", "body-fat"],
      "maxCount": 3,
      "priorityOrder": ["bmr", "ideal-weight", "body-fat"]
    }
  },
  "fallbackStrategy": {
    "sameCategory": true,
    "popularityThreshold": 70,
    "maxFallbackCount": 2
  }
}
```

**calculator-categories.json**
```json
{
  "categories": {
    "health": {
      "id": "health",
      "titleKey": "category_health_title",
      "descriptionKey": "category_health_description",
      "icon": "Heart",
      "color": "text-red-600",
      "bgColor": "bg-red-50",
      "calculators": ["bmi", "bmr", "ideal-weight"],
      "priority": 1
    }
  },
  "quickLinks": {
    "popular": {
      "calculators": ["bmi", "dph", "unit-converter"],
      "maxCount": 5
    }
  }
}
```

### Utility Functions

`src/lib/calculatorDataUtils.ts` exports:

| Function | Purpose |
|---|---|
| `getCalculator(id)` | Get calculator metadata by ID |
| `getRelatedCalculators(id, locale, t)` | Get related calculators with fallback |
| `getCalculatorCategories(locale, t)` | Get all categories with counts |
| `getQuickLinks(type, locale, t)` | Get popular/recent calculators |
| `searchCalculators(query, locale, t)` | Search calculators by query |

## Internationalization (i18n)

### Supported Languages

| Code | Language | Status |
|---|---|---|
| `cs` | Czech | ✅ Complete (850 lines) |
| `en` | English | ✅ Complete (839 lines) |
| `sk` | Slovak | ⚠️ Partial (common.json only) |
| `pl` | Polish | ⚠️ Partial (common.json only) |
| `hu` | Hungarian | ⚠️ Partial (common.json only) |

### Translation Structure

```
src/messages/                    # Primary location (next-intl)
├── cs.json                      # Czech - Complete
├── en.json                      # English - Complete
└── [sk, pl, hu]/             # To be completed

public/locales/                  # Legacy location (fallback)
├── cs/common.json
├── en/common.json
└── [sk, pl, hu]/common.json
```

### Usage in Components

```tsx
import { useTranslations } from 'next-intl';

function MyCalculator() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t('bmi_calculator_title')}</h1>
      <p>{t('bmi_calculator_description')}</p>
    </div>
  );
}
```

## Routing

### Locale Routing

Middleware (`src/middleware.ts`) handles:

1. **Locale Detection**: From Accept-Language header or URL prefix
2. **Redirect Handling**: Redirect `/path` to `/cs/path`
3. **Prefix Validation**: Only allow configured locales

```
URL Pattern: /{locale}/calculator/{category}/{name}
Example:    /cs/calculator/fitness-a-zdravi/kalkulacka-2/
Fallback:   /calculator/... → /cs/calculator/...
```

### Page Wrapper Pattern

Every calculator page follows this pattern:

```tsx
// src/app/[locale]/calculator/{name}/page.tsx
'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Calculator = dynamic(
  () => import('@/components/calculators/MyCalculator'),
  { ssr: false }  // Client-side only for calculators
);

export default function CalculatorPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Skeleton />}>
        <Calculator />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## Build Process

```bash
npm run build
│
├── Next.js compilation
│   ├── App Router optimization
│   ├── Static page generation
│   ├── Image optimization
│   └── Bundle splitting
│
├── next-intl message extraction
│
└── Output: .next/ directory
```

### Production Deployment

```bash
# Vercel (recommended)
vercel --prod

# Or manual
npm run build
npm start
```

## Performance Optimizations

1. **Code Splitting**: Dynamic imports for calculators
2. **Lazy Loading**: Suspense with skeleton fallbacks
3. **SSR Disabled**: Calculators render client-side only (`ssr: false`)
4. **Image Optimization**: Next.js Image component with blur placeholders
5. **Bundle Size**: Tailwind CSS purges unused styles

## Security Considerations

1. **Input Validation**: All calculator inputs validate min/max ranges
2. **XSS Protection**: React's built-in escaping
3. **CSP Headers**: Content-Security-Policy (configure in deployment)
4. **Rate Limiting**: Consider for API routes (ratings)

---

For implementation details, see [Calculator Template](calculator-template.md).
For refactoring status, see [Refactoring Guide](refactoring-guide.md).
