# MathCalc Pro – Projektová instrukce pro AI asistovaný vývoj

> **Účel:** Tento dokument je hlavní instrukce pro AI agenty pracující na projektu MathCalc Pro. Obsahuje kompletní kontext, pravidla, monetizační strategii a technické vzory pro efektivní vývoj.
> **Doplňující dokumenty:**
> - [`docs/DEFINITION_OF_DONE.md`](docs/DEFINITION_OF_DONE.md) – **Klíčový dokument**: kompletní definice hotové kalkulačky
> - [`docs/target-architecture.md`](docs/target-architecture.md) – Cílová architektura
> - [`docs/refactoring-tracker.md`](docs/refactoring-tracker.md) – Stav refaktoringu
> - [`docs/code-analysis.md`](docs/code-analysis.md) – Detailní analýza kódu

---

## 1. Identita projektu

**MathCalc Pro** je platforma online kalkulaček cílící na středoevropské trhy (CZ, SK, PL, HU) a anglicky mluvící uživatele. Monetizace probíhá přes Google AdSense s cílem **$3 000–$15 000/měsíc** při plné expanzi na 141+ kalkulaček.

- **Doména:** mathcalc.pro
- **Jazyky:** cs (výchozí), en, sk, pl, hu
- **Aktuální stav:** 43 kalkulaček implementováno, refaktoring probíhá
- **Cíl:** 141+ kalkulaček, 5 plně lokalizovaných jazyků, TypeScript strict mode

### 1.1 Technický stack

| Technologie | Verze | Účel |
|---|---|---|
| Next.js | 14+ (App Router) | Framework, SSR, routing |
| React | 18+ | UI knihovna |
| TypeScript | latest | Typová bezpečnost |
| Tailwind CSS | 3.4 | Utility-first styling |
| shadcn/ui | latest (Radix UI primitives) | UI komponenty (24 ks) |
| next-intl | 4.3.4 | Internacionalizace |
| next-themes | 0.4.6 | Dark/light mode |
| KaTeX + react-katex | 0.16 / 3.1 | LaTeX vzorce |
| Framer Motion | 12.x | Animace |
| Lucide React | latest | Ikony |
| Jest | 30.x | Testy |
| React Testing Library | 16.x | Testování komponent |

**Build:** `next build` (Webpack interně) · **Package manager:** npm · **Node.js:** >= 18.0.0

---

## 2. Monetizační strategie – KLÍČOVÉ PRO KAŽDÉ ROZHODNUTÍ

Každá implementační volba musí zohledňovat dopad na příjmy z reklam. Platí pravidlo **barbell strategie**: vysokoobjemové kalkulačky (matematika, zdraví) budují doménovou autoritu, finanční kalkulačky generují neproporcio­nálně vysoký příjem.

### 2.1 CPC priority podle kategorie

| Kategorie | US CPC | CE CPC | Priorita obsahu |
|-----------|--------|--------|-----------------|
| Pojištění, hypotéky, půjčky | $10–$50 | $0.50–$5 | Anglický obsah VŽDY |
| Daně, investice | $5–$25 | $0.50–$2 | Country-specific 🏳️ |
| Mzdy, platy | $2–$8 | $0.30–$1.50 | CE jazyky (nejvyšší demand) |
| Zdraví (BMI, kalorie, BMR) | $2–$10 | $0.10–$0.50 | Všech 5 jazyků 🌍 |
| Stavební | $1.50–$12 | $0.20–$1 | Všech 5 jazyků 🌍 |
| Matematika, procenta | $0.05–$1 | $0.02–$0.20 | Traffic builders 🌍 |

### 2.2 Pravidla pro obsah na stránce kalkulačky

Každá stránka kalkulačky MUSÍ být **samostatným SEO aktivem** s:

1. **Minimálně 1 500 slov vzdělávacího obsahu** – vysvětlení vzorce, metodologie, praktické příklady
2. **FAQ sekce** (5–10 otázek) – targetuje "People Also Ask" snippety v Google
3. **Příklady použití** (3–5 scénářů) – zvyšuje čas na stránce a snižuje bounce rate
4. **LaTeX vzorec** – vizuální diferenciátor, buduje důvěryhodnost
5. **Related calculators** – interní prolinkování zvyšuje pages per session (cíl: 3.5+)
6. **Schema.org structured data** – SoftwareApplication + FAQPage schémata

