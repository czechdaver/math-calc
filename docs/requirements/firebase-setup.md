---
title: Firebase Setup
category: Requirements
version: 1.2.0
updated: 2025-07-22
---

# KOMPLEXNÍ ZADÁNÍ PRO FIREBASE AI: WEBOVÁ APLIKACE MATEMATICKÝCH KALKULAČEK

Vytvořte webovou aplikaci matematických kalkulaček s těmito funkcemi:

KALKULAČKY (MVP priorita):
- Kalkulátor procent (3 typy: X% z Y, kolik % je X z Y, Y je X% kolik je 100%)
- Trojčlenka (přímá a nepřímá úměra s vysvětlením)
- Převodník jednotek (délka: mm/cm/m/km, hmotnost: g/kg/t, objem: ml/l, teplota: °C/°F/K)
- BMI kalkulačka (s kategorizací: podváha/normální/nadváha/obezita)
- DPH kalkulátor pro ČR (21%) a SK (20%) - základ→celkem i celkem→základ
- Kalkulátor čisté mzdy pro ČR a SK (sociální, zdravotní pojištění, daň)

TECHNICKÉ POŽADAVKY:
- Responzivní design (mobil + desktop)
- Rychlé načítání (< 3 sekundy)
- SEO optimalizace (meta tagy, H1, URL structure)
- Multi-jazykový (cs, sk, pl, hu) s automatickou detekcí
- Google Ads integrace (4 pozice: header, in-content, sidebar, sticky bottom)
- AdBlock detekce s modálem pro podporu webu

UŽIVATELSKÉ ROZHRANÍ:
- Jednoduché a přehledné formuláře
- Okamžité výsledky bez potřeby kliknutí
- Chybové hlášky v místním jazyce
- Příklady použití pro každou kalkulačku
- FAQ sekce s nejčastějšími dotazy

BUSINESS LOGIKA:
- Všechny výpočty na straně klienta (rychlost)
- Tracking použití jednotlivých kalkulaček
- GDPR compliance pro CEE trh


## 1. PŘEHLED PROJEKTU

### Název projektu
**MathCalc Pro** - Hostovatelná webová aplikace pro amatérské matematické výpočty

### Cíl
Vytvořit moderní, responzivní webovou aplikaci s 141+ matematickými kalkulačkami optimalizovanou pro SEO, monetizaci a snadnou lokalizaci do více jazyků.

### Referenční analýza
Aplikace má překonat konkurenční řešení jako:
- vypocitejto.cz (4.4/5, 194 recenzí)
- hackmath.net (94 kalkulaček)
- kalkula.cz, penize.cz

## 2. TECHNICKÁ SPECIFIKACE

### Core technologie
- **Framework**: Next.js 15 s App Router
- **Backend**: Firebase (Firestore, Authentication, Hosting, Analytics)
- **Styling**: Tailwind CSS + Shadcn/ui komponenty
- **PWA**: Offline support s Service Workers
- **Internacionalizace**: next-i18next s podporou 20+ jazyků

### Architektura
```
/src
  /app
    /[locale]
      /layout.tsx
      /page.tsx
      /calculator/[category]/[name]/page.tsx
  /components
    /calculators
    /ui
    /ads
    /seo
  /lib
    /firebase
    /utils
    /calculations
  /locales
  /types
```

## 3. FUNKCIONALITA

### Kalkulačky podle priority

#### VELMI VYSOKÁ PRIORITA (17 kalkulaček)
1. **Procenta** (3 varianty)
   - Výpočet procent z čísla
   - Kolik procent je číslo z čísla
   - Základ z procent

2. **Trojčlenka** (2 varianty)
   - Přímá úměra
   - Nepřímá úměra

3. **Převody jednotek** (12 typů)
   - Délka, objem, hmotnost, rychlost
   - Teplota, úhly, tlak, výkon
   - Energie, čas, procenta/promile/ppm

#### VYSOKÁ PRIORITA (40 kalkulaček)
- Zlomky (6 operací)
- Finance rozšířené (6 kalkulaček)
- Praktické výpočty (6 kalkulaček)
- Fitness & zdraví (6 kalkulaček)
- Podnikání (5 kalkulaček)
- Finance základní (11 kalkulaček)

#### STŘEDNÍ PRIORITA (59 kalkulaček)
- Obsah a obvod (14 útvarů)
- Objem a povrch (7 těles)
- Statistika (7 funkcí)
- Fyzika (9 vzorců)
- Stavebnictví (6 kalkulaček)
- Rovnice (5 typů)
- Průměr, mocniny, odmocniny

#### NÍZKÁ PRIORITA (25 kalkulaček)
- Pokročilá matematika (9 oblastí)
- Goniometrie (4 funkce)
- Logaritmy (3 typy)
- Chemie (4 kalkulačky)
- Zahradnictví (4 kalkulačky)
- Hry (1 sudoku)

## 4. UI/UX DESIGN

### Hlavní stránka
- Hero sekce s vyhledáváním kalkulaček
- Kategorie v grid layoutu s ikonami
- Populární kalkulačky
- SEO optimalizovaný obsah

### Stránka kalkulačky
- Nadpis s kategorií
- Matematický vzorec (LaTeX rendering)
- Interaktivní formulář
- Krok za krokem vysvětlení
- Související kalkulačky
- Google Ads placement

### Navigace
- Sticky header s vyhledáváním
- Breadcrumb navigace
- Jazykový přepínač
- Dark/light mode

## 5. MONETIZACE

