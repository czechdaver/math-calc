---
title: Calculator Layout
category: Design
version: 2.0.0
updated: 2025-08-06
---

# Specifikace: Reusable Kalkulačkový Layout (Calculator Page Layout)

## Účel
Unifikovaný layout stránky každé kalkulačky, který zajišťuje:
- profesionální vzhled,
- přehlednou strukturu,
- optimální umístění reklam,
- možnost škálování na různé typy výpočtů,
- SEO optimalizaci a lokalizaci.

## Struktura stránky

### 1. Nadpis a Meta informace
- H1: Název výpočtu/kalkulačky (lokalizovaný)
- SEO meta tagy (title, description podle kalkulačky).

### 2. Navigace (Breadcrumb)
- Zpět na hlavní rozcestník/hlavní kategorie.

### 3. Vzorec (LaTeX)
- Zobrazení matematického vzorce pomocí LaTeX rendereru (KaTeX).
- Nad vzorcem krátký popis/použití.

### 4. Kalkulačka – Vstupní pole
- Kompaktní formulář s validací (shadcn/ui: `Card`, `Input`, `Select`, `Button`, ...)
- Reálné příklady naplnění inputů (placeholdery a hinty)
- Okamžitý výstup po změně hodnoty (bez kliku na tlačítko).

### 5. Výsledek výpočtu
- Jasně oddělený box s výsledkem (shadcn/ui: `Card`).
- Výstup obsahuje:
    - hodnotu,
    - popisný text,
    - případně výsledný vzorec/vypočet výpočtu v LaTeXu (opět přes KaTeX).

### 6. Sekce s příklady a vysvětlením
- Případové scénáře (textově a případně formou mini-tabulky).
- Možnost rozšíření o krok za krokem návod.

### 7. Reklamní plochy
- Header banner (desktop: 728x90, mobile: 320x100).
- Mezi kalkulačkou a výsledkem (in-content: 300x250).
- Sidebar vpravo (160x600/300x250, desktop only).
- Sticky bottom bar (mobile: 320x50).

### 8. Související kalkulačky (NOVÝ MODULÁRNÍ SYSTÉM)
- **Centralizovaná data struktura** - kalkulačky načítané z `/src/data/calculators.json`
- **Automatické vztahy** - definované v `/src/data/calculator-relationships.json`
- **Inteligentní fallback** - podle kategorie a popularity při nedostatku dat
- **Utility funkce** - `getRelatedCalculators(id, locale, t)` pro snadné načítání
- **Výhody:**
  - Přidání nové kalkulačky = úprava JSON souborů
  - Žádné úpravy desítek existujících kalkuláček
  - AI-friendly struktura dat bez ztráty kontextu
  - Automatické lokalizace a odkazy

### 9. Adblock Modal
- Modal vysvětlující podporu webu reklamou v lokálním jazyce.
- Zobrazení pouze při detekci blokování reklam.

### 9. Rychlé odkazy (NOVÝ MODULÁRNÍ SYSTÉM)
- **Dynamické kategorie** - načítané z `/src/data/calculator-categories.json`
- **Populární kalkulačky** - automaticky řazené podle popularity
- **Kategorie s počty** - zobrazení počtu kalkuláček v každé kategorii
- **Barevné označení** - každá kategorie má vlastní barvu a ikonu
- **Utility funkce:**
  - `getCalculatorCategories(locale, t)` - načte kategorie s lokalizací
  - `getQuickLinks('popular', locale, t)` - načte populární kalkulačky
  - `searchCalculators(query, locale, t)` - vyhledávání podle klíčových slov

### 10. FAQ a podpora
- Accordion s nejčastějšími dotazy k aktuálnímu typu výpočtu.

### 11. Tracking & Analytics
- Event trackování návštěvy, interakcí a použití kalkulačky (Firebase Analytics).
- Logování chybných vstupů a konverzí.

## UX a UI Zásady
- Responzivní mřížka (mobile-first).
- Jednoduchý, čistý vizuální styl inspirován shadcn/ui a Tailwindem.
- Maximální kontrast a čitelnost výsledků.
- Přístupnost (WCAG 2.1), dostatečný barevný kontrast, focus indikátory.

## Lokalizace
- Všechny texty, labely, hlášky, příklady lokalizované (next-intl).
- Automatická detekce jazyka podle URL, fallback na default.

## Kódové zásady pro generátor aplikace
- Každý kalkulátor je samostatná komponenta, obalená tímto layoutem.
- Dynamický import kalkulačky dle kategorie/názvu z URL.
- Layout musí fungovat i pro jednostránkové a vícestránkové kalkulačky.
- Snadná rozšiřitelnost pro nové typy výpočtů.

## NOVÁ MODULÁRNÍ DATOVÁ STRUKTURA (v2.0)

### Centralizovaná data

#### `/src/data/calculators.json`
```json
{
  "calculators": {
    "bmi": {
      "id": "bmi",
      "slug": "bmi",
      "category": "health",
      "popularity": 95,
      "titleKey": "bmi_calculator_title",
      "descriptionKey": "bmi_calculator_description",
      "path": "/calculator/bmi",
      "tags": ["health", "fitness", "weight", "body"],
      "relatedCategories": ["health", "fitness"]
    }
  }
}
```

#### `/src/data/calculator-relationships.json`
```json
{
  "relationships": {
    "bmi": {
      "related": ["bmr", "ideal-weight", "body-fat"],
      "maxCount": 3,
      "priorityOrder": ["bmr", "ideal-weight", "body-fat"]
    }
  },
  "fallbackStrategy": {
    "sameCategory": true,
    "popularityThreshold": 70,
    "maxFallbackCount": 2
  }
}
```

