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
| ⚠️ PARTIAL | Částečně hotovo - duplicity vyřešeny, ale stále používá CalculatorBase |

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
| 2 | BMI v1 | `/calculator/bmi/` | ✅ DONE | 0 | 1 | S | 2026-02-11 | 2026-02-11 | 772281d | Smazán broken route, redirect na v2 |
| 3 | DPH | `/calculator/dph/` | ✅ DONE | 0 | 1 | M | 2026-02-11 | 2026-02-11 | 772281d | Duplicita `dph-new` odstraněna |
| 4 | DPH new | `/calculator/dph-new/` | ✅ DONE | 0 | 1 | M | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 5 | Procento z čísla | `/calculator/procenta/procento-z-cisla/` | ✅ DONE | 0 | 1 | S | 2026-02-11 | 2026-02-11 | 772281d | Duplicita odstraněna |
| 6 | Procento z čísla new | `/calculator/procenta/procento-z-cisla-new/` | ✅ DONE | 0 | 1 | S | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 7 | Kolik % je X z Y | `/calculator/procenta/kolik-procent-je-x-z-y/` | ✅ DONE | 0 | 1 | S | 2026-02-11 | 2026-02-11 | 772281d | Duplicita odstraněna |
| 8 | Kolik % je X z Y new | `/calculator/kolik-procent-je-x-z-y-new/` | ✅ DONE | 0 | 1 | S | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 9 | Y je X% co je 100% | `/calculator/procenta/y-je-x-kolik-je-sto/` | ✅ DONE | 0 | 1 | S | 2026-02-11 | 2026-02-11 | 772281d | Duplicita odstraněna |
| 10 | Y je X% co je 100% new | `/calculator/y-je-x-kolik-je-sto-new/` | ✅ DONE | 0 | 1 | S | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 11 | Čistá mzda | `/calculator/cista-mzda/` | ⚠️ PARTIAL | 0 | 2 | M | 2026-02-11 | - | 772281d | Duplicita odstraněna, ale stále CalculatorBase |
| 12 | Čistá mzda new | `/calculator/cista-mzda-new/` | ✅ DONE | 0 | 1 | M | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 13 | Převodník jednotek | `/calculator/prevodnik-jednotek/` | ⚠️ PARTIAL | 0 | 2 | M | 2026-02-11 | - | 772281d | Duplicita odstraněna, ale stále CalculatorBase |
| 14 | Převodník jednotek new | `/calculator/prevodnik-jednotek-new/` | ✅ DONE | 0 | 1 | M | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 15 | Trojčlenka new | `/calculator/trojclenka-new/` | ✅ DONE | 0 | 2 | M | 2026-02-11 | 2026-02-11 | 772281d | Duplikát kategorie smazán |
| 16 | Zlomky new | `/calculator/zlomky-new/` | ✅ DONE | 0 | 2 | L | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 17 | Složené úročení new | `/calculator/slozene-uroceni-new/` | ✅ DONE | 0 | 2 | M | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 18 | Anuita new | `/calculator/anuita-new/` | ✅ DONE | 0 | 2 | M | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 19 | Trojčlenka - přímá úměra | `/calculator/trojclenka/prima-umera/` | ✅ DONE | 1 | 2 | M | 2026-02-11 | 2026-02-11 | 55b4c3b | Migrována na SimpleCalculatorLayout |
| 20 | Trojčlenka - nepřímá úměra | `/calculator/trojclenka/neprima-umera/` | ⬜ NOT_STARTED | 1 | 2 | M | - | - | - | Používá CalculatorBase |
| 21 | Zlomky | `/calculator/zlomky/` | ⚠️ PARTIAL | 1 | 2 | L | 2026-02-11 | - | 772281d | Duplicita odstraněna, ale stále CalculatorBase |
| 22 | Složené úročení | `/calculator/financie-rozsirene/slozene-uroceni/` | ⚠️ PARTIAL | 1 | 2 | M | 2026-02-11 | - | 772281d | Duplicita odstraněna, ale stále CalculatorBase |
| 23 | Anuitní splátka | `/calculator/financie-rozsirene/anuitni-splatka/` | ⬜ NOT_STARTED | 2 | 3 | M | - | - | - | Používá CalculatorBase |
| 24 | IRR | `/calculator/financie-rozsirene/irr/` | ⬜ NOT_STARTED | 2 | 3 | L | - | - | - | Velký soubor (555 řádků) |
| 25 | NPV | `/calculator/financie-rozsirene/npv/` | ⬜ NOT_STARTED | 2 | 3 | L | - | - | - | |
| 26 | ROI | `/calculator/financie-rozsirene/roi/` | ⬜ NOT_STARTED | 2 | 3 | M | - | - | - | |
| 27 | Předčasné splacení | `/calculator/financie-rozsirene/predcasne-splaceni/` | ⬜ NOT_STARTED | 2 | 3 | M | - | - | - | |
| 28 | Age Calculator | `/calculator/age/` | ✅ DONE | 0 | 5 | S | 2026-02-11 | 2026-02-11 | acdc75e | Route vytvořena |
| 29 | Area Calculator | `/calculator/area/` | ✅ DONE | 0 | 3 | M | 2026-02-11 | 2026-02-11 | acdc75e | Route vytvořena |
| 30 | BMR Calculator | `/calculator/bmr/` | ✅ DONE | 0 | 5 | S | 2026-02-11 | 2026-02-11 | acdc75e | Route vytvořena |
| 31 | Body Fat Calculator | `/calculator/body-fat/` | ✅ DONE | 0 | 5 | M | 2026-02-11 | 2026-02-11 | acdc75e | Route vytvořena |
| 32 | Calories Calculator | `/calculator/calories/` | ✅ DONE | 0 | 5 | M | 2026-02-11 | 2026-02-11 | acdc75e | Route vytvořena |
| 33 | Currency Calculator | `/calculator/currency/` | ✅ DONE | 0 | 5 | M | 2026-02-11 | 2026-02-11 | acdc75e | Route vytvořena |
| 34 | Discount Calculator | `/calculator/discount/` | ✅ DONE | 0 | 5 | S | 2026-02-11 | 2026-02-11 | acdc75e | Route vytvořena |
| 35 | Fuel Calculator | `/calculator/fuel/` | ✅ DONE | 0 | 5 | S | 2026-02-11 | 2026-02-11 | acdc75e | Route vytvořena |
| 36 | Ideal Weight Calculator | `/calculator/ideal-weight/` | ✅ DONE | 0 | 5 | M | 2026-02-11 | 2026-02-11 | acdc75e | Route vytvořena |
| 37 | Loan Calculator | `/calculator/loan/` | ✅ DONE | 0 | 5 | M | 2026-02-11 | 2026-02-11 | acdc75e | Route vytvořena |
| 38 | Time Calculator | `/calculator/time/` | ✅ DONE | 0 | 5 | S | 2026-02-11 | 2026-02-11 | acdc75e | Route vytvořena |
| 39 | Tip Calculator | `/calculator/tip/` | ✅ DONE | 0 | 5 | S | 2026-02-11 | 2026-02-11 | acdc75e | Route vytvořena |
| 40 | Volume Converter | N/A | ⬜ NOT_STARTED | 4 | 3 | M | - | - | - | Komponenta exists (VolumeConverter.tsx v unitConverters/) |
| 41 | Beton | `/calculator/stavebni/beton/` | ⬜ NOT_STARTED | 3 | 4 | L | - | - | - | Velký soubor (649 řádků) |
| 42 | Izolace | `/calculator/stavebni/izolace/` | ⬜ NOT_STARTED | 3 | 4 | M | - | - | - | |
| 43 | Materiály | `/calculator/stavebni/materialy/` | ⬜ NOT_STARTED | 3 | 4 | M | - | - | - | |
| 44 | Objem | `/calculator/stavebni/objem/` | ⬜ NOT_STARTED | 3 | 4 | L | - | - | - | Velký soubor (666 řádků) |
| 45 | Plocha | `/calculator/stavebni/plocha/` | ⬜ NOT_STARTED | 3 | 4 | M | - | - | - | |
| 46 | Fraction Addition | N/A | ⬜ NOT_STARTED | 5 | 5 | M | - | - | - | Placeholder - implementovat |
| 47 | Fraction Subtraction | N/A | ⬜ NOT_STARTED | 5 | 5 | M | - | - | - | Placeholder - implementovat |
| 48 | Fraction Multiplication | N/A | ⬜ NOT_STARTED | 5 | 5 | M | - | - | - | Placeholder - implementovat |
| 49 | Fraction Division | N/A | ⬜ NOT_STARTED | 5 | 5 | M | - | - | - | Placeholder - implementovat |
| 50 | Fraction Simplification | N/A | ⬜ NOT_STARTED | 5 | 5 | M | - | - | - | Placeholder - implementovat |
| 51 | Fraction Conversion | N/A | ⬜ NOT_STARTED | 5 | 5 | M | - | - | - | Placeholder - implementovat |
| 52 | Fitness kalkulačka 1 | `/calculator/fitness-a-zdravi/kalkulacka-1/` | ⬜ NOT_STARTED | 6 | 5 | L | - | - | - | Placeholder - implementovat |
| 53 | Fitness kalkulačka 2 | `/calculator/fitness-a-zdravi/kalkulacka-2/` | ⬜ NOT_STARTED | 6 | 5 | L | - | - | - | Placeholder - implementovat |
| 54 | Fitness kalkulačka 3 | `/calculator/fitness-a-zdravi/kalkulacka-3/` | ⬜ NOT_STARTED | 6 | 5 | L | - | - | - | Placeholder - implementovat |
| 55 | Fitness kalkulačka 4 | `/calculator/fitness-a-zdravi/kalkulacka-4/` | ⬜ NOT_STARTED | 6 | 5 | L | - | - | - | Placeholder - implementovat |
| 56 | Fitness kalkulačka 5 | `/calculator/fitness-a-zdravi/kalkulacka-5/` | ⬜ NOT_STARTED | 6 | 5 | L | - | - | - | Placeholder - implementovat |
| 57 | Fitness kalkulačka 6 | `/calculator/fitness-a-zdravi/kalkulacka-6/` | ⬜ NOT_STARTED | 6 | 5 | L | - | - | - | Placeholder - implementovat |
| 58 | Praktické kalkulačka 1 | `/calculator/prakticke-vypocty/kalkulacka-1/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | - | Placeholder - implementovat |
| 59 | Praktické kalkulačka 2 | `/calculator/prakticke-vypocty/kalkulacka-2/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | - | Placeholder - implementovat |
| 60 | Praktické kalkulačka 3 | `/calculator/prakticke-vypocty/kalkulacka-3/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | - | Placeholder - implementovat |
| 61 | Praktické kalkulačka 4 | `/calculator/prakticke-vypocty/kalkulacka-4/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | - | Placeholder - implementovat |
| 62 | Praktické kalkulačka 5 | `/calculator/prakticke-vypocty/kalkulacka-5/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | - | Placeholder - implementovat |
| 63 | Praktické kalkulačka 6 | `/calculator/prakticke-vypocty/kalkulacka-6/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | - | Placeholder - implementovat |

