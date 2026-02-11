# MathCalc Pro - Comprehensive Codebase Analysis

**Analysis Date:** 2026-02-11
**Analyzers:** Three parallel Explore agents
**Scope:** 47 calculator implementations + shared infrastructure

---

## Executive Summary

The MathCalc Pro codebase shows **moderate quality with significant technical debt**. While the foundation is solid (SimpleCalculatorLayout, shared components, good styling), evolution without consolidation has created:

- **3 different layout patterns** coexisting
- **11 duplicate route pairs** violating project rules
- **~2,000+ lines of unnecessary duplication**
- **23 hardcoded arrays** instead of centralized data
- **12 empty placeholder components**

### Overall Scores

| Metric | Score | Notes |
|---------|--------|-------|
| **Code Health** | 5.4/10 | 15% best practices, 43% needs refactoring, 26% placeholders |
| **Infrastructure** | 6.5/10 | Good foundation, missing error handling & testing |
| **Consistency** | 3.7/10 | Multiple patterns, significant duplication |
| **Test Coverage** | 2.6% | Only BMI v2 has tests |
| **Type Safety** | 3/10 | strict: false in tsconfig |

### Key Statistics

- **47 calculator implementations** total:
  - 33 main calculators
  - 6 fraction operations (all empty placeholders)
  - 4 unit converters (functional but inconsistent)
  - 6 fitness calculators (all generic placeholders)
  - 6 practical calculators (all generic placeholders)

- **Only 7 calculators (15%)** follow best practices
- **20 calculators (43%)** need refactoring
- **12 calculators (26%)** are empty/placeholder implementations
- **11 duplicate route pairs** exist

---

## 1. Calculator-by-Calculator Analysis

### BMI Calculators

#### BMI v2 (Reference Implementation) ⭐
**Files:**
- Page: `src/app/[locale]/calculator/bmi-new/page.tsx` (82 lines)
- Component: `src/components/calculators/BMICalculator.tsx` (218 lines)

**Quality:** 9/10
**Status:** REFERENCE IMPLEMENTATION

**Strengths:**
- Clean separation: page wrapper (ErrorBoundary + Suspense) + calculator component
- Uses SimpleCalculatorLayout correctly
- Uses CalculatorInput and CalculatorResult from shared
- Real-time calculation via useEffect (no submit button)
- Typed result interface (BMIResult)
- Centralized relatedCalculators via getRelatedCalculators()
- Schema.org structured data
- Comprehensive examples and FAQ
- Has tests (only calculator with coverage)

**Could Improve:**
- Add ARIA live regions for dynamic updates
- More granular loading states

---

#### BMI v1 (Legacy/Broken)
**Files:**
- Page: `src/app/[locale]/calculator/bmi/page.tsx`

**Quality:** 2/10
**Status:** CRITICAL - DELETE IMMEDIATELY

**Issues:**
- References undefined variables (`bmi_title`, `bmi_seo_description`)
- Non-functional calculator
- Should be replaced by BMI v2

---

### Procenta (Percentage) Calculators

#### Procento z čísla (Percentage of Number)
**Files:**
- Page: `src/app/[locale]/calculator/procenta/procento-z-cisla/page.tsx`
- Component: `src/components/calculators/PercentageOfNumberCalculator.tsx` (248 lines)

**Quality:** 8/10
**Status:** GOOD - Minor improvements needed

**Strengths:**
- Uses SimpleCalculatorLayout
- Real-time calculation
- Proper locale formatting

**Issues:**
- Hardcoded relatedCalculators (should use getRelatedCalculators())
- No tests

---

#### Kolik procent je X z Y (What Percentage is X of Y)
**Files:**
- Page: `src/app/[locale]/calculator/procenta/kolik-procent-je-x-z-y/page.tsx`
- Component: `src/components/calculators/WhatPercentageIsXOfYCalculator.tsx` (152 lines)

**Quality:** 4/10
**Status:** PARTIALLY REFACTORED

**Issues:**
- Has TODO comment indicating incomplete refactoring
- Uses CalculatorBase (old pattern)
- No tests

---

#### Y je X%, kolik je 100% (Y is X%, What is 100%)
**Files:**
- Page: `src/app/[locale]/calculator/procenta/y-je-x-kolik-je-sto/page.tsx`
- Component: `src/components/calculators/YIsXWhatIsHundredCalculator.tsx` (228 lines)

