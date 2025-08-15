# Formula Authoring Guide (LaTeX + i18n)

This guide defines how to author, localize, and render formulas for calculators using KaTeX and next-intl.

## Goals
- Ensure formulas render cleanly across locales (CS/EN) with KaTeX
- Avoid awkward math-mode spacing for words
- Keep formulas readable, consistent, and easy to localize

## Core Rules
- Wrap all natural language words in LaTeX with `\text{...}`
  - Examples: `\text{With VAT}`, `\text{Without VAT}`, `\text{sazba}`, `\text{bez DPH}`
- Use `\dfrac{...}{...}` for display fractions in multi-line or highlighted formulas
- Escape content correctly in JSON
  - Backslashes: `"\\dfrac{...}{...}"`
  - Braces stay as-is
- Keep variables/symbols in math mode and words in text mode
  - Good: `x = a \times (1 + r)`
  - With words: `\text{total} = \text{base} \times (1 + \text{rate})`
- Prefer readable, localized terms over abbreviations where appropriate
  - CS: `\text{s DPH}`, `\text{bez DPH}`, `\text{sazba}`
  - EN: `\text{With VAT}`, `\text{Without VAT}`, `\text{rate}`
- Keep parentheses and operators standard: `+`, `-`, `\times`, `\div` (or `\dfrac`)
- Avoid manual spacing hacks inside math like `\,` for words; use `\text{...}` instead

## JSON Localization Pattern
Store formulas in `src/messages/<locale>.json` under the calculator's keys, or a calculator section (e.g., `vat_enhanced.formula.*`).

Example (EN):
```json
{
  "vat_enhanced": {
    "formula": {
      "base_to_total_latex": "\\text{With VAT} = \\text{Without VAT} \\times (1 + \\text{rate})",
      "total_to_base_latex": "\\text{Without VAT} = \\dfrac{\\text{With VAT}}{1 + \\text{rate}}",
      "base_to_total_desc": "Total calculation: base amount is multiplied by coefficient (1 + VAT rate)",
      "total_to_base_desc": "Base calculation: total amount is divided by coefficient (1 + VAT rate)"
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
      "total_to_base_latex": "\\text{bez DPH} = \\dfrac{\\text{s DPH}}{1 + \\text{sazba}}",
      "base_to_total_desc": "Výpočet celkové částky: základ se násobí koeficientem (1 + sazba DPH)",
      "total_to_base_desc": "Výpočet základu: celková částka se dělí koeficientem (1 + sazba DPH)"
    }
  }
}
```

## Component Usage Pattern
- Read raw LaTeX from messages and feed into the formula renderer
- Keep direction-specific formulas separate (if applicable)

```tsx
const t = useTranslations();
const messages = useMessages() as any;

const formulaLatex = mode === 'base-to-total'
  ? (messages?.vat_enhanced?.formula?.base_to_total_latex as string) || '\\text{s DPH} = \\text{bez DPH} \\times (1 + \\text{sazba})'
  : (messages?.vat_enhanced?.formula?.total_to_base_latex as string) || '\\text{bez DPH} = \\dfrac{\\text{s DPH}}{1 + \\text{sazba}}';

const formulaDescription = mode === 'base-to-total'
  ? t('vat_enhanced.formula.base_to_total_desc')
  : t('vat_enhanced.formula.total_to_base_desc');
```

## KaTeX Rendering & CSS
- Formulas are displayed using KaTeX
- We allow wrapping to avoid horizontal scroll on small screens
  - CSS already configured (e.g., `.katex-display { white-space: normal }` and container overflow visible)
- Prefer concise formulas that fit well on mobile

## Testing Checklist
- Verify both locales (CS/EN) display formulas correctly
- Confirm words appear in normal text style (not math italics)
- Check fraction readability and wrapping on mobile
- Toggle any direction/mode and ensure each formula is localized
- Ensure no raw keys appear in UI; fallback LaTeX is safe

## Common Pitfalls
- Missing `\text{}` around words → causes italicized, squashed text
- Using `\\` incorrectly in JSON → always double-escape backslashes
- Overusing manual spacing like `\,` for words → use `\text{}` instead
- Mixing localized words inside math mode without `\text{}`

## Examples by Category
- VAT: shown above
- Percentages: `\text{new} = \text{original} \times (1 + \text{rate})`
- BMI: `\text{BMI} = \dfrac{\text{weight}\,(\text{kg})}{(\text{height}\,(\text{m}))^2}` (localize unit words as needed)

## Conventions
- Keep symbols (`x`, `y`, `n`, `r`) language-agnostic when appropriate
- Localize unit words and labels via `\text{...}`
- Be consistent across calculators in wording and structure

---
Last updated: 2025-08-15
