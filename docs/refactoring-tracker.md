# Refactoring Tracker – Online Kalkulačky

> Automaticky aktualizováno při refaktoringu.
> Poslední update: 2026-02-12

## Legenda stavů

> **Detailní definice DONE stavu:** viz [`DEFINITION_OF_DONE.md`](./DEFINITION_OF_DONE.md)

| Stav | Význam |
|-------|---------|
| ⬜ NOT_STARTED | Čeká na refaktoring |
| 🔄 IN_PROGRESS | Rozpracováno (viz poznámky kde se skončilo) |
| ✅ DONE | Plně hotovo – viz DEFINTION_OF_DONE.md (i18n cs/en vyžadováno, sk/pl/hu volitelné) |
| ⚠️ BLOCKED | Nelze pokračovat (viz poznámky) |
| 🔙 REVERTED | Vráceno kvůli problému |
| 🔗 REFERENCE | Referenční implementace (nerefaktorovat) |
| 🔧 NEEDS_ROUTE | Komponenta existuje ale chybí route (vytvořit v Batch 0) |
| ⚠️ DUPLICATE | Duplicitní route (vyřešit v Batch 0) |
| ⚠️ PARTIAL | Částečně hotovo - duplicity vyřešeny, ale stále používá CalculatorBase |
| ~~⚠️ PARTIAL_RELATED~~ | **ZRUŠENO** – vše opraveno, viz Batch 0 Hardcoded fix |

### DONE Checklist (shrnutí)

