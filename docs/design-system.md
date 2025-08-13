# MathCalc Pro - Design System Documentation

## 🎨 Design System Overview

The MathCalc Pro design system is built around the **Enhanced UI Theme** established by the Homepage and BMI-v3 calculator patterns. This system provides consistent, accessible, and beautiful components for rapid calculator development.

## 🎯 Design Philosophy

### Core Principles

1. **Simplicity Over Complexity**
   - Always choose the simplest solution that meets requirements
   - Minimize cognitive load for users
   - Clear, intuitive interfaces

2. **Consistency & Predictability**
   - Unified color theming across all components
   - Consistent spacing and typography scales
   - Predictable interaction patterns

3. **Accessibility First**
   - WCAG 2.1 AA compliance
   - Keyboard navigation support
   - Screen reader friendly
   - High contrast ratios

4. **Performance & Responsiveness**
   - Mobile-first design approach
   - Fast loading times
   - Smooth animations and transitions
   - Optimized for touch interactions

## 🎨 Color System

### Theme Colors

The design system supports 7 primary color themes, each with comprehensive shade variations:

```css
/* Available Color Themes */
- blue    (Primary - Default)
- green   (Success, Nature)
- amber   (Warning, Attention)
- yellow  (Caution, Highlight)  
- red     (Error, Danger)
- violet  (Creative, Premium)
- indigo  (Professional, Tech)
```

### Color Application

**Blue Theme** - Default, primary actions, navigation
- Use for: Primary buttons, links, form focus states
- Variables: `--enhanced-blue-50` through `--enhanced-blue-700`

**Green Theme** - Success, positive values, nature-related calculators
- Use for: Success messages, positive results, health calculators
- Variables: `--enhanced-green-50` through `--enhanced-green-700`

**Amber Theme** - Warnings, important information
- Use for: Warning messages, important disclaimers, attention-grabbing elements
- Variables: `--enhanced-amber-50` through `--enhanced-amber-700`

## 📐 Spacing System

### Design Tokens

```css
--calc-spacing-xs: 0.25rem;    /* 4px - Tight spacing */
--calc-spacing-sm: 0.5rem;     /* 8px - Small gaps */
--calc-spacing-md: 1rem;       /* 16px - Standard spacing */
--calc-spacing-lg: 1.5rem;     /* 24px - Section spacing */
--calc-spacing-xl: 2rem;       /* 32px - Large sections */
--calc-spacing-2xl: 3rem;      /* 48px - Page sections */
```

### Usage Guidelines

- **xs (4px)**: Icon padding, badge padding
- **sm (8px)**: Button padding, small gaps
- **md (16px)**: Standard component margins, form field spacing
- **lg (24px)**: Section padding, card internal spacing
- **xl (32px)**: Component margins, large section padding
- **2xl (48px)**: Page section separation

## 🔤 Typography Scale

### Text Size Tokens

```css
--calc-text-xs: 0.75rem;       /* 12px - Captions, help text */
--calc-text-sm: 0.875rem;      /* 14px - Secondary text */
--calc-text-base: 1rem;        /* 16px - Body text */
--calc-text-lg: 1.125rem;      /* 18px - Large body, input text */
--calc-text-xl: 1.25rem;       /* 20px - Headings */
--calc-text-2xl: 1.5rem;       /* 24px - Section headings */
--calc-text-3xl: 1.875rem;     /* 30px - Page headings, results */
```

### Typography Hierarchy

1. **Page Title** (`calc-text-3xl`) - Main calculator title
2. **Section Headings** (`calc-text-2xl`) - Form sections, result sections
3. **Component Labels** (`calc-text-lg`) - Input labels, important text
4. **Body Text** (`calc-text-base`) - Descriptions, paragraphs
5. **Secondary Text** (`calc-text-sm`) - Help text, metadata
6. **Captions** (`calc-text-xs`) - Fine print, disclaimers

## 🎯 Component Guidelines

### CalculatorInput

**When to use:**
- Number inputs with validation
- Text inputs requiring enhanced styling
- Any input needing color theming

