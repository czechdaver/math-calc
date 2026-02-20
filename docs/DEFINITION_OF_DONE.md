# Definition of Done – Kalkulačka

**Verze:** 2.0
**Datum:** 2026-02-11
**Účel:** Jednotná definice "hotové" kalkulačky pro všechny refaktoringové aktivity.

---

## Přehled

Kalkulačka je považována za **✅ DONE** pouze pokud splňuje **VŠECHNY** povinné požadavky. Požadavky jsou rozděleny do 4 kategorií:

1. **Architektura** – technická implementace
2. **Data** – centralizovaná konfigurace
3. **Obsah** – uživatelská informace
4. **SEO** – vyhledávací optimalizace

---

## 1. Architektura (Required)

### 1.1 Komponenty

| Požadavek | Detail | Check |
|-----------|--------|-------|
| SimpleCalculatorLayout | Hlavní layout komponenta | `import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout'` |
| CalculatorInput | Sdílený input komponenta | `import { CalculatorInput } from '@/components/calculators/shared'` |
| CalculatorResult | Sdílený výsledek komponenta | `import { CalculatorResult } from '@/components/calculators/shared'` |
| getRelatedCalculators | Centralizovaná data funkce | `import { getRelatedCalculators } from '@/lib/calculatorDataUtils'` |

### 1.2 Page Wrapper

Každá route MUSÍ mít standardizovaný wrapper:

```tsx
// src/app/[locale]/calculator/{category}/{slug}/page.tsx
'use client';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const MyCalculator = dynamic(
  () => import('@/components/calculators/MyCalculator'),
  { ssr: false }
);

export default function MyCalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={MyCalculator}
      calculatorId="my-calculator"
    />
  );
}
```

**Požadavky:**
- [ ] Dynamic import s `ssr: false`
- [ ] CalculatorPageWrapper (ErrorBoundary + Suspense)
- [ ] Předáno calculatorId string

### 1.3 Komponenta kalkulačky

```tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { getRelatedCalculators } from '@/lib/calculatorDataUtils';

interface MyResult {
  value: number;
  isValid: boolean;
}

const MyCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  // State
  const [input1, setInput1] = useState<string>('');
  const [errors, setErrors] = useState<{ input1?: string }>({});
  const [result, setResult] = useState<MyResult | null>(null);

  // Real-time výpočet
  useEffect(() => {
    // validace → výpočet → setResult
  }, [input1]);

  // Centralizovaná data
  const relatedCalculators = getRelatedCalculators('my-calculator', locale, t);

  return (
    <SimpleCalculatorLayout
      title={t('my_calc_title')}
      description={t('my_calc_desc')}
      category="category"
      seo={{ title: t('my_calc_seo_title'), description: t('my_calc_seo_desc'), keywords: [...] }}
      formula={{ latex: String.raw`E = mc^2`, description: t('my_calc_formula_desc') }}
      examples={{ title: t('examples_title'), description: t('examples_desc'), scenarios: [...] }}
      faq={[{ question: t('faq_1_q'), answer: t('faq_1_a') }, ...]}
      relatedCalculators={relatedCalculators}
      schemaData={{ applicationCategory: "UtilityApplication", operatingSystem: "Any" }}
      resultSection={result && <CalculatorResult ... />}
    >
      {/* Inputy s CalculatorInput */}
    </SimpleCalculatorLayout>
  );
};
```

**Požadavky:**
- [ ] `'use client'` directive
- [ ] `useTranslations()` hook
- [ ] `useParams()` pro locale
- [ ] Result interface (TypeScript)
- [ ] Real-time výpočet přes `useEffect` (žádný submit button)
- [ ] Input validation s error messages
- [ ] Pod 250 řádků NEBO logika extrahovaná

### 1.4 Anti-patterns (NESMÍ)

- [ ] Žádný `CalculatorBase` import
- [ ] Žádné hardcoded `relatedCalculators` pole
- [ ] Žádný inline layout bez SimpleCalculatorLayout
- [ ] Žádný soubor s `-new`, `-old`, `-refactored` suffixem
- [ ] Žádné `any` typy (kromě výjimek)

---

## 2. Data (Required)

### 2.1 calculators.json

Každá kalkulačka MUSÍ mít záznam v `src/data/calculators.json`:

```json
"my-calculator": {
  "id": "my-calculator",
  "slug": "my-calculator",
  "category": "math",
  "popularity": 70,
  "titleKey": "my_calculator_title",
  "descriptionKey": "my_calculator_description",
  "path": "/calculator/matika/my-calculator",
  "tags": ["math", "geometry"],
  "relatedCategories": ["math", "education"]
}
```

### 2.2 calculator-relationships.json

Volitelné – pokud existuje, používá se pro `getRelatedCalculators()`. Fallback策略:
1. Podívá se do calculator-relationships.json
2. Pokud nenajde, použije calculators.json (relatedCategories)
3. Pokud ani to ne, používá kategorii

**Požadavky:**
- [ ] ID v calculators.json EXACTNĚ shodné s parametrem getRelatedCalculators()
- [ ] Route v calculators.json EXACTNĚ shodná s URL

---

## 3. Obsah (Required)

### 3.1 LaTeX Formula

Každá kalkulačka MUSÍ zobrazovat vzorec:

```tsx
formula={{
  latex: String.raw`V = l \times š \times v`,
  description: 'Objem kvádru je součin délky, šířky a výšky.'
}}
```

**Požadavky:**
- [ ] `String.raw` pro escape LaTeX
- [ ] Popis v češtině (pro cs locale)
- [ ] Validní LaTeX syntaxe

### 3.2 Examples (Příklady)

