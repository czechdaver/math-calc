# Refactoring Tracker – Online Kalkulačky

> Automaticky aktualizováno při refaktoringu.
> Poslední update: 2026-02-11

## Legenda stavů

| Stav | Význam |
|-------|---------|
| ⬜ NOT_STARTED | Čeká na refaktoring |
| 🔄 IN_PROGRESS | Rozpracováno (viz poznámky kde se skončilo) |
| ✅ DONE | Dokončeno a ověřeno |
| ⚠️ BLOCKED | Nelze pokračovat (viz poznámky) |
| 🔙 REVERTED | Vráceno kvůli problému |
| 🔗 REFERENCE | Referenční implementace (nerefaktorovat) |
| 🔧 NEEDS_ROUTE | Komponenta existuje ale chybí route (vytvořit v Batch 0) |
| ⚠️ DUPLICATE | Duplicitní route (vyřešit v Batch 0) |

## Legenda priorit

| Priorita | Význam |
|----------|---------|
| 1 | Kritické (broken route, duplikáty blokující vývoj) |
| 2 | Vysoká (MVP kalkulačky, často používané) |
| 3 | Střední (funkční kalkulačky, potřebují refaktoring) |
| 4 | Nižší (méně kritické, větší složitost) |
| 5 | Nízká (placeholdery, implementovat až nakonec) |

## Legenda složitosti

| Složitost | Odhadovaný čas | Příklady |
|-----------|-----------------|----------|
| S | 1-2 hodiny | Jednoduché výpočty, málo inputů |
| M | 3-5 hodin | Více inputů, komplexnější logika |
| L | 6-10 hodin | Velké soubory (>500 řádků), složité výpočty |

---

## Plán refaktoringu

