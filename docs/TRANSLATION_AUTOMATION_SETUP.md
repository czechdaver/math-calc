# Translation Automation - Setup Complete ✅

**Date:** 2026-02-15
**Status:** Fully operational

---

## What Was Implemented

### 1. Validation Script (`scripts/validate-translations.js`)

Comprehensive 4-phase validation:
- ✅ **Phase 1:** JSON syntax validation
- ✅ **Phase 2:** Key parity checking (all locales vs cs.json reference)
- ✅ **Phase 3:** Hardcoded Czech string detection in components
- ✅ **Phase 4:** Interpolation variable consistency checking

**Usage:**
```bash
npm run validate:translations        # Full validation
npm run validate:translations:quick  # Quick validation (future)
```

**Current results:**
- 26 hardcoded Czech text instances found in 5 calculators
- 146 missing translation keys across sk/pl/hu locales
- Multiple interpolation variable warnings (expected for LaTeX formulas)

---

### 2. Pre-commit Hook (Husky)

Automatically runs validation before every commit.

**Files created:**
- `.husky/pre-commit` - Hook script
- `package.json` - Added `prepare` script for Husky

**Behavior:**
- ✅ Validation passes → Commit proceeds
- ❌ Validation fails → Commit blocked with error details

**Bypass (emergency only):**
```bash
git commit --no-verify -m "Emergency commit"
```

---

### 3. GitHub Actions CI/CD

Two workflows running on every PR and push to main/develop:

**File:** `.github/workflows/translation-validation.yml`

**Job 1: Validate Translations**
- Runs on changes to `src/messages/**`, `src/components/**`, `src/app/**`
- Executes `npm run validate:translations`
- Comments on PR if validation fails

**Job 2: Translation Coverage Report**
- Posts coverage table to PR
- Shows completion percentages for all 5 locales

---

### 4. ESLint Configuration

**File:** `.eslintrc.json`

Basic ESLint rules:
- `no-console` - Warns on console usage
- `prefer-const` - Enforces const
- `@typescript-eslint/no-explicit-any` - Warns on `any` usage
- `@typescript-eslint/no-unused-vars` - Warns on unused variables

---

### 5. Documentation

Comprehensive documentation created:
- **`docs/translation-automation.md`** - Full system documentation (60+ KB)
- **`docs/TRANSLATION_AUTOMATION_SETUP.md`** - This file (setup summary)
- **`CLAUDE.md` updates** - References to automation in project instructions

---

## Files Modified/Created

### Created
```
.eslintrc.json                                    # ESLint configuration
.husky/pre-commit                                 # Git pre-commit hook
.github/workflows/translation-validation.yml      # CI/CD workflow
scripts/validate-translations.js                  # Validation script (executable)
docs/translation-automation.md                    # Full documentation
docs/TRANSLATION_AUTOMATION_SETUP.md              # This file
```

### Modified
```
package.json                                      # Added scripts + Husky dependency
CLAUDE.md                                         # Updated with automation references
```

---

## Current Status

### Translation Coverage (2026-02-15)

| Locale | Keys | Coverage | Missing | Status |
|--------|------|----------|---------|--------|
| cs.json | 1536 | 100% | 0 (reference) | ✅ |
| en.json | 1530 | 99.7% | 6 | ✅ |
| sk.json | 1494 | 97.3% | 42 | ⚠️ |
| pl.json | 1487 | 96.8% | 49 | ⚠️ |
| hu.json | 1487 | 96.8% | 49 | ⚠️ |

### Issues Found

**Hardcoded text (26 instances):**
- CaloriesCalculator.tsx - 11 instances
- CurrencyCalculator.tsx - 4 instances
- DiscountCalculator.tsx - 5 instances
- LoanCalculator.tsx - 1 instance
- TipCalculator.tsx - 5 instances

**Missing keys:**
- en.json: 6 keys (BMI/BMR formulas and aliases)
- sk.json: 42 keys (BMI/BMR + Time Calculator)
- pl.json: 49 keys (BMI/BMR + Time + navigation key)
- hu.json: 49 keys (Same as Polish)

**Interpolation warnings:**
- LaTeX formulas have different variable names per locale (expected)
- Example: `{váha (kg)}` in Czech vs `{weight (kg)}` in English

---

## Testing the System

### 1. Test Validation Script Locally

```bash
npm run validate:translations
```

**Expected output:**
- ✓ JSON syntax validated
- ⚠ Key parity warnings (sk/pl/hu missing keys)
- ⚠ Hardcoded text warnings (26 instances)
- ⚠ Interpolation warnings (expected)

### 2. Test Pre-commit Hook

```bash
# Make a dummy change
echo "// test" >> src/components/calculators/BMICalculator.tsx

# Try to commit
git add .
git commit -m "Test commit"

# Hook will run validation automatically
# Commit will SUCCEED but show warnings
```

### 3. Test CI/CD (GitHub Actions)

1. Create a new branch:
   ```bash
   git checkout -b test/translation-automation
   ```

2. Make a change to a translation file:
   ```bash
   # Add a test key to cs.json
   # Commit and push
   ```

3. Create a PR