**Best Practices:**
```tsx
<CalculatorInput
  id="height"
  label="Výška"
  value={height}
  onChange={setHeight}
  placeholder="170"
  step="0.1"
  min="50"
  max="300"
  unit="cm"
  helpText="Zadejte svou výšku v centimetrech"
  labelIcon={Ruler}
  color="blue"
  quickAdjustSteps={[1, 5, 10]}
/>
```

**Color Assignment:**
- **Blue**: General numeric inputs, primary fields
- **Green**: Positive values, weight, money
- **Amber**: Important fields requiring attention
- **Red**: Error states, dangerous values

### CalculatorSelect

**When to use:**
- Country selection
- Unit selection  
- Calculation method selection
- Any predefined option list

**Best Practices:**
```tsx
<CalculatorSelect
  id="country"
  label="Země"
  value={country}
  onChange={setCountry}
  options={[
    { value: "cz", label: "Česká republika", description: "DPH 21%" },
    { value: "sk", label: "Slovensko", description: "DPH 20%" }
  ]}
  placeholder="Vyberte zemi"
  helpText="Vyberte zemi pro správnou sazbu DPH"
  labelIcon={Flag}
  color="indigo"
/>
```

### CalculatorToggle

**When to use:**
- Binary choices (Yes/No)
- Calculation direction (A→B, B→A)
- Mode selection with 2-4 options

**Best Practices:**
```tsx
<CalculatorToggle
  name="direction"
  label="Směr výpočtu"
  value={direction}
  onChange={setDirection}
  options={[
    { value: "base-to-total", label: "Bez DPH → S DPH" },
    { value: "total-to-base", label: "S DPH → Bez DPH" }
  ]}
  layout="vertical"
  color="amber"
/>
```

### CalculatorRange

**When to use:**
- Age input
- Percentage selection
- Any bounded numeric input with visual feedback

**Best Practices:**
```tsx
<CalculatorRange
  id="age"
  label="Věk"
  value={age}
  onChange={setAge}
  min={18}
  max={100}
  unit="let"
  helpText="Váš věk ovlivňuje metabolismus"
  color="green"
  formatValue={(value) => `${value} let`}
/>
```

### CalculatorResult

**When to use:**
- Displaying primary calculation results
- Showing formatted output with context
- Results requiring additional information

**Best Practices:**
```tsx
<CalculatorResult
  title="Váš BMI"
  value={result.bmi.toFixed(1)}
  description={result.category}
  formula={`BMI = ${weight} kg ÷ (${(height/100).toFixed(2)} m)² = ${result.bmi.toFixed(1)}`}
  additionalInfo={
    <div className="grid grid-cols-4 gap-3">
      {categories.map(cat => (
        <div key={cat.name} className={`enhanced-result-grid ${cat.color} ${isActive ? 'active' : ''}`}>
          <div className="font-bold">{cat.range}</div>
          <div className="text-xs">{cat.name}</div>
        </div>
      ))}
    </div>
  }
/>
```

### CalculatorChart

**When to use:**
- Investment growth visualization
- Loan amortization schedules
- Trend analysis
- Comparative data display

**Best Practices:**
```tsx
<CalculatorChart
  data={yearlyData}
  type="line"
  title="Vývoj investice v čase"
  height={300}
  color="blue"
  showValues={false}
  showLegend={true}
/>
```

### CalculatorDisclaimer

**When to use:**
- Legal disclaimers
- Important warnings
- Help information
- Usage instructions

**Types and Usage:**
```tsx
{/* Warning - Amber color, important notices */}
<CalculatorDisclaimer type="warning">
  Výsledky jsou pouze orientační.
</CalculatorDisclaimer>

{/* Info - Blue color, helpful information */}
<CalculatorDisclaimer type="info">
  Kalkulátor používá standardní WHO kategorie.
</CalculatorDisclaimer>

{/* Legal - Red color, legal notices */}
<CalculatorDisclaimer type="legal">
  Neneseme odpovědnost za investiční rozhodnutí.
</CalculatorDisclaimer>

{/* Help - Indigo color, usage instructions */}
<CalculatorDisclaimer type="help">
  Jak používat tento kalkulátor...
</CalculatorDisclaimer>
```