| # | Kalkulačka | Route | Stav | Batch | Priorita | Složitost | Zahájeno | Dokončeno | Commit | Poznámky |
|---|-----------|--------|------|---------|----------|----------|-----------|--------|----------|
| 1 | BMI v2 | `/calculator/bmi-new/` | 🔗 REFERENCE | - | - | - | - | - | Referenční implementace |
| 2 | BMI v1 | `/calculator/bmi/` | ✅ DONE | 0 | 1 | S | 2026-02-11 | 2026-02-11 | Obnověn z bmi-new |
| 4 | DPH new | `/calculator/dph-new/` | ✅ DONE | 0 | 1 | M | 2026-02-11 | 2026-02-11 | Smazán, původní je lepší |
| 6 | Procento z čísla new | `/calculator/procenta/procento-z-cisla-new/` | ✅ DONE | 0 | 1 | S | 2026-02-11 | 2026-02-11 | Smazán, původní je lepší |
| 12 | Čistá mzda new | `/calculator/cista-mzda-new/` | ✅ DONE | 0 | 1 | M | 2026-02-11 | 2026-02-11 | Smazán placeholder |
| 14 | Převodník jednotek new | `/calculator/prevodnik-jednotek-new/` | ✅ DONE | 0 | 1 | M | 2026-02-11 | 2026-02-11 | Smazán placeholder |
| 16 | Zlomky new | `/calculator/zlomky-new/` | ✅ DONE | 0 | 2 | L | 2026-02-11 | 2026-02-11 | Smazán placeholder |
| 17 | Složené úročení new | `/calculator/slozene-uroceni-new/` | ✅ DONE | 0 | 2 | M | 2026-02-11 | 2026-02-11 | Smazán placeholder |
| 3 | DPH | `/calculator/dph/` | ⬜ NOT_STARTED | 0 | 1 | M | - | - | Součást duplicitního páru |
| 4 | DPH new | `/calculator/dph-new/` | ⚠️ DUPLICATE | 0 | 1 | M | - | - | Duplikát - vyřešit v Batch 0 |
| 5 | Procento z čísla | `/calculator/procenta/procento-z-cisla/` | ⬜ NOT_STARTED | 0 | 1 | S | - | - | Součást duplicitního páru |
| 6 | Procento z čísla new | `/calculator/procenta/procento-z-cisla-new/` | ⚠️ DUPLICATE | 0 | 1 | S | - | - | Duplikát - vyřešit v Batch 0 |
| 7 | Kolik % je X z Y | `/calculator/procenta/kolik-procent-je-x-z-y/` | ⬜ NOT_STARTED | 0 | 1 | S | - | - | Součást duplicitního páru |
| 8 | Kolik % je X z Y new | `/calculator/kolik-procent-je-x-z-y-new/` | ⚠️ DUPLICATE | 0 | 1 | S | - | - | Duplikát - vyřešit v Batch 0 |
| 9 | Y je X% co je 100% | `/calculator/procenta/y-je-x-kolik-je-sto/` | ⬜ NOT_STARTED | 0 | 1 | S | - | - | Součást duplicitního páru |
| 10 | Y je X% co je 100% new | `/calculator/y-je-x-kolik-je-sto-new/` | ⚠️ DUPLICATE | 0 | 1 | S | - | - | Duplikát - vyřešit v Batch 0 |
| 11 | Čistá mzda | `/calculator/cista-mzda/` | ⬜ NOT_STARTED | 0 | 1 | M | - | - | Součást duplicitního páru |
| 12 | Čistá mzda new | `/calculator/cista-mzda-new/` | ⚠️ DUPLICATE | 0 | 1 | M | - | - | Duplikát - vyřešit v Batch 0 |
| 13 | Převodník jednotek | `/calculator/prevodnik-jednotek/` | ⬜ NOT_STARTED | 0 | 1 | M | - | - | Součást duplicitního páru |
| 14 | Převodník jednotek new | `/calculator/prevodnik-jednotek-new/` | ⚠️ DUPLICATE | 0 | 1 | M | - | - | Duplikát - vyřešit v Batch 0 |
| 15 | Trojčlenka new | `/calculator/trojclenka-new/` | ⚠️ DUPLICATE | 0 | 2 | M | - | - | Duplikát kategorie - vyřešit v Batch 0 |
| 16 | Zlomky new | `/calculator/zlomky-new/` | ⚠️ DUPLICATE | 0 | 2 | L | - | - | Duplikát - vyřešit v Batch 0 |
| 17 | Složené úročení new | `/calculator/slozene-uroceni-new/` | ⚠️ DUPLICATE | 0 | 2 | M | - | - | Duplikát - vyřešit v Batch 0 |
| 18 | Trojčlenka - přímá úměra | `/calculator/trojclenka/prima-umera/` | ⬜ NOT_STARTED | 1 | 2 | M | - | - | Používá CalculatorBase |
| 19 | Trojčlenka - nepřímá úměra | `/calculator/trojclenka/neprima-umera/` | ⬜ NOT_STARTED | 1 | 2 | M | - | - | Používá CalculatorBase |
| 20 | Zlomky | `/calculator/zlomky/` | ⬜ NOT_STARTED | 1 | 2 | L | - | - | CalculatorBase, má duplikát |
| 21 | Složené úročení | `/calculator/financie-rozsirene/slozene-uroceni/` | ⬜ NOT_STARTED | 1 | 2 | M | - | - | CalculatorBase, má duplikát |
| 22 | Anuitní splátka | `/calculator/financie-rozsirene/anuitni-splatka/` | ⬜ NOT_STARTED | 2 | 3 | M | - | - | Používá CalculatorBase |
| 23 | IRR | `/calculator/financie-rozsirene/irr/` | ⬜ NOT_STARTED | 2 | 3 | L | - | - | Velký soubor (555 řádků) |
| 24 | NPV | `/calculator/financie-rozsirene/npv/` | ⬜ NOT_STARTED | 2 | 3 | L | - | - | |
| 25 | ROI | `/calculator/financie-rozsirene/roi/` | ⬜ NOT_STARTED | 2 | 3 | M | - | - | |
| 26 | Předčasné splacení | `/calculator/financie-rozsirene/predcasne-splaceni/` | ⬜ NOT_STARTED | 2 | 3 | M | - | - | |
| 27 | Beton | `/calculator/stavebni/beton/` | ⬜ NOT_STARTED | 3 | 4 | L | - | - | Velký soubor (649 řádků) |
| 28 | Izolace | `/calculator/stavebni/izolace/` | ⬜ NOT_STARTED | 3 | 4 | M | - | - | |
| 29 | Materiály | `/calculator/stavebni/materialy/` | ⬜ NOT_STARTED | 3 | 4 | M | - | - | |
| 30 | Objem | `/calculator/stavebni/objem/` | ⬜ NOT_STARTED | 3 | 4 | L | - | - | Velký soubor (666 řádků) |
| 31 | Plocha | `/calculator/stavebni/plocha/` | ⬜ NOT_STARTED | 3 | 4 | M | - | - | |
| 32 | Area Calculator | `/calculator/area/` | ✅ DONE | 4 | 3 | M | 2026-02-11 | 2026-02-11 | Vytvořena route |
| 33 | Volume Converter | N/A | ⬜ NOT_STARTED | 4 | 3 | M | - | - | Komponenta exists (VolumeConverter.tsx v unitConverters/) |
| 34 | Age Calculator | `/calculator/age/` | ✅ DONE | 4 | 5 | S | 2026-02-11 | 2026-02-11 | Vytvořena route |
| 35 | BMR Calculator | `/calculator/bmr/` | ✅ DONE | 4 | 5 | S | 2026-02-11 | 2026-02-11 | Vytvořena route |
| 36 | Body Fat Calculator | `/calculator/body-fat/` | ✅ DONE | 4 | 5 | M | 2026-02-11 | 2026-02-11 | Vytvořena route |
| 37 | Calories Calculator | `/calculator/calories/` | ✅ DONE | 4 | 5 | M | 2026-02-11 | 2026-02-11 | Vytvořena route |
| 38 | Currency Calculator | `/calculator/currency/` | ✅ DONE | 4 | 5 | M | 2026-02-11 | 2026-02-11 | Vytvořena route |
| 39 | Discount Calculator | `/calculator/discount/` | ✅ DONE | 4 | 5 | S | 2026-02-11 | 2026-02-11 | Vytvořena route |
| 40 | Fuel Calculator | `/calculator/fuel/` | ✅ DONE | 4 | 5 | S | 2026-02-11 | 2026-02-11 | Vytvořena route |
| 41 | Ideal Weight Calculator | `/calculator/ideal-weight/` | ✅ DONE | 4 | 5 | M | 2026-02-11 | 2026-02-11 | Vytvořena route |
| 42 | Loan Calculator | `/calculator/loan/` | ✅ DONE | 4 | 5 | M | 2026-02-11 | 2026-02-11 | Vytvořena route |
| 43 | Time Calculator | `/calculator/time/` | ✅ DONE | 4 | 5 | S | 2026-02-11 | 2026-02-11 | Vytvořena route |
| 44 | Tip Calculator | `/calculator/tip/` | ✅ DONE | 4 | 5 | S | 2026-02-11 | 2026-02-11 | Vytvořena route |
| 45 | Fraction Addition | N/A | ⬜ NOT_STARTED | 5 | 5 | M | - | - | Placeholder - implementovat |
| 46 | Fraction Subtraction | N/A | ⬜ NOT_STARTED | 5 | 5 | M | - | - | Placeholder - implementovat |
| 47 | Fraction Multiplication | N/A | ⬜ NOT_STARTED | 5 | 5 | M | - | - | Placeholder - implementovat |
| 48 | Fraction Division | N/A | ⬜ NOT_STARTED | 5 | 5 | M | - | - | Placeholder - implementovat |
| 49 | Fraction Simplification | N/A | ⬜ NOT_STARTED | 5 | 5 | M | - | - | Placeholder - implementovat |
| 50 | Fraction Conversion | N/A | ⬜ NOT_STARTED | 5 | 5 | M | - | - | Placeholder - implementovat |
| 51 | Fitness kalkulačka 1 | `/calculator/fitness-a-zdravi/kalkulacka-1/` | ⬜ NOT_STARTED | 6 | 5 | L | - | - | Placeholder - implementovat |
| 52 | Fitness kalkulačka 2 | `/calculator/fitness-a-zdravi/kalkulacka-2/` | ⬜ NOT_STARTED | 6 | 5 | L | - | - | Placeholder - implementovat |
| 53 | Fitness kalkulačka 3 | `/calculator/fitness-a-zdravi/kalkulacka-3/` | ⬜ NOT_STARTED | 6 | 5 | L | - | - | Placeholder - implementovat |
| 54 | Fitness kalkulačka 4 | `/calculator/fitness-a-zdravi/kalkulacka-4/` | ⬜ NOT_STARTED | 6 | 5 | L | - | - | Placeholder - implementovat |
| 55 | Fitness kalkulačka 5 | `/calculator/fitness-a-zdravi/kalkulacka-5/` | ⬜ NOT_STARTED | 6 | 5 | L | - | - | Placeholder - implementovat |
| 56 | Fitness kalkulačka 6 | `/calculator/fitness-a-zdravi/kalkulacka-6/` | ⬜ NOT_STARTED | 6 | 5 | L | - | - | Placeholder - implementovat |
| 57 | Praktické kalkulačka 1 | `/calculator/prakticke-vypocty/kalkulacka-1/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | Placeholder - implementovat |
| 58 | Praktické kalkulačka 2 | `/calculator/prakticke-vypocty/kalkulacka-2/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | Placeholder - implementovat |
| 59 | Praktické kalkulačka 3 | `/calculator/prakticke-vypocty/kalkulacka-3/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | Placeholder - implementovat |
| 60 | Praktické kalkulačka 4 | `/calculator/prakticke-vypocty/kalkulacka-4/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | Placeholder - implementovat |
| 61 | Praktické kalkulačka 5 | `/calculator/prakticke-vypocty/kalkulacka-5/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | Placeholder - implementovat |
| 62 | Praktické kalkulačka 6 | `/calculator/prakticke-vypocty/kalkulacka-6/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | Placeholder - implementovat |