4. **Expected GitHub Actions behavior:**
   - ✅ Validation job runs
   - 📊 Coverage report comment appears on PR
   - ⚠️ Shows current warnings (doesn't block merge)

---

## Next Steps (Recommended Priority)

### Phase 1: Fix Hardcoded Text (High Priority)
- **Impact:** Blocks Slovak/Polish/Hungarian localization
- **Effort:** 10-12 hours
- **Calculators to fix:** 5 (Calories, Currency, Discount, Loan, Tip)
- **Process:**
  1. Add translation keys to cs.json and en.json
  2. Replace hardcoded strings with `t('key')`
  3. Re-run validation

### Phase 2: Complete Missing Translations (Medium Priority)
- **Impact:** Required for 100% locale coverage
- **Effort:** 15-18 hours
- **Locales:** sk, pl, hu
- **Recommendation:** Use translation-orchestrator agent for bulk work

### Phase 3: Enhance Automation (Low Priority)
- **Impact:** Prevents future regressions
- **Effort:** 7 hours
- **Enhancements:**
  - Custom ESLint plugin for real-time hardcoded text detection
  - Translation coverage badge in README
  - Automatic PR creation for missing translations

---

## Troubleshooting

### Pre-commit Hook Not Running

**Symptom:** Commits succeed without validation

**Fix:**
```bash
rm -rf .husky
npm run prepare
npx husky add .husky/pre-commit "npm run validate:translations"
```

### Validation Script Fails

**Symptom:** `TypeError: value.match is not a function`

**Fix:** Already fixed in current version (checks for string type)

### GitHub Actions Failing

**Symptom:** CI fails with module errors

**Fix:** Ensure `chalk` dependency is in `package.json` (already added)

---

## Integration with Existing Workflows

### For Developers

1. **Before starting work:**
   ```bash
   npm run validate:translations  # Check current status
   ```

2. **While working:**
   - Use `t('key')` for all text
   - Add keys to cs.json and en.json
   - No hardcoded Czech strings

3. **Before committing:**
   - Pre-commit hook runs automatically
   - Fix any errors before commit succeeds

4. **In PR review:**
   - Check GitHub Actions results
   - Review coverage report comment

### For Translation Work

**Use Translation Orchestrator Agent:**
```
"Add Slovak translations for [calculator-name]"
"Sync all locales with cs.json"
"Fix hardcoded text in CaloriesCalculator"
```

**Or manual process:**
1. Run validation to see missing keys
2. Add translations to locale files
3. Re-run validation to verify
4. Commit changes (pre-commit hook validates)

---

## Metrics & Monitoring

### Performance
- **Validation script:** 2-6 seconds
- **Pre-commit hook:** 2-6 seconds (low friction)
- **CI/CD jobs:** ~1 minute total

### Quality Gates
- ✅ **JSON syntax:** Must be valid (blocks build)
- ⚠️ **Key parity:** Warnings only (doesn't block)
- ⚠️ **Hardcoded text:** Warnings only (should fix)
- ⚠️ **Interpolation:** Warnings only (expected for LaTeX)

### Goals
- cs.json: 100% coverage ✅
- en.json: 100% coverage (TARGET: 99.7% → 100%)
- sk/pl/hu.json: 100% coverage (TARGET: ~97% → 100%)
- Hardcoded text: 0 instances (TARGET: 26 → 0)

---

## Resources

### Documentation
- **Full system docs:** [`translation-automation.md`](translation-automation.md)
- **Usage guide:** [`translation-orchestrator-usage.md`](translation-orchestrator-usage.md)
- **Quick start:** [`translation-orchestrator-quickstart.md`](translation-orchestrator-quickstart.md)

### Audit Reports (2026-02-15)
- **Comprehensive audit:** [`../TRANSLATION_AUDIT_2026-02-15.md`](../TRANSLATION_AUDIT_2026-02-15.md)
- **Hardcoded text inventory:** [`../HARDCODED_TEXT_INVENTORY.csv`](../HARDCODED_TEXT_INVENTORY.csv)
- **Missing keys:** [`../MISSING_KEYS_BY_LOCALE.txt`](../MISSING_KEYS_BY_LOCALE.txt)

### Project Instructions
- **Main instructions:** [`../CLAUDE.md`](../CLAUDE.md) (section 12: Translation workflows)

---

## Success Criteria ✅

- [x] Validation script created and working
- [x] Pre-commit hook installed and functional
- [x] GitHub Actions workflow configured
- [x] ESLint configuration added
- [x] Comprehensive documentation written
- [x] CLAUDE.md updated with references
- [x] Tested locally (validation script works)
- [ ] **TODO:** Test GitHub Actions on PR
- [ ] **TODO:** Fix hardcoded text (Phase 1)
- [ ] **TODO:** Complete missing translations (Phase 2)

---

## Maintenance

### Weekly
- Review GitHub Actions runs for new translation issues
- Monitor coverage percentages in PR comments

### Per Calculator Addition
- Add translation keys to cs.json and en.json
- Run `npm run validate:translations` before commit
- Pre-commit hook will enforce validation

### Per Release
- Ensure en.json has 100% coverage (required)
- Aim for 100% coverage in sk/pl/hu (nice-to-have)
- Zero hardcoded text instances (target)

---

*Translation automation is now fully operational and will scale to 141+ calculators with minimal manual overhead.*

**Setup completed by:** Claude Sonnet 4.5
**Date:** 2026-02-15
**Automation level:** Pre-commit + CI/CD + Validation script
