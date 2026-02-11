# MathCalc Pro – Master Prompt pro Claude Code

> **Důležité:** Přečti nejprve [`docs/target-architecture.md`](docs/target-architecture.md) pro kompletní popis cílové architektury po refaktoringu. Tento dokument obsahuje detailní specifikaci struktur, rozhraní a migračního plánu.

## Kontext projektu

MathCalc Pro je platforma online matematickych a praktickych kalkulacek postavena na Next.js. Cilova skupina jsou studenti, uctari a bezni uzivatele v CR, SR a dalsich stredoevropskych zemich. Projekt vznikl jako prvni pokus s AI asistovanym vyvojem, proto je kvalita kodu nekonzistentni a vyzaduje systematicky refaktoring.

- **Aktualni stav:** 43 implementovanych kalkulacek (33 hlavni + 6 frakcni operaci + 4 unit konvertory)
- **MVP kalkulacky (6/6):** BMI, procenta (3 podtypy), DPH, cista mzda, prevodnik jednotek, trojclenka
- **Jazyky:** cs (vychozi), en, sk, pl, hu

## Technicky stack

| Technologie | Verze | Ucel |
|---|---|---|
| Next.js | 14+ (App Router) | Framework, SSR, routing |
| React | 18+ (latest) | UI knihovna |
| TypeScript | latest | Typova bezpecnost |
| Tailwind CSS | 3.4 | Utility-first styling |
| shadcn/ui | latest | Komponenty (Radix UI primitives) |
| next-intl | 4.3.4 | Internacionalizace |
| next-themes | 0.4.6 | Dark/light mode |
| KaTeX + react-katex | 0.16 / 3.1 | LaTeX vzorce |
| Framer Motion | 12.x | Animace |
| Lucide React | latest | Ikony |
| Jest | 30.x | Testy |
| React Testing Library | 16.x | Testovani komponent |

**Build:** `next build` (Webpack interně)
**Package manager:** npm
**Node.js:** >= 18.0.0

## Architektura

### Adresarova struktura
```
src/
├── app/
│   ├── [locale]/              # Lokalizovane routy
│   │   ├── calculator/        # Vsechny kalkulacky
│   │   │   ├── bmi/           # BMI v1 (stary)
│   │   │   ├── bmi-new/       # BMI v2 (REFERENCNI)
│   │   │   ├── dph/           # DPH kalkulacka
│   │   │   ├── cista-mzda/    # Cista mzda
│   │   │   ├── zlomky/        # Zlomky
│   │   │   ├── procenta/      # Procenta (3 podkalkulacky)
│   │   │   ├── trojclenka/    # Trojclenka (prima/neprima)
│   │   │   ├── prevodnik-jednotek/  # Prevodnik
│   │   │   ├── financie-rozsirene/  # Finance (6 kalkulacek)
│   │   │   ├── fitness-a-zdravi/    # Zdravi (placeholdery)
│   │   │   ├── prakticke-vypocty/   # Prakticke (placeholdery)
│   │   │   └── stavebni/           # Stavebni (5 kalkulacek)
│   │   ├── privacy-policy/
│   │   ├── layout.tsx
│   │   └── page.tsx           # Homepage
│   └── api/ratings/           # API endpoint
├── components/
│   ├── calculators/           # 43 komponent kalkulacek (33 hlavni + 6 operaci se zlomky + 4 unit konvertory)
│   │   ├── shared/            # CalculatorInput, CalculatorResult, CalculatorRating
│   │   ├── fractionOperations/
│   │   ├── unitConverters/
│   │   └── __tests__/
│   ├── layout/                # SimpleCalculatorLayout
│   ├── ui/                    # shadcn/ui komponenty (24)
│   ├── ads/                   # Reklamni komponenty
│   ├── analytics/             # Google Analytics
│   ├── navigation/            # Navigace
│   ├── seo/                   # SEO komponenty
│   └── theme/                 # Theme provider
├── config/site.ts
├── context/ThemeContext.tsx
├── data/                      # JSON data kalkulacek
├── hooks/                     # Custom React hooks
├── i18n/                      # i18n setup
├── lib/                       # Utility knihovny (calculatorDataUtils)
├── messages/                  # Preklady (cs.json, en.json, sk.json, pl.json, hu.json)
├── styles/globals.css
├── types/                     # TypeScript typy
└── utils/                     # Utility funkce
```