#### `/src/data/calculator-categories.json`
```json
{
  "categories": {
    "health": {
      "id": "health",
      "titleKey": "category_health_title",
      "descriptionKey": "category_health_description",
      "icon": "Heart",
      "color": "text-red-600",
      "bgColor": "bg-red-50",
      "calculators": ["bmi", "bmr", "ideal-weight"],
      "priority": 1
    }
  }
}
```

### Utility funkce (`/src/lib/calculatorDataUtils.ts`)

#### Načítání souvisejících kalkuláček
```typescript
// Použití v kalkulačce
const relatedCalculators = getRelatedCalculators('bmi', locale, t);

// Výsledek:
// [
//   {
//     id: 'bmr',
//     title: 'BMR Kalkulátor',
//     description: 'Vypočítejte bazální metabolismus...',
//     href: '/cs/calculator/bmr',
//     category: 'health'
//   }
// ]
```

#### Načítání kategorií a rychlých odkazů
```typescript
// V SimpleCalculatorLayout
const popularLinks = getQuickLinks('popular', locale, t);
const calculatorCategories = getCalculatorCategories(locale, t);
```

### Výhody nového systému

1. **Snadná údržba**
   - Přidání nové kalkulačky = úprava 3 JSON souborů
   - Žádné úpravy desítek existujících komponent
   - Centralizovaná správa všech vztahů

2. **AI-friendly**
   - Jasná struktura dat bez ztráty kontextu
   - Předvídatelné vzory pro rozšiřování
   - Automatické fallback mechanismy

3. **Škálovatelnost**
   - Automatické řazení podle popularity
   - Inteligentní doporučování podle kategorie
   - Flexibilní konfigurace počtu zobrazených položek

### 4. Lokalizace
   - Automatické načítání překladů podle locale
   - Konzistentní odkazy s jazykovou mutací
   - Jednotná správa překladových klíčů

## NOVÁ RATING KOMPONENTA (v2.0)

### Přehled
Sdílená komponenta `CalculatorRating` umožňuje uživatelům hodnotit kalkulačky pomocí hvězdiček (1-5 hvězdiček) s jednoduchým počítadlem recenzí.

### Umístění v layoutu
- **Pozice:** Hned za nadpis a popis kalkulačky
- **Vizuální styl:** Karta s hvězdičkami a počtem hodnocení
- **Responzivita:** Maximální šířka 384px (max-w-md)

### Funkční vlastnosti

#### Anti-abuse ochrana
- **localStorage klíč:** `user_rating_{calculatorId}` - zabrání opakovanému hodnocení
- **Vizuální feedback:** Po hodnocení se zobrazí "Děkujeme za hodnocení!"
- **Deaktivace:** Hvězdičky se po hodnocení deaktivují

#### Ukládání dat
- **Centrální klíč:** `rating_{calculatorId}` v localStorage
- **Datová struktura:**
```json
{
  "totalRating": 85,
  "reviewCount": 20,
  "averageRating": 4.25
}
```

#### Zobrazení hodnocení
- **Průměrné hodnocení:** Zobrazeno s přesností na 1 desetinné místo
- **Počet recenzí:** Lokalizovaný text ("hodnocení" / "reviews")
- **Prázdný stav:** "Zatím žádná hodnocení" / "No reviews yet"

### Implementace

#### Použití v kalkulačce
```typescript
<SimpleCalculatorLayout
  title={t('calculator_title')}
  description={t('calculator_description')}
  category="health"
  calculatorId="bmi"  // POVINNÉ pro rating
  // ... ostatní props
>
```

#### Automatická integrace
Rating komponenta se automaticky zobrazí v každé kalkulačce, která má definované `calculatorId`.

### Lokalizační klíče

#### České překlady (`cs.json`)
```json
{
  "rating": {
    "reviews": "hodnocení",
    "no_reviews": "Zatím žádná hodnocení",
    "thank_you": "Děkujeme za hodnocení!",
    "click_to_rate": "Klikněte na hvězdičky pro hodnocení"
  }
}
```

#### Anglické překlady (`en.json`)
```json
{
  "rating": {
    "reviews": "reviews",
    "no_reviews": "No reviews yet",
    "thank_you": "Thank you for rating!",
    "click_to_rate": "Click stars to rate"
  }
}
```

### Výhody pro údržbu

1. **Jednoduchá integrace**
   - Stačí přidat `calculatorId` do layoutu
   - Automatické zobrazení bez dalších úprav

2. **Centralizované ukládání**
   - Každá kalkulačka má vlastní rating data
   - localStorage zajišťuje persistenci mezi návštěvami

3. **AI-friendly**
   - Jasná struktura dat
   - Snadné rozšiřování o nové kalkulačky
   - Konzistentní API napříč projektem

4. **UX optimalizace**
   - Ochrana proti spam hodnocení
   - Vizuální feedback pro uživatele
   - Responzivní design

### Budoucí rozšíření

- **Backend integrace:** Možnost synchronizace s databází
- **Pokročilé analytics:** Sledování trendů hodnocení
- **Komentáře:** Rozšíření o textové recenze
- **Moderace:** Nástroje pro správu hodnocení

## Schema.org a SEO
- Strukturovaná data typu `SoftwareApplication` či `Calculator`.
- Rich Snippets pro náhled ve vyhledávačích.

---
{{ ... }}
