# Translation Audit Report - File Index

**Audit Date:** February 15, 2026
**Status:** COMPLETE - Ready for Implementation

## Overview

This comprehensive audit identified **27+ hardcoded text instances** and **146 missing translation keys** across 5 calculator components and 4 locales. The project is **97% translation-complete** by key count but **100% has hardcoded text** that must be moved to translation files.

---

## Generated Report Files

### 1. **TRANSLATION_AUDIT_2026-02-15.md** (Main Report)
**Purpose:** Comprehensive audit with all findings, root cause analysis, and recommendations
**Size:** 15+ pages
**Sections:**
- Executive Summary
- Part 1: Hardcoded Text Findings (27+ instances with file:line refs)
- Part 2: Missing Translation Keys (146 instances by locale)
- Part 3: Translation File Validation
- Part 4: Hardcoded Text Location Index
- Part 5: Root Cause Analysis
- Part 6: Recommended Actions (3-phase approach)
- Part 7: Calculator Files Needing Updates
- Part 8: Impact Assessment (SEO, UX, Developer)
- Part 9: Validation Checklist

**Use this for:** Executive review, detailed planning, understanding scope

**Key Statistics:**
- cs.json: 1,536 keys (reference)
- en.json: 1,530/1,536 (99.6% complete, 6 missing)
- sk.json: 1,494/1,536 (97.3% complete, 42 missing)
- pl.json: 1,487/1,536 (96.8% complete, 49 missing)
- hu.json: 1,487/1,536 (96.8% complete, 49 missing)

---

### 2. **HARDCODED_TEXT_INVENTORY.csv** (Developer Reference)
**Purpose:** Quick-lookup CSV file for fixing hardcoded text
**Format:** Structured as:
- File | Line | Hardcoded Text | Type | Priority | Recommended Key | Action

**35 rows:** One per hardcoded string instance
**Columns:**
- File: Which calculator component
- Line: Exact line number
- Hardcoded Text: The Czech text that needs i18n
- Type: Placeholder, SelectItem, Label, Help text
- Priority: CRITICAL or HIGH
- Recommended Key: Proposed translation key name
- Action: "Wrap in t()"

**Use this for:** Quick developer reference, IDE setup, code review

**Key Offenders (by hardcoded count):**
1. DiscountCalculator.tsx - 8 hardcoded strings
2. TipCalculator.tsx - 7 hardcoded strings
3. CaloriesCalculator.tsx - 6 hardcoded strings
4. LoanCalculator.tsx - 4 hardcoded strings
5. CurrencyCalculator.tsx - 2 hardcoded strings

---

### 3. **MISSING_KEYS_BY_LOCALE.txt** (Translation Reference)
**Purpose:** Detailed breakdown of missing keys organized by language
**Structure:**
- English: 6 missing keys (BMI/BMR)
- Slovak: 42 missing keys (BMI/BMR + Time Calculator)
- Polish: 49 missing keys (BMI/BMR + Time + Category)
- Hungarian: 49 missing keys (BMI/BMR + Time + Category)

**Includes:**
- Per-locale analysis with effort estimates
- Root cause for each missing group
- Recommended translations
- Implementation checklist
- Validation procedures
- Effort breakdown (total: 15-18 hours)

**Use this for:** Translation work, missing key verification, effort planning

---

### 4. **Translation Audit Summary (Summary Output)**
**Purpose:** One-page executive summary in human-readable format
**Format:** ASCII table layout with colored status indicators
**Includes:**
- Translation coverage table (all 5 locales)
- Hardcoded text top offenders
- Missing keys root causes
- Recommended actions with effort estimates
- Impact analysis (SEO, UX, Developer)
- Validation checklist

**Use this for:** Team meetings, executive briefing, quick reference

---