### Routing pattern
```
/{locale}/calculator/{category}/{name}
```
Middleware (`src/middleware.ts`) pouziva `next-intl/middleware` pro detekci locale a prefix routing.

### Komponentni hierarchie (referencni)
```
page.tsx (tenny wrapper)
  └── ErrorBoundary
      └── Suspense (se Skeleton loading)
          └── [Calculator] (dynamic import, ssr: false)
              └── SimpleCalculatorLayout
                  ├── children (formularove inputy)
                  ├── resultSection (vysledky)
                  ├── formula (LaTeX)
                  ├── examples (priklady pouziti)
                  ├── faq (caste dotazy)
                  └── relatedCalculators
```

## Konvence a vzory

### Naming conventions
- **Komponenty:** PascalCase - `BMICalculator.tsx`, `VATCalculator.tsx`
- **Routy:** kebab-case cesky - `cista-mzda`, `procento-z-cisla`, `prevodnik-jednotek`
- **Preklady:** snake_case - `height_label`, `bmi_category_normal`
- **Typy:** PascalCase s postfixem - `BMIResult`, `SimpleCalculatorLayoutProps`

### Vzor pro novou kalkulacku

**1. Page wrapper** (`src/app/[locale]/calculator/{name}/page.tsx`):
```tsx
'use client';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const MyCalculator = dynamic(
  () => import('@/components/calculators/MyCalculator'),
  { loading: () => <SkeletonLoader />, ssr: false }
);

// ErrorBoundary class...

export default function MyCalculatorPage() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<SkeletonLoader />}>
        <MyCalculator />
      </Suspense>
    </ErrorBoundary>
  );
}
```

**2. Calculator component** (`src/components/calculators/MyCalculator.tsx`):
- Pouzij `SimpleCalculatorLayout` z `@/components/layout/SimpleCalculatorLayout`
- Pouzij `CalculatorInput` a `CalculatorResult` z `@/components/calculators/shared`
- Real-time vypocet pres `useEffect` (zadny submit button)
- Typovane rozhrani pro vysledky
- Preklady pres `useTranslations()` z next-intl
- Related calculators pres `getRelatedCalculators()` z `@/lib/calculatorDataUtils`
- Max ~250 radku

**3. SimpleCalculatorLayout props:**
- `title`, `description`, `category`, `calculatorId` - zakladni info
- `seo` - { title, description, keywords }
- `formula` - { latex, description }
- `children` - formularove inputy
- `resultSection` - ReactNode s vysledky
- `examples` - { title, description, scenarios[] }
- `faq` - Array<{ question, answer }>
- `relatedCalculators` - z centralizovanych dat

### Styling
- Tailwind utility classes primo v JSX
- `cn()` helper z `@/lib/utils` pro podminene tridy (clsx + tailwind-merge)
- CSS promenne pro theming (HSL barvy)
- Responsive: `md:` a `lg:` breakpointy
- Dark mode: class-based pres `next-themes`

### State management
- Lokalni stav pres `useState` (zadny global state management)
- Validace pri kazde zmene inputu
- Chyby v samostatnem state objektu: `useState<{ field?: string }>({})`

## Referencni implementace

**BMI Calculator v2** je vzorova implementace. Studuj tyto soubory:

| Soubor | Cesta | Radku | Ucel |
|---|---|---|---|
| Page wrapper | `src/app/[locale]/calculator/bmi-new/page.tsx` | 82 | ErrorBoundary + Suspense + dynamic import |
| Komponenta | `src/components/calculators/BMICalculator.tsx` | 218 | Kalkulacka s SimpleCalculatorLayout |
| Layout | `src/components/layout/SimpleCalculatorLayout.tsx` | 516 | Sdileny layout se vsemi sekcemi |
| Shared input | `src/components/calculators/shared/CalculatorInput.tsx` | 73 | Znovupouzitelny input s validaci |
| Shared result | `src/components/calculators/shared/CalculatorResult.tsx` | 65 | Znovupouzitelny vysledek |
| Rating | `src/components/calculators/shared/CalculatorRating.tsx` | - | Hodnoceni kalkulacky |
| Data utils | `src/lib/calculatorDataUtils.ts` | - | getRelatedCalculators(), getQuickLinks() |

**Co je na BMI v2 dobre:**
- Cista separace page wrapper vs. kalkulacka vs. layout
- Real-time vypocet bez submit buttonu
- Typovane rozhrani `BMIResult`
- Pouziti vsech sdilenych komponent
- LaTeX vzorec, priklady, FAQ, related calculators
- Schema.org structured data
- Graceful error handling
- Ma testy

