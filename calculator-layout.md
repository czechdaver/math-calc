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

### 8. Související kalkulačky
- Výpis odkazů na další relevantní kalkulačky (Card/Grid).
- Možnost rychlého přechodu na další výpočet.

### 9. Adblock Modal
- Modal vysvětlující podporu webu reklamou v lokálním jazyce.
- Zobrazení pouze při detekci blokování reklam.

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
- Všechny texty, labely, hlášky, příklady lokalizované (next-i18next).
- Automatická detekce jazyka podle URL, fallback na default.

## Kódové zásady pro generátor aplikace
- Každý kalkulátor je samostatná komponenta, obalená tímto layoutem.
- Dynamický import kalkulačky dle kategorie/názvu z URL.
- Layout musí fungovat i pro jednostránkové a vícestánkové kalkulačky.
- Snadná rozšiřitelnost pro nové typy výpočtů.

## Schema.org a SEO
- Strukturovaná data typu `SoftwareApplication` či `Calculator`.
- Rich Snippets pro náhled ve vyhledávačích.

---

