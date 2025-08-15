# Calculator Development Patterns

This document outlines the proven patterns and components developed during the foundation-first approach to MathCalc Pro. These patterns provide templates for efficiently developing the remaining 16+ calculators.

## 📋 Pattern Summary

Based on our four prototype calculators, we've established **4 distinct patterns** that can be replicated across all calculator development:

1. **Simple Form Pattern** (VAT Calculator)
2. **Complex Multi-Section Pattern** (Net Salary Calculator) 
3. **Data Visualization Pattern** (Compound Interest Calculator)
4. **Category-Based Selection Pattern** (Unit Converter Calculator)

## 🎨 Enhanced Design System

### Color Themes
All calculators use a **7-color theme system**:
- **Blue** (primary) - General purpose calculators
- **Green** - Financial/money calculators 
- **Amber** - Construction/building calculators
- **Violet** - Conversion/utility calculators
- **Red** - Health/medical calculators
- **Yellow** - Time/date calculators
- **Indigo** - Advanced/scientific calculators

### Component Library
- **Cards**: Primary content containers with gradient backgrounds
- **Buttons**: Consistent styling with hover effects
- **Inputs**: Standardized form controls with validation
- **Select**: Dropdown components with enhanced UX
- **Labels**: Consistent typography and spacing
- **Badges**: Status and category indicators

## 🔧 Pattern 1: Simple Form Pattern

**Use Case**: Basic calculations with 2-4 inputs and single result
**Example**: VAT Calculator, Basic BMI, Simple Percentage

### Component Structure
```tsx
<Card className="bg-gradient-to-r from-theme-50 to-theme-100 border-theme-200">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-theme-700">
      <Icon className="h-5 w-5" />
      {title}
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* 2-4 input fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input /> <Select />
    </div>
    
    {/* Action buttons */}
    <div className="flex gap-3">
      <Button className="flex-1 bg-theme-600 hover:bg-theme-700">
        <Calculator className="mr-2 h-4 w-4" />
        Calculate
      </Button>
      <Button variant="outline">Reset</Button>
    </div>
  </CardContent>
</Card>

{/* Results */}
{result && (
  <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
    <ResultDisplay />
  </Card>
)}
```

### Key Features
- **Toggle functionality** (VAT add/remove)
- **Multi-country support** with different rates
- **Real-time validation** with error states
- **Quick action buttons** for common scenarios

### Bundle Size: ~600-700B
### Development Time: 2-3 hours

---

## 🔧 Pattern 2: Complex Multi-Section Pattern  

**Use Case**: Calculations requiring multiple input sections and complex validation
**Example**: Net Salary, Loan Calculator, Insurance Calculator

### Component Structure
```tsx
<div className="space-y-6">
  {/* Section 1: Basic Information */}
  <Card className="bg-gradient-to-r from-theme-50 to-theme-100">
    <CardHeader>
      <CardTitle>Basic Information</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Multiple inputs with validation */}
      </div>
    </CardContent>
  </Card>

  {/* Section 2: Advanced Options */}
  <Card>
    <CardHeader>
      <CardTitle>Advanced Options</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {/* Complex controls, checkboxes, sliders */}
      </div>
    </CardContent>
  </Card>

  {/* Section 3: Results with Breakdown */}
  {result && (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>{/* Main result */}</div>
          <div>{/* Detailed breakdown */}</div>
        </div>
      </CardContent>
    </Card>
  )}
</div>
```

### Key Features
- **Sectioned forms** with logical grouping
- **Advanced validation** with field dependencies  
- **Progressive disclosure** for advanced options
- **Detailed result breakdown** with multiple metrics
- **Real-time calculation** as user types

### Bundle Size: ~800-900B
### Development Time: 4-6 hours

---

## 🔧 Pattern 3: Data Visualization Pattern

**Use Case**: Calculations that benefit from charts and graphs
**Example**: Compound Interest, Investment Growth, Loan Amortization

### Component Structure
```tsx
<div className="space-y-6">
  {/* Input Section */}
  <Card className="bg-gradient-to-r from-theme-50 to-theme-100">
    <CardContent>
      {/* Input controls */}
    </CardContent>
  </Card>

  {/* Results with Charts */}
  {result && (
    <>
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-green-700">
              {mainResult}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <CalculatorChart
            data={chartData}
            type="line"
            xKey="year"
            yKey="value"
            theme="green"
          />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* Detailed data breakdown */}
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )}
</div>
```

### Key Features
- **CalculatorChart component** with line/bar/pie support
- **Interactive data tables** with year-by-year breakdown
- **Multiple chart types** based on data structure
- **Time-series calculations** with compound effects
- **Export functionality** for data and charts

### Bundle Size: ~1.1-1.3kB (includes chart library)
### Development Time: 5-8 hours

---

## 🔧 Pattern 4: Category-Based Selection Pattern

**Use Case**: Calculators with multiple categories or modes of operation
**Example**: Unit Converter, Currency Converter, Time Zone Calculator

### Component Structure
```tsx
<div className="space-y-6">
  {/* Category Selection */}
  <Card className="bg-gradient-to-r from-theme-50 to-theme-100">
    <CardHeader>
      <CardTitle>Category Selection</CardTitle>
    </CardHeader>
    <CardContent>
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        {Object.entries(CATEGORIES).map(([key, category]) => (
          <SelectItem key={key} value={key}>
            {category.name}
          </SelectItem>
        ))}
      </Select>
    </CardContent>
  </Card>

  {/* Dynamic Input Section */}
  <Card>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <Input /> {/* Value */}
        <Select /> {/* From unit */}
        <Button variant="outline" onClick={handleSwap}>
          <ArrowRightLeft />
        </Button>
        <Select /> {/* To unit */}
        <Button>Convert</Button>
      </div>
    </CardContent>
  </Card>

  {/* Results */}
  {result && (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
      <CardContent>
        {/* Main result */}
        {/* Formula display */}
        {/* Quick conversions */}
      </CardContent>
    </Card>
  )}
</div>
```