## Zname problemy

**Poznámka: Tento seznam je výsledkem komplexní analýzy kódové báze ze dne 11. 2. 2026. Podrobná analýza viz `docs/code-analysis.md`.**

### Kritické (Critical)

1. **11 duplicitních route pairs** - existují duplicitní routy porušující vlastní pravidla v `docs/development/refactoring-guidelines.md`:
   - `bmi` + `bmi-new`
   - `dph` + `dph-new`
   - `zlomky` + `zlomky-new`
   - `cista-mzda` + `cista-mzda-new`
   - `prevodnik-jednotek` + `prevodnik-jednotek-new`
   - `procenta/procento-z-cisla` + `procenta/procento-z-cisla-new`
   - `procenta/kolik-procent-je-x-z-y` + `kolik-procent-je-x-z-y-new`
   - `procenta/y-je-x-kolik-je-sto` + `y-je-x-kolik-je-sto-new`
   - `trojclenka` (složka) + `trojclenka-new`
   - `financie-rozsirene/slozene-uroceni` + `slozene-uroceni-new`

2. **Broken BMI v1** (`src/app/[locale]/calculator/bmi/page.tsx`) - nefunkční kód s nedefinovanými proměnnými (`bmi_title`, `bmi_seo_description`), nutno smazat

3. **12 prázdných placeholder komponent** - všechny neimplementované:
   - **6 fraction operations** (`src/components/calculators/fractionOperations/`) - všechny mají pouze 18 řádků s textem "bude implementováno později"
   - **6 fitness calculators** (`fitness-a-zdravi/kalkulacka-{1-6}`) - generické placeholdery
   - **6 practical calculators** (`prakticke-vypocty/kalkulacka-{1-6}`) - prázdné placeholdery

### Vysoke (High)

4. **CalculatorBase anti-pattern** - 10+ kalkulaček stále používá starý `CalculatorBase` místo `SimpleCalculatorLayout`:
   - DirectProportionCalculator (trojclenka/prima-umera)
   - InverseProportionCalculator (trojclenka/neprima-umera)
   - FractionsCalculator (zlomky)
   - CompoundInterestCalculator (financie-rozsirene/slozene-uroceni)
   - AnnuityPaymentCalculator (financie-rozsirene/anuitni-splatka)
   - WhatPercentageIsXOfYCalculator (procenta)
   - A další 2+

5. **Hardcoded relatedCalculators** - 23 souborů má hardcoded pole (~1500 řádků duplicity) místo centralizovaného `getRelatedCalculators()`:
   - VATCalculator, PercentageOfNumberCalculator, YIsXWhatIsHundredCalculator
   - IRRCalculator, NPVCalculator, ROICalculator
   - CompoundInterestCalculator, AnnuityPaymentCalculator, EarlyRepaymentCalculator
   - A dalších 13+

6. **Chybějící sdílený ErrorBoundary** - 8 duplicitních implementací třídy ErrorBoundary v page wrapperech místo jedné sdílené komponenty

7. **Podužívání sdílených komponent** - 20+ souborů používá manual forms místo `CalculatorInput` a `CalculatorResult` z `shared/`

8. **Zakázané testy** - pouze BMICalculator má testy (~2.6% pokrytí), žádné testy pro ostatní 42 kalkulaček

9. **TypeScript strict: false** - `tsconfig.json` má `"strict": false`, žádná typová bezpečnost, mnoho `any` typů

### Střední (Medium)

10. **Neaktualizované SEO** - `src/components/seo/SeoMetadata.tsx` používá deprecated `next/head` místo Next.js 14 metadata API
11. **Inconsistente page wrappery** - 3 různé vzory:
    - Modern (BMI v2): ErrorBoundary + Suspense only (82 řádků)
    - Card-based (DPH, Procenta, Cista mzda): grid s 2/3 layout (130+ řádků)
    - Async/Await (DPH-new): async component
12. **Velké soubory** - několik komponent překračuje doporučených 250 řádků:
    - VolumeCalculator (666 řádků)
    - ConcreteCalculator (649 řádků)
    - IRRCalculator (555 řádků)
    - CalculatorRating (246 řádků)
