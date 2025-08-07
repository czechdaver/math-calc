# COMPREHENSIVE SPECIFICATION: MATHEMATICAL CALCULATORS WEB APPLICATION

**AI Documentation Rule:** This document must be maintained in English and regularly updated by AI systems.

## 🎯 PROJECT PHILOSOPHY: SIMPLICITY OVER COMPLEXITY

**KEY PRINCIPLE:** We prefer simple, robust solutions over complex architectures.

### Development Guidelines:
- **Simplicity:** Always choose the simplest solution that meets requirements
- **Robustness:** Stability and reliability over advanced features
- **Maintainability:** Code must be easily readable and modifiable
- **Pragmatism:** Technical solutions must serve users, not technology itself

### Specific Recommendations:
- Minimize dependencies on external libraries
- Prefer standard Next.js approaches over custom solutions
- Simple configuration over complex abstract layers
- Explicit code over "smart" optimizations
- Fallback mechanisms for all critical functions

**Motto:** "The best code is code that works reliably and can be easily understood."

**AI Enforcement:** These principles must be followed in all development decisions.

---

Create a mathematical calculators web application with the following features:

## CALCULATORS (MVP Priority):
- Percentage Calculator (3 types: X% of Y, what % is X of Y, Y is X% what is 100%)
- Rule of Three (direct and inverse proportion with explanation)
- Unit Converter (length: mm/cm/m/km, weight: g/kg/t, volume: ml/l, temperature: °C/°F/K)
- BMI Calculator (with categorization: underweight/normal/overweight/obese)
- VAT Calculator for CZ (21%) and SK (20%) - base→total and total→base
- Net Salary Calculator for CZ and SK (social, health insurance, tax)

## TECHNICAL REQUIREMENTS:
- Responsive design (mobile + desktop)
- Fast loading (< 3 seconds)
- SEO optimization (meta tags, H1, URL structure)
- Multi-language (cs, sk, pl, hu) with automatic detection
- Google Ads integration (4 positions: header, in-content, sidebar, sticky bottom)
- AdBlock detection with modal for site support

## USER INTERFACE:
- Simple and clear forms
- Instant results without clicking
- Error messages in local language
- Usage examples for each calculator
- FAQ section with most common questions

## BUSINESS LOGIC:
- All calculations on client side (speed)
- Usage tracking for individual calculators
- GDPR compliance for CEE market

## 1. PROJECT OVERVIEW

### Project Name
**MathCalc Pro** - Hostable web application for amateur mathematical calculations

### Goal
Create a modern, responsive web application with 141+ mathematical calculators optimized for SEO, monetization, and easy localization into multiple languages.

### Competitive Analysis
The application aims to surpass competitive solutions such as:
- vypocitejto.cz (4.4/5, 194 reviews)
- hackmath.net (94 calculators)
- kalkula.cz, penize.cz

## 2. TECHNICAL SPECIFICATION

### 🛠️ Technical Guidelines (Based on Experience)

**IMPORTANT DEVELOPMENT INSIGHTS:**
- Next.js 15 has changes in async params - always test compatibility
- next-intl requires fallback mechanisms for robustness
- Simple middleware configuration is more reliable than complex
- Explicit error handling is critical for i18n applications

**RECOMMENDED APPROACHES:**
- Use basic next-intl configuration without unnecessary optimizations
- Implement fallback values for all locale parameters
- Prefer `localePrefix: 'always'` for consistent routing
- Validate all async params with fallback values

### Core Technologies
- **Framework**: Next.js 15 with App Router (with caution for async params)
- **Backend**: Firebase (Firestore, Authentication, Hosting, Analytics)
- **Styling**: Tailwind CSS + Shadcn/ui components
- **PWA**: Offline support with Service Workers
- **Internationalization**: next-intl (with robust fallback mechanisms)

### Architecture
```
/src
  /app
    /[locale]
      /calculator
        /[category]
          /[calculator-name]
            page.tsx
      page.tsx
      layout.tsx
    layout.tsx
    page.tsx
  /components
    /ui (shadcn/ui)
    /calculators
    /layout
  /lib
    /calculators
    /utils
  /messages
    cs.json
    en.json
```

## 3. CALCULATOR SPECIFICATIONS

### MVP Calculators (Priority 1)
1. **Percentage Calculator** (`/calculator/procenta/`)
   - X% of Y
   - What % is X of Y
   - Y is X%, what is 100%
   