### 5. **Agent Memory File** (in .claude/agent-memory/)
**Purpose:** Persistent memory for future translation work
**Location:** `/Users/dmotalik/.claude/agent-memory/translation-orchestrator/MEMORY.md`
**Contains:**
- Key audit findings
- File locations requiring action
- Root causes and patterns discovered
- Recommended translation keys
- Effort estimates
- Validation status

**Use this for:** Future translation sessions, preventing regression

---

## Implementation Roadmap

### Phase 1: Fix Hardcoded Text (This Week)
**Total Effort:** 10-12 hours

1. **DiscountCalculator.tsx** (2-3 hours)
   - Add 8 translation keys to cs.json
   - Update component to use `t()` wrapper
   - 5 calculator components need similar fixes

2. **TipCalculator.tsx** (2-3 hours)
3. **CaloriesCalculator.tsx** (2-3 hours)
4. **LoanCalculator.tsx** (2 hours)
5. **CurrencyCalculator.tsx** (1 hour)

**Success Criteria:**
- Zero hardcoded text in calculator components
- All 5 calculators work in all 5 languages
- No console errors for missing translation keys

### Phase 2: Sync Missing Keys (Next Week)
**Total Effort:** 15-18 hours

1. **en.json** (30 min) - Add 6 BMI/BMR keys
2. **sk.json** (4-5 hours) - Add 6 BMI/BMR + 36 Time Calculator keys
3. **pl.json** (5-6 hours) - Add 6 BMI/BMR + 36 Time + 7 Category keys
4. **hu.json** (5-6 hours) - Same as pl.json

**Success Criteria:**
- All 5 locales at 99%+ key parity
- All components render properly in all languages
- No missing translation key errors at runtime

### Phase 3: Automation (This Month)
**Total Effort:** 7 hours

1. **ESLint Rule** (2 hours) - Detect hardcoded text
2. **Pre-commit Hook** (2 hours) - Verify key parity
3. **Documentation** (1 hour) - Translation workflow
4. **CI Checks** (2 hours) - GitHub Actions validation

**Success Criteria:**
- No hardcoded text can be committed
- Key parity checked before every commit
- Translation workflow documented

---

## Key Files to Update

### Components with Hardcoded Text (Phase 1)
```
src/components/calculators/DiscountCalculator.tsx    - 8 strings
src/components/calculators/TipCalculator.tsx         - 7 strings
src/components/calculators/CaloriesCalculator.tsx    - 6 strings
src/components/calculators/LoanCalculator.tsx        - 4 strings
src/components/calculators/CurrencyCalculator.tsx    - 2 strings
```

### Translation Files to Update (Phase 2)
```
src/messages/cs.json  - Add 27+ new keys (Phase 1)
src/messages/en.json  - Add 6 keys (30 min)
src/messages/sk.json  - Add 42 keys (4-5 hours)
src/messages/pl.json  - Add 49 keys (5-6 hours)
src/messages/hu.json  - Add 49 keys (5-6 hours)
```

---

## Recommended Translation Keys (Sample)

### Discount Calculator (8 keys needed)
```json
{
  "discount_type_placeholder": "Vyberte typ výpočtu",
  "discount_type_percentage": "Mám procento slevy",
  "discount_type_amount": "Mám částku slevy",
  "discount_type_final_price": "Mám konečnou cenu",
  "discount_label_type": "Typ výpočtu",
  "discount_label_original_price": "Původní cena",
  "discount_label_percentage": "Procento slevy",
  "discount_label_amount": "Částka slevy"
}
```

### Time Calculator (36 keys needed - see MISSING_KEYS_BY_LOCALE.txt for full list)
```json
{
  "time_label_hours": "Hodiny",
  "time_label_minutes": "Minuty",
  "time_label_seconds": "Sekundy",
  "time_first_time": "Čas 1",
  "time_second_time": "Čas 2",
  "time_add_verb": "Sečíst",
  "time_subtract_verb": "Odečíst"
  ...
}
```

---

## How to Use These Reports