### Google Ads integrace
- **Placement 1**: Banner v headeru (728x90)
- **Placement 2**: V-content reklama mezi kalkulačkami (300x250)
- **Placement 3**: Sticky bottom banner na mobile (320x50)
- **Placement 4**: Sidebar reklamy na desktop (160x600)

### AdBlock detekce
```javascript
// Implementace pomocí bait elementu
function detectAdBlock() {
  const adElement = document.createElement('div');
  adElement.className = 'ad-banner';
  adElement.style.display = 'none';
  document.body.appendChild(adElement);
  
  setTimeout(() => {
    if (window.getComputedStyle(adElement).display === 'none') {
      showAdBlockModal();
    }
    document.body.removeChild(adElement);
  }, 100);
}
```

### AdBlock modal
- Informativní zpráva o podpoře webu
- Možnost vysvětlení přínosů reklam
- Žádost o vypnutí AdBlockeru
- Alternativní možnost podpory

## 6. SEO OPTIMALIZACE

### On-page SEO
- Jedinečné H1 pro každou kalkulačku
- Meta descriptions s klíčovými slovy
- Schema.org markup pro calculatory
- Open Graph a Twitter Cards
- Breadcrumb schema

### Technické SEO
- **Core Web Vitals optimalizace**
- Next.js Image optimization
- Lazy loading komponent
- Gzip/Brotli komprese
- CDN přes Firebase Hosting

### Struktura URL
```
/{locale}/
/{locale}/calculator/{category}
/{locale}/calculator/{category}/{calculator-name}
/{locale}/about
/{locale}/contact
```

### Sitemap.xml
- Dynamicky generovaná
- Lokalizovaná pro každý jazyk
- Prioritizace podle popularity kalkulaček

## 7. INTERNACIONALIZACE

### Podporované jazyky (20+)
**Priorita 1**: cs, en, de, es, fr, it
**Priorita 2**: pl, ru, pt, nl, sv, da
**Priorita 3**: zh, ja, ko, ar, hi, tr, hu, ro

### Implementace
```javascript
// next-i18next konfigurace
module.exports = {
  i18n: {
    defaultLocale: 'cs',
    locales: ['cs', 'en', 'de', 'es', 'fr', 'it', ...],
    localeDetection: true,
  },
}
```

### Lokalizace obsahu
- Názvy kalkulaček
- Matematické termíny
- UI komponenty
- SEO metadata
- Chybové hlášky

## 8. FIREBASE INTEGRACE

### Hosting
- Automatické deployment z GitHubu
- Preview channels pro testování
- Custom domain s SSL

### Analytics
- Sledování použití kalkulaček
- Conversion tracking pro reklamy
- User engagement metriky
- A/B testing support

### Firestore
- Ukládání statistik použití
- User feedback
- Kalkulace historie (optional)

### Authentication (volitelné)
- Google/Facebook přihlášení
- Uložení oblíbených kalkulaček
- Historie výpočtů

## 9. PERFORMANCE OPTIMALIZACE

### Loading strategy
- Critical CSS inlining
- Route-based code splitting
- Prefetching populárních kalkulaček
- Service Worker caching

### Caching
- Static assets: 1 rok
- Dynamic content: 1 hodina
- API responses: 15 minut

### Bundle optimalizace
- Tree shaking
- Webpack optimalizace
- Lazy loading komponent
- Critical path prioritizace

## 10. DEPLOYMENT STRATEGIE

### Staging workflow
1. Feature branch → Preview channel
2. Main branch → Staging environment
3. Tag release → Production deployment

### CI/CD pipeline
```yaml
# GitHub Actions
deploy:
  - run: npm run build
  - run: npm run test
  - run: firebase deploy --only hosting
```

### Monitoring
- Google Analytics 4
- Firebase Performance Monitoring
- Error tracking s Sentry
- Uptime monitoring

## 11. CONTENT MANAGEMENT

### Kalkulačky definice
```typescript
interface Calculator {
  id: string;
  name: string;
  category: string;
  formula: string;
  inputs: Input[];
  output: Output;
  explanation: string;
  examples: Example[];
  relatedCalculators: string[];
}
```

### Static content
- Markdown soubory pro about/contact
- JSON soubory pro kalkulačky
- Lokalizované stringy v JSON

## 12. TESTING STRATEGIE

### Unit testy
- Matematické funkce
- Utility funkce
- Komponenty

### Integration testy
- API endpoints
- Firebase integrace
- Lokalizace

### E2E testy
- Kritické user flows
- Cross-browser testing
- Mobile responsiveness

## 13. MAINTENANCE & SCALING

### Content updates
- Přidávání nových kalkulaček
- Aktualizace překladů
- SEO optimalizace

### Performance monitoring
- Regular audity
- Core Web Vitals tracking
- User feedback integration

### Scaling plan
- Multi-region deployment
- Database scaling
- CDN optimalizace

## 14. LEGAL & COMPLIANCE

### GDPR compliance
- Cookie consent
- Privacy policy
- Data processing agreement

### Accessibility
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation

## 15. LAUNCH STRATEGIE

### Phase 1: MVP (20 nejvíce prioritních kalkulaček)
- Core functionality
- 3 jazyky (cs, en, de)
- Základní SEO

### Phase 2: Expansion (100 kalkulaček)
- 10 jazyků
- Pokročilé SEO
- Analytics implementace

### Phase 3: Full Launch (141+ kalkulaček)
- Všechny jazyky
- Advanced features
- Marketing campaign

---

**Odhadovaný čas vývoje**: 3-4 měsíce
**Týmová struktura**: 1x Full-stack developer, 1x UI/UX designer, 1x SEO specialist
**Budget**: $15,000 - $25,000 USD