# Translation Orchestrator Agent Specification

> **Model**: Haiku (fast, cost-efficient for file operations and pattern matching)
> **Purpose**: Unified agent for scanning codebase, finding missing localization keys, and orchestrating translations across 5 locales (cs, en, sk, pl, hu)

---

## Agent Capabilities

### 1. Code Scanning Phase
**Objective**: Find hardcoded text that should use translation keys

**Patterns to detect**:
- Hardcoded strings in JSX: `<div>Some text</div>` → should be `<div>{t('some_key')}</div>`
- Hardcoded attributes: `placeholder="Enter value"` → `placeholder={t('placeholder_enter')}`
- Hardcoded labels: `label="Name"` → `label={t('name_label')}`
- Hardcoded error messages in code
- Missing `useTranslations()` import in components

**Tools**: `Grep`, `Glob`, `Read`

**Output**: List of files with hardcoded text + suggested translation keys

---

### 2. Translation Gap Analysis Phase
**Objective**: Compare locale files to find missing/incomplete translations

**Checks**:
- **Missing keys**: Keys present in cs.json/en.json but absent in sk/pl/hu
- **Empty values**: Keys with empty string values
- **Stale keys**: Keys in locale files but unused in codebase
- **Inconsistent structure**: Nested key mismatches between locales
- **Line count discrepancy**: Significant difference in file sizes

**Tools**: `Read`, `Bash` (jq for JSON parsing)

**Current status** (2026-02-15):
```
cs.json: 2367 lines (reference)
en.json: 2360 lines (reference)
sk.json: 2240 lines (missing ~125 keys)
pl.json: 2215 lines (missing ~150 keys)
hu.json: 2265 lines (missing ~100 keys)
```

**Output**: Structured report of missing keys per locale

---

### 3. Translation Generation Phase
**Objective**: Generate high-quality transcreated translations for missing keys

**Workflow**:
1. Read source text from cs.json (default) or en.json
2. Apply **transcreation rules** (not literal translation):
   - **Financial terms**: Use locale-specific terminology (OSVČ vs SZČO, düchod vs dôchodok)
   - **Currency format**:
     - CZ/SK/PL: `1 234,56 Kč` (comma decimal, space thousands, symbol after)
     - EN: `$1,234.56` (period decimal, comma thousands, symbol before)
     - HU: No decimals for HUF
   - **Date formats**:
     - CE: `DD.MM.YYYY`
     - HU: `YYYY.MM.DD`
   - **Examples**: Use locale-appropriate values (Prague → Warsaw for PL)
   - **Legal/Tax**: Research current rates via web search if needed

3. Preserve:
   - Interpolation variables: `{variable}`, `{count}`
   - HTML tags: `<strong>`, `<br/>`, etc.
   - LaTeX markup: `\frac{}{}`, `\sqrt{}`

**Tools**: `Read`, `Edit`, `WebSearch` (for country-specific data)

**Model**: Haiku (should handle most translations) → escalate to Sonnet if:
- Complex legal/financial terminology
- Long-form educational content (1500+ words)
- Country-specific calculators (OSVČ, PIT-37, KATA)

**Output**: Updated locale files with new translations

---

### 4. Validation Phase
**Objective**: Ensure translation quality and consistency

**Checks**:
- ✅ All interpolation variables present in translation
- ✅ HTML tags balanced and matching source
- ✅ No English/Czech text in sk/pl/hu files (detect with regex)
- ✅ Key count matches across all locales (±5 keys tolerance)
- ✅ No duplicate keys within same file
- ✅ JSON syntax valid (parseable)

**Tools**: `Read`, `Bash` (jq validation)

**Output**: Validation report + auto-fix minor issues

---

## Orchestration Workflow

### Mode 1: Full Audit (default)
```
1. Scan codebase for hardcoded text
2. Analyze translation gaps across all 5 locales
3. Generate report with:
   - Files with hardcoded text (priority by category: finance > health > math)
   - Missing keys per locale (sorted by usage frequency)
   - Validation errors
4. Ask user which tasks to execute:
   [ ] Fix hardcoded text (create translation keys)
   [ ] Generate sk translations
   [ ] Generate pl translations
   [ ] Generate hu translations
   [ ] Validate all locale files
```

### Mode 2: Targeted Translation (specific locale)
```
Example: "Add Slovak translations for BMI calculator"
1. Find all keys starting with `bmi_` in cs.json
2. Check which are missing in sk.json
3. Generate transcreated Slovak translations
4. Update sk.json
5. Validate
```

### Mode 3: Auto-Sync (continuous)
```
Example: "Ensure all locales have the same keys as cs.json"
1. Extract all keys from cs.json (reference)
2. For each locale (en, sk, pl, hu):
   - Find missing keys
   - Generate translations
   - Update file
3. Run validation
4. Report summary
```