13. **Locale inconsistency** - middleware podporuje 5 locales (cs, en, sk, pl, hu), ale `src/i18n/settings.ts` definuje pouze 2 (en, cs)
14. **calculatorUtils.ts 785 řádků** - příliš velký soubor, měl by být rozdělen na menší moduly
15. **ThemeContext používá next/router** - nekompatibilní s App Routerem, mělo by používat `next/navigation`

### Nízké (Low)

16. **Chybějící ESLint/Prettier konfigurace** - používá se jen default Next.js ESLint, žádné `.eslintrc` nebo `.prettierrc`
17. **Chybějící CI/CD pipeline** - žádné GitHub Actions pro automated testing
18. **Chybějící deployment konfigurace** - žádná Vercel/Netlify setup
19. **Zduplikované utility soubory** - `calculatorUtils.clean.ts`, `calculatorUtils.new.ts`, `calculatorUtils.updated.ts` místo jednéné verze
20. **`next: "latest"` v package.json** - není připnutý na konkrétní verzi, může způsobit neočekávané breaking changes

---

## Stav sdílené infrastruktury (Shared Infrastructure Status)

**Aktualizováno:** 11. 2. 2026
**Větev:** `czechdaver/shared-infrastructure-setup`

Před zahájením refaktoringu jednotlivých kalkulaček byla vytvořena robustní sdílená infrastruktura.

### Dokončené úlohy (Phase 1-4)

#### ✅ Vytvořeny sdílené komponenty (10 komponent)
| Komponenta | Cesta | Řádků | Účel |
|-----------|-------|-------|------|
| ErrorBoundary | `src/components/shared/ErrorBoundary.tsx` | 152 | Centralizované ošetření chyb, lokální zprávy |
| CalculatorPageWrapper | `src/components/shared/CalculatorPageWrapper.tsx` | 77 | Standardizovaný page wrapper (ErrorBoundary + Suspense) |
| CalculatorSkeleton | `src/components/shared/CalculatorSkeleton.tsx` | 79 | Konzistentní loading stavy |
| AdPlaceholder | `src/components/shared/AdPlaceholder.tsx` | 28 | Pozice pro reklamy |
| SimpleBadge | `src/components/shared/SimpleBadge.tsx` | 36 | Badge varianty (default, secondary, outline) |
| SimpleFAQ | `src/components/shared/SimpleFAQ.tsx` | 61 | Accordion FAQ komponenta |

**Přínos:** 8 duplicitních ErrorBoundary implementací lze odstranit, page wrappery zredukovány z 80+ na ~10 řádků

#### ✅ Modularizovány utility funkce (6 modulů)
| Modul | Cesta | Řádků | Exporty |
|-------|-------|-------|---------|
| calculatorValidation | `src/lib/calculatorValidation.ts` | 174 | `isValidNumber`, `isValidMathExpression` |
| calculatorFormatting | `src/lib/calculatorFormatting.ts` | 65 | `formatNumber`, `formatNumberWithCommas`, `round` |
| calculatorMath | `src/lib/calculatorMath.ts` | 158 | `parseNumber`, `convertUnit`, `range` |
| percentage | `src/utils/math/percentage.ts` | 96 | `calculatePercentage`, `calculatePercentageChange` |
| expression | `src/utils/math/expression.ts` | 326 | `evaluateMathExpression` |
| geometry | `src/utils/math/geometry.ts` | 10 | (placeholder) |

**Původní:** calculatorUtils.ts (784 řádků) + 3 duplicitní soubory (1,250 řádků)
**Nově:** 6 modulů (829 řádků) + re-export vrstva (45 řádků)
**Redukce:** -1,250 řádků duplicity odstraněno

#### ✅ Vytvořeny custom hooks (7 hooků)
| Hook | Cesta | Řádků | Účel |
|------|-------|-------|------|
| useRatingData | `src/hooks/useRatingData.ts` | 92 | API volání pro hodnocení |
| useUserRating | `src/hooks/useUserRating.ts` | 50 | LocalStorage pro uživatelské hodnocení |
| useStarInteraction | `src/hooks/useStarInteraction.ts` | 44 | Hover a tooltip stav |
| useThankYouMessage | `src/hooks/useThankYouMessage.ts` | 50 | Fade animace pro "děkuji" zprávu |
| useNumberInput | `src/hooks/useNumberInput.ts` | 130 | Validace číselných inputů |
| useValidation | `src/hooks/useValidation.ts` | 116 | Obecná form validace |
| useCalculatorForm | `src/hooks/useCalculatorForm.ts` | 107 | Kompletní form state management |