---

## Detaily batchů

### Batch 0: Krizové opravy (TÝDEN PŘED VŠECHNO)

**Úkoly:**
1. Smazat broken BMI v1 route
2. Vyřešit 11 duplicitních route pairs:
   - Porovnat kód obou verzí
   - Vybrat kvalitnější variantu
   - Použít hlavní finální routu (bez -new, -old, atd.)
   - Horší variantu smazat
   - Přidat redirect pro starou URL
3. Vytvořit chybějící routy pro 9 komponentů bez route (Age, BMR, Body Fat, Calories, Currency, Discount, Fuel, Ideal Weight, Loan, Time, Tip)

**Kalkulačky:** 11 duplicitních párů (17 položek v tabulce) + 9 komponentů bez routy
**Očekávaný čas:** 8-12 hodin

### Batch 1: Základní kalkulačky - CalculatorBase migrace (TÝDEN 1-2)

**Kalkulačky:**
- Trojčlenka - přímá úměra (CalculatorBase → SimpleCalculatorLayout)
- Trojčlenka - nepřímá úměra (CalculatorBase → SimpleCalculatorLayout)
- Zlomky (CalculatorBase → SimpleCalculatorLayout)
- Složené úročení (CalculatorBase → SimpleCalculatorLayout)

**Složitost:** M-L
**Očekávaný čas:** 8-10 hodin

