# MathCalc Pro – Master Prompt pro Claude Code

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

### Kriticke
1. **Duplicitni routy** - existuji `bmi` + `bmi-new`, `dph` + `dph-new`, `zlomky` + `zlomky-new` (porusuje vlastni pravidla v `docs/development/refactoring-guidelines.md`)
2. **Stara BMI v1** (`src/app/[locale]/calculator/bmi/page.tsx`) - broken kod s nedefinovanymi promennymi, pouziva stary pattern

### Vysoke
3. **Nekonzistentni layouty** - nektere kalkulacky pouzivaji `SimpleCalculatorLayout`, jine stary `CalculatorBase`, jine inline layout
4. **Hardcoded related calculators** - vetsina kalkulacek ma hardcoded pole misto `getRelatedCalculators()`
5. **Smisene i18n patterny** - nektere soubory stale referencuji `next-i18next` misto `next-intl`
6. **Zadna sdilena ErrorBoundary** - kazda stranka reimplementuje vlastni

### Stredni
7. **Placeholder kalkulacky** - fitness-a-zdravi a prakticke-vypocty jsou genericke placeholdery (`kalkulacka-1` az `kalkulacka-6`)
8. **Minimalni testy** - pouze BMICalculator ma testy
9. **tsconfig strict: false** - TypeScript neni v strict modu
10. **Chybejici ESLint/Prettier konfigurace** - pouziva se jen default Next.js ESLint

### Nizke
11. **`next: "latest"` v package.json** - neni pinnuty na konkretni verzi, muze zpusobit neocekavane breaking changes
12. **Chybejici CI/CD** - zadny GitHub Actions pipeline
13. **Chybejici deployment konfigurace** - zadny Vercel/Netlify setup

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

### Faze 1: Uklid duplikatu (PRVNI)
Odstranit duplicitni routy (`-new` varianty) - nahradit puvodni refaktorovanou verzi.

### Faze 2: MVP kalkulacky (VYSOKA PRIORITA)
1. **Procenta** (3 podkalkulacky) - nejvice navstevovane
2. **DPH** - business kriticka
3. **Prevodnik jednotek** - popularni utilita
4. **Trojclenka** (2 podkalkulacky) - vzdelavaci dulezitost
5. **Cista mzda** - komplexni ale dulezita

### Faze 3: Rozsirene kalkulacky (STREDNI PRIORITA)
6. **Zlomky** - prepsat na SimpleCalculatorLayout
7. **Slozene uroceni** - financni kalkulacky
8. **Anuitni splatka**
9. **Zbyvajici financni** (IRR, NPV, ROI, predcasne splaceni)

### Faze 4: Implementace chybejicich (NIZKA PRIORITA)
10. **Nahradit placeholder kalkulacky** (zdravi, prakticke)
11. **Stavebni kalkulacky** - dodelat
12. **Nove kategorie** - pokrocila matematika, specializovane

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