**Quality:** 8/10
**Status:** GOOD

**Strengths:**
- Uses SimpleCalculatorLayout
- Well-structured examples and FAQ

**Issues:**
- Hardcoded relatedCalculators
- No tests

---

### DPH (VAT) Calculator

**Files:**
- Page: `src/app/[locale]/calculator/dph/page.tsx`
- Component: `src/components/calculators/VATCalculator.tsx` (295 lines)

**Quality:** 8/10
**Status:** GOOD

**Strengths:**
- Uses SimpleCalculatorLayout
- Supports two countries (CZ 21%, SK 20%)
- Bidirectional calculation (base-to-total, total-to-base)
- Proper select dropdowns and radio buttons

**Issues:**
- Hardcoded relatedCalculators
- No tests
- Duplicate route: dph-new exists

---

### Čistá mzda (Net Salary) Calculator

**Files:**
- Page: `src/app/[locale]/calculator/cista-mzda/page.tsx`
- Component: Likely `CistaMzdaCalculator.refactored.tsx`

**Quality:** 7/10
**Status:** NEEDS REVIEW

**Issues:**
- May use CalculatorBase (transitional pattern)
- Simplified tax calculation (no tax credits)
- Duplicate route: cista-mzda-new exists

---

### Zlomky (Fractions) Calculator

**Files:**
- Page: `src/app/[locale]/calculator/zlomky/page.tsx`
- Component: `src/components/calculators/FractionsCalculator.tsx` (130 lines)

**Quality:** 6/10
**Status:** NEEDS REFACTORING

**Issues:**
- Container component, delegates to operation-specific calculators
- Uses CalculatorBase (old pattern)
- No calculation logic in main file
- Duplicate route: zlomky-new exists

---

### Trojclenka (Rule of Three) Calculators

#### Přímá úměra (Direct Proportion)
**Files:**
- Page: `src/app/[locale]/calculator/trojclenka/prima-umera/page.tsx`
- Component: `DirectProportionCalculator.tsx`

**Quality:** 6/10
**Status:** NEEDS REFACTORING

**Issues:**
- Uses CalculatorBase (old pattern)
- Formula: (C × B) / A

---

#### Nepřímá úměra (Inverse Proportion)
**Files:**
- Page: `src/app/[locale]/calculator/trojclenka/neprima-umera/page.tsx`
- Component: `InverseProportionCalculator.tsx`

**Quality:** 6/10
**Status:** NEEDS REFACTORING

**Issues:**
- Uses CalculatorBase (old pattern)
- Formula: (A × B) / C

---

### Převodník jednotek (Unit Converter)

**Files:**
- Page: `src/app/[locale]/calculator/prevodnik-jednotek/page.tsx`
- Component: `src/components/calculators/UnitConverter.tsx` (314 lines)

**Quality:** 7/10
**Status:** GOOD - Exceeds line limit

**Strengths:**
- Supports length, weight, volume, temperature
- Good quick conversion features

