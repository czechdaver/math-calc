# Audit dokumentace – 2026-02-11

Kompletní audit dokumentace projektu MathCalc Pro.

## Shrnutí

| Metrika | Hodnota |
|---------|---------|
| Celkem dokumentačních souborů | 37 MD souborů |
| S kritickými problémy | 2 |
| Se středními problémy | 6 |
| S malými problémy | 4 |
| Bez problémů | 25 |

---

## Existující dokumentace

### Hlavní dokumentace (root)

| Soubor | Stav | Aktuálnost | Kompletnost | Problémy |
|--------|------|------------|-------------|----------|
| `README.md` | ⚠️ KRITICKÝ | Nízká | Střední | Duplicitní sekce (Project Structure 2x, i18n 2x, Testing 2x), neexistující reference (`CODING_STANDARDS.md`, `CONTRIBUTING.md`, `LICENSE`), zastaralé cesty (`public/locales/` vs `src/messages/`), smíšené informace o struktuře |
| `CLAUDE.md` | ⚠️ STŘEDNÍ | Střední | Vysoká | Nepřesné počty komponent (38 vs 33), verze balíčků jako "latest", tabulka stavu refaktoringu potřebuje ověření |

### docs/README.md a obsah

| Soubor | Stav | Aktuálnost | Kompletnost | Problémy |
|--------|------|------------|-------------|----------|
| `docs/README.md` | ✅ OK | Vysoká | Vysoká | Aktuální index dokumentace, jasná struktura |

### docs/calculator-specification.md

| Soubor | Stav | Aktuálnost | Kompletnost | Problémy |
|--------|------|------------|-------------|----------|
| `docs/calculator-specification.md` | ⚠️ STŘEDNÍ | Nízká | Střední | Popisuje neexistující strukturu (`components/calculators/common/CalculatorLayout.tsx`, `HistoryPanel.tsx`), cesty jako `/zakladni/kalkulacka` neexistují, UI komponenty `InputField.tsx`, `ResultDisplay.tsx` neexistují |

### docs/changelog/

| Soubor | Stav | Aktuálnost | Kompletnost | Problémy |
|--------|------|------------|-------------|----------|
| `docs/changelog/CHANGELOG.md` | ⚠️ MALÝ | Nízká | Nízká | Pouze 3 položky, neodráží skutečný vývoj (141+ kalkulátorů, mnoho commitů) |

### docs/design/

| Soubor | Stav | Aktuálnost | Kompletnost | Problémy |
|--------|------|------------|-------------|----------|
| `docs/design/style-guide.md` | ⚠️ MALÝ | Střední | Vysoká | Odkazuje na Heroicons v2, ale projekt používá Lucide React |
| `docs/design/calculator-layout.md` | ✅ OK | Vysoká | Vysoká | Detailní a aktuální specifikace layoutu, včetně nového modulárního systému |
| `docs/design/homepage-layout.md` | ✅ OK | Vysoká | Střední | - |
| `docs/design/ui-components.md` | ✅ OK | Vysoká | Střední | - |
| `docs/design/accordion.md` | ✅ OK | Vysoká | Střední | - |
| `docs/design/modal.md` | ✅ OK | Vysoká | Střední | - |
| `docs/design/tabs.md` | ✅ OK | Vysoká | Střední | - |
| `docs/design/toast.md` | ✅ OK | Vysoká | Střední | - |
| `docs/design/tooltip.md` | ✅ OK | Vysoká | Střední | - |
| `docs/design/pagination.md` | ✅ OK | Vysoká | Střední | - |
| `docs/design/loading-spinner.md` | ✅ OK | Vysoká | Střední | - |

### docs/development/

