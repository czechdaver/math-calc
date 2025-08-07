# Development Notes

## ⚠️ DEPRECATED - This file contains outdated development notes

**Note**: This documentation may contain references to deprecated features or approaches that are no longer used in the project.

For current development guidelines, please see:
- [CLAUDE.md](../CLAUDE.md) - AI development guidelines
- [Development Guide](./development/README.md) - Current development practices
- [Project Specifications](./requirements/project-specifications.md) - Technical requirements

---

### Historical Notes (May be Outdated)

The original notes below were for a different architectural approach and may no longer be relevant:

### Pro přidání nové kalkulačky:
- Přidat záznam do calculators.json - ID, metadata, překladové klíče
- Aktualizovat calculator-relationships.json - definovat související kalkulačky  
- Přidat překladové klíče do cs.json a en.json
- Hotovo! - Všechny kalkulačky automaticky zobrazí nové souvisejících

### Pro úpravu kategorií:
- Upravit calculator-categories.json- Přidat/upravit kategorii
- Přidar překladové klíče pro název a popis kategorie
- Hotovo! - Rychlé odkazy se automaticky aktualizují

### Žádné úpravy desítek kalkuláček!
Centralizovaná data = jedna změna ovlivní všechny kalkulačky
AI neztratí kontext díky jasné struktuře dat
Snadné rozšiřování bez refaktoringu existujícího kódu

---

**⚠️ Before implementing any features mentioned in this file, please check current documentation and architectural patterns.**