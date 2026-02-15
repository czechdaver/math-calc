# Translation Orchestrator Agent - Usage Guide

> **Quick Start**: Use the translation-orchestrator agent to scan for hardcoded text, find missing translation keys, and orchestrate translations across all 5 locales (cs, en, sk, pl, hu).

---

## How to Use the Agent

### Basic Invocation

The agent is available via the Task tool with `subagent_type: "translation-orchestrator"`.

**Example prompts**:
```
"Check for missing translation keys"
"Add Slovak translations for the BMI calculator"
"Find hardcoded text in calculator components"
"Sync all locales with cs.json"
"Validate translation files"
```

---

## Common Workflows

### 1. Full Translation Audit

**User says**: *"Check translations"* or *"Audit localization"*

**Agent will**:
1. Scan all calculator components for hardcoded text
2. Compare all 5 locale files to find missing keys
3. Validate JSON syntax and structure
4. Generate comprehensive report with:
   - Files with hardcoded text (priority: finance > health > math)
   - Missing keys per locale (sorted by frequency)
   - Validation errors

**Example output**:
```
📝 Hardcoded Text Found (5 instances):
  - src/components/calculators/CaloriesCalculator.tsx:266
    placeholder="Vyberte pohlaví"
    → Suggest: placeholder={t('calories_gender_placeholder')}

📊 Missing Translations:
  sk.json: 144 keys missing (93.3% complete)
  pl.json: 141 keys missing (93.4% complete)
  hu.json: 96 keys missing (95.5% complete)

✅ What should I do?
  [ ] Fix hardcoded text (create translation keys + update components)
  [ ] Generate Slovak translations
  [ ] Generate Polish translations
  [ ] Generate Hungarian translations
```

---

### 2. Fix Hardcoded Text

**User says**: *"Fix hardcoded text in CaloriesCalculator"*

**Agent will**:
1. Read `src/components/calculators/CaloriesCalculator.tsx`
2. Find hardcoded strings: `"Vyberte pohlaví"`, `"Vyberte úroveň aktivity"`
3. Generate translation keys:
   ```json
   "calories_gender_placeholder": "Vyberte pohlaví",
   "calories_activity_placeholder": "Vyberte úroveň aktivity"
   ```
4. Add to cs.json and en.json (with English translation)
5. Update component:
   ```tsx
   <SelectValue placeholder={t('calories_gender_placeholder')} />
   ```
6. Validate build passes

**Result**: No hardcoded text, all locales can translate these strings.

---

### 3. Generate Missing Translations (Specific Locale)

**User says**: *"Add Slovak translations for BMR calculator"*

**Agent will**:
1. Extract all keys starting with `bmr_` from cs.json
2. Check which are missing in sk.json
3. Generate **transcreated** Slovak translations:
   - `bmr_category_sedentary` → "Sedavý" (not literal "Sedentárny")
   - `bmr_formula_mifflin` → "Mifflin-St Jeor vzorec"
   - Use SK examples (€ instead of Kč)
4. Update sk.json
5. Validate JSON syntax

**Transcreation rules applied**:
- Financial terms: locale-specific (OSVČ → SZČO in SK)
- Currency: € for SK (not Kč)
- Examples: Bratislava-based (not Prague)
- Date format: DD.MM.YYYY (same as CZ)

---

### 4. Sync All Locales

**User says**: *"Ensure all locales have the same keys as cs.json"*

**Agent will**:
1. Extract all 2147 keys from cs.json (reference)
2. For each locale (en, sk, pl, hu):
   - Compare keys
   - Generate missing translations
   - Update file
3. Run validation
4. Report:
   ```
   ✅ en.json: Added 2 keys
   ✅ sk.json: Added 144 keys
   ✅ pl.json: Added 141 keys
   ✅ hu.json: Added 96 keys

   All locales now have 2147 keys (100% parity)
   ```

---

### 5. Cleanup Unused Keys

**User says**: *"Find unused translation keys"*

**Agent will**:
1. Scan all `.tsx` files for `t('key_name')` usage
2. Extract all used keys: `['bmi_title', 'vat_rate', ...]`
3. Compare with locale files
4. Report unused keys:
   ```
   🗑️ Unused keys (stale):
     - old_calculator_title (not found in code)
     - deprecated_label (not found in code)

   Remove these keys? [y/N]
   ```

---

## Advanced Features

### Country-Specific Calculator Translations

**Example**: *"Translate OSVČ calculator for Polish (PIT-37 equivalent)"*

**Agent will**:
1. Recognize this is a **country-specific** calculator
2. Research PIT-37 requirements via WebSearch
3. Generate **NOT a literal translation**, but PL equivalent:
   - OSVČ (CZ self-employed) → Samozatrudnienie / Ryczałt (PL)
   - Tax rates: Use current PL tax brackets (not CZ)
   - Forms: Reference PIT-37 (not Czech forms)
4. Create new calculator: `src/app/[locale]/calculator/pit-37/`

**This is transcreation, not translation** - adapts the concept to the target market.

---

### SEO Content Translation (Long-Form)

**Example**: *"Translate mortgage calculator educational content to English"*