**Přínos:** Zjednodušený vývoj kalkulaček s předpřipravenou validací

#### ✅ Opraveny kritické problémy
- **Locale inconsistency:** 5 locales (cs, en, sk, pl, hu) nyní konzistentně v middleware i i18n settings
- **ThemeProvider:** Integrován do root layout, tmavý režim funkční
- **Hardcoded barvy:** Nahrazeny sémantickými CSS proměnnými v CalculatorInput a CalculatorResult
- **Import paths:** Opraveny relativní importy na absolutní s `@/` aliasem

#### ✅ Refaktorovány velké komponenty
| Komponenta | Před | Po | Zmena |
|-----------|------|-----|-------|
| SimpleCalculatorLayout | 516 řádků | 446 řádků | -70 řádků (-14%) |
| CalculatorRating | 246 řádků | 139 řádků | -107 řádků (-43%) |

### Souhrn metrik

- **Vytvořeno:** 23 nových souborů (10 komponent, 6 utilit, 7 hooků)
- **Odstraněno:** 3 duplicitní utility soubory (-1,250 řádků)
- **Upraveno:** 8 souborů (SimpleCalculatorLayout, CalculatorRating, calculatorUtils, i18n settings, layout, CalculatorInput/Result)
- **Celková redukce kódu:** ~1,400 řádků duplicity odstraněno
- **Žádné breaking changes:** Všechny existující kalkulačky stále fungují

### Před refaktorováním kalkulaček

Infrastruktura je nyní připravena. Doporučený postup:

1. **Používejte CalculatorPageWrapper** pro nové page wrappery
2. **Používejte SimpleCalculatorLayout** pro všechny nové kalkulačky
3. **Používejte CalculatorInput/CalculatorResult** z `shared/`
4. **Používejte useNumberInput/useCalculatorForm** pro validaci
5. **Nahraďte hardcoded relatedCalculators** voláním `getRelatedCalculators()`

Viz `docs/target-architecture.md` pro detailní specifikaci cílové architektury.

---

## Pravidla pro refaktoring

### Zakladni pravidla
1. **Zachovej zpetnou kompatibilitu URL** - existujici routy nesmi zmizet, pouzij redirecty
2. **Kazda kalkulacka musi pouzivat `SimpleCalculatorLayout`** - zadny `CalculatorBase` nebo inline layout
3. **Pouzivej sdilene komponenty** - `CalculatorInput`, `CalculatorResult` z `shared/`
4. **Pouzivej centralizovana data** - `getRelatedCalculators()` misto hardcoded poli
5. **Jeden kalkulator = jeden soubor** - zadne "Refactored", "New", "Updated" pripoky (viz `docs/development/refactoring-guidelines.md`)
6. **Aktualizuj existujici soubory** - nevytvarej duplikaty, pouzij git pro verzovani
7. **Po refaktoringu odstran stare verze** - `-new` routy nahrad puvodni a puvodni smaz
8. **Kazda kalkulacka musi mit:** formula (LaTeX), examples, FAQ, related calculators, SEO metadata
9. **Real-time vypocet** - zadny submit button, vypocet pres useEffect
10. **Max 250 radku na komponentu** - pri prekroceni extrahuj logiku

### Postup refaktoringu jedne kalkulacky
1. Precti aktualni implementaci
2. Precti BMI v2 jako referenci
3. Aktualizuj komponentu - prepis na SimpleCalculatorLayout pattern
4. Aktualizuj page wrapper - ErrorBoundary + Suspense + dynamic import
5. Pridej/aktualizuj preklady v `src/messages/*.json`
6. Pridej testy
7. Over funkcnost na vsech locale
8. Aktualizuj tabulku stavu refaktoringu nize

### Kontrolni checklist pred commitem
- [ ] Pouziva SimpleCalculatorLayout
- [ ] Pouziva CalculatorInput a CalculatorResult
- [ ] Real-time vypocet (zadny submit button)
- [ ] LaTeX vzorec
- [ ] Priklady pouziti
- [ ] FAQ sekce
- [ ] Related calculators pres getRelatedCalculators()
- [ ] Schema.org structured data
- [ ] Responsive na mobile
- [ ] Funguje na vsech 5 locale
- [ ] Zadne duplicitni soubory

## Prioritni poradi refaktoringu

