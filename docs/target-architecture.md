# MathCalc Pro - Cílová architektura po refaktoringu

**Datum:** 2026-02-11
**Verze:** 1.0
**Autor:** Architecture Analysis

---

## 1. Cílová struktura projektu

### 1.1 Adresářová struktura

```
src/
├── app/
│   ├── [locale]/
│   │   ├── calculator/
│   │   │   ├── {category}/
│   │   │   │   └── {calculator-slug}/
│   │   │   │       └── page.tsx           # Standardizovaný wrapper (30-40 řádků)
│   │   │   └── _redirects.ts              # Next.js redirects pro deprecated routes
│   │   └── layout.tsx
│   └── api/
│       └── ratings/                       # Existující API endpoint
│
├── components/
│   ├── calculators/
│   │   ├── {Name}Calculator.tsx           # Hlavní komponenta (150-250 řádků)
│   │   ├── __tests__/
│   │   │   └── {Name}Calculator.test.tsx  # Unit testy
│   │   └── shared/                        # Sdílené komponenty (viz sekce 2)
│   │
│   ├── layout/
│   │   └── SimpleCalculatorLayout.tsx     # Hlavní layout komponenta
│   │
│   ├── shared/                            # NOVÁ: Sdílené komponenty pro celou app
│   │   ├── ErrorBoundary.tsx              # Sdílený ErrorBoundary
│   │   ├── CalculatorPageWrapper.tsx      # Sdílený page wrapper
│   │   └── LoadingSkeletons.tsx           # Loading stavy
│   │
│   └── ui/                                # shadcn/ui komponenty (24)
│
├── config/
│   ├── calculators.ts                     # Centralizovaná konfigurace kalkulaček
│   ├── categories.ts                      # Konfigurace kategorií
│   └── redirects.ts                       # Konfigurace redirectů
│
├── data/
│   ├── calculators.json                   # Metadata všech 47 kalkulaček
│   ├── calculator-relationships.json      # Relace mezi kalkulačkami
│   └── calculator-categories.json         # Kategorie a priority
│
├── hooks/
│   ├── useCalculatorValidation.ts         # NOVÁ: Validace hook
│   ├── useCalculatorResult.ts             # NOVÁ: Výpočet hook
│   └── useFormattedNumber.ts              # NOVÁ: Formátování čísel
│
├── i18n/
│   ├── settings.ts                        # 5 locales: cs, en, sk, pl, hu
│   └── request.ts
│
├── lib/
│   ├── calculatorDataUtils.ts             # getRelatedCalculators(), getCalculator()
│   ├── calculatorValidation.ts            # NOVÁ: Validace funkce
│   ├── calculatorFormatting.ts            # NOVÁ: Formátování výsledků
│   └── utils.ts                           # Obecné utility
│
├── messages/
│   ├── cs.json                            # České překlady
│   ├── en.json                            # Anglické překlady
│   ├── sk.json                            # NOVÉ: Slovenské překlady
│   ├── pl.json                            # NOVÉ: Polské překlady
│   └── hu.json                            # NOVÉ: Maďarské překlady
│
├── types/
│   ├── calculator.ts                      # TypeScript typy pro kalkulačky
│   ├── validation.ts                      # Typy pro validaci
│   └── result.ts                          # Typy pro výsledky
│
└── utils/
    ├── math/                              # NOVÁ: Matematické funkce
    │   ├── percentage.ts
    │   ├── fraction.ts
    │   └── geometry.ts
    └── validation/                        # NOVÁ: Validace utility
        ├── number.ts
        └── range.ts
```

---

## 2. Sdílené komponenty a jejich API

### 2.1 CalculatorPageWrapper (NOVÁ)

**Cíl:** Odstranit 8 duplicitních ErrorBoundary implementací.

**Umístění:** `src/components/shared/CalculatorPageWrapper.tsx`

```typescript
interface CalculatorPageWrapperProps {
  calculatorComponent: React.ComponentType;
  calculatorId: string;
  fallback?: React.ComponentType;
}

// Použití:
export default function CalculatorPage() {
  return (
    <CalculatorPageWrapper
      calculatorComponent={BMICalculator}
      calculatorId="bmi"
    />
  );
}
```

**Implementace:**
- Obsahuje ErrorBoundary class komponentu
- Suspense s Skeleton loader
- Dynamic import se `ssr: false`
- Fallback UI s lokalizovanými chybovými zprávami