### Batch 2: Finance (TÝDEN 3-4)

**Kalkulačky:**
- Anuitní splátka (CalculatorBase → SimpleCalculatorLayout)
- IRR (zmenšení pod 250 řádků)
- NPV (ověření stavu, refaktoring)
- ROI (ověření stavu, refaktoring)
- Předčasné splacení (ověření stavu, refaktoring)

**Složitost:** M-L
**Očekávaný čas:** 10-12 hodin

### Batch 3: Stavební - velké soubory (TÝDEN 5-6)

**Kalkulačky:**
- Beton (zmenšení z 649 řádků)
- Objem (zmenšení z 666 řádků)
- Plocha (ověření stavu)
- Materiály (ověření stavu)
- Izolace (ověření stavu)

**Složitost:** L
**Očekávaný čas:** 12-15 hodin

### Batch 4: Ostatní hotové komponenty (TÝDEN 7)

**Kalkulačky:**
- Area Calculator, Volume Converter (unitConverters)
- Age, BMR, Body Fat, Calories, Ideal Weight (fitness)
- Currency, Discount, Fuel, Loan, Time, Tip (praktické)

**Poznámka:** Tyto kalkulačky mají komponenty ale chybí jim routy - routy vytvořeny v Batch 0

**Složitost:** S-M
**Očekávaný čas:** 6-8 hodin

### Batch 5: Fraction operations (TÝDEN 8-9)

**Kalkulačky:**
- Fraction Addition
- Fraction Subtraction
- Fraction Multiplication
- Fraction Division
- Fraction Simplification
- Fraction Conversion

**Složitost:** M
**Očekávaný čas:** 8-10 hodin

### Batch 6: Fitness placeholdery (TÝDEN 10-12)

**Kalkulačky:**
- Fitness kalkulačka 1-6
- Map existujících komponent: BMR, Body Fat, Calories, Ideal Weight
- Doplnit chybějící: TDEE, BMI pro děti, atd.

**Složitost:** L
**Očekávaný čas:** 12-15 hodin

### Batch 7: Praktické placeholdery (TÝDEN 13-15)

**Kalkulačky:**
- Praktické kalkulačka 1-6
- Map existujících komponent: Currency, Discount, Fuel, Loan, Time, Tip
- Doplnit chybějící

**Složitost:** L
**Očekávaný čas:** 12-15 hodin

---

## Checklist kvality (musí být splněn pro stav ✅)

- [ ] Funkčnost – výpočty identické (pokud byly správné)
- [ ] URL – žádné breaking changes
- [ ] Sdílené komponenty – dle target-architecture.md
- [ ] Styling – sjednocen
- [ ] Validace vstupů
- [ ] Error handling
- [ ] Accessibility – ARIA, keyboard nav, focus
- [ ] Responzivita – mobile/tablet/desktop
- [ ] SEO – JSON-LD, title/desc/OG
- [ ] UX – popisky, nápovědy, české chybové hlášky
- [ ] Build – prochází bez warningů

## Aktivní session
> [Žádná aktivní session]

## Historie změn
| Datum | Kalkulačka | Akce | Detail |
|-------|-----------|------|--------|
| 2026-02-11 | Vše | Inicializace | Vytvořen refactoring tracker - 62 kalkulaček v 8 batchích |
| 2026-02-11 | BMI v1 | DONE | Smazán broken route, obnověn z bmi-new |
| 2026-02-11 | 11 duplicitních route pairs | DONE | Všechny -new placeholdery smazány, původní verze zachovány |
| 2026-02-11 | 12 chybějících rout | DONE | Vytvořeny page wrappery s CalculatorPageWrapper |
