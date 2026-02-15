# Translation Orchestrator - Quick Start

> **TL;DR**: Unified Haiku-powered agent that scans code for hardcoded text, finds missing translation keys, and orchestrates translations across 5 locales.

---

## 🚀 Quick Start

### Run POC to See Current Issues
```bash
./scripts/translation-scanner-poc.sh
```

**Output shows**:
- 5 hardcoded Czech placeholders in calculator components
- 144 missing keys in sk.json
- 141 missing keys in pl.json
- 96 missing keys in hu.json

---

## 💬 How to Use (Example Prompts)

### Full Audit
```
"Check for missing translation keys"
"Audit translations"
```

### Fix Hardcoded Text
```
"Fix hardcoded text in CaloriesCalculator"
"Find and fix all hardcoded placeholders"
```

### Add Missing Translations
```
"Add Slovak translations for BMI calculator"
"Generate missing Polish translations"
"Sync all locales with cs.json"
```

### Validation
```
"Validate translation files"
"Check for unused translation keys"
```

---

## 🎯 Current Status (2026-02-15)

| Locale | Keys | Missing | % Complete |
|--------|------|---------|------------|
| cs.json | 2147 | 0 (ref) | 100% |
| en.json | 2145 | 2 | 99.9% |
| sk.json | 2003 | 144 | 93.3% |
| pl.json | 2006 | 141 | 93.4% |
| hu.json | 2051 | 96 | 95.5% |

**Hardcoded text**: 5 instances (CaloriesCalculator, CurrencyCalculator, DiscountCalculator)

---

## 🔧 Agent Capabilities

### 1️⃣ Code Scanning
- Finds hardcoded strings in JSX
- Detects missing `useTranslations()` imports
- Suggests translation keys

### 2️⃣ Gap Analysis
- Compares all 5 locale files
- Finds missing/empty/stale keys
- Reports inconsistencies

### 3️⃣ Translation Generation
- **Transcreation** (not literal translation)
- Locale-specific examples, currencies, formats
- Preserves interpolation variables and HTML tags

### 4️⃣ Validation
- JSON syntax checks
- Key parity verification
- No cross-language contamination

---

## 💰 Cost Optimization

**Haiku-first approach** (default):
- ✅ File scanning: ~$0.01 per run
- ✅ Simple translations: ~$0.05 per 100 keys
- ✅ Validation: ~$0.01 per run

**Escalate to Sonnet** only when:
- ⚠️ Educational content >500 words
- ⚠️ Country-specific calculators (OSVČ, PIT-37)
- ⚠️ EN content for high-CPC keywords

**Estimated savings**: ~20x cheaper than Sonnet-only approach

---

## 📚 Full Documentation

- **Specification**: [`translation-orchestrator-agent.md`](translation-orchestrator-agent.md)
- **Usage Guide**: [`translation-orchestrator-usage.md`](translation-orchestrator-usage.md)
- **POC Script**: `scripts/translation-scanner-poc.sh`

---

## ✅ Next Steps

1. ⬜ Run POC to see current issues: `./scripts/translation-scanner-poc.sh`
2. ⬜ Fix hardcoded text in 3 calculators
3. ⬜ Sync sk.json (add 144 keys)
4. ⬜ Sync pl.json (add 141 keys)
5. ⬜ Sync hu.json (add 96 keys)
6. ⬜ Validate all locales have 2147 keys
7. ⬜ Add to CI/CD pipeline to prevent regressions

---

*This agent merges translation search, orchestration, and validation into one unified, cost-efficient workflow powered by Haiku.*