**Výsledek:** Page wrapper zmenší z 82 řádků na ~15 řádků.

---

### 2.2 CalculatorInput (existující, rozšířené API)

**Cíl:** Unifikovat všechny inputy do jedné komponenty.

**Aktuální API:**
```typescript
interface CalculatorInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'number' | 'text' | 'select' | 'radio';
  placeholder?: string;
  step?: string;
  min?: string;
  max?: string;
  unit?: string;
  helpText?: string;
  error?: string;
  options?: Array<{ value: string; label: string }>;
  className?: string;
}
```

**Nové vlastnosti (rozšíření):**
- `type: 'select'` - select dropdown
- `type: 'radio'` - radio button group
- `options` - pro select/radio typy
- Lepší accessibility (ARIA labels)

---

### 2.3 CalculatorResult (existující, rozšířené API)

**Cíl:** Unifikovat zobrazení výsledků.

```typescript
interface CalculatorResultProps {
  title?: string;
  value: string | number;
  unit?: string;
  description?: string;
  formula?: string;
  additionalInfo?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}
```

**Nové vlastnosti:**
- `variant` - pro různé styly výsledku
- Lepší locale awareness (používá aktuální locale místo hardcoded 'cs-CZ')

---

### 2.4 ErrorBoundary (NOVÁ - sdílená)

**Cíl:** Centralizovat error handling.

**Umístění:** `src/components/shared/ErrorBoundary.tsx`

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  // Implementace s:
  // - Lokalizovanými chybovými zprávami
  // - Reset funkcionality
  // - Optional error logging (Sentry?)
}
```

---

### 2.5 SimpleCalculatorLayout (existující - žádné změny)

**Cíl:** Zůstane hlavním layout komponentou pro všechny kalkulačky.

**Rozšíření API (volitelné):**
- `loadingState?: ReactNode` - pro granulární loading stavy
- `errorState?: ReactNode` - pro custom error UI

---

## 3. Standardizované rozhraní kalkulačky

### 3.1 Lifecycle kalkulačky

```
1. INIT (mount)
   ├─ Načtení překladů (useTranslations)
   ├─ Načtení konfigurace (getCalculator)
   └─ Inicializace stavu (useState)

2. INPUT (změna hodnoty)
   ├─ onChange handler
   ├─ useCalculatorValidation.validate()
   ├─ setError() pokud validace selže
   └─ clearError() pokud validace projde

3. CALCULATE (validní input)
   ├─ useEffect nad inputy
   ├─ useCalculatorResult.calculate()
   ├─ setResult()
   └─ formatResult()

4. DISPLAY (zobrazení)
   ├─ CalculatorResult component
   ├─ Podmíněné zobrazení (hasResults)
   └─ Formátování podle locale

5. ERROR (chyba)
   ├─ Zobrazení error zprávy
   ├─ ARIA live region pro a11y
   └─ Možnost retry
```

---

### 3.2 Props / Konfigurace

Každá kalkulačka MUSÍ mít:

```typescript
interface CalculatorConfig {
  // Identifikace
  id: string;                    // 'bmi', 'dph', 'procento-z-cisla'
  category: string;              // 'zdravi', 'finance', 'matematika'

  // Lokalizace
  titleKey: string;              // 'bmi_calculator_title'
  descriptionKey: string;        // 'bmi_calculator_description'

  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };

  // Formula (volitelné, ale doporučené)
  formula?: {
    latex: string;
    description: string;
  };

  // Examples (volitelné, ale doporučené)
  examples?: {
    titleKey: string;
    descriptionKey: string;
    scenarios: Array<{
      titleKey: string;
      descriptionKey: string;
      input: Record<string, string | number>;
      expectedOutput: Record<string, string | number>;
    }>;
  };

  // FAQ (volitelné, ale doporučené)
  faq?: Array<{
    questionKey: string;
    answerKey: string;
  }>;

  // Vstupy
  inputs: Array<{
    id: string;
    type: 'number' | 'text' | 'select' | 'radio';
    labelKey: string;
    placeholderKey?: string;
    unit?: string;
    step?: string;
    min?: number;
    max?: number;
    options?: Array<{ value: string; labelKey: string }>;
    helpTextKey?: string;
    validation?: {
      required?: boolean;
      min?: number;
      max?: number;
      custom?: (value: string) => string | null;
    };
  }>;

  // Výstupy
  outputs: Array<{
    id: string;
    labelKey: string;
    unit?: string;
    format?: 'number' | 'percentage' | 'currency';
  }>;
}
```

---

### 3.3 Error States

Každá kalkulačka MUSÍ ošetřovat:

```typescript
interface CalculatorErrors {
  [inputId: string]: string | undefined;
}