Minimálně **2 scénáře**:

```tsx
examples={{
  title: 'Příklady výpočtu',
  description: 'Praktické příklady použití',
  scenarios: [
    {
      title: 'Základní výpočet',
      description: 'Popis scénáře',
      example: 'vstup → výstup'
    },
    {
      title: 'Finanční příklad',
      description: 'Popis scénáře',
      example: 'vstup → výstup'
    }
  ]
}}
```

**Požadavky:**
- [ ] Min. 2 scénáře
- [ ] Praktické, reálné příklady
- [ ] Domain-specific příklady (finance, zdraví, stavebnictví)

### 3.3 FAQ (Časté dotazy)

Minimálně **3 otázky**:

```tsx
faq={[
  {
    question: 'Jak funguje výpočet?',
    answer: 'Podrobné vysvětlení vzorce.'
  },
  {
    question: 'Kdy použiji tuto kalkulačku?',
    answer: 'Praktické případy použití.'
  },
  {
    question: 'Jaké jsou běžné chyby?',
    answer: 'Upozornění na časté chyby.'
  }
]}
```

**Požadavky:**
- [ ] Min. 3 otázky
- [ ] Targetují Google "People Also Ask" snippety
- [ ] Vzdělávací charakter

### 3.4 Related Calculators

```tsx
const relatedCalculators = getRelatedCalculators('my-calculator', locale, t);

// V SimpleCalculatorLayout:
relatedCalculators={relatedCalculators}
```

**Požadavky:**
- [ ] Volání `getRelatedCalculators(id, locale, t)`
- [ ] ID shodné s calculators.json
- [ ] Žádné hardcoded pole

---

## 4. SEO (Required)

### 4.1 Metadata

```tsx
seo={{
  title: 'Kalkulačka: Můj výpočet | MathCalc Pro',
  description: 'Bezplatná kalkulačka pro výpočet...',
  keywords: ['kalkulačka', 'výpočet', 'matematika']
}}
```

**Požadavky:**
- [ ] Title včetně "MathCalc Pro" suffix
- [ ] Description 150-160 znaků
- [ ] Keywords pole (5-10 frází)

### 4.2 Schema.org

```tsx
schemaData={{
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any"
}}
```

**Požadavky:**
- [ ] SoftwareApplication schema
- [ ] applicationCategory podle typu kalkulačky
- [ ] operatingSystem: "Any"

---

## 5. Internationalization (i18n)

### 5.1 Překladové klíče

**Povinné jazyky:**
- [ ] `cs.json` (čeština – výchozí)
- [ ] `en.json` (angličtina – pro EN traffic)

**Volitelné jazyky (vynecháno pro DONE status):**
- [ ] `sk.json` (slovenština)
- [ ] `pl.json` (polština)
- [ ] `hu.json` (maďarština)

### 5.2 Formatování

Čísla se formátují podle locale:
- **CZ/SK/PL/HU:** `1 234,56` (čárka = desetinný, mezera = tisíce)
- **EN:** `1,234.56` (tečka = desetinný, čárka = tisíce)

```tsx
const formatNumber = (num: number): string => {
  return num.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
};
```

---

## 6. Kontrolní Checklist

Před označením kalkulačky jako ✅ DONE ověř:

### Architektura
- [ ] SimpleCalculatorLayout použit
- [ ] CalculatorInput/CalculatorResult ze shared
- [ ] getRelatedCalculators() voláno (nikdy hardcoded)
- [ ] Page wrapper s CalculatorPageWrapper
- [ ] Result interface definován
- [ ] Real-time výpočet (useEffect)
- [ ] Input validation
- [ ] Pod 250 řádků OR logika extrahovaná

### Data
- [ ] Záznam v calculators.json
- [ ] ID shodné s getRelatedCalculators parametrem

### Obsah
- [ ] LaTeX vzorec přítomen
- [ ] Examples sekce (min. 2 scénáře)
- [ ] FAQ sekce (min. 3 otázky)
- [ ] Related calculators přes getRelatedCalculators()

### SEO
- [ ] Title + description + keywords
- [ ] Schema.org data (SoftwareApplication)

### i18n
- [ ] cs.json překlady
- [ ] en.json překlady
- [ ] Formátování čísel podle locale

### Anti-patterns
- [ ] Žádný CalculatorBase
- [ ] Žádné hardcoded relatedCalculators
- [ ] Žádné -new/-old/-refactored soubory
- [ ] Žádné any typy

---

## 7. Stavy a jejich význam

| Stav | Význam |
|------|---------|
| ✅ DONE | Vše výše uvedené splněno (i18n vynecháno pro sk/pl/hu) |
| ⚠️ PARTIAL | SimpleCalculatorLayout použit, ale stáleCalculatorBase |
| ⬜ NOT_STARTED | Čeká na refaktoring |
| 🔗 REFERENCE | Referenční implementace (BMICalculator) |

---

## 8. Example: BMI Calculator (Reference)

**Soubor:** `src/components/calculators/BMICalculator.tsx`

```tsx
// Všechny požadavky splněny:
✅ SimpleCalculatorLayout
✅ CalculatorInput/CalculatorResult
✅ getRelatedCalculators('bmi', locale, t)
✅ Result interface (BMIResult)
✅ Real-time výpočet
✅ Input validation
✅ LaTeX vzorec
✅ Examples (3 scénáře)
✅ FAQ (6 otázek)
✅ SEO metadata
✅ Schema.org
✅ cs.json + en.json překlady
✅ 218 řádků (pod limitem)
```

---

*Tyto požadavky jsou závazné pro všechny nové i refaktorované kalkulačky.*
