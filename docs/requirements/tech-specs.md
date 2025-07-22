---
title: Technical Specifications
category: Requirements
version: 1.2.0
updated: 2025-07-22
---

# Technické specifikace projektu

## Optimalizace obrázků a Lazy Load

Pro optimalizaci obrázků a implementaci lazy loadingu v projektu Next.js doporučujeme používat vestavěnou komponentu `next/image`. Tato komponenta poskytuje automatickou optimalizaci velikosti, formátu a lazy loadingu obrázků, což vede ke zlepšení výkonu a rychlejšímu načítání stránek.

### Jak používat `next/image`

1.  **Importujte komponentu:** Na začátku souboru, kde chcete použít obrázek, importujte `Image` z `next/image`:

    ```jsx
    import Image from 'next/image';
    ```

2.  **Nahraďte `<img>` tag:** Nahraďte standardní `<img>` tag komponentou `Image`. Místo atributu `src` použijte prop `src`. Dále je nutné specifikovat `width` a `height` obrázku.

    ```jsx
    // Místo:
    // <img src="/path/to/your/image.jpg" alt="Popis obrázku" />

    // Použijte:
    <Image
      src="/path/to/your/image.jpg"
      alt="Popis obrázku"
      width={500} // Zadejte šířku obrázku v pixelech
      height={300} // Zadejte výšku obrázku v pixelech
    />
    ```

3.  **Konfigurace domén obrázků (pokud načítáte z externích zdrojů):** Pokud načítáte obrázky z externích URL, musíte nakonfigurovat domény v souboru `next.config.js`:

    ```javascript
    module.exports = {
      images: {
        domains: ['example.com', 'anotherdomain.com'],
      },
    };
    ```

### Přínosy použití `next/image`

*   **Automatický Lazy Load:** Obrázky se načtou až v momentě, kdy se objeví v zobrazení uživatele (viewportu), což zrychluje počáteční načítání stránky.
*   **Optimalizace velikosti a formátu:** `next/image` automaticky servíruje obrázky v optimalizované velikosti a moderních formátech (např. WebP), pokud je prohlížeč podporuje.
*   **Prevence CLS (Cumulative Layout Shift):** Zadáním `width` a `height` se před načtením obrázku vyhradí místo, což zabraňuje posunu obsahu stránky.
*   **Prioritní načítání:** Pomocí prop `priority` můžete určit, které obrázky jsou klíčové pro počáteční zobrazení stránky a měly by se načíst s vyšší prioritou.

Použitím `next/image` zajistíte, že vaše ilustrace a obrázky budou načítány efektivně a pozitivně ovlivní výkon a SEO vašeho webu.

## Reusable Calculator Components

To ensure a scalable and maintainable architecture for 141+ calculators, we are implementing a reusable component pattern for each calculator's logic and UI.

**Architecture:**

- **Dynamic Route:** A single dynamic route file (`src/app/[locale]/calculator/[category]/[name]/page.tsx`) handles all calculator URLs.
- **Server Component (`page.tsx`):** This file acts as a Server Component. It fetches calculator-specific data based on the URL parameters using `getCalculatorData`.
- **Client Components (Individual Calculators):** Each calculator's unique logic and UI are implemented as a Client Component in the `src/components/calculators` directory (e.g., `BMICalculator.tsx`, `DPHCalculator.tsx`).
- **Dynamic Importing:** The `page.tsx` file dynamically imports the relevant calculator Client Component using `next/dynamic` based on the fetched data or a mapping.
- **Shared Layout:** The dynamically imported calculator component is wrapped within a `CalculatorLayout` component (likely in `src/app/[locale]/calculator/layout.tsx`) which provides the common page structure, SEO elements, ad placements, etc.

**Component Responsibilities:**

- **`[category]/[name]/page.tsx` (Server Component):**
    - Fetch calculator data (`calculatorData`).
    - Handle data not found (e.g., `notFound()`).
    - Determine the correct calculator component to import.
    - Dynamically import the calculator component (`next/dynamic`, with `ssr: false`).
    - Pass `calculatorData` and `locale` as props to the imported component.
    - Render the `CalculatorLayout` wrapping the dynamic component.

- **Individual Calculator Components (Client Components in `src/components/calculators`):**
    - Marked with `"use client";`.
    - Accept `calculatorData` and `locale` as props.
    - Use `useState` to manage input values and calculation results.
    - Implement the specific calculation logic.
    - Use `useEffect` to trigger calculations when inputs change.
    - Use `useTranslation` with the `locale` prop for localization.
    - Render the calculator's input form, result display, and any calculator-specific UI elements based on `calculatorData` and component state.

**Benefits:**

- **Scalability:** Easily add new calculators by creating a new component and updating the data/mapping.
- **Maintainability:** Centralized logic for each calculator makes updates and bug fixes easier.
- **Reduced Duplication:** Avoids repeating layout and data fetching logic in multiple files.
- **Improved Performance:** Client-side calculations for instant results, server-side data fetching for SEO and initial load.

**Implementation Steps for Each Calculator Component:**

1.  Add `"use client";` directive.
2.  Import necessary React hooks (`useState`, `useEffect`), `useTranslation`, and `CalculatorData` type.
3.  Define a props interface accepting `calculatorData: CalculatorData` and `locale: string`.
4.  Update the component function signature to use the props.
5.  Access relevant data from `calculatorData`.
6.  Define state variables for inputs and outputs using `useState`.
7.  Implement the calculator's core calculation logic.
8.  Wrap calculation logic in `useEffect` with appropriate dependencies (inputs, `t`).
9.  Initialize `useTranslation` with the `locale` prop and a calculator-specific namespace.
10. Refactor JSX to use `calculatorData`, state variables, and the `t` function for localization.
11. Remove any obsolete page-specific code.