---

## Souhrn stavu

| Stav | Počet | Procento |
|------|-------|----------|
| ✅ DONE | 21 | 33% |
| ⚠️ PARTIAL | 4 | 6% |
| ⬜ NOT_STARTED | 38 | 60% |
| 🔗 REFERENCE | 1 | 2% |
| **CELKEM** | **64** | **100%** |

### Batch 0 – ✅ DOKONČEN (23 položek)
- Smazány všechny duplicity (-new routes)
- Vytvořeno 12 chybějících rout
- 4 kalkulačky označeny jako PARTIAL (nutno migrovat z CalculatorBase)

### Batch 1 – 🔄 ROZPRACOVÁN (2/5 hotovo)
- ✅ Trojčlenka - přímá úměra (SimpleCalculatorLayout)
- ⬜ Trojčlenka - nepřímá úměra (CalculatorBase)
- ⚠️ Zlomky (CalculatorBase)
- ⚠️ Složené úročení (CalculatorBase)
- ⚠️ Čistá mzda (CalculatorBase)
- ⚠️ Převodník jednotek (CalculatorBase)

---

## Detaily batchů

### Batch 0: Krizové opravy ✅ DOKONČEN

**Úkoly:**
1. ✅ Smazat broken BMI v1 route
2. ✅ Vyřešit 11 duplicitních route pairs
3. ✅ Vytvořit chybějící routy pro 12 komponentů