2. **Rule of Three** (`/calculator/trojclenka/`)
   - Direct proportion
   - Inverse proportion
   - Step-by-step explanation

3. **Unit Converter** (`/calculator/prevodnik-jednotek/`)
   - Length: mm, cm, m, km
   - Weight: g, kg, t
   - Volume: ml, l
   - Temperature: °C, °F, K

4. **BMI Calculator** (`/calculator/bmi/`)
   - Weight and height input
   - BMI categorization
   - Health recommendations

5. **VAT Calculator** (`/calculator/dph/`)
   - CZ: 21%, SK: 20%
   - Base → Total
   - Total → Base

6. **Net Salary Calculator** (`/calculator/cista-mzda/`)
   - CZ and SK tax systems
   - Social and health insurance
   - Take-home pay calculation

### Extended Calculators (Priority 2)
- Advanced Financial Calculators (15 calculators)
- Health and Fitness Calculators (8 calculators)
- Practical Calculations (12 calculators)
- Fraction Calculators (6 calculators)

### Full Calculator Suite (Priority 3)
- Construction Calculators (6 calculators)
- Equations (5 types)
- Average, powers, roots

## 4. SEO & MONETIZATION

### SEO Strategy
- Unique meta titles and descriptions for each calculator
- Structured data (schema.org)
- Breadcrumb navigation
- Internal linking strategy
- Sitemap generation
- Multi-language hreflang tags

### Monetization
- Google AdSense integration (4 ad positions)
- AdBlock detection with support modal
- Premium features (future)
- Affiliate partnerships (future)

## 5. INTERNATIONALIZATION

### Supported Languages
- Czech (cs) - Primary
- Slovak (sk)
- Polish (pl)
- Hungarian (hu)
- English (en) - Documentation

### Localization Requirements
- Currency formats per region
- Number formatting
- Date formats
- Regional calculation examples
- Legal compliance per country

## 6. PERFORMANCE & QUALITY

### Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

### Quality Assurance
- TypeScript for type safety
- ESLint + Prettier for code quality
- Jest for unit testing
- Cypress for E2E testing
- Lighthouse CI for performance monitoring

## 7. DEPLOYMENT & HOSTING

### Firebase Setup
- Firestore for data storage
- Authentication for user accounts
- Hosting for static files
- Analytics for usage tracking
- Functions for server-side logic

### Environment Configuration
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=
```

## 8. DEVELOPMENT PHASES

### Phase 1: MVP (4-6 weeks)
1. Project setup and architecture
2. Core 6 calculators implementation
3. Basic UI/UX design
4. Internationalization setup
5. SEO optimization
6. Initial deployment

### Phase 2: Extended Features (6-8 weeks)
1. Additional calculator categories
2. Advanced UI components
3. User accounts and preferences
4. Analytics integration
5. Performance optimization

### Phase 3: Full Suite (8-10 weeks)
1. Complete calculator library
2. Advanced monetization
3. Mobile app (PWA)
4. API development
5. Third-party integrations

## 9. SUCCESS METRICS

### Technical Metrics
- Page load speed < 3 seconds
- 99.9% uptime
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1)

### Business Metrics
- User engagement (time on site)
- Calculator usage statistics
- Ad revenue optimization
- SEO ranking improvements

## 10. FINAL DEVELOPMENT PRINCIPLES

### Code Quality Checklist
- [ ] Follows simplicity-first philosophy
- [ ] Implements proper error handling
- [ ] Uses fallback mechanisms
- [ ] Includes TypeScript types
- [ ] Has comprehensive tests
- [ ] Optimized for performance
- [ ] Accessible to all users
- [ ] SEO optimized
- [ ] Multi-language support
- [ ] GDPR compliant

### AI Development Rules
1. **Always prefer simple solutions** over complex architectures
2. **Implement fallback mechanisms** for all critical functions
3. **Use explicit error handling** instead of implicit assumptions
4. **Follow Next.js conventions** rather than custom solutions
5. **Test all locale routes** after configuration changes
6. **Update documentation** when adding new features
7. **Validate with provided commands** before deployment

---

**Project Status:** ✅ Routing functional, MVP calculators implemented, documentation in English, AI-optimized structure

**Next Steps:** Complete i18n standardization, SEO optimization, additional calculators