**Agent will**:
1. Detect long-form content (1500+ words)
2. **Escalate to Sonnet** (Haiku not sufficient for this)
3. Generate premium EN content for US/UK market:
   - Use USD examples (not Kč)
   - Reference US mortgage types (30-year fixed, ARM)
   - Cite US sources (Freddie Mac, not Czech banks)
   - Optimize for high-CPC keywords: "mortgage calculator", "home loan"

**Why Sonnet**: EN content targets premium CPC ($10-$50), quality critical.

---

## Model Selection Strategy

### Use Haiku (Default) For:
- ✅ Scanning files (Glob, Grep, Read)
- ✅ JSON comparison and validation
- ✅ Simple translations: labels, units, common words
- ✅ Placeholders, error messages, button text
- ✅ SK/PL translations (similar to CZ)

**Cost**: ~$0.25 per 1M input tokens (~80% cheaper than Sonnet)

### Escalate to Sonnet When:
- ⚠️ Educational content > 500 words (FAQ, examples)
- ⚠️ Country-specific calculators (OSVČ, PIT-37, KATA)
- ⚠️ EN content for high-CPC calculators (mortgage, insurance)
- ⚠️ Complex financial/legal terminology
- ⚠️ HU translations (very different from CZ)

**Cost**: ~$3 per 1M input tokens (necessary for quality)

**Estimated savings**: 90% of work can use Haiku → **~20x cost reduction**

---

## Integration with Other Agents

### calculator-scaffolding + translation-orchestrator
```
User: "Create a new mortgage calculator"

1. calculator-scaffolding creates:
   - Component: MortgageCalculator.tsx
   - Page: src/app/[locale]/calculator/mortgage/page.tsx
   - Data: adds to calculators.json

2. translation-orchestrator automatically:
   - Adds keys to cs.json, en.json:
     mortgage_title, mortgage_amount_label, ...
   - Generates sk/pl/hu translations
   - Validates all locales have new keys
```

### quality-audit + translation-orchestrator
```
User: "Audit BMI calculator"

1. quality-audit checks DEFINITION_OF_DONE:
   ✅ Translations in cs + en

2. If missing keys found:
   - Calls translation-orchestrator
   - Generates missing translations
   - Re-validates
```

### seo-content + translation-orchestrator
```
User: "Generate SEO content for VAT calculator"

1. seo-content generates:
   - FAQ section (cs.json)
   - Meta descriptions (cs.json)
   - Examples (cs.json)

2. translation-orchestrator:
   - Translates to en (premium quality for high CPC)
   - Translates to sk/pl/hu (transcreated)
   - Ensures hreflang tags correct
```

---

## Validation Rules

The agent validates:

### JSON Syntax
```bash
✅ All files parseable by jq
✅ No trailing commas
✅ Proper escaping of quotes
```

### Key Parity
```bash
✅ cs.json: 2147 keys
✅ en.json: 2147 keys
✅ sk.json: 2147 keys
✅ pl.json: 2147 keys
✅ hu.json: 2147 keys
```

### Interpolation Variables
```bash
✅ Source: "Výsledek: {result} Kč"
✅ Translation: "Result: {result} CZK"
❌ Bad: "Result: CZK" (missing {result})
```

### HTML Tags
```bash
✅ Source: "Více informací <strong>zde</strong>"
✅ Translation: "More info <strong>here</strong>"
❌ Bad: "More info here" (missing tags)
```

### No Cross-Language Contamination
```bash
❌ sk.json contains Czech: "Výsledek" → should be "Výsledok"
❌ pl.json contains English: "Result" → should be "Wynik"
```

---

## POC Script Output

Run `./scripts/translation-scanner-poc.sh` to see:

```
=== Translation Orchestrator - POC ===

📝 Phase 1: Scanning for hardcoded text...
Hardcoded placeholders found:
  src/components/calculators/CaloriesCalculator.tsx:266
  src/components/calculators/CurrencyCalculator.tsx:183

📊 Phase 2: Translation gap analysis...
Key count comparison:
  cs.json: 2147 keys
  sk.json: 2003 keys (144 missing)

Missing keys in sk.json:
  bmi_alias_full
  bmr_category_active
  ...
```

---

## Success Metrics

After running translation-orchestrator:

| Metric | Before | Target | Status |
|--------|--------|--------|--------|
| Hardcoded text instances | 5 | 0 | ⬜ Todo |
| SK translation coverage | 93.3% | 100% | ⬜ Todo |
| PL translation coverage | 93.4% | 100% | ⬜ Todo |
| HU translation coverage | 95.5% | 100% | ⬜ Todo |
| Key parity (all locales) | ❌ | ✅ | ⬜ Todo |
| JSON validation errors | ? | 0 | ⬜ Todo |
| Unused keys | ? | < 10 | ⬜ Todo |

---

## Next Steps

1. ✅ Run POC script to see current issues
2. ⬜ Invoke agent to fix hardcoded text
3. ⬜ Invoke agent to sync sk.json
4. ⬜ Invoke agent to sync pl.json
5. ⬜ Invoke agent to sync hu.json
6. ⬜ Run validation to ensure 100% parity
7. ⬜ Add to CI/CD pipeline (prevent new hardcoded text)

---

*Use this agent frequently to maintain translation quality as the project grows to 141+ calculators.*