Kalkulačka je DONE když splňuje:
- [x] **Architektura:** SimpleCalculatorLayout + CalculatorInput/Result + getRelatedCalculators()
- [x] **Data:** Záznam v calculators.json s platným ID
- [x] **Obsah:** LaTeX formula + Examples (min. 2) + FAQ (min. 3)
- [x] **SEO:** title/description/keywords + Schema.org
- [x] **i18n:** cs.json + en.json překlady
- [x] **Anti-patterns:** Žádný CalculatorBase, žádné hardcoded relatedCalculators

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
| 5 | Procento z čísla | `/calculator/procenta/procento-z-cisla/` | ✅ DONE | 0 | 1 | S | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 6 | Procento z čísla new | `/calculator/procenta/procento-z-cisla-new/` | ✅ DONE | 0 | 1 | S | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 7 | Kolik % je X z Y | `/calculator/procenta/kolik-procent-je-x-z-y/` | ✅ DONE | 3 | 1 | S | 2026-02-11 | 2026-02-12 | batch-3 | Migrace z CalculatorBase na SimpleCalculatorLayout, překlady cs/en |
| 8 | Kolik % je X z Y new | `/calculator/kolik-procent-je-x-z-y-new/` | ✅ DONE | 0 | 1 | S | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 9 | Y je X% co je 100% | `/calculator/procenta/y-je-x-kolik-je-sto/` | ✅ DONE | 0 | 1 | S | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 10 | Y je X% co je 100% new | `/calculator/y-je-x-kolik-je-sto-new/` | ✅ DONE | 0 | 1 | S | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 11 | Čistá mzda | `/calculator/cista-mzda/` | ✅ DONE | 1 | 2 | M | 2026-02-12 | 2026-02-12 | batch-1 | 184→140ř, hook useNetSalaryCalculator, CZ/SK support |
| 12 | Čistá mzda new | `/calculator/cista-mzda-new/` | ✅ DONE | 0 | 1 | M | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 13 | Převodník jednotek | `/calculator/prevodnik-jednotek/` | ✅ DONE | 1 | 2 | L | 2026-02-12 | 2026-02-12 | batch-1 | 313→167ř, hook useUnitConverter, Tabs/Select/swap zachovány |
| 14 | Převodník jednotek new | `/calculator/prevodnik-jednotek-new/` | ✅ DONE | 0 | 1 | M | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 15 | Trojčlenka new | `/calculator/trojclenka-new/` | ✅ DONE | 0 | 2 | M | 2026-02-11 | 2026-02-11 | 772281d | Duplikát kategorie smazán |
| 16 | Zlomky new | `/calculator/zlomky-new/` | ✅ DONE | 0 | 2 | L | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 17 | Složené úročení new | `/calculator/slozene-uroceni-new/` | ✅ DONE | 0 | 2 | M | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 18 | Anuita new | `/calculator/anuita-new/` | ✅ DONE | 0 | 2 | M | 2026-02-11 | 2026-02-11 | 772281d | Duplikát smazán |
| 19 | Trojčlenka - přímá úměra | `/calculator/trojclenka/prima-umera/` | ✅ DONE | 1 | 2 | M | 2026-02-11 | 2026-02-11 | 55b4c3b | Migrována na SimpleCalculatorLayout |
| 20 | Trojčlenka - nepřímá úměra | `/calculator/trojclenka/neprima-umera/` | ✅ DONE | 1 | 2 | M | 2026-02-12 | 2026-02-12 | batch-1 | Přepis z CalculatorBase na SimpleCalculatorLayout, LaTeX, FAQ, examples |
| 21 | Zlomky | `/calculator/zlomky/` | ✅ DONE | 1 | 2 | L | 2026-02-12 | 2026-02-12 | batch-1 | 129→106ř, přepis na SimpleCalculatorLayout, sub-komponenty zachovány |
| 22 | Složené úročení | `/calculator/financie-rozsirene/slozene-uroceni/` | ✅ DONE | 1 | 2 | M | 2026-02-12 | 2026-02-12 | batch-1 | 193→169ř, hook useCompoundInterestCalculator, CalculatorSelect |
| 23 | Anuitní splátka | `/calculator/financie-rozsirene/anuitni-splatka/` | ✅ DONE | 2 | 3 | M | 2026-02-12 | 2026-02-12 | batch-2 | 166→173ř, přepis z CalculatorBase na SimpleCalculatorLayout, hook useFinanceFormatting |
| 24 | IRR | `/calculator/financie-rozsirene/irr/` | ✅ DONE | 2 | 3 | L | 2026-02-12 | 2026-02-12 | batch-2 | 554→189ř, hook useIRRCalculator, CashFlowEditor, sdílená calculateNPV |
| 25 | NPV | `/calculator/financie-rozsirene/npv/` | ✅ DONE | 2 | 3 | L | 2026-02-12 | 2026-02-12 | batch-2 | 519→200ř, hook useNPVCalculator, CashFlowEditor |
| 26 | ROI | `/calculator/financie-rozsirene/roi/` | ✅ DONE | 2 | 3 | M | 2026-02-12 | 2026-02-12 | batch-2 | 575→241ř, hook useROICalculator, CalculatorInput |
| 27 | Předčasné splacení | `/calculator/financie-rozsirene/predcasne-splaceni/` | ✅ DONE | 2 | 3 | M | 2026-02-12 | 2026-02-12 | batch-2 | 625→279ř, hook useEarlyRepaymentCalculator, CalculatorInput |
| 28 | Age Calculator | `/calculator/age/` | ✅ DONE | 0 | 5 | S | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 29 | Area Calculator | `/calculator/area/` | ✅ DONE | 0 | 3 | M | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 30 | BMR Calculator | `/calculator/bmr/` | ✅ DONE | 0 | 5 | S | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 31 | Body Fat Calculator | `/calculator/body-fat/` | ✅ DONE | 0 | 5 | M | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 32 | Calories Calculator | `/calculator/calories/` | ✅ DONE | 0 | 5 | M | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 33 | Currency Calculator | `/calculator/currency/` | ✅ DONE | 0 | 5 | M | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 34 | Discount Calculator | `/calculator/discount/` | ✅ DONE | 0 | 5 | S | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 35 | Fuel Calculator | `/calculator/fuel/` | ✅ DONE | 0 | 5 | S | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 36 | Ideal Weight Calculator | `/calculator/ideal-weight/` | ✅ DONE | 0 | 5 | M | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 37 | Loan Calculator | `/calculator/loan/` | ✅ DONE | 0 | 5 | M | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 38 | Time Calculator | `/calculator/time/` | ✅ DONE | 0 | 5 | S | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 39 | Tip Calculator | `/calculator/tip/` | ✅ DONE | 0 | 5 | S | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 40 | Volume Converter | N/A | ✅ DONE | 4 | 3 | M | 2026-02-12 | 2026-02-12 | batch-4 | Redundantní – UnitConverter má 10 volume jednotek. Orphaned komponenty smazány (4 soubory), SEO doplněno. |
| 41 | Beton | `/calculator/stavebni/beton/` | ✅ DONE | 3 | 4 | L | 2026-02-11 | 2026-02-12 | batch-3 | 630→163ř, hook useConcreteCalculator, CalculatorPageWrapper, překlady cs/en |
| 42 | Izolace | `/calculator/stavebni/izolace/` | ✅ DONE | 3 | 4 | M | 2026-02-12 | 2026-02-12 | batch-3 | 515→265ř, hook useInsulationCalculator, CalculatorPageWrapper, překlady cs/en |
| 43 | Materiály | `/calculator/stavebni/materialy/` | ✅ DONE | 3 | 4 | M | 2026-02-11 | 2026-02-11 | fix-related | Hardcoded relatedCalculators opraveny |
| 44 | Objem | `/calculator/stavebni/objem/` | ✅ DONE | 3 | 4 | L | 2026-02-11 | 2026-02-12 | batch-3 | 647→171ř, hook useVolumeCalculator, CalculatorPageWrapper, překlady cs/en |
| 45 | Plocha | `/calculator/stavebni/plocha/` | ✅ DONE | 3 | 4 | M | 2026-02-12 | 2026-02-12 | batch-3 | CalculatorPageWrapper standardizován |
| 46 | Fraction Addition | `/calculator/zlomky/` | ✅ DONE | 5 | 5 | S | 2026-02-12 | 2026-02-12 | batch-5 | Implementováno: 4 inputy, real-time výpočet, krok-po-kroku, LCD |
| 47 | Fraction Subtraction | `/calculator/zlomky/` | ✅ DONE | 5 | 5 | S | 2026-02-12 | 2026-02-12 | batch-5 | Implementováno: 4 inputy, real-time výpočet, krok-po-kroku, LCD |
| 48 | Fraction Multiplication | `/calculator/zlomky/` | ✅ DONE | 5 | 5 | S | 2026-02-12 | 2026-02-12 | batch-5 | Implementováno: 4 inputy, real-time výpočet, krok-po-kroku |
| 49 | Fraction Division | `/calculator/zlomky/` | ✅ DONE | 5 | 5 | S | 2026-02-12 | 2026-02-12 | batch-5 | Implementováno: flip & multiply, validace dělení nulou |
| 50 | Fraction Simplification | `/calculator/zlomky/` | ✅ DONE | 5 | 5 | S | 2026-02-12 | 2026-02-12 | batch-5 | Implementováno: GCD, krok-po-kroku, detekce základního tvaru |
| 51 | Fraction Conversion | `/calculator/zlomky/` | ✅ DONE | 5 | 5 | M | 2026-02-12 | 2026-02-12 | batch-5 | Implementováno: 4 typy konverze (improper↔mixed, fraction↔decimal) |
| 52 | Fitness: Calories (redirect) | `/calculator/fitness-a-zdravi/kalkulacka-1/` | 🔄 IN_PROGRESS | 6 | 5 | S | 2026-02-12 | - | - | Duplikát /calculator/calories/ → redirect |
| 53 | Fitness: BMR (redirect) | `/calculator/fitness-a-zdravi/kalkulacka-2/` | 🔄 IN_PROGRESS | 6 | 5 | S | 2026-02-12 | - | - | Duplikát /calculator/bmr/ → redirect |
| 54 | Fitness: Ideal Weight (redirect) | `/calculator/fitness-a-zdravi/kalkulacka-3/` | 🔄 IN_PROGRESS | 6 | 5 | S | 2026-02-12 | - | - | Duplikát /calculator/ideal-weight/ → redirect |
| 55 | Fitness: Body Fat (redirect) | `/calculator/fitness-a-zdravi/kalkulacka-4/` | 🔄 IN_PROGRESS | 6 | 5 | S | 2026-02-12 | - | - | Duplikát /calculator/body-fat/ → redirect |
| 56 | Macro Calculator | `/calculator/fitness-a-zdravi/makro-kalkulator/` | 🔄 IN_PROGRESS | 6 | 5 | M | 2026-02-12 | - | - | Nová kalkulačka: denní makra (protein, sacharidy, tuky) |
| 57 | Water Intake Calculator | `/calculator/fitness-a-zdravi/prijem-vody/` | 🔄 IN_PROGRESS | 6 | 5 | S | 2026-02-12 | - | - | Nová kalkulačka: doporučený denní příjem vody |
| 58 | Praktické kalkulačka 1 | `/calculator/prakticke-vypocty/kalkulacka-1/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | - | Placeholder - implementovat |
| 59 | Praktické kalkulačka 2 | `/calculator/prakticke-vypocty/kalkulacka-2/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | - | Placeholder - implementovat |
| 60 | Praktické kalkulačka 3 | `/calculator/prakticke-vypocty/kalkulacka-3/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | - | Placeholder - implementovat |
| 61 | Praktické kalkulačka 4 | `/calculator/prakticke-vypocty/kalkulacka-4/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | - | Placeholder - implementovat |
| 62 | Praktické kalkulačka 5 | `/calculator/prakticke-vypocty/kalkulacka-5/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | - | Placeholder - implementovat |
| 63 | Praktické kalkulačka 6 | `/calculator/prakticke-vypocty/kalkulacka-6/` | ⬜ NOT_STARTED | 7 | 5 | L | - | - | - | Placeholder - implementovat |

---

## Feature Checklist pro DONE kalkulačky

| # | Kalkulačka | getRelated | Schema | Poznámky |
|---|-------------|-------------|---------|-----------|
| 1 | BMI v2 | ✅ | ✅ | Referenční implementace |
| 2 | Trojčlenka přímá úměra | ✅ | ✅ | Migrace kompletní |
| 3 | Age Calculator | ✅ | ✅ | Opraveno |
| 4 | Area Calculator | ✅ | ✅ | Opraveno |
| 5 | BMR Calculator | ✅ | ✅ | Opraveno |
| 6 | Body Fat Calculator | ✅ | ✅ | Opraveno |
| 7 | Calories Calculator | ✅ | ✅ | Opraveno |
| 8 | Currency Calculator | ✅ | ✅ | Opraveno |
| 9 | Discount Calculator | ✅ | ✅ | Opraveno |
| 10 | VAT/DPH Calculator | ✅ | ✅ | Opraveno |
| 11 | Fuel Calculator | ✅ | ✅ | Opraveno |
| 12 | Ideal Weight Calculator | ✅ | ✅ | Opraveno |
| 13 | Loan Calculator | ✅ | ✅ | Opraveno |
| 14 | Time Calculator | ✅ | ✅ | Opraveno |
| 15 | Tip Calculator | ✅ | ✅ | Opraveno |
| 16 | Procento z čísla | ✅ | ✅ | Opraveno |
| 17 | Y je X% co je 100% | ✅ | ✅ | Opraveno |
| 18 | Beton | ✅ | ✅ | Opraveno |
| 19 | Materiály | ✅ | ✅ | Opraveno |
| 20 | Objem | ✅ | ✅ | Opraveno |

| 21 | Trojčlenka - nepřímá úměra | ✅ | ✅ | Batch 1 |
| 22 | Zlomky | ✅ | ✅ | Batch 1 |
| 23 | Složené úročení | ✅ | ✅ | Batch 1 |
| 24 | Čistá mzda | ✅ | ✅ | Batch 1 |
| 25 | Převodník jednotek | ✅ | ✅ | Batch 1 |
| 26 | Anuitní splátka | ✅ | ✅ | Batch 2 |
| 27 | IRR | ✅ | ✅ | Batch 2 |
| 28 | NPV | ✅ | ✅ | Batch 2 |
| 29 | ROI | ✅ | ✅ | Batch 2 |
| 30 | Předčasné splacení | ✅ | ✅ | Batch 2 |
| 31 | Kolik % je X z Y | ✅ | ✅ | Batch 3 |
| 32 | Beton | ✅ | ✅ | Batch 3 |
| 33 | Objem | ✅ | ✅ | Batch 3 |
| 34 | Plocha | ✅ | ✅ | Batch 3 |
| 35 | Izolace | ✅ | ✅ | Batch 3 |
| 36 | Volume Converter | ✅ | ✅ | Batch 4 (redundantní, SEO doplněno) |
| 37 | Fraction Addition | ✅ | ✅ | Batch 5 |
| 38 | Fraction Subtraction | ✅ | ✅ | Batch 5 |
| 39 | Fraction Multiplication | ✅ | ✅ | Batch 5 |
| 40 | Fraction Division | ✅ | ✅ | Batch 5 |
| 41 | Fraction Simplification | ✅ | ✅ | Batch 5 |
| 42 | Fraction Conversion | ✅ | ✅ | Batch 5 |

**Stav:** 42/42 s getRelatedCalculators()

---

## Souhrn stavu

| Stav | Počet | Procento |
|------|-------|----------|
| ✅ DONE | 37 | 58% |
| ⬜ NOT_STARTED | 26 | 41% |
| 🔗 REFERENCE | 1 | 2% |
| **CELKEM** | **64** | **100%** |

### Batch 0 – ✅ DOKONČEN (23 položek)
- Smazány všechny duplicity (-new routes)
- Vytvořeno 12 chybějících rout
- 4 kalkulačky označeny jako PARTIAL (nutno migrovat z CalculatorBase)
- **19 kalkulaček opraveno - hardcoded relatedCalculators nahrazeny getRelatedCalculators()**

### Batch 1 – ✅ DOKONČEN (6/6 hotovo)
- ✅ Trojčlenka - přímá úměra (SimpleCalculatorLayout)
- ✅ Trojčlenka - nepřímá úměra (SimpleCalculatorLayout) – přepsáno 2026-02-12
- ✅ Zlomky (SimpleCalculatorLayout) – přepsáno 2026-02-12
- ✅ Složené úročení (SimpleCalculatorLayout + useCompoundInterestCalculator) – přepsáno 2026-02-12
- ✅ Čistá mzda (SimpleCalculatorLayout + useNetSalaryCalculator) – přepsáno 2026-02-12
- ✅ Převodník jednotek (SimpleCalculatorLayout + useUnitConverter) – přepsáno 2026-02-12
- ✅ DirectProportion i18n fix – hardcoded CZ text nahrazen translation klíči

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

### Hardcoded relatedCalculators fix – ✅ DOKONČEN (19 položek)

**Úkoly:**
1. ✅ Přidat chybějící ID do calculators.json (19 položek)
2. ✅ Opravit hardcoded relatedCalculators v 18 kalkulačkách na getRelatedCalculators()
3. ✅ Fix: DirectProportionCalculator onChange handler (z e.target.value na direct setValue)
4. ✅ Fix: API route ratings TypeScript error
5. ✅ Fix: tooltip import case sensitivity (5 souborů)
6. ✅ Fix: WhatPercentageIsXOfYCalculator TypeScript error

**Opravené kalkulačky (19):**
- Age Calculator, Area Calculator, BMR Calculator, Body Fat Calculator
- Calories Calculator, Currency Calculator, Discount Calculator
- VAT/DPH Calculator, Fuel Calculator, Ideal Weight Calculator
- Loan Calculator, Time Calculator, Tip Calculator
- Procento z čísla, Y je X% co je 100%
- Beton, Materiály, Objem

**Vyjímka:**
- Kolik % je X z Y (WhatPercentageIsXOfYCalculator) – stále používá CalculatorBase, vyžaduje kompletní refaktoring

**Čas:** 3-4 hodin

### Batch 1: CalculatorBase migrace ✅ DOKONČEN

**Kalkulačky:**
- ✅ Trojčlenka - přímá úměra (SimpleCalculatorLayout)
- ✅ Trojčlenka - nepřímá úměra (SimpleCalculatorLayout)
- ✅ Zlomky (SimpleCalculatorLayout)
- ✅ Složené úročení (SimpleCalculatorLayout + useCompoundInterestCalculator)
- ✅ Čistá mzda (SimpleCalculatorLayout + useNetSalaryCalculator)
- ✅ Převodník jednotek (SimpleCalculatorLayout + useUnitConverter)
- ✅ DirectProportion i18n fix (hardcoded CZ → translation keys)

**Nové hooks:** useCompoundInterestCalculator.ts, useNetSalaryCalculator.ts, useUnitConverter.ts
**Nové překlady:** ~195 klíčů v cs.json a en.json
**Stav:** 6/6 hotovo + 1 fix
**Čas:** Dokončeno 2026-02-12

### Batch 2: Finance ✅ DOKONČEN

**Kalkulačky:**
- ✅ Anuitní splátka (166→173ř, hook useFinanceFormatting)
- ✅ IRR (554→189ř, hook useIRRCalculator, CashFlowEditor)
- ✅ NPV (519→200ř, hook useNPVCalculator, CashFlowEditor)
- ✅ ROI (575→241ř, hook useROICalculator)
- ✅ Předčasné splacení (625→279ř, hook useEarlyRepaymentCalculator)

**Stav:** 5/5 hotovo
**Čas:** Dokončeno 2026-02-12

### Batch 3: Stavební - velké soubory ✅ DOKONČEN

**Kalkulačky:**
- ✅ Beton (630→163ř, hook useConcreteCalculator, CalculatorPageWrapper)
- ✅ Objem (647→171ř, hook useVolumeCalculator, CalculatorPageWrapper)
- ✅ Plocha (CalculatorPageWrapper standardizován)
- ✅ Materiály (beze změny – již splňovalo)
- ✅ Izolace (515→265ř, hook useInsulationCalculator, nová route + data)
- ✅ Kolik % je X z Y (167→223ř, migrace z CalculatorBase na SimpleCalculatorLayout)

**Nové hooks:** useConcreteCalculator.ts, useVolumeCalculator.ts, useInsulationCalculator.ts
**Nové překlady:** ~180 klíčů v cs.json a en.json (concrete, volume, insulation, x_percent_of_y)
**Stav:** 6/6 hotovo
**Čas:** Dokončeno 2026-02-12

### Batch 4: Ostatní hotové komponenty ✅ DOKONČEN

**Kalkulačky:**
- ✅ Volume Converter – redundantní (UnitConverter má 10 volume jednotek), orphaned komponenty smazány (VolumeConverter, LengthConverter, WeightConverter, TemperatureConverter), SEO doplněno u UnitConverter

**Stav:** 1/1 hotovo
**Čas:** Dokončeno 2026-02-12

### Batch 5: Fraction operations ✅ DOKONČEN

**Kalkulačky:**
- ✅ Fraction Addition (75ř, CalculatorInput, additionSteps, LCD)
- ✅ Fraction Subtraction (75ř, CalculatorInput, subtractionSteps, LCD)
- ✅ Fraction Multiplication (75ř, CalculatorInput, multiplicationSteps)
- ✅ Fraction Division (76ř, CalculatorInput, divisionSteps, flip & multiply)
- ✅ Fraction Simplification (67ř, GCD, detekce základního tvaru)
- ✅ Fraction Conversion (169ř, 4 typy: improper↔mixed, fraction↔decimal)

**Nové soubory:** `src/utils/math/fractions.ts` (sdílené math utility – gcd, lcm, simplify, operations, steps)
**Nové překlady:** ~30 klíčů cs/en (inputy, chybové hlášky, kroky řešení, typy konverze)
**Stav:** 6/6 hotovo
**Čas:** Dokončeno 2026-02-12

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
> **Batch 6 Fitness:** 4 redirecty (duplicate elimination) + 2 nové kalkulačky (Macro, Water Intake)

## Historie změn

| Datum | Kalkulačka | Akce | Detail |
|-------|-----------|------|--------|
| 2026-02-11 | Vše | Inicializace | Vytvořen refactoring tracker - 62 kalkulaček v 8 batchích |
| 2026-02-11 | Batch 0 Part 1 | Dokončeno | Smazány duplicity (BMI, DPH, Procenta, Čistá mzda, Převodník, Zlomky, Složené úročení, Trojčlenka, Anuita) - commit 772281d |
| 2026-02-11 | Batch 0 Part 2 | Dokončeno | Vytvořeno 12 chybějících rout (Age, Area, BMR, Body Fat, Calories, Currency, Discount, Fuel, Ideal Weight, Loan, Time, Tip) - commit acdc75e |
| 2026-02-11 | Trojčlenka - přímá úměra | Dokončeno | Migrace na SimpleCalculatorLayout - commit 55b4c3b |
| 2026-02-11 | Tracker | Oprava | Aktualizován stav dle skutečné git historie - přidáno 2 MISSING stavy, přeskupina položek |
| 2026-02-11 | Tracker | Revize | Přidán stav PARTIAL_RELATED, 19 kalkulaček překlasifikováno z DONE na PARTIAL_RELATED (hardcoded relatedCalculators), přidána Feature Checklist sekce |
| 2026-02-12 | Batch 2 Finance | Dokončeno | 5 finančních kalkulaček migrováno na SimpleCalculatorLayout (anuitní splátka, IRR, NPV, ROI, předčasné splacení) |
| 2026-02-12 | Batch 1 Remaining | Dokončeno | 5 kalkulaček migrováno (nepřímá úměra, zlomky, složené úročení, čistá mzda, převodník jednotek) + DirectProportion i18n fix. 3 nové hooks, ~195 translation klíčů cs/en |
| 2026-02-12 | Batch 3 Stavební | Dokončeno | 6 kalkulaček: beton (630→163ř), objem (647→171ř), izolace (515→265ř), plocha (wrapper), kolik % je X z Y (167→223ř). 3 nové hooks, ~180 translation klíčů cs/en |
| 2026-02-12 | Batch 4 | Dokončeno | Volume Converter redundantní – smazány 4 orphaned unitConverter komponenty, SEO doplněno u UnitConverter |
| 2026-02-12 | Batch 5 Fractions | Dokončeno | 6 fraction operací implementováno (addition, subtraction, multiplication, division, simplification, conversion). Nový src/utils/math/fractions.ts, ~30 translation klíčů cs/en |