### 2.3 Umístění reklam (Ad placement)

Struktura je definována v `SimpleCalculatorLayout`. Klíčová pozice:

- **Nad kalkulačkou** – responsive display ad
- **Pod výsledky** – NEJVYŠŠÍ CTR (uživatel v "rozhodovacím" režimu)
- **Mezi vzdělávacím obsahem** – in-content ads
- **Sidebar** – sticky ad na desktopu
- **Sticky footer** – na mobilu

**Pravidlo:** NIKDY nepřesouvej ani neodstraňuj `<AdPlaceholder>` komponenty. Jsou kritické pro monetizaci.

### 2.4 Klíčové metriky pro Google AdSense

- **Bounce rate < 35%** – zajisti relevantní obsah a interní prolinkování
- **Pages per session > 3.0** – related calculators, navigace mezi kategoriemi
- **Average session duration > 2:30** – vzdělávací obsah, příklady, FAQ
- **Core Web Vitals** – LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## 3. Vícejazyčná architektura

### 3.1 Jazyková strategie

| Jazyk | Kód | Role | Stav překladů |
|-------|-----|------|---------------|
| Čeština | cs | Výchozí jazyk, hlavní CE trh | ✅ Kompletní |
| Angličtina | en | Premium CPC obsah (US/UK traffic) | ✅ Kompletní |
| Slovenština | sk | Blízká čeština, 30–40% úspora na překladu | ⚠️ Částečné |
| Polština | pl | Největší CE trh (38M obyvatel) | ⚠️ Částečné |
| Maďarština | hu | Nejmenší konkurence, unikátní produkty | ⚠️ Částečné |

### 3.2 Pravidla pro překlady

1. **NIKDY neservíruj český obsah slovenským uživatelům** – i přes podobnost jazyků existují rozdíly ve finančních termínech (OSVČ vs SZČO, důchod vs dôchodok)
2. **Každý překlad musí být transcreace, ne překlad** – lokální daňové sazby, měny, příklady v místní měně
3. **Formátování čísel se liší:**
   - CE země: `1 234,56` (čárka = desetinný oddělovač, mezera = tisíce)
   - EN: `1,234.56` (tečka = desetinný oddělovač, čárka = tisíce)
   - HU datum: `YYYY.MM.DD` · CE datum: `DD.MM.YYYY`
   - Měna CE: `1 234,56 Kč` (symbol za číslem) · Měna EN: `$1,234.56` (symbol před číslem)
   - HUF: bez desetinných míst
4. **Klíče překladů:** snake_case v `src/messages/{locale}.json`
5. **Používej `useTranslations()` z next-intl** – žádný hardcoded text v komponentách

### 3.3 Country-specific kalkulačky (highest moat)

Tyto kalkulačky nemají globální ekvivalent a tvoří nejsilnější konkurenční výhodu:

- **CZ:** OSVČ kalkulačka, nemocenská, důchodový věk
- **SK:** DPH 2025/2026 (reformované 3-sazbové: 23%/19%/5%), materská dovolená
- **PL:** PIT-36/PIT-37 daňové přiznání, ZUS příspěvky, ryczałt, OC pojištění
- **HU:** CSOK (rodinný příspěvek), babaváró hitel, KATA daň, cégautó adó

### 3.4 Sezónní kalkulačky

- **Leden–Duben:** Daňové kalkulačky spike 300–500%
- **Leden:** Zdravotní kalkulačky (novoroční předsevzetí)
- **Jaro:** Hypoteční kalkulačky
- **Srpen–Září:** GPA/známkové kalkulačky (zpátky do školy)
- **Q4:** AdSense RPM +20–50% (inzerenti dočerpávají rozpočty)

---

## 4. Technická architektura

### 4.1 Adresářová struktura

