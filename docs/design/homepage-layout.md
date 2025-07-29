---
title: Homepage Layout
category: Design
version: 1.2.0
updated: 2025-07-29
---

# Specification: Homepage Layout (Application Landing Page)

**AI Documentation Rule:** This design specification must be maintained in English.

## Goals
- Maximum clarity, quick navigation to calculators
- Pleasant and modern UI with emphasis on trustworthiness (CEE market)
- Support for monetization and SEO

## Homepage Structure

### 1. Header/Navigation
- Logo/project name (left)
- Links to main sections/calculator categories
- Language selection (dropdown with flags/language abbreviations)
- Search bar ("Find calculator..." autocomplete, keyboard shortcut)

### 2. Hero Section
- Main headline (e.g., "Mathematical Calculators for Everyday Use")
- Subtitle describing main problems solved (percentages, conversions...)
- Illustration/animation with calculation or mathematics theme
- Main CTA button: "Start Calculating" – scrolls to calculator list

### 3. Most Popular Calculators (Directory)
- Grid of several most frequently used calculators → card style (icon, description, rating/popularity)
- Each card = CTA (redirect to specific calculator page)

### 4. Calculator Categories
- Grid section for categories (Mathematics, Finance, Health, Units, etc.) with icon and number of available calculators
- Click through to category shows complete directory with calculator selection

### 5. Advertising Spaces on Homepage
- Header banner (below navigation)
- Sidebar banner (desktop only)
- Footer banner (before footer)

### 6. Social Proof Section
- Box with "Trusted by" – user counts, partner logos, highest ratings
- Reference/testimonial slider with real quotes

### 7. FAQ Section
- Accordion with basic questions about using the application and privacy protection

### 8. Footer
- Links to calculator categories, blog, terms, GDPR
- Contact and company information (address, email)
- Language selection and copyright information

## UX/UI and Technical Guidelines
- Responsive/mobile approach: grid cards wrap in one or two columns
- Touch-friendly interface (large clickable areas, min 44px)
- Sticky main menu on mobile
- Sticky bottom advertisement for mobile
- Optimization for fast loading (lazy-load illustrations and ads)
- SEO maximization (H1, descriptions, keywords, meta description and schema.org WebSite/WebApplication markup)
- Accessibility: all information/highlight CTA also for screen readers

### Monetization
- Advertising boxes as above, with option to disable them by informing about support in case of AdBlock (soft modal)

### Internationalization
- All texts in languages: Czech, Slovak, Polish, Hungarian
- Correct currency and number formats in localizations
- Examples and FAQ according to regional customs

## Component Structure

### Hero Component
```typescript
interface HeroProps {
  locale: string;
  onStartCalculating: () => void;
}

const Hero: React.FC<HeroProps> = ({ locale, onStartCalculating }) => {
  const t = useTranslations('homepage.hero');
  
  return (
    <section className="hero-section">
      <div className="container">
        <h1 className="hero-title">{t('title')}</h1>
        <p className="hero-subtitle">{t('subtitle')}</p>
        <button 
          onClick={onStartCalculating}
          className="cta-button"
        >
          {t('startCalculating')}
        </button>
      </div>
    </section>
  );
};
```

### Popular Calculators Grid
```typescript
interface PopularCalculatorsProps {
  locale: string;
  calculators: Calculator[];
}

const PopularCalculators: React.FC<PopularCalculatorsProps> = ({ 
  locale, 
  calculators 
}) => {
  return (
    <section className="popular-calculators">
      <h2>{t('popularCalculators')}</h2>
      <div className="calculator-grid">
        {calculators.map((calculator) => (
          <CalculatorCard 
            key={calculator.id}
            calculator={calculator}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
};
```

### Calculator Categories
```typescript
interface Category {
  id: string;
  name: string;
  icon: string;
  calculatorCount: number;
  href: string;
}

const CategoryGrid: React.FC<{ categories: Category[] }> = ({ categories }) => {
  return (
    <section className="category-grid">
      <h2>{t('calculatorCategories')}</h2>
      <div className="grid">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};
```

## SEO Optimization

### Meta Tags
```html
<head>
  <title>Mathematical Calculators | MathCalc Pro</title>
  <meta name="description" content="Free online mathematical calculators for percentages, BMI, VAT, unit conversions and more. Fast, accurate calculations for everyday use." />
  <meta name="keywords" content="calculator, mathematics, percentage, BMI, VAT, unit converter" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Mathematical Calculators | MathCalc Pro" />
  <meta property="og:description" content="Free online mathematical calculators for everyday use" />
  <meta property="og:type" content="website" />
  
  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "MathCalc Pro",
    "description": "Mathematical calculators web application",
    "url": "https://mathcalc.pro",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser"
  }
  </script>
</head>
```

### URL Structure
```
/ - Homepage
/cs/ - Czech homepage
/en/ - English homepage
/cs/calculator/procenta/ - Percentage calculators
/cs/calculator/bmi/ - BMI calculator
/cs/kategorie/financie/ - Finance category
```

## Performance Requirements

### Core Web Vitals Targets
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### Optimization Strategies
- Lazy loading for images and ads
- Code splitting for calculator components
- Preloading critical resources
- Optimized image formats (WebP, AVIF)
- Minified CSS and JavaScript

## Accessibility Guidelines

### WCAG 2.1 Compliance
- Proper heading hierarchy (H1 → H2 → H3)
- Alt text for all images
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratio ≥ 4.5:1
- Focus indicators for interactive elements

### Implementation
```typescript
// Accessible button component
const AccessibleButton: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  ariaLabel 
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="accessible-button"
      tabIndex={0}
    >
      {children}
    </button>
  );
};
```

## Mobile-First Design

### Responsive Breakpoints
```css
/* Mobile First */
.calculator-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .calculator-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .calculator-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Touch Targets
- Minimum 44px × 44px for touch targets
- Adequate spacing between interactive elements
- Swipe gestures for carousel components
- Pull-to-refresh functionality

## Analytics and Tracking

### Event Tracking
```typescript
// Track calculator usage
const trackCalculatorClick = (calculatorName: string) => {
  gtag('event', 'calculator_click', {
    calculator_name: calculatorName,
    page_location: window.location.href
  });
};

// Track category navigation
const trackCategoryClick = (categoryName: string) => {
  gtag('event', 'category_click', {
    category_name: categoryName,
    page_location: window.location.href
  });
};
```

### Conversion Goals
- Calculator page visits
- Time spent on calculators
- Search usage
- Category exploration
- Return visits

## Content Strategy

### Localized Content
- Region-specific examples in calculators
- Local currency formats
- Cultural references in copy
- Legal compliance per country

### SEO Content
- Calculator descriptions optimized for search
- FAQ content targeting long-tail keywords
- Blog integration for educational content
- Internal linking strategy

---

**Design Status:** ✅ Homepage layout specification complete with responsive design, SEO optimization, and accessibility guidelines

**Implementation Priority:** High - Homepage is the primary entry point for users and SEO