### Mode 4: Cleanup (remove unused)
```
1. Scan all .tsx files for t('key_name') usage
2. Extract all used translation keys
3. Compare with locale files
4. Report unused keys (stale)
5. Ask user to confirm deletion
```

---

## Agent Invocation Examples

### Find missing translations
```
User: "Check for missing translation keys"
Agent:
  1. Reads all 5 locale files
  2. Compares key structures
  3. Reports:
     - sk.json missing: bmi_category_underweight, bmi_example_1_title, ...
     - pl.json missing: vat_rate_label, loan_term_years, ...
     - hu.json missing: roi_period_label, ...
```

### Add calculator translations
```
User: "Add Slovak translations for the mortgage calculator"
Agent:
  1. Finds all keys matching 'mortgage_*' in cs.json
  2. Generates Slovak transcreations:
     - mortgage_amount → "Výška hypotéky" (not literal translation)
     - Uses € instead of Kč for SK examples
  3. Updates sk.json
  4. Validates
```

### Fix hardcoded text
```
User: "Find and fix hardcoded text in calculator components"
Agent:
  1. Scans src/components/calculators/**/*.tsx
  2. Finds: TipCalculator has placeholder="Enter amount"
  3. Suggests:
     - Add key: tip_amount_placeholder: "Enter amount" to cs.json
     - Update component: placeholder={t('tip_amount_placeholder')}
  4. Asks user to confirm changes
  5. Executes edits
```

---

## File Locations (Reference)

```
src/messages/
├── cs.json          # Czech (reference, complete)
├── en.json          # English (reference, complete)
├── sk.json          # Slovak (partial, ~95% complete)
├── pl.json          # Polish (partial, ~93% complete)
└── hu.json          # Hungarian (partial, ~96% complete)

Key structure:
{
  "common": { ... },
  "navigation": { ... },
  "bmi": {
    "title": "...",
    "description": "...",
    "height_label": "..."
  },
  "vat": { ... },
  ...
}
```

---

## Performance Optimization

### Use Haiku for:
- ✅ File reading and parsing
- ✅ Pattern matching (grep, glob)
- ✅ JSON comparison
- ✅ Simple translations (common words, labels, units)
- ✅ Validation checks

### Escalate to Sonnet when:
- ⚠️ Educational content > 500 words
- ⚠️ Complex financial/legal terminology
- ⚠️ Country-specific calculator descriptions
- ⚠️ FAQ sections (need contextual understanding)

**Cost savings estimate**: 90% of translation work can be Haiku → **~20x cheaper** than Sonnet

---

## Integration with Existing Agents

This agent **replaces** the need for separate:
- ~~translation-agent~~ → merged into this
- ~~localization-scanner~~ → included in Phase 1
- ~~translation-validator~~ → included in Phase 4

**Workflow with other agents**:
- **calculator-scaffolding** → calls translation-orchestrator to add keys for new calculator
- **quality-audit** → calls translation-orchestrator to validate DEFINITION_OF_DONE requirement: "translations in cs + en"
- **seo-content** → calls translation-orchestrator to ensure meta descriptions in all 5 locales

---

## Success Metrics

After full orchestration run:
- ✅ **0 hardcoded text** in calculator components (excluding constant values like π)
- ✅ **100% key parity** across cs/en/sk/pl/hu (all locales have same keys)
- ✅ **< 5% literal translations** (most should be transcreations)
- ✅ **0 validation errors** (JSON parseable, balanced tags, variables preserved)
- ✅ **< 10 unused keys** per locale (stale keys cleaned up)

---

## User-Facing Commands

Suggested slash command integration:
```
/translate                    # Full audit mode
/translate sk                 # Generate Slovak translations for missing keys
/translate bmi                # Translate specific calculator (all locales)
/translate --scan             # Find hardcoded text only
/translate --validate         # Validation only
/translate --cleanup          # Remove unused keys
```

---

## Next Steps

1. ✅ Create this specification document
2. ⬜ Test Haiku model with sample translation tasks
3. ⬜ Implement Phase 1 (code scanning) as standalone script
4. ⬜ Implement Phase 2 (gap analysis) with jq
5. ⬜ Implement Phase 3 (generation) with transcreation rules
6. ⬜ Integrate with Task tool as `subagent_type: "translation-orchestrator"`
7. ⬜ Add to CLAUDE.md agent list
8. ⬜ Create user documentation with examples

---

*This agent is designed to be autonomous, cost-efficient (Haiku-first), and comprehensive (scanning → analysis → generation → validation in one workflow).*
