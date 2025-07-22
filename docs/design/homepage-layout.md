---
title: Homepage Layout
category: Design
version: 1.2.0
updated: 2025-07-22
---

# Specifikace: Homepage Layout (Úvodní stránka aplikace)

## Cíle
- Maximální srozumitelnost, rychlá navigace ke kalkulačkám.
- Příjemné a moderní UI s důrazem na důvěryhodnost (CEE trhu).
- Podpora monetizace a SEO.

## Struktura homepage

### 1. Navigation Bar
- Logo/název projektu (vlevo).
- Odkazy na hlavní sekce/kategorie kalkulaček.
- Jazyková volba (dropdown s vlajkami/skratkami jazyků).
- Search bar (“Najít kalkulačku…” autocomplete, klávesová zkratka).

### 2. Hero Sekce
- Hlavní headline (např. “Matematické kalkulačky pro každodenní použití”).
- Podtitulek popisující hlavní řešené problémy (procenta, převody…).
- Ilustrace/animace s tématikou výpočtů nebo matematiky.
- Hlavní CTA tlačítko: “Začít počítat” – posune na seznam kalkulaček.

### 3. Nejpoužívanější kalkulačky (rozcezstník)
- Grid několika nejčastějších kalkulaček → card style (ikona, popis, rating/popularita).
- Každá karta = CTA (převést na konkrétní kalkulačku page).

### 4. Kategorie kalkulaček  
- Grid sekce pro kategorie (Matematika, Finance, Zdraví, Jednotky atd.) s ikonou a počtem dostupných kalkulaček.
- Proklik do kategorie zobrazí kompletní rozcestník s výběrem kalkulaček.

### 5. Reklamní plochy na homepage
- Header banner (pod navigací).
- In-content (mezi grid sekcemi).
- Sidebar reklama (desktop only).
- Footer banner (před patičkou).

### 6. Trust & Proof sekce
- Box s “Důvěřují nám” – počty uživatelů, partnerské loga, nejvyšší hodnocení.
- Reference/testimonial slider s reálnými citacemi.

### 7. FAQ blok
- Accordion se základními dotazy k používání aplikace a ochraně soukromí.

### 8. Footer
- Odkazy na kategorie kalkulaček, blog, podmínky, GDPR.
- Kontaktní a firemní informace (adresa, e-mail).
- Jazyková volba a informace o copyrightu.

## UX/UI a technické zásady
- Responzivní/mobilní přístup: grid karty se zalamují v jednom či dvou sloupcích.
- Touch-friendly interface (velké clickable plochy, min 44px).
- Sticky hlavní menu na mobile.
- Sticky spodní reklama pro mobil.
- Optimalizace pro rychlý load (lazy-load ilustrací a reklam)
- Maximalizace SEO (H1, popisky, klíčová slova, meta description a schema.org WebSite/WebApplication markup)
- Přístupnost: všechny informace/highlight CTA i pro screenreadery.

## Monetizace
- Reklamní boxy viz výše, s možností jejich vypnutí informováním o podpoře v případě AdBlocku (soft modal).

## Lokalizace a CEE adaptace
- Veškeré texty v jazycích: čeština, slovenština, polština, maďarština.
- Správné měnové a číselné formáty v lokalizacích.
- Příklady a FAQ podle regionálních zvyklostí.

---