// Použití:
const [errors, setErrors] = useState<CalculatorErrors>({});

// Validace
const validate = (): boolean => {
  const newErrors: CalculatorErrors = {};

  if (!height) {
    newErrors.height = t('validation_height_required');
  }
  if (height && (parseFloat(height) < 50 || parseFloat(height) > 300)) {
    newErrors.height = t('validation_height_range');
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

---

### 3.4 Loading States

```typescript
interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Použití:
const [loading, setLoading] = useState<LoadingState>({
  isLoading: false,
});

// Suspense fallback:
<Suspense fallback={<CalculatorSkeleton />}>
  <BMICalculator />
</Suspense>
```

---

### 3.5 Responsive Breakpoints

```typescript
// Tailwind breakpointy (konfigurace v tailwind.config.js)
{
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large desktop
}

// Použití v komponentách:
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2"> {/* Hlavní obsah */}</div>
  <div className="lg:col-span-1"> {/* Sidebar */}</div>
</div>
```

---

## 4. Styling strategie

### 4.1 Zásady

1. **Tailwind utility classes** - Používat vždy před vlastním CSS
2. **`cn()` helper** - Pro podmíněné třídy (clsx + tailwind-merge)
3. **CSS proměnné** - Pro theming (HSL barvy v globals.css)
4. **Dark mode** - Class-based strategie přes next-themes
5. **Žádné inline styly** - Kromě dynamických hodnot (např. height)
6. **Responsive mobile-first** - Default = mobile, přidávat `md:`, `lg:`

---

### 4.2 Component composition pattern

```typescript
// SPRÁVNĚ - pomocí utility classes
<div className="flex flex-col gap-4 p-6 bg-card rounded-lg border">
  <CalculatorInput ... />
  <CalculatorResult ... />
</div>

// ŠPATNĚ - inline styly
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
```

---

### 4.3 Theming systém

```css
/* globals.css - CSS proměnné */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

```typescript
// Použití v komponentách
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Vypočítat
</Button>
```

---

## 5. Migrace plan

### 5.1 Co se dá udělat inkrementálně (BEZ breaking changes)

#### Fáze 0: Příprava infrastruktury (1-2 týdny)

1. **Vytvořit sdílené komponenty:**
   - `src/components/shared/ErrorBoundary.tsx`
   - `src/components/shared/CalculatorPageWrapper.tsx`
   - `src/components/shared/LoadingSkeletons.tsx`

2. **Opravit locale inconsistency:**
   - Sjednotit middleware (5 locales) s i18n/settings.ts (přidat sk, pl, hu)
   - Vytvořit prázdné překladové soubory pro sk.json, pl.json, hu.json

3. **Rozdělit calculatorUtils.ts:**
   - `src/lib/calculatorValidation.ts`
   - `src/lib/calculatorFormatting.ts`
   - `src/utils/math/` (nový adresář)

4. **Aktualizovat calculators.json:**
   - Přidat chybějící metadata pro všech 47 kalkulaček
   - Ověřit konzistenci ID a slugs

**Výsledek:** Infrastruktura připravena, žádné breaking changes.

---

#### Fáze 1: Uklid duplikátů (2-3 týdny)

5. **Vyřešit 11 duplicitních route pairs:**
   - Pro každý pár: ověřit která varianta je lepší
   - Lepší variantu přejmenovat na původní název (př. bmi-new → bmi)
   - Horší variantu smazat
   - Přidat Next.js redirect pro starou URL

   **Postup pro jeden pair:**
   ```bash
   # 1. Ověřit kvality obou verzí
   # 2. Vybrat lepší
   # 3. Přesunout lepší na původní URL
   git mv app/[locale]/calculator/bmi-new app/[locale]/calculator/bmi
   # 4. Smazat horší
   rm -rf app/[locale]/calculator/bmi-old
   # 5. Přidat redirect do _redirects.ts
   ```

6. **Smazat CalculatorBase.tsx:**
   - Až po migraci všech 12 uživatelů na SimpleCalculatorLayout
   - Nejdříve vytvořit alias pro backward compatibility

7. **Nahradit 23 hardcoded relatedCalculators:**
   - Najít všechny soubory s hardcoded poli
   - Nahradit voláním `getRelatedCalculators(calculatorId, locale, t)`
   - Odebrat ~1500 řádků duplicity

**Výsledek:** 0 duplicit, čistá kódová báze.

---

#### Fáze 2: Migrace na SimpleCalculatorLayout (3-4 týdny)

8. **Migrovat 10 CalculatorBase uživatelů:**

   **Postup pro jednu kalkulačku:**
   ```bash
   # 1. Přečíst BMI v2 jako referenci
   # 2. Přečíst aktuální implementaci
   # 3. Refaktorovat:
   #    - CalculatorBase → SimpleCalculatorLayout
   #    - Manuální inputy → CalculatorInput
   #    - Hardcoded outputs → CalculatorResult
   #    - Hardcoded relatedCalculators → getRelatedCalculators()
   # 4. Aktualizovat page wrapper na CalculatorPageWrapper
   # 5. Otestovat na všech 5 locale
   # 6. Commit
   ```

   **Seznam k migraci:**
   - DirectProportionCalculator (trojclenka/prima-umera)
   - InverseProportionCalculator (trojclenka/neprima-umera)
   - FractionsCalculator (zlomky)
   - CompoundInterestCalculator (financie-rozsirene/slozene-uroceni)
   - AnnuityPaymentCalculator (financie-rozsirene/anuitni-splatka)
   - WhatPercentageIsXOfYCalculator (procenta)
   - YIsXWhatIsHundredCalculator (procenta)
   - NetSalaryCalculator (cista-mzda)
   - UnitConverter (prevodnik-jednotek)
   - + 2 další

9. **Standardizovat page wrappery:**
   - Všechny na CalculatorPageWrapper pattern
   - Odstranit Card layouty z page files

10. **Používat CalculatorInput/CalculatorResult:**
    - Nahradit manual forms ve 20+ souborech
    - Využít rozšířené API (select, radio variants)

**Výsledek:** Všechny kalkulačky používají SimpleCalculatorLayout.

---

#### Fáze 3: Implementace placeholerů (4-5 týdnů)

11. **Implementovat 6 fraction operations:**
    - FractionAddition - sčítání zlomků
    - FractionSubtraction - odčítání zlomků
    - FractionMultiplication - násobení zlomků
    - FractionDivision - dělení zlomků
    - FractionSimplification - zjednodušení zlomků
    - FractionConversion - konverze na desetinná čísla

12. **Implementovat 6 fitness calculators:**
    - Výpočet kalorií
    - BMI pro děti a dospělé
    - Tělesný tuk
    - BMR (bazální metabolismus)
    - TDEE (denní výdej energie)
    - Ideální váha

13. **Implementovat 6 practical calculators:**
    - Převod měn
    - Výpočet úroku
    - Slevové procento
    - Marže
    - Převod číselných soustav
    - Výpočet daně z příjmu

**Výsledek:** Všechny 47 kalkulaček funkční.

---

### 5.2 Co vyžaduje breaking changes

#### Fáze 4: Kvalita kódu (3-4 týdny)

14. **Povolit TypeScript strict mode:**
    ```json
    // tsconfig.json
    {
      "compilerOptions": {
        "strict": true,
        "strictNullChecks": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true
      }
    }
    ```
    - Opravit všechny type errors
    - Může vyžadat refactor API některých komponent

15. **Rozdělit velké soubory:**
    - VolumeCalculator (666 řádků) → pod 250
    - ConcreteCalculator (649 řádků) → pod 250
    - IRRCalculator (555 řádků) → pod 250
    - CalculatorRating (246 řádků) → pod 150 s custom hooks

16. **Aktualizovat SEO:**
    - Přepsat SeoMetadata.tsx použitím Next.js 14 metadata API
    - Přidat Open Graph, Twitter Card, Canonical URLs, Hreflang

**Výsledek:** Type-safe, malé soubory, moderní SEO.

---

### 5.3 Pořadí migrace kalkulaček

#### Priorita 1: MVP kalkulačky (nejdůležitější)
1. BMI v2 → již hotovo (reference)
2. DPH - již používá SimpleCalculatorLayout, jen drobné úpravy
3. Procenta (3 varianty) - drobné refaktoringy
4. Cistá mzda - vyžaduje větší refactor
5. Převodník jednotek - custom layout → SimpleCalculatorLayout
6. Trojclenka (2 varianty) - CalculatorBase → SimpleCalculatorLayout

#### Priorita 2: Finance (vysoce využívané)
7. Složené úročení - CalculatorBase → SimpleCalculatorLayout
8. Anuitní splátka - CalculatorBase → SimpleCalculatorLayout
9. IRR - již dobré, jen zmenšit pod 250 řádků
10. NPV - ověřit stav
11. ROI - ověřit stav
12. Předčasné splacení - ověřit stav

#### Priorita 3: Stavební (funkční, velké soubory)
13. Beton - zmenšit z 649 řádků
14. Objem - zmenšit z 666 řádků
15. Plocha - ověřit stav
16. Materiály - ověřit stav
17. Izolace - ověřit stav

#### Priorita 4: Placeholdery (neimplementované)
18-23. Fraction operations (6)
24-29. Fitness calculators (6)
30-35. Practical calculators (6)

---

## 6. Technické rozhodnutí

### 6.1 Co zachovat

| Technologie | Důvod zachování |
|---|---|
| **Next.js 14+ (App Router)** | Moderní SSR, routing, metadata API |
| **React 18+** | Stabilní, dobře podporovaný |
| **Tailwind CSS 3.4** | Flexibilní, konzistentní styly |
| **shadcn/ui** | Kvalitní komponenty, Radix UI primitives |
| **next-intl 4.3.4** | Funkční i18n řešení |
| **KaTeX + react-katex** | LaTeX vzorce fungují dobře |
| **SimpleCalculatorLayout** | Solid foundation, 40+ kalkulaček ho používá |
| **CalculatorInput/Result** | Dobré API, stačí rozšířit |
| **getRelatedCalculators()** | Centralizovaný přístup funguje |
| **calculatorDataUtils.ts** | Dobrá abstrakce |

---

### 6.2 Co vyměnit

| Nahradit | Nové řešení | Důvod |
|---|---|---|
| **CalculatorBase** | SimpleCalculatorLayout | Starý pattern, 12 uživatelů |
| **8× ErrorBoundary duplicity** | Sdílená komponenta | ~200 řádků duplicity |
| **23× hardcoded relatedCalculators** | getRelatedCalculators() | ~1500 řádků duplicity |
| **11 duplicitních routes** | Single route + redirecty | User confusion, dead code |
| **next/head SEO** | Next.js 14 metadata API | Deprecated API |
| **next/router v ThemeContext** | next/navigation | App Router incompatibility |
| **calculatorUtils.ts 785 řádků** | Modulární struktura | Příliš velký soubor |
| **TypeScript strict: false** | strict: true | Type safety |
| **Locale mismatch (5 vs 2)** | 5 locales všude | Broken UX pro sk/pl/hu |

---

### 6.3 Co přidat

| Nová komponenta | Umístění | Účel |
|---|---|---|
| **ErrorBoundary** | `src/components/shared/` | Centralizovaný error handling |
| **CalculatorPageWrapper** | `src/components/shared/` | Standardizovaný page wrapper |
| **LoadingSkeletons** | `src/components/shared/` | Konzistentní loading stavy |
| **useCalculatorValidation** | `src/hooks/` | Validace hook |
| **useCalculatorResult** | `src/hooks/` | Výpočet hook |
| **calculatorValidation.ts** | `src/lib/` | Validace funkce |
| **calculatorFormatting.ts** | `src/lib/` | Formátování výsledků |
| **math/** | `src/utils/math/` | Matematické utility |
| **validation/** | `src/utils/validation/` | Validace utility |
| **sk.json, pl.json, hu.json** | `src/messages/` | Překlady |

---

### 6.4 Zdůvodnění rozhodnutí

#### Proč zachovat SimpleCalculatorLayout místo vytvoření nového?

**Důvody:**
- Již implementováno v 40+ kalkulačkách
- Solid API (516 řádků, ale přehledné)
- Obsahuje všechny potřebné features: SEO, ads, formula, examples, FAQ, related
- BMI v2 a IRR Calculator ukazují, že to funguje dobře
- Změna by znamenala refactor 40+ souborů

**Rozšíření místo replikace:**
- Přidat `loadingState?` a `errorState?` props
- Vytáhnout vnitřní komponenty (AdPlaceholder, SimpleFAQ)
- Zmenšit pod 500 řádků extrakcí

---

#### Proč centralizovaná data místo props?

**Důvody:**
- `getRelatedCalculators()` již funguje pro BMI
- Odstraní ~1500 řádků hardcoded polí
- Jedno místo pro údržbu relací
- Konfigurace může být verzovaná v Git
- Snadnější přidávání nových kalkulaček

**Implementace:**
```typescript
// calculators.json - metadata všech 47 kalkulaček
// calculator-relationships.json - relace mezi kalkulačkami
// calculator-categories.json - kategorie a priority

// Použití:
const relatedCalculators = getRelatedCalculators('bmi', locale, t);
const category = getCalculatorCategory('zdravi', locale, t);
```

---

#### Proč TypeScript strict mode?

**Důvody:**
- Současné `strict: false` dává falešný pocit bezpečnosti
- Mnoho `any` typů skrývá bugs
- Refactoring je bez strict mode riskantní
- Moderní Next.js projekty mají default strict: true

**Postup:**
1. Povolit strict mode v tsconfig.json
2. Spustit `tsc --noEmit` pro nalezení všech errors
3. Systematicky opravit:
   - Přidat chybějící typy
   - Opravit any typy
   - Přidat null checks
4. Přidat `--strict` do CI/CD pipeline

---

#### Proč Next.js 14 metadata API místo next/head?

**Důvody:**
- `next/head` je deprecated v App Routeru
- Next.js 14 metadata API je moderní řešení
- Lepší SEO (Open Graph, Twitter Card, Canonical)
- Automatické hreflang tags pro i18n
- Lepší performance (server-generated metadata)

**Implementace:**
```typescript
// page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const locale = params.locale;
  const t = await getTranslations(locale);

  return {
    title: t('bmi_seo_title'),
    description: t('bmi_seo_description'),
    keywords: t('bmi_seo_keywords').split(','),
    openGraph: {
      title: t('bmi_og_title'),
      description: t('bmi_og_description'),
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: `https://mathcalc.pro/${locale}/calculator/bmi`,
      languages: {
        cs: 'https://mathcalc.pro/cs/calculator/bmi',
        en: 'https://mathcalc.pro/en/calculator/bmi',
        sk: 'https://mathcalc.pro/sk/calculator/bmi',
      },
    },
  };
}
```

---

#### Proč zachovat Tailwind utility classes?

**Důvody:**
- Již zavedený v projektu
- Flexibilní a konzistentní
- Menší bundle než vlastní CSS
- Snadné refaktorování
- Dark mode podpora out-of-the-box

**Alternativy zvažované a zamítnuté:**
- **CSS Modules:** Více boilerplate, menší flexibilita
- **Styled Components:** Runtime overhead, větší bundle
- **Vanilla CSS:** Obtížnější údržba, méně konzistentní

---

## 7. Verification sekce

### 7.1 Jak otestovat změny end-to-end

#### Testovací workflow pro jednu kalkulačku:

```bash
# 1. Spustit dev server
npm run dev

# 2. Otevřít kalkulačku v prohlížeči
open http://localhost:3000/cs/calculator/bmi

# 3. Manual testovací checklist:
# [ ] Kalkulačka se načte bez chyb
# [ ] Inputy fungují (validace, placeholder, help text)
# [ ] Real-time výpočet funguje
# [ ] Výsledek se správně formátuje
# [ ] Formula se zobrazuje (KaTeX)
# [ ] Examples sekce existuje
# [ ] FAQ sekce existuje
# [ ] Related calculators se zobrazují
# [ ] Rating funguje
# [ ] Dark mode switch funguje
# [ ] Mobile responsive (změnit velikost okna)

# 4. Otestovat všechny locale:
for locale in cs en sk pl hu; do
  open http://localhost:3000/$locale/calculator/bmi
done

# 5. Spustit testy (pokud existují)
npm test -- BMICalculator

# 6. Type check
npx tsc --noEmit

# 7. Lint
npm run lint
```

---

#### Automatizované testy (Cílový stav):

```bash
# Unit testy pro kalkulačky
npm test -- --coverage

# Očekávané coverage:
# - MVP kalkulačky: >80%
# - Ostatní: >60%
# - Celý projekt: >50%

# E2E testy (Playwright)
npm run test:e2e

# Testovací scénáře:
# - Navigace na kalkulačku
# - Vložení hodnot
# - Ověření výsledku
# - Přepnutí locale
# - Přepnutí dark mode
# - Odeslání ratingu
```

---

### 7.2 Jak ověřit migraci

#### Ověřovací checklist po refaktoringu jedné kalkulačky:

```typescript
// 1. Structure check
- [ ] Page wrapper používá CalculatorPageWrapper
- [ ] Komponenta používá SimpleCalculatorLayout
- [ ] Inputy používají CalculatorInput
- [ ] Výsledky používají CalculatorResult
- [ ] Related calculators přes getRelatedCalculators()

// 2. Code quality check
- [ ] Soubor < 250 řádků
- [ ] Žádné any typy (strict mode)
- [ ] Žádné console.log nebo debugger
- [ ] Všechny texty přes useTranslations()
- [ ] ESLint prochází bez chyb

// 3. Feature check
- [ ] Real-time výpočet (žádný submit button)
- [ ] LaTeX vzorec přítomen
- [ ] Examples sekce existuje
- [ ] FAQ sekce existuje
- [ ] Schema.org data přítomna
- [ ] SEO metadata kompletní

// 4. i18n check
- [ ] Funguje na cs locale
- [ ] Funguje na en locale
- [ ] Funguje na sk locale
- [ ] Funguje na pl locale
- [ ] Funguje na hu locale

// 5. Accessibility check
- [ ] ARIA labels přítomny
- [ ] Keyboard navigation funguje
- [ ] Screen reader oznámí chyby
- [ ] Focus management správný

// 6. Performance check
- [ ] Žádné unnecessary re-renders (React DevTools)
- [ ] Výpočet trvá < 100ms
- [ ] Bundle size increased by < 10KB

// 7. Testing check
- [ ] Unit testy existují
- [ ] Coverage > 60%
- [ ] Všechny testy procházejí
```

---

### 7.3 Smoke test po každé fázi migrace

```bash
#!/bin/bash
# scripts/smoke-test.sh

echo "🧪 Running smoke tests..."

# 1. Type check
echo "1. Type checking..."
npx tsc --noEmit || exit 1

# 2. Lint
echo "2. Linting..."
npm run lint || exit 1

# 3. Build
echo "3. Building..."
npm run build || exit 1

# 4. Unit tests
echo "4. Running unit tests..."
npm test -- --passWithNoTests || exit 1

# 5. Start dev server na pozadí
echo "5. Starting dev server..."
npm run dev &
DEV_PID=$!
sleep 10

# 6. Curl test kritických kalkulaček
echo "6. Testing critical calculators..."
for locale in cs en sk pl hu; do
  for calc in bmi dph procento-z-cisla cista-mzda prevodnik-jednotek; do
    curl -f http://localhost:3000/$locale/calculator/$calc || exit 1
  done
done

# 7. Kill dev server
kill $DEV_PID

echo "✅ All smoke tests passed!"
```

---

## 8. Shrnutí

### Klíčové principy cílové architektury:

1. **Jeden jasný pattern** - SimpleCalculatorLayout pro všechny kalkulačky
2. **Centralizovaná data** - calculators.json pro metadata
3. **Sdílené komponenty** - Odstranění duplicity
4. **Type safety** - strict mode, žádné any typy
5. **i18n first** - Plná podpora 5 locale
6. **Testable** - Každá kalkulačka má testy
7. **Accessible** - ARIA, keyboard navigation, screen readers
8. **Performant** - < 250 řádků, < 100ms výpočet

### Odhadovaný časový harmonogram:

| Fáze | Týdny | Úkol |
|---|---|---|
| 0 | 1-2 | Příprava infrastruktury |
| 1 | 2-3 | Uklid duplikátů |
| 2 | 3-4 | Migrace na SimpleCalculatorLayout |
| 3 | 4-5 | Implementace placeholerů |
| 4 | 3-4 | Kvalita kódu (strict mode, refaktoring) |
| **Celkem** | **13-18** | **Kompletní refaktoring** |

### Success metrics:

- [ ] 0 duplicitních routes
- [ ] 0 CalculatorBase uživatelů
- [ ] 0 hardcoded relatedCalculators
- [ ] 100% kalkulaček s SimpleCalculatorLayout
- [ ] 100% pokrytí 5 locale
- [ ] >50% test coverage
- [ ] Všechny soubory < 250 řádků
- [ ] TypeScript strict: true
- [ ] 0 ESLint chyb
- [ ] 0 placeholerů (vše implementováno)