**Hotové kalkulačky (23):**
- BMI v1 (smazán, redirect)
- DPH, DPH new (duplicita odstraněna)
- Procento z čísla, Procento z čísla new (duplicita odstraněna)
- Kolik % je X z Y, Kolik % je X z Y new (duplicita odstraněna)
- Y je X% co je 100%, Y je X% co je 100% new (duplicita odstraněna)
- Čistá mzda, Čistá mzda new (duplicita odstraněna, ale stále CalculatorBase)
- Převodník jednotek, Převodník jednotek new (duplicita odstraněna, ale stále CalculatorBase)
- Zlomky, Zlomky new (duplicita odstraněna, ale stále CalculatorBase)
- Složené úročení, Složené úročení new (duplicita odstraněna, ale stále CalculatorBase)
- Trojčlenka new (duplikát kategorie smazán)
- Anuita new (duplikát smazán)
- Age Calculator, Area Calculator, BMR Calculator, Body Fat Calculator, Calories Calculator, Currency Calculator, Discount Calculator, Fuel Calculator, Ideal Weight Calculator, Loan Calculator, Time Calculator, Tip Calculator (routy vytvořeny)

**Čas:** 8-12 hodin (dokončeno)

### Batch 1: CalculatorBase migrace 🔄 ROZPRACOVÁN