```
src/
├── app/
│   ├── [locale]/                  # Lokalizované routy
│   │   ├── calculator/            # Všechny kalkulačky
│   │   │   ├── bmi-new/           # BMI v2 (REFERENČNÍ)
│   │   │   ├── dph/               # DPH kalkulačka
│   │   │   ├── cista-mzda/        # Čistá mzda
│   │   │   ├── zlomky/            # Zlomky
│   │   │   ├── procenta/          # Procenta (3 podkalkulačky)
│   │   │   ├── trojclenka/        # Trojčlenka (přímá/nepřímá)
│   │   │   ├── prevodnik-jednotek/# Převodník
│   │   │   ├── financie-rozsirene/# Finance (6 kalkulaček)
│   │   │   ├── fitness-a-zdravi/  # Zdraví (placeholdery)
│   │   │   ├── prakticke-vypocty/ # Praktické (placeholdery)
│   │   │   └── stavebni/          # Stavební (5 kalkulaček)
│   │   ├── privacy-policy/
│   │   ├── layout.tsx
│   │   └── page.tsx               # Homepage
│   └── api/ratings/               # API endpoint pro hodnocení
├── components/
│   ├── calculators/               # 43 komponent kalkulaček
│   │   ├── shared/                # CalculatorInput, CalculatorResult, CalculatorRating, CalculatorSelect
│   │   ├── fractionOperations/    # 6 fraction komponent (placeholdery)
│   │   ├── unitConverters/        # 4 unit konvertory
│   │   └── __tests__/             # Testy kalkulaček
│   ├── layout/
│   │   └── SimpleCalculatorLayout.tsx  # Hlavní layout (446 řádků)
│   ├── shared/                    # ErrorBoundary, CalculatorPageWrapper, CalculatorSkeleton, AdPlaceholder, SimpleBadge, SimpleFAQ
│   ├── ui/                        # shadcn/ui komponenty (24 ks)
│   ├── ads/                       # Reklamní komponenty
│   ├── analytics/                 # Google Analytics
│   ├── navigation/                # Navigace, header, footer
│   ├── seo/                       # SEO komponenty (⚠️ deprecated next/head)
│   └── theme/                     # Theme provider
├── config/site.ts                 # Site metadata, navigation
├── context/ThemeContext.tsx        # Theme management (⚠️ používá next/router)
├── data/                          # calculators.json, relationships.json, categories.json
├── hooks/                         # useNumberInput, useCalculatorForm, useValidation, useRatingData...
├── i18n/                          # Nastavení 5 locales
├── lib/                           # calculatorDataUtils, calculatorValidation, calculatorFormatting, calculatorMath
├── messages/{cs,en,sk,pl,hu}.json # Překlady
├── styles/globals.css             # Tailwind + CSS proměnné
├── types/                         # TypeScript definice
└── utils/math/                    # percentage, expression, geometry
```

### 4.2 Routing

**URL pattern:** `/{locale}/calculator/{category}/{calculator-slug}`

Middleware (`src/middleware.ts`) používá `next-intl/middleware` pro detekci locale a prefix routing. Podporuje 5 locales: cs, en, sk, pl, hu.

**KRITICKÉ:** Nikdy neměň existující URL. Při přesunu přidej Next.js redirect.

### 4.3 Komponentní hierarchie (POVINNÁ)

```
page.tsx (10–15 řádků s CalculatorPageWrapper)
  └── CalculatorPageWrapper
      └── ErrorBoundary
          └── Suspense (CalculatorSkeleton)
              └── [Calculator] (dynamic import, ssr: false)
                  └── SimpleCalculatorLayout
                      ├── children (formulářové inputy – CalculatorInput)
                      ├── resultSection (výsledky – CalculatorResult)
                      ├── formula (LaTeX vzorec)
                      ├── examples (příklady použití)
                      ├── faq (časté dotazy)
                      ├── relatedCalculators (z getRelatedCalculators())
                      └── schemaData (Schema.org)
```

### 4.4 Referenční implementace – BMI Calculator v2

| Soubor | Cesta | Řádků | Účel |
|---|---|---|---|
| Page wrapper | `src/app/[locale]/calculator/bmi-new/page.tsx` | 82 | ErrorBoundary + Suspense + dynamic import |
| Komponenta | `src/components/calculators/BMICalculator.tsx` | 218 | Kalkulačka s SimpleCalculatorLayout |
| Layout | `src/components/layout/SimpleCalculatorLayout.tsx` | 446 | Sdílený layout se všemi sekcemi |
| Shared input | `src/components/calculators/shared/CalculatorInput.tsx` | 73 | Znovupoužitelný input s validací |
| Shared result | `src/components/calculators/shared/CalculatorResult.tsx` | 65 | Znovupoužitelný výsledek |
| Rating | `src/components/calculators/shared/CalculatorRating.tsx` | 139 | Hodnocení kalkulačky (refaktorováno) |
| Data utils | `src/lib/calculatorDataUtils.ts` | 212 | getRelatedCalculators(), getQuickLinks() |