| Soubor | Stav | Aktuálnost | Kompletnost | Problémy |
|--------|------|------------|-------------|----------|
| `docs/development/README.md` | ⚠️ MALÝ | Střední | Vysoká | Smíšený anglický/český jazyk (části "Konkrétní příklady", "Struktura projektu") |
| `docs/development/refactoring-guidelines.md` | ✅ OK | Vysoká | Vysoká | Aktuální a detailní pravidla pro refaktoring |
| `docs/development/troubleshooting-guide.md` | ✅ OK | Vysoká | Vysoká | Komplexní guide s konkrétními řešeními |
| `docs/development/calculator-status-audit.md` | ⚠️ STŘEDNÍ | Nízká | Vysoká | Generováno 2025-08-05, nepřesnosti (`BMICalculatorRefactored.tsx` byl přejmenován), počty kalkulátorů potřebují update |
| `docs/development/calculator-testing-results.md` | ✅ OK | Střední | Střední | - |
| `docs/development/localization-status.md` | ✅ OK | Střední | Střední | - |

### docs/getting-started/

| Soubor | Stav | Aktuálnost | Kompletnost | Problémy |
|--------|------|------------|-------------|----------|
| `docs/getting-started/installation.md` | ✅ OK | Vysoká | Vysoká | Aktuální, obsahuje validační kroky a troubleshooting |
| `docs/getting-started/development.md` | ✅ OK | Vysoká | Střední | - |

### docs/reference/

| Soubor | Stav | Aktuálnost | Kompletnost | Problémy |
|--------|------|------------|-------------|----------|
| `docs/reference/coding-standards.md` | ⚠️ MALÝ | Střední | Vysoká | Doporučuje interface prefix `I` (např. `IUserData`), ale v kódu se nepoužívá |
| `docs/reference/testing-guide.md` | ✅ OK | Vysoká | Střední | Obecný UI testing plan |
| `docs/reference/api-documentation.md` | ⚠️ STŘEDNÍ | Nízká | Vysoká | Mnoho definovaných rozhraní neexistuje v kódu (např. `PercentageCalculator` s `locale` a `onCalculate` props), teoretické API neodpovídá implementaci |
| `docs/reference/state-management.md` | ✅ OK | Vysoká | Střední | - |

### docs/requirements/

| Soubor | Stav | Aktuálnost | Kompletnost | Problémy |
|--------|------|------------|-------------|----------|
| `docs/requirements/project-specifications.md` | ⚠️ STŘEDNÍ | Střední | Vysoká | Odkazuje na neexistující `docs/requirements/firebase-setup.md` |
| `docs/requirements/tech-specs.md` | ✅ OK | Střední | Střední | - |
| `docs/requirements/testing-strategy.md` | ✅ OK | Střední | Střední | - |

### AI/Tool konfigurace

| Soubor | Stav | Aktuálnost | Kompletnost | Problémy |
|--------|------|------------|-------------|----------|
| `.windsurf/rules.md` | ✅ OK | Vysoká | Vysoká | Aktuální pravidla pro Windsurf AI |
| `.idx/airules.md` | ✅ OK | Vysoká | Střední | Pravidla pro Google IDX |
| `.context/notes.md` | ✅ OK | Vysoká | Nízká | Dočasné poznámky agentů |
| `.context/todos.md` | ✅ OK | Vysoká | Nízká | Dočasné todo listy |

### Ostatní

| Soubor | Stav | Aktuálnost | Kompletnost | Problémy |
|--------|------|------------|-------------|----------|
| `docs/notes.md` | ✅ OK | Střední | Nízká | Obecné poznámky |
| `scripts/README.md` | ✅ OK | Vysoká | Střední | - |

---

## Chybějící dokumentace

