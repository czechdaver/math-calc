# MathCalc Pro - Development Guide

## 🎯 Project Philosophy: Simplicity Over Complexity

**Core Principle:** We prefer simple, robust solutions over complex architectures.

**AI Note:** This guide is designed to be regularly reviewed and updated by AI systems.

### Why Simplicity?

During project development, we learned that:
- Simple solutions are more reliable
- Less code = fewer bugs
- Easier maintenance and extension
- Faster onboarding of new developers
- Better debugging and troubleshooting

**AI Development Rule:** Always choose the simplest solution that meets requirements.

## 🛠️ Technical Guidelines

**AI Rule:** These guidelines must be followed in all development decisions.

### 1. Preferred Approaches

✅ **DO:**
- Use standard Next.js conventions
- Implement basic library configurations
- Write explicit error handling
- Add fallback mechanisms for all critical functions
- Create simple middleware solutions
- Build straightforward components without unnecessary abstractions

❌ **DON'T:**
- Use custom solutions where standard ones suffice
- Implement premature optimizations
- Create complex abstract layers
- Use experimental features in production
- Configure without fallback mechanisms

**AI Validation:** Before implementing any feature, verify it follows these guidelines.

### 2. Konkrétní příklady

#### ✅ Dobrý přístup - next-intl konfigurace:
```typescript
// next-intl.config.ts
export default getRequestConfig(async ({locale}) => {
  const validLocale = locale || 'cs'; // Fallback!
  
  return {
    locale: validLocale,
    messages: (await import(`./src/messages/${validLocale}.json`)).default
  };
});
```

#### ❌ Špatný přístup - bez fallback:
```typescript
// Nebezpečné - může způsobit 500 chyby
export default getRequestConfig(async ({locale}) => {
  return {
    locale,
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});
```

## 📁 Struktura projektu

```
/docs
  /development/          # Vývojářská dokumentace
    - README.md         # Tento soubor
    - troubleshooting-guide.md  # Řešení problémů
  /requirements/        # Specifikace projektu
    - project-specifications.md  # Hlavní specifikace

/src
  /app                  # Next.js App Router
    /[locale]          # Lokalizované routy
  /components          # Komponenty
  /messages           # i18n překlady
```

## 🚀 Rychlý start

### 1. Instalace
```bash
npm install
```

### 2. Spuštění
```bash
npm run dev
```

### 3. Testování rout
```bash
# Test základních rout
curl -I http://localhost:3000/
curl -I http://localhost:3000/cs
curl -I http://localhost:3000/en
```

## 🐛 Troubleshooting

### Časté problémy:

1. **404/500 chyby na lokalizovaných routách**
   - Zkontroluj fallback mechanismy v next-intl.config.ts
   - Ověř middleware konfiguraci
   - Viz: [troubleshooting-guide.md](./troubleshooting-guide.md)

2. **Problémy s async params**
   - Next.js 15 vyžaduje `Promise<{locale}>` v layout props
   - Vždy await params před použitím

3. **i18n problémy**
   - Ověř existenci message souborů
   - Zkontroluj fallback hodnoty

## 📋 Checklist pro nové funkce

Před implementací nové funkce:

- [ ] **Jednoduchost**: Je toto nejjednodušší možné řešení?
- [ ] **Robustnost**: Existují fallback mechanismy?
- [ ] **Čitelnost**: Je kód snadno pochopitelný?
- [ ] **Testovatelnost**: Lze snadno testovat a debugovat?
- [ ] **Kompatibilita**: Funguje ve všech podporovaných prostředích?
- [ ] **Dokumentace**: Je řešení zdokumentováno?

## 🔧 Nástroje a příkazy

### Development
```bash
npm run dev          # Spuštění dev serveru
npm run build        # Build produkce
npm run start        # Spuštění produkční verze
npm run lint         # Linting
```

### Debugging
```bash
# Testování HTTP status kódů
curl -I http://localhost:3000/
curl -I http://localhost:3000/cs
curl -I http://localhost:3000/en

# Sledování server logů
npm run dev | grep -E "(error|Error|404|500)"
```

## 📚 Další dokumentace

- [Specifikace projektu](../requirements/project-specifications.md)
- [Průvodce řešením problémů](./troubleshooting-guide.md)
- [Next.js dokumentace](https://nextjs.org/docs)
- [next-intl dokumentace](https://next-intl-docs.vercel.app/)

## 💡 Tipy pro vývojáře

1. **Vždy testuj lokalizované routy** po změnách v konfiguraci
2. **Používej server logy** pro debugging problémů
3. **Implementuj fallback mechanismy** pro všechny kritické funkce
4. **Preferuj explicitní kód** před "chytrými" optimalizacemi
5. **Dokumentuj neobvyklá řešení** pro budoucí vývojáře

---

**Motto:** "Nejlepší kód je ten, který funguje spolehlivě a dá se snadno pochopit."