**Co je na BMI v2 dobré:** Čistá separace page/komponenta/layout, real-time výpočet, typované rozhraní `BMIResult`, centralizované related calculators, LaTeX vzorec, příklady, FAQ, Schema.org, má testy.

### 4.5 SimpleCalculatorLayout – klíčové props

```typescript
interface SimpleCalculatorLayoutProps {
  title: string;                   // Název kalkulačky
  description: string;             // Popis pro uživatele
  category: string;                // Kategorie (pro breadcrumbs)
  calculatorId: string;            // ID pro centralizovaná data
  seo: { title: string; description: string; keywords: string[] };
  formula?: { latex: string; description: string };
  children: React.ReactNode;       // Formulářové inputy
  resultSection?: React.ReactNode; // Výsledky výpočtu
  examples?: { title: string; description: string; scenarios: Array<{title: string; description: string; example?: string}> };
  faq?: Array<{ question: string; answer: string }>;
  relatedCalculators?: Array<{title: string; description: string; href: string; category: string}>;
  schemaData?: { applicationCategory: string; operatingSystem: string };
}
```

---

## 5. Vzory a konvence

### 5.1 Pojmenování

| Typ | Konvence | Příklad |
|-----|----------|---------|
| Komponenty | PascalCase | `BMICalculator.tsx`, `VATCalculator.tsx` |
| Routy | kebab-case česky | `cista-mzda`, `procento-z-cisla` |
| Překlady | snake_case | `bmi_category_normal`, `height_label` |
| Typy | PascalCase + postfix | `BMIResult`, `VATCalculatorProps` |
| Hooks | camelCase s "use" | `useNumberInput`, `useCalculatorForm` |

### 5.2 Page wrapper (ŠABLONA)

```tsx
'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { CalculatorPageWrapper } from '@/components/shared/CalculatorPageWrapper';

const MyCalculator = dynamic(
  () => import('@/components/calculators/MyCalculator'),
  { ssr: false }
);

export default function MyCalculatorPage() {
  return <CalculatorPageWrapper calculatorComponent={MyCalculator} calculatorId="my-calculator" />;
}
```

### 5.3 Kalkulačka (ŠABLONA STRUKTURY)

```tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput, CalculatorResult } from './shared';
import { getRelatedCalculators } from '@/lib/calculatorDataUtils';

interface MyResult {
  value: number;
  category: string;
}

const MyCalculator: React.FC = () => {
  const t = useTranslations();
  const { locale } = useParams();
  
  // State – vždy string pro inputy
  const [input1, setInput1] = useState<string>('');
  const [errors, setErrors] = useState<{ input1?: string }>({});
  const [result, setResult] = useState<MyResult | null>(null);

  // Real-time výpočet – ŽÁDNÝ submit button
  useEffect(() => {
    // validace → výpočet → setResult
  }, [input1]);

  // Centralizovaná data
  const relatedCalculators = getRelatedCalculators('my-calculator', locale as string, t);

  return (
    <SimpleCalculatorLayout
      title={t('my_calc_title')}
      description={t('my_calc_desc')}
      category="category"
      calculatorId="my-calculator"
      seo={{ title: t('my_calc_seo_title'), description: t('my_calc_seo_desc'), keywords: [...] }}
      formula={{ latex: String.raw`E = mc^2`, description: t('my_calc_formula_desc') }}
      resultSection={result && <CalculatorResult label={t('result')} value={result.value} unit="..." />}
      examples={{ title: t('examples_title'), description: t('examples_desc'), scenarios: [...] }}
      faq={[{ question: t('faq_1_q'), answer: t('faq_1_a') }, ...]}
      relatedCalculators={relatedCalculators}
      schemaData={{ applicationCategory: "UtilityApplication", operatingSystem: "Any" }}
    >
      <div className="space-y-6">
        <CalculatorInput id="input1" label={t('input1_label')} value={input1} onChange={setInput1}
          placeholder="0" min="0" max="100" unit="..." error={errors.input1} />
      </div>
    </SimpleCalculatorLayout>
  );
};

export default MyCalculator;
```

### 5.4 Styling pravidla

- **Tailwind utility classes** – vždy před custom CSS
- **`cn()` helper** z `@/lib/utils` pro podmíněné třídy (clsx + tailwind-merge)
- **CSS proměnné** pro theming (HSL v globals.css)
- **Dark mode** – class-based přes next-themes
- **Responsive** – mobile-first, přidávej `md:`, `lg:`
- **Žádné inline styly** (kromě dynamických hodnot)