**Kalkulačky:**
- ✅ Trojčlenka - přímá úměra (SimpleCalculatorLayout)
- ⬜ Trojčlenka - nepřímá úměra (CalculatorBase)
- ⚠️ Zlomky (CalculatorBase - duplicity vyřešeny v Batch 0)
- ⚠️ Složené úročení (CalculatorBase - duplicity vyřešeny v Batch 0)
- ⚠️ Čistá mzda (CalculatorBase - duplicity vyřešeny v Batch 0)
- ⚠️ Převodník jednotek (CalculatorBase - duplicity vyřešeny v Batch 0)

**Stav:** 1/6 hotovo (2/6 pokud počítáme PARTIAL)
**Očekávaný čas:** 8-10 hodin

### Batch 2: Finance

**Kalkulačky:**
- Anuitní splátka (CalculatorBase → SimpleCalculatorLayout)
- IRR (zmenšení pod 250 řádků)
- NPV (ověření stavu, refaktoring)
- ROI (ověření stavu, refaktoring)
- Předčasné splacení (ověření stavu, refaktoring)

**Složitost:** M-L
**Očekávaný čas:** 10-12 hodin

### Batch 3: Stavební - velké soubory

**Kalkulačky:**
- Beton (zmenšení z 649 řádků)
- Objem (zmenšení z 666 řádků)
- Plocha (ověření stavu)
- Materiály (ověření stavu)
- Izolace (ověření stavu)

**Složitost:** L
**Očekávaný čas:** 12-15 hodin

### Batch 4: Ostatní hotové komponenty

**Kalkulačky:**
- Volume Converter (unitConverters)

**Poznámka:** Většina kalkulaček z tohoto batchu už má routy z Batch 0

**Složitost:** S-M
**Očekávaný čas:** 1-2 hodin

### Batch 5: Fraction operations

**Kalkulačky:**
- Fraction Addition
- Fraction Subtraction
- Fraction Multiplication
- Fraction Division
- Fraction Simplification
- Fraction Conversion

**Složitost:** M
**Očekávaný čas:** 8-10 hodin

### Batch 6: Fitness placeholdery

**Kalkulačky:**
- Fitness kalkulačka 1-6
- Map existujících komponent: BMR, Body Fat, Calories, Ideal Weight
- Doplnit chybějící: TDEE, BMI pro děti, atd.

**Složitost:** L
**Očekávaný čas:** 12-15 hodin

### Batch 7: Praktické placeholdery

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
| 2026-02-11 | Batch 0 Part 1 | Dokončeno | Smazány duplicity (BMI, DPH, Procenta, Čistá mzda, Převodník, Zlomky, Složené úročení, Trojčlenka, Anuita) - commit 772281d |
| 2026-02-11 | Batch 0 Part 2 | Dokončeno | Vytvořeno 12 chybějících rout (Age, Area, BMR, Body Fat, Calories, Currency, Discount, Fuel, Ideal Weight, Loan, Time, Tip) - commit acdc75e |
| 2026-02-11 | Trojčlenka - přímá úměra | Dokončeno | Migrace na SimpleCalculatorLayout - commit 55b4c3b |
| 2026-02-11 | Tracker | Oprava | Aktualizován stav dle skutečné git historie - přidáno 2 MISSING stavy, přeskupina položek |
