# Refactoring Guide

This guide tracks the refactoring status of all 43 calculators and provides the Definition of Done.

## Status Overview

| Metric | Count |
|---|---|
| Total Calculators | 43 |
| Modern (SimpleCalculatorLayout) | 33 |
| Legacy (CalculatorBase) | 8 |
| Mixed Layout | 1 |
| Duplicate Routes | 10 pairs |

## Legacy Calculators (Need Refactoring)

| Calculator | Component | Route | Priority |
|---|---|---|---|
| Annuity Payment | AnnuityPaymentCalculator | `/financie-rozsirene/anuitni-splatka/` | Medium |
| Compound Interest | CompoundInterestCalculator | `/financie-rozsirene/slozene-uroceni/` | Medium |
| Direct Proportion | DirectProportionCalculator | `/trojclenka/prima-umera/` | Medium |
| Inverse Proportion | InverseProportionCalculator | `/trojclenka/neprima-umera/` | Medium |
| Fractions Calculator | FractionsCalculator | `/zlomky/` | High |
| Net Salary | NetSalaryCalculator | `/cista-mzda/` | High |
| Unit Converter | UnitConverter | `/prevodnik-jednotek/` | High |
| What % is X of Y | WhatPercentageIsXOfYCalculator | `/procenta/kolik-procent-je-x-z-y/` | Medium |

## Duplicate Routes (Cleanup Phase)

| Original | Duplicate | Action |
|---|---|---|
| `/calculator/bmi/` | `/calculator/bmi-new/` | Keep -new, delete old |
| `/calculator/dph/` | `/calculator/dph-new/` | Consolidate |
| `/calculator/zlomky/` | `/calculator/zlomky-new/` | Consolidate |
| `/calculator/cista-mzda/` | `/calculator/cista-mzda-new/` | Consolidate |
| `/calculator/trojclenka/` | `/calculator/trojclenka-new/` | Consolidate |
| `/calculator/prevodnik-jednotek/` | `/calculator/prevodnik-jednotek-new/` | Consolidate |
| `/procenta/procento-z-cisla/` | `/procenta/procento-z-cisla-new/` | Consolidate |
| `/procenta/kolik-procent-je-x-z-y/` | `/procenta/kolik-procent-je-x-z-y-new/` | Consolidate |
| `/procenta/y-je-x-kolik-je-sto/` | `/procenta/y-je-x-kolik-je-sto-new/` | Consolidate |
| `/financie-rozsirene/slozene-uroceni/` | `/financie-rozsirene/slozene-uroceni-new/` | Consolidate |

## Placeholder Calculators (Need Implementation)

| Route | Status |
|---|---|
| `/fitness-a-zdravi/kalkulacka-5/` | Empty placeholder |
| `/fitness-a-zdravi/kalkulacka-6/` | Empty placeholder |

## Refactoring Phases

### Phase 1: Cleanup Duplicates (CRITICAL)

1. For each duplicate pair, verify which version is correct
2. Replace original route with correct version
3. Delete the duplicate route
4. Update any internal references
5. Remove `-new` suffix from route name

### Phase 2: Legacy to Modern (HIGH)

Refactor in priority order:

1. **Unit Converter** - High traffic utility
2. **Net Salary** - Business critical
3. **Fractions Calculator** - Educational importance
4. **Annuity Payment** - Finance category
5. **Compound Interest** - Finance category
6. **Direct Proportion** - Educational
7. **Inverse Proportion** - Educational
8. **What % is X of Y** - Fix mixed layout

### Phase 3: Implement Placeholders (MEDIUM)

1. fitness-a-zdravi/kalkulacka-5
2. fitness-a-zdravi/kalkulacka-6

### Phase 4: Complete Translations (LOW)

1. Create sk.json with full translations
2. Create pl.json with full translations
3. Create hu.json with full translations

## Definition of Done

A calculator is considered **DONE** when it meets ALL criteria:

### Must Have (Required)

- [ ] Uses `SimpleCalculatorLayout` from `@/components/layout/SimpleCalculatorLayout`
- [ ] Uses `CalculatorInput` and `CalculatorResult` from `@/components/calculators/shared`
- [ ] Real-time calculation via `useEffect` (no submit button)
- [ ] TypeScript result interface defined
- [ ] Input validation with error messages
- [ ] Translations in BOTH `cs.json` and `en.json`
- [ ] Calculator ID assigned for data lookups
- [ ] SEO metadata (title, description, keywords)

### Must Have (Content)

- [ ] LaTeX formula displayed with KaTeX
- [ ] Examples section with at least 2 scenarios
- [ ] FAQ section with at least 2 questions
- [ ] Related calculators via `getRelatedCalculators()`
- [ ] Schema.org structured data

### Must Have (Technical)

- [ ] Page wrapper with ErrorBoundary + Suspense
- [ ] Dynamic import with `ssr: false`
- [ ] Skeleton loading state
- [ ] Responsive design (375px breakpoint)
- [ ] Dark mode compatible
- [ ] No TypeScript errors
- [ ] Component under 250 lines OR logic extracted

### Must NOT Have (Anti-patterns)

- [ ] No `CalculatorBase` import (legacy pattern)
- [ ] No hardcoded related calculators array
- [ ] No inline layout (no unified wrapper)
- [ ] No file with `-new`, `-old`, `-refactored` suffix
- [ ] No duplicate code patterns

## Step-by-Step Process

1. Read current implementation
2. Read reference implementation (BMICalculator.tsx)
3. Update component (use SimpleCalculatorLayout)
4. Update page wrapper (ErrorBoundary + Suspense)
5. Add/update translations (cs.json, en.json)
6. Add data entries (calculators.json, relationships.json)
7. Add tests (create `__tests__` directory)
8. Verify checklist above
9. Update status in this document

## Testing Commands

```bash
# Run specific test
npm test -- MyCalculator

# Watch mode during development
npm run test:watch

# Coverage report
npm run test:coverage

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## Notes

- Complex calculators (>250 lines): Extract logic to utilities
- Form fields >5: Consider subcomponents
- Unit tests: Aim for >80% coverage on calculation logic
- Use `React.memo` if component re-renders frequently

---

See [Calculator Template](calculator-template.md) for new calculator creation.
See [Architecture](architecture.md) for project structure details.