### Key Features
- **Dynamic categories** with different unit sets
- **Special conversion logic** (e.g., temperature formulas)
- **Unit swapping functionality** 
- **Formula explanations** with step-by-step breakdown
- **Quick conversion suggestions** for common units

### Bundle Size: ~900B-1.1kB
### Development Time: 4-6 hours

---

## 🚀 Implementation Guidelines

### 1. Choose the Right Pattern

| Calculator Type | Recommended Pattern | Theme Color |
|----------------|-------------------|-------------|
| Basic percentage, simple math | Pattern 1 (Simple Form) | Blue |
| Financial calculations | Pattern 2 (Complex Multi-Section) | Green |
| Investment, growth analysis | Pattern 3 (Data Visualization) | Green |
| Unit conversions | Pattern 4 (Category-Based) | Violet |
| Health metrics | Pattern 1 or 2 | Red |
| Construction calculations | Pattern 2 | Amber |
| Time/date calculations | Pattern 1 or 4 | Yellow |

### 2. Development Checklist

#### Phase 1: Setup (30 min)
- [ ] Choose appropriate pattern and theme color
- [ ] Create component file in `src/components/calculators/enhanced/`
- [ ] Create page file in `src/app/[locale]/calculator/[slug]/page.tsx`
- [ ] Add translations to `cs.json` and `en.json`

#### Phase 2: Implementation (2-6 hours based on pattern)
- [ ] Implement core calculation logic
- [ ] Add input validation and error handling
- [ ] Style with chosen theme colors
- [ ] Add accessibility attributes
- [ ] Implement responsive design

#### Phase 3: Testing (30 min)
- [ ] Test calculation accuracy
- [ ] Test error states and edge cases
- [ ] Test responsive behavior
- [ ] Test internationalization
- [ ] Verify build optimization

### 3. Code Standards

#### Naming Conventions
```typescript
// Component naming
Enhanced[Name]Calculator.tsx

// Translation keys
calculators.[slug].title
calculators.[slug].description
calculators.[slug].[field_name]

// Theme classes
bg-gradient-to-r from-[theme]-50 to-[theme]-100
border-[theme]-200
text-[theme]-700
bg-[theme]-600 hover:bg-[theme]-700
```

#### Error Handling Pattern
```typescript
const handleCalculate = () => {
  try {
    // Validation
    if (!inputValue || isNaN(Number(inputValue))) {
      setError(t('invalid_input'));
      return;
    }
    
    // Calculation
    const result = performCalculation(values);
    setResult(result);
    setError(null);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Calculation error:', error);
    }
    setError(t('calculation_error'));
  }
};
```

#### Internationalization Pattern
```typescript
const t = useTranslations('calculators.[slug]');

<Label>{t('field_label', { fallback: 'Default Label' })}</Label>
<Button>{t('calculate', { fallback: 'Calculate' })}</Button>
```

### Formula Authoring (LaTeX + i18n)
See the Formula Authoring Guide: [docs/development/formula-authoring.md](./development/formula-authoring.md)

- Wrap natural language with `\text{...}` (e.g., `\text{With VAT}`, `\text{rate}`)
- Use `\dfrac` for display fractions
- Escape backslashes in JSON strings (e.g., "\\dfrac{...}{...}")
- Read localized LaTeX from messages and provide safe fallbacks in components

## 📊 Performance Metrics

Our established patterns deliver excellent performance:

| Pattern | Bundle Size | First Load | Build Time | Development Time |
|---------|-------------|------------|------------|------------------|
| Simple Form | ~600-700B | ~115kB | <5s | 2-3 hours |
| Complex Multi-Section | ~800-900B | ~115kB | <5s | 4-6 hours |  
| Data Visualization | ~1.1-1.3kB | ~175kB | <10s | 5-8 hours |
| Category-Based | ~900B-1.1kB | ~178kB | <5s | 4-6 hours |

## 🎯 Success Criteria

Each calculator following these patterns should achieve:

1. **✅ Functionality**: Accurate calculations with proper validation
2. **✅ Performance**: <1.5kB bundle size, <200kB total load
3. **✅ UX**: Responsive design, clear error states, intuitive flow
4. **✅ Accessibility**: Proper ARIA labels, keyboard navigation
5. **✅ SEO**: Optimized metadata, structured data
6. **✅ i18n**: Full Czech and English translation support
7. **✅ Quality**: TypeScript strict mode, no console errors

## 🔄 Next Steps

With these patterns established, the remaining calculators can be developed efficiently:

### Priority 1 (High Traffic - Simple Form Pattern)
- Basic Percentage Calculator
- Simple Interest Calculator  
- Tip Calculator
- Currency Converter

### Priority 2 (Complex Features - Multi-Section Pattern)
- Mortgage Calculator
- Loan Amortization Calculator
- Tax Calculator
- Insurance Premium Calculator

### Priority 3 (Visualization - Data Visualization Pattern)
- Investment Portfolio Calculator
- Retirement Planning Calculator
- Savings Goal Calculator

### Priority 4 (Specialized - Category-Based Pattern)
- Scientific Calculator
- Programming Calculator (Hex/Binary/Octal)
- Time Zone Calculator

Each calculator can now be developed in **1-2 days** using these proven patterns, compared to the **1-2 weeks** it would have taken without this foundation-first approach.

---

*This pattern documentation completes the foundation-first development methodology for MathCalc Pro. All global components, infrastructure, and proven patterns are now ready for efficient mass calculator development.*