## 🏗️ Layout Patterns

### Enhanced Page Background

All calculators using `enhanced={true}` automatically get:
- Gradient background system
- Glass-morphism cards
- Consistent backdrop styling

```tsx
<SimpleCalculatorLayout enhanced={true}>
  {/* Automatically applies enhanced background */}
</SimpleCalculatorLayout>
```

### Form Layout Patterns

**Two-Column Grid:**
```tsx
<div className="calc-form-grid calc-form-grid-2">
  <CalculatorInput {...props1} />
  <CalculatorInput {...props2} />
</div>
```

**Section Grouping:**
```tsx
<div className="enhanced-section">
  <div className="enhanced-section-header">
    <Calculator className="w-5 h-5" />
    Základní parametry
  </div>
  {/* Form fields */}
</div>
```

### Result Display Patterns

**Grid Results:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  <div className="enhanced-result-grid blue">
    <div className="font-bold text-blue-600">{value}</div>
    <div className="text-xs text-gray-700">{label}</div>
  </div>
</div>
```

## 🎭 Animation & Transitions

### Standard Transitions

```css
--calc-transition-fast: 150ms ease-in-out;    /* Hover effects */
--calc-transition-normal: 200ms ease-in-out;  /* Standard interactions */
--calc-transition-slow: 300ms ease-in-out;    /* Complex animations */
```

### Usage Guidelines

- **Fast (150ms)**: Button hovers, input focus states
- **Normal (200ms)**: Card hovers, component state changes
- **Slow (300ms)**: Page transitions, complex animations

## 📱 Responsive Design

### Breakpoint Strategy

The design system follows a mobile-first approach:

1. **Mobile (default)**: Single column, touch-optimized
2. **Tablet (sm:)**: Two-column grids, larger touch targets
3. **Desktop (lg:)**: Full layouts, hover states, sidebars

### Component Responsiveness

**Form Grids:**
```tsx
{/* Automatically responsive */}
<div className="calc-form-grid calc-form-grid-2">
  {/* Single column on mobile, two columns on larger screens */}
</div>
```

**Charts:**
```tsx
<CalculatorChart
  height={300} // Automatically adjusts for mobile
  {...props}
/>
```

## ♿ Accessibility Guidelines

### Color Contrast

All color combinations meet WCAG 2.1 AA standards:
- Text on colored backgrounds: minimum 4.5:1 ratio
- UI components: minimum 3:1 ratio
- Focus indicators: minimum 3:1 ratio

### Keyboard Navigation

All components support:
- Tab navigation in logical order
- Enter/Space activation
- Escape key for modals/dropdowns
- Arrow keys for range inputs

### Screen Reader Support

- All inputs have proper labels
- Error messages are associated with fields
- Results have descriptive text
- Charts include data tables as fallback

## 🧪 Testing Guidelines

### Component Testing

Each component should be tested for:
1. **Functionality**: All props work as expected
2. **Accessibility**: Screen reader compatibility, keyboard navigation
3. **Responsiveness**: Works on all screen sizes
4. **Error States**: Handles invalid input gracefully

### Visual Testing

- Test all color theme combinations
- Verify spacing consistency
- Check typography hierarchy
- Validate responsive behavior

## 🚀 Implementation Checklist

### New Calculator Checklist

- [ ] Uses appropriate shared components
- [ ] Follows color theming guidelines
- [ ] Implements proper validation
- [ ] Includes accessibility features
- [ ] Has responsive design
- [ ] Uses consistent spacing
- [ ] Includes proper error handling
- [ ] Has appropriate animations
- [ ] Follows naming conventions
- [ ] Includes proper documentation

### Quality Gates

Before publishing any calculator:
1. **Visual Review**: Matches design system patterns
2. **Accessibility Audit**: WCAG compliance verified
3. **Responsive Test**: Works on mobile, tablet, desktop
4. **Performance Check**: Fast loading and smooth interactions
5. **Cross-browser Test**: Works in all supported browsers

---

This design system ensures that all MathCalc Pro calculators maintain the highest quality standards while enabling rapid development through reusable, well-documented components.