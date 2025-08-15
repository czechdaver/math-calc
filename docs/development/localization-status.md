# Localization Status Report

**⚠️ IMPORTANT**: This document needs updating after recent cleanup changes.

## Overview
Systematic implementation of EN and CS localization for all calculators in the math calculator project.

**Recent Changes:**
- ✅ Consolidated i18n configuration files
- ✅ Removed duplicate calculator directories (-new versions)
- ✅ Cleaned up backup files

## Current Status

### ✅ Completed Localization Files
- **cs.json**: Extended with comprehensive calculator keys
- **en.json**: Extended with comprehensive calculator keys

### 🔄 In Progress - Calculator Localization Implementation

#### ✅ Partially Completed
1. **TipCalculator.tsx**
   - Status: 🟡 Partially localized
   - Completed: Bill amount, service quality labels
   - Remaining: Layout props, service quality options, result labels

#### ⏳ Pending Localization
1. **AgeCalculator.tsx** - Age calculation with date inputs
2. **CurrencyCalculator.tsx** - Currency conversion
3. **MaterialCalculator.tsx** - Construction materials
4. **IRRCalculator.tsx** - Internal Rate of Return
5. **NPVCalculator.tsx** - Net Present Value
6. **ROICalculator.tsx** - Return on Investment
7. **EarlyRepaymentCalculator.tsx** - Loan early repayment
8. **ConcreteCalculator.tsx** - Concrete calculations
9. **InsulationCalculator.tsx** - Insulation calculations
10. **AreaCalculator.tsx** - Area calculations
11. **VolumeCalculator.tsx** - Volume calculations
12. **CaloriesCalculator.tsx** - Calorie calculations
13. **BMRCalculator.tsx** - Basal Metabolic Rate
14. **IdealWeightCalculator.tsx** - Ideal weight
15. **BodyFatCalculator.tsx** - Body fat percentage
16. **DiscountCalculator.tsx** - Discount calculations
17. **TimeCalculator.tsx** - Time calculations
18. **FuelCalculator.tsx** - Fuel consumption
19. **FractionsCalculator.tsx** - Fraction operations

## Localization Keys Structure

### Common Keys (`common.*`)
```json
{
  "calculate": "Vypočítat / Calculate",
  "result": "Výsledek / Result",
  "formula": "Vzorec / Formula",
  "calculator": "Kalkulačka / Calculator",
  "examples": "Příklady / Examples",
  "faq": "Často kladené otázky / FAQ",
  "related_calculators": "Související kalkulátory / Related Calculators",
  "enter_values": "Zadejte hodnoty pro výpočet / Enter values for calculation",
  "currency": "Kč / $",
  "percentage": "%",
  "years": "let / years",
  "months": "měsíců / months",
  "days": "dní / days"
}
```

### Calculator-Specific Keys (`calculators.*`)
- `calculators.tip.*` - Tip calculator
- `calculators.age.*` - Age calculator
- `calculators.currency.*` - Currency calculator
- `calculators.material.*` - Material calculator
- `calculators.irr.*` - IRR calculator
- `calculators.npv.*` - NPV calculator
- `calculators.roi.*` - ROI calculator

### Category Keys (`categories.*`)
```json
{
  "practical": "Praktické / Practical",
  "financial": "Finanční / Financial", 
  "construction": "Stavební / Construction",
  "health": "Zdraví a fitness / Health and fitness"
}
```

### Formula Keys Guidance (LaTeX + i18n)
See: `docs/development/formula-authoring.md`.
- Store raw LaTeX per locale in `src/messages/<locale>.json`
- Wrap words with `\text{...}`; use `\dfrac` for display fractions
- Escape backslashes in JSON (e.g., "\\dfrac{...}{...}")
- Provide direction-specific keys when needed (e.g., `base_to_total_latex`, `total_to_base_latex`)

Example (EN):
```json
{
  "vat_enhanced": {
    "formula": {
      "base_to_total_latex": "\\text{With VAT} = \\text{Without VAT} \\times (1 + \\text{rate})",
      "total_to_base_latex": "\\text{Without VAT} = \\dfrac{\\text{With VAT}}{1 + \\text{rate}}"
    }
  }
}
```

Example (CS):
```json
{
  "vat_enhanced": {
    "formula": {
      "base_to_total_latex": "\\text{s DPH} = \\text{bez DPH} \\times (1 + \\text{sazba})",
      "total_to_base_latex": "\\text{bez DPH} = \\dfrac{\\text{s DPH}}{1 + \\text{sazba}}"
    }
  }
}
```

## Implementation Strategy

### Phase 1: Core Calculators (Priority)
1. **TipCalculator** - Complete remaining localization
2. **AgeCalculator** - Full localization implementation
3. **CurrencyCalculator** - Full localization implementation
4. **MaterialCalculator** - Full localization implementation

### Phase 2: Financial Calculators
1. **IRRCalculator** - Investment analysis
2. **NPVCalculator** - Net present value
3. **ROICalculator** - Return on investment
4. **EarlyRepaymentCalculator** - Loan calculations

### Phase 3: Construction & Health Calculators
1. **ConcreteCalculator** - Construction materials
2. **InsulationCalculator** - Building insulation
3. **CaloriesCalculator** - Health calculations
4. **BMRCalculator** - Metabolic rate

### Phase 4: Remaining Calculators
1. All other calculators in systematic order

## Testing Plan

### Browser Testing
- Test each calculator in CS locale: `/cs/calculator/...`
- Test each calculator in EN locale: `/en/calculator/...`
- Verify all text displays correctly
- Check for missing translation keys

### Validation
- No hardcoded Czech/English text remaining
- All `t()` calls resolve correctly
- Consistent terminology across calculators
- Proper fallbacks for missing keys

## Technical Requirements

### File Updates Required
1. **Calculator Components**: Replace hardcoded strings with `t()` calls
2. **Layout Props**: Use localization for title, description, category
3. **Form Labels**: Localize all input labels and hints
4. **Result Display**: Localize all result labels and descriptions
5. **Examples & FAQ**: Localize educational content

### Common Patterns
```tsx
// Before
title: "Kalkulátor spropitného"

// After  
title: t('calculators.tip.title')

// Before
<Label>Částka účtu</Label>

// After
<Label>{t('calculators.tip.bill_amount')}</Label>
```

## Progress Tracking

### Completed: 1/19 calculators (5%)
- ✅ TipCalculator (partial)

### In Progress: 0/19 calculators
- 🔄 None currently

### Pending: 18/19 calculators (95%)
- ⏳ All remaining calculators

## Next Steps
1. Complete TipCalculator localization
2. Implement AgeCalculator localization  
3. Test both calculators in CS/EN locales
4. Continue with systematic implementation
5. Document any missing localization keys
6. Verify all calculators work in both languages

## Success Criteria
- ✅ All calculators display correctly in Czech (CS)
- ✅ All calculators display correctly in English (EN)
- ✅ No hardcoded text strings remain
- ✅ Consistent terminology and formatting
- ✅ All educational content localized
- ✅ Proper currency and unit formatting per locale