### 5.5 State management

- Lokální stav přes `useState` (žádný global state management)
- Inputy vždy jako `string`, parsování při výpočtu
- Validace při každé změně inputu
- Chyby v samostatném state: `useState<{ field?: string }>({})`

---

## 6. Přísná pravidla

> **Kompletní checklist:** viz [`docs/DEFINITION_OF_DONE.md`](docs/DEFINITION_OF_DONE.md)

### 6.1 MUSÍŠ vždy

1. **Používat `SimpleCalculatorLayout`** – žádný `CalculatorBase` ani inline layout
2. **Používat `CalculatorInput` a `CalculatorResult`** ze `shared/`
3. **Používat `getRelatedCalculators()`** – žádná hardcoded pole
4. **Používat `useTranslations()`** – žádný hardcoded text
5. **Real-time výpočet** přes `useEffect` – žádný submit button
6. **Mít LaTeX vzorec** na každé kalkulačce
7. **Mít FAQ sekci** (min. 3 otázky) – targetuje Google PAA
8. **Mít příklady použití** (min. 2 scénáře)
9. **Mít Schema.org data** – SoftwareApplication + FAQPage
10. **Zachovat zpětnou kompatibilitu URL** – existující routy nesmí zmizet
11. **Přidat překlady do cs.json a en.json** (sk, pl, hu volitelné pro DONE)
12. **Formátovat čísla podle locale** – `Intl.NumberFormat` nebo `toLocaleString`

### 6.2 NESMÍŠ nikdy

1. **Vytvářet duplicitní soubory** – žádné `-new`, `-old`, `-refactored` přípony
2. **Překročit 250 řádků** na komponentu – extrahuj logiku do hooks/utils
3. **Používat `any` typ** – typuj vše explicitně
4. **Hardcodovat relatedCalculators** – používej centralizovaná data
5. **Odstraňovat `<AdPlaceholder>` komponenty** – jsou kritické pro příjmy
6. **Servírovat český obsah slovenským uživatelům** – vždy separátní překlady
7. **Měnit existující URL** bez redirectu
8. **Vytvářet komponentu bez SEO metadat**
9. **Vynechávat error handling** – každý input musí validovat
10. **Zapomínat na mobile responsive** – testuj na 375px šířce

---

## 7. SEO implementace

### 7.1 Metadata API (Next.js 14+)