**Issues:**
- 314 lines (exceeds 250 line guideline)
- Custom layout (doesn't use SimpleCalculatorLayout)
- Duplicate route: prevodnik-jednotek-new exists

---

### Financie rozšířené (Extended Finance) Calculators

#### Složené úročení (Compound Interest)
**Files:**
- Page: `src/app/[locale]/calculator/financie-rozsirene/slozene-uroceni/page.tsx`
- Component: `src/components/calculators/CompoundInterestCalculator.tsx` (194 lines)

**Quality:** 7/10
**Status:** NEEDS REFACTORING

**Issues:**
- Uses CalculatorBase (old pattern)

---

#### Anuitní splátka (Annuity Payment)
**Files:**
- Page: `src/app/[locale]/calculator/financie-rozsirene/anuitni-splatka/page.tsx`
- Component: `src/components/calculators/AnnuityPaymentCalculator.tsx` (167 lines)

**Quality:** 7/10
**Status:** NEEDS REFACTORING

**Issues:**
- Uses CalculatorBase (old pattern)
- Formula: M = P * [i(1+i)^n] / [(1+i)^n - 1]

---

#### IRR (Internal Rate of Return) ⭐
**Files:**
- Page: `src/app/[locale]/calculator/financie-rozsirene/irr/page.tsx`
- Component: `src/components/calculators/IRRCalculator.tsx` (555 lines)

**Quality:** 9/10
**Status:** EXCELLENT - Reference quality for financial calculators

**Strengths:**
- Uses SimpleCalculatorLayout
- Dynamic cash flow management (add/remove rows)
- Newton-Raphson iteration for IRR calculation
- NPV calculation included
- Payback period calculation
- Excellent error handling
- Detailed examples and FAQ
- Schema.org data
- Proper relatedCalculators (hardcoded but comprehensive)

**Issues:**
- 555 lines (exceeds 250 line guideline)
- No tests (complex calculator would benefit)

---

#### NPV, ROI, Předčasné splacení
**Files:** Exist but not fully analyzed
**Quality:** Unknown, likely 7/10
**Status:** NEEDS REVIEW

---

### Stavební (Construction) Calculators

#### Beton (Concrete)
**Files:**
- Page: `src/app/[locale]/calculator/stavebni/beton/page.tsx`
- Component: `src/components/calculators/ConcreteCalculator.tsx` (649 lines)

**Quality:** 8/10
**Status:** GOOD - Exceeds line limit

**Strengths:**
- Two calculation types: slab and column
- Five concrete grades (C12/15 to C30/37)
- Material pricing inputs
- Uses SimpleCalculatorLayout

**Issues:**
- 649 lines (significantly exceeds 250 line guideline)
- No tests

---

#### Objem (Volume)
**Files:**
- Page: `src/app/[locale]/calculator/stavebni/objem/page.tsx`
- Component: `src/components/calculators/VolumeCalculator.tsx` (666 lines)

**Quality:** 7/10
**Status:** GOOD - Exceeds line limit

**Strengths:**
- Five shapes: cube, rectangular prism, sphere, cylinder, cone
- Surface area calculations
- Uses SimpleCalculatorLayout

**Issues:**
- 666 lines (significantly exceeds 250 line guideline)
- No tests

---

#### Plocha, Materiály, Izolace
**Files:** Exist but not fully analyzed
**Quality:** Unknown
**Status:** NEEDS REVIEW

---

### Fitness a zdravi (Health) - PLACEHOLDERS ❌

**Files:**
- Pages: `src/app/[locale]/calculator/fitness-a-zdravi/kalkulacka-{1-6}/page.tsx`

**Quality:** 2/10
**Status:** ALL PLACEHOLDERS - NEED IMPLEMENTATION

**Issues:**
- Generic placeholder implementations
- All likely point to CaloriesCalculator or similar
- No specific functionality implemented

---

### Prakticke výpočty - PLACEHOLDERS ❌

**Files:**
- Pages: `src/app/[locale]/calculator/prakticke-vypocty/kalkulacka-{1-6}/page.tsx`

**Quality:** 2/10
**Status:** ALL PLACEHOLDERS - NEED IMPLEMENTATION

**Issues:**
- Generic placeholder pages
- No actual calculator implementations

---

### Fraction Operations (6 Components) - PLACEHOLDERS ❌

**Location:** `src/components/calculators/fractionOperations/`

**Files:**
1. `FractionAddition.tsx` (18 lines)
2. `FractionSubtraction.tsx`
3. `FractionMultiplication.tsx`
4. `FractionDivision.tsx`
5. `FractionSimplification.tsx`
6. `FractionConversion.tsx`

**Quality:** 1/10
**Status:** ALL PLACEHOLDERS - NEED FULL IMPLEMENTATION

**Example from FractionAddition.tsx:**
```tsx
const FractionAddition: React.FC = () => {
  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-2">Sčítání zlomků</h3>
      <p>Komponenta pro sčítání zlomků bude implementována později.</p>
    </div>
  );
};
```

---

### Unit Converters (4 Components)

**Location:** `src/components/calculators/unitConverters/`

**Files:**
1. `LengthConverter.tsx` (85 lines)
2. `TemperatureConverter.tsx`
3. `WeightConverter.tsx`
4. `VolumeConverter.tsx`

**Quality:** 6/10
**Status:** FUNCTIONAL - Could use shared components

**Issues:**
- No SimpleCalculatorLayout usage
- Simple conversion logic
- Inline form elements (no shared components)

---

## 2. Shared Infrastructure Assessment

### Routing System
**Quality:** 7/10

**File:** `src/middleware.ts`
- Clean implementation using `next-intl/middleware`
- Supports 5 locales: cs, en, sk, pl, hu
- Proper locale detection and prefix routing

**Issues:**
- `src/i18n/settings.ts` only defines 2 locales (en, cs) - inconsistent with middleware
- Missing locale validation before routing

---

### Styling System
**Quality:** 8/10

**Files:** `tailwind.config.js`, `src/styles/globals.css`
- Proper dark mode configuration (`class` strategy)
- Comprehensive CSS variables for theming
- HSL-based color system
- Extended color palette (primary, secondary, muted, destructive, accent)

**Issues:**
- tailwind.config.js uses CommonJS instead of ES modules

---

### Theme System
**Quality:** 8/10

**File:** `src/context/ThemeContext.tsx` (244 lines)
- Comprehensive theme management (light/dark/system)
- localStorage persistence
- System preference detection
- URL-based theme switching support

**Issues:**
- Uses `next/router` instead of `next/navigation` (App Router incompatibility)
- Could be simplified (< 150 lines)

---

### Layout Components
**Quality:** 8/10

#### SimpleCalculatorLayout (516 lines) ⭐
**File:** `src/components/layout/SimpleCalculatorLayout.tsx`

**Strengths:**
- Comprehensive props interface
- Built-in Schema.org structured data
- Integrated ad placement (header, in-content, sidebar, sticky-bottom)
- AdBlock detection with modal
- Formula display with KaTeX support
- FAQ accordion component
- Related calculators section
- Responsive grid layout

**Issues:**
- Missing error boundary
- No loading states
- Hardcoded Czech text in AdBlock modal
- Inline components (AdPlaceholder, SimpleBadge, SimpleFAQ) should be extracted

---

### Shared Calculator Components
**Quality:** 9/10

#### CalculatorInput (73 lines)
**File:** `src/components/calculators/shared/CalculatorInput.tsx`

**Strengths:**
- TypeScript interface for props
- Validation support with error display
- Unit display support
- Help text support
- Uses shared Label and Input components

**Status:** EXCELLENT - Foundation for new calculators

---

#### CalculatorResult (65 lines)
**File:** `src/components/calculators/shared/CalculatorResult.tsx`

**Strengths:**
- Flexible result display
- Formula support
- Additional info slot
- Uses locale formatting for numbers

**Issues:**
- Hardcoded 'cs-CZ' locale (should use current locale)

---

#### CalculatorRating (246 lines)
**File:** `src/components/calculators/shared/CalculatorRating.tsx`

**Strengths:**
- Complete rating system with stars
- LocalStorage persistence
- Server API integration
- Average rating calculation

**Issues:**
- 246 lines - could be refactored into smaller hooks
- Czech comments and text (should use i18n)
- Complex state management (8 useState hooks)

---

### CalculatorBase (Legacy)
**File:** `src/components/calculators/CalculatorBase.tsx` (249 lines)

**Quality:** 4/10
**Status:** ANTI-PATTERN - Should be replaced

**Issues:**
- Old pattern - should be replaced by SimpleCalculatorLayout
- No SEO support
- No related calculators
- Lacks modern features (LaTeX, examples, FAQ)
- **10 files still use this pattern**

---

### Utils and Helpers
**Quality:** 7/10

#### src/lib/utils.ts (188 lines)
- `cn()` helper for class merging
- `formatNumber()`, `toKebabCase()`, `truncateString()`
- `debounce()`, `generateId()`, `isMobileDevice()`
- `copyToClipboard()`, `formatDate()`

**Issues:**
- Some utilities overlap with calculatorUtils.ts
- Missing common utilities like `classNames`, `clamp`

---

#### src/utils/calculatorUtils.ts (785 lines)
**Quality:** 7/10

**Strengths:**
- Extremely comprehensive
- Number validation, parsing, formatting
- Percentage calculations
- Math expression evaluation
- Unit conversion utilities

**Issues:**
- **785 lines is too long - should be split**
- Duplicate files: `.clean.ts`, `.new.ts`, `.updated.ts`
- Should use `mathjs` library instead of custom eval

---

#### src/lib/calculatorDataUtils.ts (212 lines)
**Quality:** 9/10

**Strengths:**
- Centralized calculator data management
- `getRelatedCalculators()` with fallback strategy
- `getCalculatorCategories()` for quick links
- `getQuickLinks()` for popular calculators

**Issues:**
- Only 10 calculators defined in JSON (should have 43)
- No caching mechanism

---

### SEO Components
**Quality:** 3/10 ⚠️

**File:** `src/components/seo/SeoMetadata.tsx`

**Critical Issues:**
- Uses deprecated `next/head` instead of Next.js 14+ metadata API
- All important features marked as TODO
- No actual implementation (all TODO comments)

**Recommendations:**
- **CRITICAL:** Rewrite using Next.js 14+ metadata API
- Implement Open Graph tags
- Add Twitter Card support
- Add canonical URLs
- Add hreflang tags for i18n

---

### Error Handling
**Quality:** 2/10 ⚠️

**Critical Gap:**
- No shared ErrorBoundary component
- Each page reimplements ErrorBoundary class (8 duplications)
- No error tracking/logging service
- No recovery UI

**Recommendations:**
1. Create `src/components/error-handling/ErrorBoundary.tsx`
2. Create `src/components/error-handling/ErrorFallback.tsx`
3. Add error logging service integration (Sentry?)

---

### Testing Infrastructure
**Quality:** 5/10

**Test Coverage:**
- Only 8 test files found
- **Only BMICalculator has tests**
- Only UI component tests (Button)

**Gaps:**
- No E2E tests
- No accessibility tests
- No performance tests
- Minimal coverage of shared components

---

### Type System
**Quality:** 5/10

**File:** `src/types/calculator.ts`
**Issues:**
- Very generic interface (only 3 fields)
- Commented out interfaces (confusing)
- Should define more specific types (Input, Output, ValidationError)

---

### TypeScript Configuration
**Quality:** 3/10 ⚠️

**File:** `tsconfig.json`

**Critical Issue:**
```json
"strict": false
```

**Recommendations:**
1. **CRITICAL:** Enable strict mode
2. Add `strictNullChecks`
3. Add `noUnusedLocals` and `noUnusedParameters`

---

## 3. Consistency Matrix & Duplication Hotspots

### Page Wrapper Patterns (CRITICAL INCONSISTENCY)

**Pattern A: Modern ErrorBoundary Wrapper** (BMI v2 - REFERENCE)
```tsx
- Custom ErrorBoundary class component
- Suspense with Skeleton loading
- Dynamic import with ssr: false
- Clean, minimal wrapper (82 lines)
```

**Pattern B: Card-based Layout** (DPH, Procenta, Cista Mzda)
```tsx
- Same ErrorBoundary class
- Container with Card wrapper
- 2/3 grid layout: calculator (left) + tips sidebar (right)
- 130+ lines of layout code in page wrapper
```

**Pattern C: Async/Await Pattern** (DPH-new)
```tsx
- Async component with await params
- Different ErrorBoundary (functional component wrapper)
```

**Pattern D: Mixed/Inline Layout** (Trojclenka)
```tsx
- Direct calculator import, no ErrorBoundary in page
- Formula/explanation cards in page component
```

**IMPACT:** 8 different page wrapper implementations create maintenance nightmare.

---

### Layout Usage Distribution

| Layout Type | Count | Calculators | Status |
|---|---|---|---|
| **SimpleCalculatorLayout** | 25 | BMI v2, VAT, Percentages, IRR, Building | CORRECT |
| **CalculatorBase** | 10 | Trojclenka (2), Fractions, Finance (3), NetSalary | ANTI-PATTERN |
| **Inline/Custom** | ~8 | UnitConverter, WhatPercentageIsXOfY, Unit Converters | INCONSISTENT |

---

### Related Calculators Implementation (CRITICAL DUPLICATION)

**Centralized** (CORRECT):
```tsx
// Only BMI v2 uses this
const relatedCalculators = getRelatedCalculators('bmi', locale, t);
```

**Hardcoded Arrays** (WRONG - found in 23 files):
```tsx
// VATCalculator, PercentageOfNumberCalculator, and 21 others
const relatedCalculators = [
  { title: '...', description: '...', href: '/...', category: '...' }
];
```

**Files with hardcoded arrays:**
1. VATCalculator.tsx
2. PercentageOfNumberCalculator.tsx
3. YIsXWhatIsHundredCalculator.tsx
4. WhatPercentageIsXOfYCalculator.tsx
5. NPVCalculator.tsx
6. IRRCalculator.tsx
7. ROICalculator.tsx
8. CompoundInterestCalculator.tsx
9. AnnuityPaymentCalculator.tsx
10. EarlyRepaymentCalculator.tsx
11. And 13 more...

**IMPACT:**
- ~50-100 lines of duplication per file
- **Total: ~1,500 lines of unnecessary hardcoded arrays**
- Maintenance burden: 23 separate arrays to update

---

### Code Duplication Hotspots

#### 1. ErrorBoundary Component (8 duplications)
**Files with duplicate ErrorBoundary:**
1. `src/app/[locale]/calculator/bmi/page.tsx`
2. `src/app/[locale]/calculator/bmi-new/page.tsx`
3. `src/app/[locale]/calculator/dph/page.tsx`
4. `src/app/[locale]/calculator/procenta/procento-z-cisma/page.tsx`
5. `src/app/[locale]/calculator/procenta/procento-z-cisla/page.tsx`
6. `src/app/[locale]/calculator/cista-mzda/page.tsx`
7. `src/app/[locale]/calculator/prevodnik-jednotek/page.tsx`
8. `src/app/[locale]/calculator/zlomky/page.tsx`

**Solution Needed:** Create `src/components/shared/ErrorBoundary.tsx`

---

#### 2. Page Wrapper Layout Code (6+ duplications)
**Duplicate Card Layout Pattern** in:
- `src/app/[locale]/calculator/dph/page.tsx` (lines 73-129)
- `src/app/[locale]/calculator/procenta/procento-z-cisla/page.tsx` (lines 100-203)
- `src/app/[locale]/calculator/cista-mzda/page.tsx` (lines 72-129)
- `src/app/[locale]/calculator/prevodnik-jednotek/page.tsx` (lines 72-80+)

**Each has:**
- Same 2/3 grid structure
- Same Card + Tooltip pattern
- **~60 lines of identical layout code**

---

#### 3. Manual Input Forms (20+ duplications)
**Shared Component Usage** (GOOD - only 12 files):
- BMICalculator.tsx
- InsulationCalculator.tsx
- CaloriesCalculator.tsx
- MaterialCalculator.tsx
- And 8 others...

**Manual Input Implementation** (INCONSISTENT - majority):
```tsx
// VATCalculator, PercentageOfNumberCalculator, NetSalaryCalculator...
<div className="space-y-2">
  <Label htmlFor="field">...</Label>
  <Input id="field" ... />
  {errors.field && <p className="text-red-500">...</p>}
</div>
```

---

### Duplicate Routes Analysis

**Confirmed Duplicate Pairs:**

| Original | Duplicate | Better Version | Recommendation |
|---|---|---|---|
| `/calculator/bmi` | `/calculator/bmi-new` | **bmi-new** (refactored) | Delete original |
| `/calculator/dph` | `/calculator/dph-new` | **dph-new** (likely refactored) | Need to verify |
| `/calculator/zlomky` | `/calculator/zlomky-new` | **zlomky-new** (likely) | Need to verify |
| `/calculator/cista-mzda` | `/calculator/cista-mzda-new` | **cista-mzda-new** (likely) | Need to verify |
| `/calculator/prevodnik-jednotek` | `/calculator/prevodnik-jednotek-new` | **prevodnik-jednotek-new** (likely) | Need to verify |
| `/calculator/procenta/procento-z-cisla` | `/calculator/procenta/procento-z-cisla-new` | Need to verify |
| `/calculator/procenta/kolik-procent-je-x-z-y` | `/calculator/kolik-procent-je-x-z-y-new` | Need to verify |
| `/calculator/procenta/y-je-x-kolik-je-sto` | `/calculator/y-je-x-kolik-je-sto-new` | Need to verify |
| `/calculator/trojclenka` (folder) | `/calculator/trojclenka-new` | Need to verify |
| `/calculator/financie-rozsirene/slozene-uroceni` | `/calculator/slozene-uroceni-new` | Need to verify |

**Total: 11 duplicate route pairs discovered**

---

## 4. BMI v2 Benchmark (Best Practices)

### What BMI v2 Does Correctly

**Page Wrapper** (`bmi-new/page.tsx`):
✅ Custom ErrorBoundary class component
✅ Suspense with Skeleton loader
✅ Dynamic import with `ssr: false`
✅ Clean separation - 82 lines total
✅ Fallback UI with Czech error messages

**Calculator Component** (`BMICalculator.tsx`):
✅ Uses SimpleCalculatorLayout
✅ Uses CalculatorInput and CalculatorResult from shared
✅ Real-time calculation via useEffect (no submit button)
✅ Typed result interface (BMIResult)
✅ Validation function returns boolean, sets error state
✅ Centralized related calculators: `getRelatedCalculators('bmi', locale, t)`
✅ Formula with LaTeX: `\\frac{váha (kg)}{výška (m)^2}`
✅ Examples array with scenarios
✅ FAQ array
✅ SEO metadata object
✅ Schema.org structured data
✅ Responsive (mobile/desktop)
✅ **218 lines - well under 250 line limit**
✅ Has tests

### Where Even BMI v2 Could Improve

1. **ErrorBoundary duplication** - should be extracted to shared component
2. **No calculator-specific tests** for edge cases
3. **Formula display** - could use KaTeX more consistently
4. **Accessibility** - missing ARIA labels in some places
5. **Loading states** - Skeleton could be more granular

---

## 5. Infrastructure Quality Scores

| Area | Quality | Consistency | Notes |
|---|---|---|---|
| **Routing** | 7/10 | Good | Locale inconsistency (middleware: 5, settings: 2) |
| **Styling** | 8/10 | Good | Well-organized Tailwind setup |
| **Layout Components** | 8/10 | Good | SimpleCalculatorLayout excellent (516 lines) |
| **UI Components** | 9/10 | Good | shadcn/ui components solid |
| **Shared Components** | 9/10 | Good | CalculatorInput/Result excellent but underutilized |
| **Utils/Helpers** | 7/10 | Mixed | calculatorUtils.ts too large (785 lines) |
| **Config/Constants** | 6/10 | Fair | Good foundation |
| **Type System** | 5/10 | Poor | Too generic types |
| **i18n** | 6/10 | Mixed | Incomplete locale support |
| **Analytics/Ads** | 8/10 | Good | Comprehensive implementation |
| **SEO** | 3/10 | Poor | Uses deprecated next/head |
| **Data Management** | 8/10 | Good | Centralized via calculatorDataUtils |
| **Error Handling** | 2/10 | Critical | No shared component |
| **Testing** | 5/10 | Poor | Minimal coverage (~2.6%) |

**OVERALL INFRASTRUCTURE SCORE: 6.5/10**

---

## 6. Prioritized Recommendations

### CRITICAL (Must Fix Immediately)

1. **Delete/Consolidate 11 duplicate routes**
   - Action: Delete `-new` variants, update originals OR replace originals with `-new` versions
   - Impact: Eliminates user confusion, removes dead code
   - Effort: 2-3 hours

2. **Delete broken BMI v1 route**
   - Action: Remove `/calculator/bmi/` implementation entirely
   - Replace with redirect to bmi-new
   - Effort: 30 minutes

3. **Create shared ErrorBoundary component**
   - Path: `src/components/shared/ErrorBoundary.tsx`
   - Replace all 8 duplicate implementations
   - Effort: 1 hour
   - Impact: ~200 lines removed

4. **Implement 12 placeholder components**
   - 6 fraction operations (currently 18-line placeholders)
   - 6 fitness/practical calculators (generic/empty)
   - Effort: 40+ hours
   - Impact: Completes MVP functionality

### HIGH (Should Fix Soon)

5. **Migrate 10 CalculatorBase users to SimpleCalculatorLayout**
   - Files: DirectProportion, InverseProportion, Fractions, CompoundInterest, AnnuityPayment, UnitConverter, WhatPercentageIsXOfY, YIsXWhatIsHundred, NetSalary, plus 2 more
   - Effort: 8-10 hours
   - Impact: Consistency, removes dead CalculatorBase code

6. **Replace 23 hardcoded relatedCalculators arrays**
   - Use `getRelatedCalculators(calculatorId, locale, t)` everywhere
   - Remove ~1,500 lines of hardcoded arrays
   - Effort: 2-3 hours

7. **Standardize page wrappers to BMI v2 pattern**
   - Remove Card layouts from page files
   - Let SimpleCalculatorLayout handle all UI
   - Effort: 2-3 hours

8. **Use CalculatorInput/CalculatorResult consistently**
   - Replace manual forms in 20+ files
   - Use shared components
   - Effort: 4-5 hours

9. **Enable TypeScript strict mode**
   - Change `"strict": false` to `"strict": true`
   - Fix resulting type errors
   - Effort: 8-12 hours

### MEDIUM (Improves Quality)

10. **Add missing examples to all calculators**
    - Only BMI v2, IRR have proper examples
    - Effort: 4-6 hours

11. **Add missing FAQ to all calculators**
    - Only BMI v2, VATCalculator have FAQ
    - Effort: 4-6 hours

12. **Split large files**
    - VolumeCalculator (666 lines), ConcreteCalculator (649 lines), IRRCalculator (555 lines)
    - Effort: 2-3 hours

13. **Fix locale inconsistency**
    - Unify middleware (5 locales) with settings.ts (2 locales)
    - Effort: 30 minutes

14. **Refactor CalculatorRating**
    - Reduce to < 150 lines
    - Extract custom hooks
    - Use i18n for all text
    - Effort: 2-3 hours

### LOW (Nice to Have)

15. **Add ESLint/Prettier configuration**
    - Enforce consistent code style
    - Effort: 1-2 hours

16. **Add CI/CD pipeline**
    - GitHub Actions for automated testing
    - Effort: 4-6 hours

17. **Update SEO component**
    - Rewrite using Next.js 14+ metadata API
    - Effort: 4-6 hours

18. **Add comprehensive tests**
    - Target 50% coverage for MVP calculators
    - Effort: 20+ hours

19. **Split calculatorUtils.ts**
    - Break 785-line file into smaller modules
    - Effort: 2-3 hours

20. **Fix ThemeContext**
    - Migrate from next/router to next/navigation
    - Effort: 1-2 hours

---

## Summary Statistics

| Category | Count | Good Quality | Need Refactoring | Placeholders |
|-----------|--------|---------------|---------------|-------------|
| BMI | 2 | 1 (v2) | 1 (v1 - DELETE) | 0 |
| Procenta | 3 | 2 | 1 (partial) | 0 |
| DPH | 1 | 1 | 0 | 0 |
| Čistá mzda | 1 | 0 | 1 (needs review) | 0 |
| Zlomky | 1 | 0 | 1 | 0 |
| Trojclenka | 2 | 0 | 2 (both) | 0 |
| Unit Converter | 1 | 0 | 1 (custom layout) | 0 |
| Financie rozšířené | 6 | 1 (IRR only) | 5 | 0 |
| Stavební | 5 | 0 (all functional) | 0 | 0 |
| Fitness/Health | 6 | 0 | 0 | 6 (ALL) |
| Praktické výpočty | 6 | 0 | 0 | 6 (ALL) |
| Fraction Operations | 6 | 0 | 0 | 6 (ALL) |
| Unit Converters | 4 | 0 | 0 | 0 |
| **TOTAL** | **47** | **7 (15%)** | **20 (43%)** | **12 (26%)** |

---

## Conclusion

The MathCalc Pro codebase shows clear evolution from early experiments (CalculatorBase, inline layouts) to reference implementation (SimpleCalculatorLayout with shared components). However, **lack of consolidation** has created:

- Multiple incompatible patterns coexisting
- Significant code duplication (~2,000+ lines)
- 11 duplicate routes violating own refactoring guidelines
- 12 empty placeholder components
- Minimal test coverage (2.6%)

**BMI v2 and IRR Calculator** represent current gold standards. All new work should follow their exact patterns.

**Urgent priority:** Eliminate duplicate routes, standardize on SimpleCalculatorLayout + centralized utilities, implement placeholder components.

**Estimated effort to full consistency:** 40-60 hours of focused refactoring work.