**Poznámka: Prioritizace založena na skutečném stavu kódu z analýzy ze dne 11. 2. 2026. Více viz `docs/code-analysis.md`.**

### Faze 0: Krizové opravy (TÝDEN PŘED VŠECHNO)

1. **Smazat broken BMI v1 route** - odstranit `src/app/[locale]/calculator/bmi/page.tsx`, nastavit redirect na `/bmi-new/`
2. **Vytvořit shared ErrorBoundary** - nová komponenta `src/components/shared/ErrorBoundary.tsx`, nahradit 8 duplicitních implementací
3. **Opravit locale inconsistency** - sjednotit `src/middleware.ts` (5 locales) s `src/i18n/settings.ts` (pouze 2)

### Faze 1: Uklid duplikatu (TÝDEN 1-2)

4. **Vyřešit 11 duplicitních route pairs** - pro každý pár:
    - Ověřit která varianta je novější/lépější
    - Smazat `-new` variantu a nahradit původní
    - NEBO nahradit původní `-new` variantou a smazat původní
    - Upravit `src/data/calculators.json` a přidat přesměrování
    - **Výsledek:** 11 smazaných route, 0 duplikát

5. **Smazat CalculatorBase.tsx** - po migraci všech uživatelů na SimpleCalculatorLayout

### Faze 2: Základní refaktoring (TÝDEN 3-10)

6. **Migrovat 10 CalculatorBase uživatelů** - přepsat na SimpleCalculatorLayout pattern:
    - DirectProportionCalculator (trojclenka/prima-umera)
    - InverseProportionCalculator (trojclenka/neprima-umera)
    - FractionsCalculator (zlomky)
    - CompoundInterestCalculator (financie-rozsirene/slozene-uroceni)
    - AnnuityPaymentCalculator (financie-rozsirene/anuitni-splatka)
    - WhatPercentageIsXOfYCalculator (procenta)
    - YIsXWhatIsHundredCalculator (procenta)
    - NetSalaryCalculator (cista-mzda)
    - UnitConverter (prevodnik-jednotek)
    - A další 2+

7. **Nahradit 23 hardcoded relatedCalculators** - použít `getRelatedCalculators(calculatorId, locale, t)` všude, odstranit ~1500 řádků duplicity

8. **Standardizovat page wrappery** - všechny na BMI v2 pattern (ErrorBoundary + Suspense + dynamic import), odstranit Card layouty z page files

9. **Používat CalculatorInput/CalculatorResult** - nahradit manual forms ve 20+ souborech sdílenými komponentami

### Faze 3: Implementace placeholerů (TÝDEN 11-20)

10. **Implementovat 6 fraction operations** - plně funkční komponenty:
    - FractionAddition - sčítání zlomků
    - FractionSubtraction - odčítání zlomků
    - FractionMultiplication - násobení zlomků
    - FractionDivision - dělení zlomků
    - FractionSimplification - zjednodušení zlomků
    - FractionConversion - konverze zlomků na desetinná čísla

11. **Implementovat 6 fitness calculators** - nahradit generic placeholdery specifickými funkcemi:
    - Výpočet kalorií
    - BMI pro děti a dospělé
    - Tělesný tuk
    - BMR (bazální metabolismus)
    - TDEE (denní výdej energie)
    - Ideální váha

12. **Implementovat 6 practical calculators** - nahradit generic placeholdery:
    - Převod měn
    - Výpočet úroku
    - Slevové procento
    - Marže
    - Převod číselných soustav
    - Výpočet daně z příjmu

### Faze 4: Kvalita kódu (TÝDEN 21-30)

13. **Povolit TypeScript strict mode** - změnit `"strict": false` na `"strict": true` v `tsconfig.json`, opravit všechny type errors

14. **Přidat testy** - alespoň pro MVP kalkulačky:
    - BMI (vylepšit stávající)
    - DPH
    - Procenta (všechny 3 varianty)
    - Cistá mzda
    - Převodník jednotek
    - Trojclenka

15. **Rozdělit velké soubory** - extrahovat logiku do menších souborů:
    - VolumeCalculator (666 řádků) → pod 250
    - ConcreteCalculator (649 řádků) → pod 250
    - IRRCalculator (555 řádků) → pod 250
    - CalculatorRating (246 řádků) → pod 150 s custom hooks

16. **Aktualizovat SEO** - přepsat `src/components/seo/SeoMetadata.tsx` použitím Next.js 14 metadata API:
    - Open Graph tags
    - Twitter Card support
    - Canonical URLs
    - Hreflang tags pro i18n
    - Schema.org structured data