Pro každou stránku implementuj `generateMetadata`:

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale);
  
  return {
    title: t('calc_seo_title'),
    description: t('calc_seo_desc'),
    keywords: t('calc_seo_keywords').split(','),
    openGraph: {
      title: t('calc_og_title'),
      description: t('calc_og_desc'),
      locale: locale,
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
    alternates: {
      canonical: `https://mathcalc.pro/${locale}/calculator/...`,
      languages: {
        cs: 'https://mathcalc.pro/cs/calculator/...',
        en: 'https://mathcalc.pro/en/calculator/...',
        sk: 'https://mathcalc.pro/sk/calculator/...',
        pl: 'https://mathcalc.pro/pl/calculator/...',
        hu: 'https://mathcalc.pro/hu/calculator/...',
      },
    },
  };
}
```

### 7.2 Schema.org (v SimpleCalculatorLayout)

Každá kalkulačka musí mít: **SoftwareApplication** (rich results), **FAQPage** (FAQ snippety), **BreadcrumbList** (navigační breadcrumby).

### 7.3 Hreflang tags

KRITICKÉ pro vícejazyčný SEO. Každá stránka musí mít obousměrné hreflang linky mezi všemi 5 jazykovými verzemi + `x-default` na angličtinu.

---

## 8. Prioritní implementační roadmap

### Fáze 1 (Měsíc 1–3): 40 high-impact kalkulaček – P1

**Finanční (EN – premium CPC):**
Mortgage calculator, Loan calculator, Investment return calculator, Debt payoff, Home affordability

**Finanční (CE – country-specific):**
Čistá mzda CZ/SK/PL/HU (existuje, refaktorovat), DPH/VAT CZ/SK/PL/HU (existuje, rozšířit), OSVČ CZ, PIT-37 PL, KATA HU

**Zdraví (traffic builders):**
BMI (existuje), Kalorie, TDEE, BMR, Body fat, Ideal weight

**Matematika (domain authority):**
Procenta (existuje), Zlomky (existuje), Trojčlenka (existuje), Scientific calculator, Standard deviation, Quadratic equation

### Fáze 2 (Měsíc 4–6): 50 medium-priority – P2

Stavební (beton, barva, podlaha, střecha), Automotive (spotřeba, autopůjčka, odpisy), Praktické (věk, datum, spropitné, palivo), E-commerce (marže, ROI, CPC/CPM, break-even), Vzdělávání (GPA, známky – launch Srpen)

### Fáze 3 (Měsíc 7–12): 50+ remaining – P3

Emerging (krypto, solární panely, carbon footprint), Deep CE (nemocenská CZ, důchodový věk CZ, PPK PL, rezsi HU), Niche (pizza comparison, wedding budget, freelancer rate)

> **Kompletní seznam 141+ kalkulaček s SEO hodnotou, složitostí a prioritou:** viz projektový soubor `MathCalc_Pro__Comprehensive_Market_Research_for_141__Calculator_Expansion.md`

---

## 9. Datová vrstva

### 9.1 Centralizovaná konfigurace

Všechna metadata kalkulaček jsou v `src/data/`:

- **`calculators.json`** – ID, slug, kategorie, popularita, tagy, cesty
- **`calculator-relationships.json`** – relace mezi kalkulačkami s fallback strategií
- **`calculator-categories.json`** – kategorie, ikony, barvy, priority

### 9.2 Utility funkce

| Funkce | Modul | Účel |
|--------|-------|------|
| `getRelatedCalculators(id, locale, t)` | `calculatorDataUtils` | Související kalkulačky s fallback |
| `getCalculatorCategories(locale, t)` | `calculatorDataUtils` | Kategorie s počty |
| `getQuickLinks(type, locale, t)` | `calculatorDataUtils` | Populární kalkulačky |
| `searchCalculators(query, locale, t)` | `calculatorDataUtils` | Hledání kalkulaček |
| `isValidNumber(value)` | `calculatorValidation` | Validace čísla |
| `isValidMathExpression(value)` | `calculatorValidation` | Validace výrazu |
| `formatNumber(value, locale)` | `calculatorFormatting` | Formátování podle locale |
| `formatNumberWithCommas(value)` | `calculatorFormatting` | Formátování s oddělovačem |
| `parseNumber(value)` | `calculatorMath` | Parsování vstupu |
| `convertUnit(value, from, to)` | `calculatorMath` | Konverze jednotek |
| `calculatePercentage(...)` | `utils/math/percentage` | Procentuální výpočty |
| `evaluateMathExpression(expr)` | `utils/math/expression` | Vyhodnocení math výrazu |

---

## 10. Kontrolní checklist před commitem

Před každým commitem ověř:

- [ ] Používá `SimpleCalculatorLayout`
- [ ] Používá `CalculatorInput` a `CalculatorResult` ze `shared/`
- [ ] Real-time výpočet (žádný submit button)
- [ ] LaTeX vzorec přítomen
- [ ] Příklady použití (min. 2 scénáře)
- [ ] FAQ sekce (min. 3 otázky)
- [ ] Related calculators přes `getRelatedCalculators()`
- [ ] Schema.org structured data
- [ ] SEO metadata (title, description, keywords, OG, hreflang)
- [ ] Překlady ve všech 5 locale souborech
- [ ] Responsive na mobilu (testuj 375px)
- [ ] Dark mode funguje
- [ ] Čísla formátována podle locale
- [ ] Měna zobrazena správně (CZK za číslem, $ před číslem)
- [ ] Komponenta pod 250 řádků
- [ ] Žádné hardcoded texty
- [ ] Žádné `any` typy
- [ ] Žádné duplicitní soubory (-new, -old, -refactored)
- [ ] `<AdPlaceholder>` komponenty na místě
- [ ] `npm run build` prochází bez chyb

---

## 11. Aktuální stav projektu

### 11.1 Co je hotovo

- ✅ **Sdílená infrastruktura:** 10 komponent, 6 utility modulů, 7 custom hooků (23 nových souborů)
- ✅ **Batch 0:** Smazány všechny duplikáty (-new routes), vytvořeno 12 chybějících rout
- ✅ **Redukce kódu:** ~1 400 řádků duplicity odstraněno, 3 duplicitní utility soubory smazány
- ✅ **BMI v2** = referenční implementace
- ✅ **Trojčlenka přímá úměra** migrována na SimpleCalculatorLayout
- ✅ **Locale konzistence:** 5 locales sjednoceno v middleware i i18n settings
- ✅ **CalculatorRating:** Refaktorován z 246 na 139 řádků

### 11.2 Co zbývá (prioritně)

1. **Batch 1 (rozpracováno 1/6):** Migrovat zbylé CalculatorBase kalkulačky – nepřímá úměra, zlomky, složené úročení, čistá mzda, převodník jednotek
2. **Batch 2:** Finance – anuitní splátka, IRR (zmenšit z 555ř), NPV, ROI, předčasné splacení
3. **Batch 3:** Stavební – zmenšit velké soubory: beton (649ř), objem (666ř)
4. **Nahradit 23 hardcoded relatedCalculators** – ~1 500 řádků zbytečné duplicity
5. **Standardizovat page wrappery** – 3 různé vzory → 1 (CalculatorPageWrapper)
6. **Nové kalkulačky:** Implementovat podle roadmapu sekce 8
7. **TypeScript strict mode:** Povolit a opravit chyby
8. **Testy:** Pokrytí je 2.6% (pouze BMI) – alespoň MVP kalkulačky
9. **Kompletní překlady:** Doplnit sk, pl, hu
10. **Implementovat 12 placeholderů:** 6 fraction operations, 6 fitness/praktické

### 11.3 Známé technické dluhy

| Problém | Soubor/Oblast | Závažnost |
|---------|---------------|-----------|
| `strict: false` | `tsconfig.json` | Kritické |
| SEO deprecated `next/head` | `src/components/seo/SeoMetadata.tsx` | Vysoké |
| `next/router` místo `next/navigation` | `src/context/ThemeContext.tsx` | Střední |
| `next: "latest"` nepřipnuté | `package.json` | Střední |
| 10+ kalkulaček na CalculatorBase | Různé komponenty | Vysoké |
| 23 hardcoded relatedCalculators | Různé komponenty (~1500ř) | Vysoké |
| Test coverage 2.6% | Pouze BMI | Vysoké |
| Chybí ESLint/Prettier | Žádná konfigurace | Nízké |
| Chybí CI/CD pipeline | Žádné GitHub Actions | Nízké |

> **Detailní stav refaktoringu:** viz [`docs/refactoring-tracker.md`](docs/refactoring-tracker.md)
> **Kompletní analýza kódu:** viz [`docs/code-analysis.md`](docs/code-analysis.md)
> **Cílová architektura:** viz [`docs/target-architecture.md`](docs/target-architecture.md)

---

## 12. Instrukce pro AI agenta

### Při vytváření nové kalkulačky:

1. **Přečti BMI v2** jako referenci (`src/components/calculators/BMICalculator.tsx`)
2. **Přečti `docs/calculator-template.md`** pro kompletní šablonu
3. **Zkontroluj `src/data/calculators.json`** – přidej metadata
4. **Zkontroluj `src/data/calculator-relationships.json`** – přidej relace
5. **Přidej překlady** do všech 5 souborů v `src/messages/`
6. **Country-specific kalkulačky:** Ověř aktuální daňové sazby a legislativu webovým vyhledáváním
7. **Finanční kalkulačky v EN:** Přidej maximálně detailní vzdělávací obsah (1500+ slov v překladech)

### Při refaktoringu existující kalkulačky:

1. **Přečti `docs/refactoring-tracker.md`** – ověř aktuální stav
2. **Postupuj podle `docs/target-architecture.md`** – cílový stav
3. **Zachovej URL** – žádné breaking changes
4. **Aktualizuj tracker** po dokončení
5. **Postup:** Přečti aktuální kód → Přečti BMI v2 → Přepiš na SimpleCalculatorLayout → Aktualizuj page wrapper → Přidej překlady → Přidej testy → Ověř všech 5 locale

### Při práci s překlady:

1. **CZ → SK:** Adaptuj, netranslatuj doslova. Zkontroluj finanční terminologii.
2. **Pro PL a HU:** Transcreace – lokální příklady, měny, daňové sazby.
3. **Pro EN:** Premium kvalita – targetuje US/UK audience s vysokým CPC.
4. **Sezónní obsah:** Aktualizuj daňové sazby každý leden.

---

*Tento dokument je živý – aktualizuj ho při každé významné změně v projektu.*