### For Developers
1. Open **HARDCODED_TEXT_INVENTORY.csv** in Excel
2. Work through each row, one component at a time
3. Use the "Recommended Key" column as your key name
4. Wrap hardcoded strings in `t()` function
5. Commit changes with reference to this audit

### For Translators
1. Start with **MISSING_KEYS_BY_LOCALE.txt**
2. Pick one locale (en.json, sk.json, pl.json, or hu.json)
3. Follow the "Implementation Checklist" section
4. Use Czech text from cs.json as reference
5. Add translations for your target language

### For Project Managers
1. Review **Main Audit Report** for understanding
2. Reference **Summary** for executive briefing
3. Use **Roadmap** above for scheduling
4. Track progress against 3-phase plan
5. Update this index as work progresses

### For QA/Testing
1. Review **Validation Checklist** in main report
2. Test each calculator in all 5 languages
3. Verify no console errors for missing keys
4. Check that SelectItems, Labels, placeholders render correctly
5. Update checklist as issues are found/resolved

---

## Quality Assurance

### Pre-Implementation Validation
- [x] All JSON files are syntactically valid
- [x] No cross-language contamination detected
- [x] Structure consistent across all locales
- [x] File sizes reasonable (137-148 KB)

### Post-Implementation Validation (TODO)
- [ ] No hardcoded text in components
- [ ] All 5 locales at 99%+ key parity
- [ ] All components render in all languages
- [ ] No console errors for missing keys
- [ ] Build completes without warnings
- [ ] ESLint checks pass
- [ ] Tests pass (existing + new)

---

## Timeline Estimates

| Phase | Task | Duration | Start | End |
|-------|------|----------|-------|-----|
| 1 | Fix hardcoded text (5 calculators) | 10-12h | Mon | Fri |
| 2 | Add keys to en.json | 30m | Mon | Mon |
| 2 | Translate Time to sk.json | 4-5h | Tue | Tue |
| 2 | Translate Time to pl.json | 4-5h | Wed | Wed |
| 2 | Translate Time to hu.json | 4-5h | Thu | Thu |
| 2 | Add Categories to pl/hu | 2-3h | Thu | Thu |
| 3 | Implement ESLint rule | 2h | Mon | Mon |
| 3 | Implement pre-commit hook | 2h | Tue | Tue |
| 3 | Write workflow docs | 1h | Wed | Wed |
| 3 | Setup CI checks | 2h | Thu | Fri |
| **TOTAL** | | **32-37 hours** | Week 1 | Week 4 |

---

## Success Metrics

### After Phase 1
- [ ] 0 hardcoded Czech text in calculator components
- [ ] All calculators work in Czech
- [ ] All required keys added to cs.json

### After Phase 2
- [ ] Key parity: 99%+ across all 5 locales
- [ ] All calculators work in all 5 languages
- [ ] No "missing translation key" errors at runtime

### After Phase 3
- [ ] ESLint prevents hardcoded text commits
- [ ] Pre-commit hook catches key parity issues
- [ ] Team workflow documented
- [ ] CI pipeline validates translations
- [ ] Zero regression in future commits

---

## Next Steps

1. **TODAY:** Share this audit report with dev team
2. **MONDAY:** Begin Phase 1 (fix hardcoded text)
3. **NEXT WEEK:** Begin Phase 2 (sync missing keys)
4. **THIS MONTH:** Complete Phase 3 (automation)
5. **ONGOING:** Use automation to prevent regression

---

## Questions?

Refer to the comprehensive **TRANSLATION_AUDIT_2026-02-15.md** for detailed information on any aspect of this audit.

For translation-specific questions, see **MISSING_KEYS_BY_LOCALE.txt**.

For developer-specific questions, see **HARDCODED_TEXT_INVENTORY.csv**.

---

*Audit compiled by: Translation Orchestrator Agent*
*Audit date: 2026-02-15*
*Status: COMPLETE - Ready for Implementation*