17. **Refaktorovat CalculatorRating** - zmenšit na <150 řádků, extrahovat custom hooks, použít i18n pro všechny texty

### Faze 5: Infrastruktura (TÝDEN 31-40)

18. **Přidat ESLint/Prettier** - vytvořit `.eslintrc` a `.prettierrc` pro enforcement code style
19. **Vytvořit CI/CD pipeline** - GitHub Actions pro automated testing (lint, unit tests, build)
20. **Rozdělit calculatorUtils.ts** - rozdělit 785 řádků na menší moduly (validation.ts, formatting.ts, math.ts)
21. **Opravit ThemeContext** - migrovat z `next/router` na `next/navigation` pro kompatibilitu s App Routerem
22. **Přidat E2E testy** - Playwright pro end-to-end testing kritických user flows

### Celkový odhad: 35-45 hodin fokusované práce

## Stav refaktoringu

| Kalkulacka | Route | Layout | Stav | Poznamky |
|---|---|---|---|---|
| BMI v2 | `/calculator/bmi-new/` | SimpleCalculatorLayout | HOTOVO | Referencni implementace |
| BMI v1 | `/calculator/bmi/` | Stary/broken | SMAZAT | Nahradit v2, redirect |
| Procento z cisla | `/calculator/procenta/procento-z-cisla/` | SimpleCalculatorLayout | REFAKTOROVAT | Nepouziva shared komponenty |
| Kolik % je X z Y | `/calculator/procenta/kolik-procent-je-x-z-y/` | SimpleCalculatorLayout | REFAKTOROVAT | Hardcoded data |
| Y je X% co je 100% | `/calculator/procenta/y-je-x-kolik-je-sto/` | SimpleCalculatorLayout | REFAKTOROVAT | Hardcoded data |
| DPH | `/calculator/dph/` | SimpleCalculatorLayout | REFAKTOROVAT | Mixed input patterny |
| DPH new | `/calculator/dph-new/` | ? | SMAZAT | Duplikat |
| Cista mzda | `/calculator/cista-mzda/` | ? | REFAKTOROVAT | Komplexni logika |
| Cista mzda new | `/calculator/cista-mzda-new/` | ? | SMAZAT | Duplikat (pokud existuje) |
| Prevodnik jednotek | `/calculator/prevodnik-jednotek/` | ? | REFAKTOROVAT | |
| Trojclenka prima | `/calculator/trojclenka/prima-umera/` | CalculatorBase | REFAKTOROVAT | Stary layout |
| Trojclenka neprima | `/calculator/trojclenka/neprima-umera/` | CalculatorBase | REFAKTOROVAT | Stary layout |
| Zlomky | `/calculator/zlomky/` | CalculatorBase | REFAKTOROVAT | Komplexni, vice operaci |
| Zlomky new | `/calculator/zlomky-new/` | ? | SMAZAT | Duplikat |
| Slozene uroceni | `/financie-rozsirene/slozene-uroceni/` | ? | REFAKTOROVAT | |
| Anuitni splatka | `/financie-rozsirene/anuitni-splatka/` | ? | REFAKTOROVAT | |
| IRR | `/financie-rozsirene/irr/` | ? | REFAKTOROVAT | |
| NPV | `/financie-rozsirene/npv/` | ? | REFAKTOROVAT | |
| ROI | `/financie-rozsirene/roi/` | ? | REFAKTOROVAT | |
| Predcasne splaceni | `/financie-rozsirene/predcasne-splaceni/` | ? | REFAKTOROVAT | |
| Beton | `/stavebni/beton/` | ? | ZKONTROLOVAT | |
| Izolace | `/stavebni/izolace/` | ? | ZKONTROLOVAT | |
| Materialy | `/stavebni/materialy/` | ? | ZKONTROLOVAT | |
| Objem | `/stavebni/objem/` | ? | ZKONTROLOVAT | |
| Plocha | `/stavebni/plocha/` | ? | ZKONTROLOVAT | |
| Zdravi 1-6 | `/fitness-a-zdravi/kalkulacka-*/` | Placeholder | IMPLEMENTOVAT | Genericke placeholdery |
| Prakticke 1-6 | `/prakticke-vypocty/kalkulacka-*/` | Placeholder | IMPLEMENTOVAT | Genericke placeholdery |
