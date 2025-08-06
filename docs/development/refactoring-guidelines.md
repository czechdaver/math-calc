# Pravidla pro refaktoring kalkulaček

## Zásady pro zabránění duplikátů

### ❌ NIKDY NEVYTVÁŘEJTE DUPLIKÁTY
- **Nikdy nevytvářejte soubory s příponami jako "Refactored", "New", "Updated", apod.**
- **Nikdy nevytvářejte testovací stránky s příponami "-new", "-test" bez okamžitého odstranění po dokončení**
- **Vždy aktualizujte existující soubory místo vytváření nových verzí**

### ✅ SPRÁVNÝ POSTUP REFAKTORINGU

#### 1. Před zahájením refaktoringu
```bash
# Zkontrolujte aktuální stav
find src/components/calculators -name "*Calculator*.tsx" | grep -v __tests__
```

#### 2. Během refaktoringu
- Aktualizujte existující soubor přímo
- Používejte git pro verzování změn
- Testujte změny průběžně

#### 3. Po dokončení refaktoringu
- Zkontrolujte všechny odkazy na kalkulačku
- Ověřte, že neexistují duplikáty
- Odstraňte všechny testovací stránky

### 🔍 KONTROLNÍ CHECKLIST

#### Před commitem změn:
- [ ] Neexistují soubory s příponami "Refactored", "New", "Updated"
- [ ] Všechny odkazy v app/ adresáři ukazují na správné komponenty
- [ ] Neexistují testovací stránky s příponami "-new", "-test"
- [ ] Všechny importy jsou aktuální

#### Kontrolní příkazy:
```bash
# Kontrola duplikátů
find src/components/calculators -name "*Refactored*" -o -name "*New*" -o -name "*Updated*"

# Kontrola odkazů na neexistující komponenty
grep -r "Refactored\|New\|Updated" src/app/ --include="*.tsx"

# Kontrola testovacích stránek
find src/app -name "*-new" -o -name "*-test"
```

## Struktura kalkulaček

### Aktuální naming convention:
- `BMICalculator.tsx` - ✅ Správně
- `PercentageOfNumberCalculator.tsx` - ✅ Správně
- `DirectProportionCalculator.tsx` - ✅ Správně (trojčlenka)

### Mapování starých názvů na nové:
- `RuleOfThreeRefactored` → `DirectProportionCalculator`
- `PercentageOfNumberRefactored` → `PercentageOfNumberCalculator`
- `YIsXPercentRefactored` → `YIsXWhatIsHundredCalculator`
- `WhatPercentageRefactored` → `WhatPercentageIsXOfYCalculator`
- `UnitConverterRefactored` → `UnitConverter`
- `VATCalculatorRefactored` → `VATCalculator`
- `BMICalculatorRefactored` → `BMICalculator`
- `CompoundInterestCalculatorRefactored` → `CompoundInterestCalculator`
- `AnnuityPaymentCalculatorRefactored` → `AnnuityPaymentCalculator`
- `NetSalaryCalculatorRefactored` → `NetSalaryCalculator`
- `FractionsCalculatorRefactored` → `FractionsCalculator`

## Historie čištění duplikátů

### Datum: 2025-08-05
**Odstraněné duplikáty:**
- `AnnuityPaymentCalculatorRefactored.tsx`
- `BMICalculatorRefactored.tsx`
- `CompoundInterestCalculatorRefactored.tsx`
- `FractionsCalculatorRefactored.tsx`
- `NetSalaryCalculatorRefactored.tsx`
- `VATCalculatorRefactored.tsx`
- `RuleOfThreeRefactored.tsx`
- `PercentageOfNumberRefactored.tsx`
- `YIsXPercentRefactored.tsx`
- `UnitConverterRefactored.tsx`
- `WhatPercentageRefactored.tsx`

**Opravené odkazy:**
- Všechny stránky v `src/app/[locale]/calculator/` aktualizovány
- Dynamic importy opraveny
- Testovací stránky přesměrovány na aktuální komponenty

## Pravidla pro code review

### Reviewer musí zkontrolovat:
1. **Žádné duplikáty komponent** - soubory nesmí obsahovat přípony jako "Refactored"
2. **Správné importy** - všechny importy ukazují na existující soubory
3. **Čisté testovací stránky** - žádné stránky s příponami "-new", "-test"
4. **Konzistentní naming** - názvy komponent následují established convention

### Automatické kontroly (pre-commit hook):
```bash
#!/bin/bash
# Kontrola duplikátů před commitem
if find src/components/calculators -name "*Refactored*" -o -name "*New*" -o -name "*Updated*" | grep -q .; then
    echo "❌ CHYBA: Nalezeny duplikáty kalkulaček!"
    echo "Odstraňte všechny soubory s příponami Refactored, New, Updated"
    exit 1
fi

if find src/app -name "*-new" -o -name "*-test" | grep -q .; then
    echo "❌ CHYBA: Nalezeny testovací stránky!"
    echo "Odstraňte všechny testovací stránky před commitem"
    exit 1
fi

echo "✅ Kontrola duplikátů prošla"
```

## Závěr

Dodržování těchto pravidel zajistí:
- Čistý a udržovatelný kód
- Žádné mrtvé odkazy
- Konzistentní strukturu projektu
- Snadnou orientaci pro nové vývojáře

**Pamatujte: Jednoduchość nad složitostí - jeden kalkulátor = jeden soubor!**