- [ ] **`CONTRIBUTING.md`** - Zmíněno v README.md, ale neexistuje. Potřeba pro open-source přispěvatele.
- [ ] **`LICENSE`** - Zmíněno v README.md, ale neexistuje. MIT licence je deklarována, ale soubor chybí.
- [ ] **`docs/requirements/firebase-setup.md`** - Zmíněno v `project-specifications.md`, ale neexistuje.
- [ ] **JSDoc/TSDoc konfigurace** - Chybí `tsdoc.json` nebo `jsdoc.json` pro standardizaci dokumentace kódu.
- [ ] **`docs/components/` adresář** - Zmíněno v README, ale neexistuje. Mělo by obsahovat dokumentaci UI komponent.
- [ ] **ESLint/Prettier konfigurace** - README zmiňuje, ale chybí `.prettierrc` a rozšířená ESLint konfigurace.
- [ ] **CI/CD dokumentace** - Chybí dokumentace pro GitHub Actions nebo deployment proces.
- [ ] **Deployment guide** - Chybí specifická dokumentace pro Vercel/Netlify deployment.

---

## Doporučení

### Prioritní opravy (kritické)

1. **README.md - kompletní přepis**
   - Odstranit duplicitní sekce (Project Structure, i18n, Testing se opakují)
   - Opravit cesty: `public/locales/` → `src/messages/`
   - Odstranit reference na neexistující soubory (`CODING_STANDARDS.md`, `CONTRIBUTING.md`)
   - Zjednodušit a aktualizovat strukturu adresářů

2. **Vytvořit chybějící LICENSE soubor**
   - Přidat MIT licence text (README ho deklaruje)

3. **Aktualizovat docs/development/calculator-status-audit.md**
   - Opravit názvy komponent (`BMICalculatorRefactored.tsx` → `BMICalculator.tsx`)
   - Aktualizovat počty kalkulátorů
   - Ověřit stav refaktoringu

### Střední priorita

4. **Opravit docs/calculator-specification.md**
   - Aktualizovat strukturu komponent na skutečný stav
   - Odstranit reference na `/zakladni/kalkulacka` a jiné neexistující cesty
   - Přejmenovat `common/` na `shared/` podle skutečné struktury

5. **Aktualizovat docs/reference/api-documentation.md**
   - Buď odstranit teoretická API, nebo implementovat
   - Změnit `PercentageCalculator` props na skutečné rozhraní

6. **Opravit docs/requirements/project-specifications.md**
   - Odstranit nebo vytvořit `firebase-setup.md` referenci

### Nízká priorita

7. **Aktualizovat docs/design/style-guide.md**
   - Změnit Heroicons na Lucide React v sekci Icons

8. **Aktualizovat docs/development/README.md**
   - Přeložit české sekce do angličtiny (nebo celý dokument do češtiny)

9. **Aktualizovat docs/reference/coding-standards.md**
   - Odstranit doporučení interface prefixu `I`

10. **Rozšířit docs/changelog/CHANGELOG.md**
    - Doplnit všechny významné změny od vzniku projektu

### Co smazat (zastaralé/matoucí)

- Žádné soubory nenavrhujeme smazat, pouze aktualizovat

### Co přidat

1. **`CONTRIBUTING.md`** - návod pro přispěvatele
2. **`LICENSE`** - MIT licence text
3. **`docs/deployment.md`** - deployment guide pro Vercel
4. **`docs/architecture.md`** - high-level architektura projektu

---

## Legenda

| Stav | Význam |
|------|--------|
| ✅ OK | Dokumentace je aktuální a kompletní |
| ⚠️ MALÝ | Malé problémy, snadno opravitelné |
| ⚠️ STŘEDNÍ | Střední problémy, vyžaduje aktualizaci |
| ⚠️ KRITICKÝ | Kritické problémy, vyžaduje kompletní přepis |

| Aktuálnost | Význam |
|------------|--------|
| Vysoká | Odpovídá současnému stavu kódu |
| Střední | Menší nepřesnosti |
| Nízká | Zastaralé, potřebuje aktualizaci |

| Kompletnost | Význam |
|-------------|--------|
| Vysoká | Obsahuje všechny potřebné informace |
| Střední | Chybí některé detaily |
| Nízká | Neúplné, chybí důležité sekce |

---

*Audit vytvořen: 2026-02-11*
*Auditor: Claude (AI agent)*
