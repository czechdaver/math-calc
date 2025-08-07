# CLAUDE.md - AI Development Guidelines

This file provides comprehensive guidelines for AI models (Claude, GPT, etc.) working on the MathCalc Pro project. **Always read this file before making any changes.**

## 🎯 Project Context & Philosophy

### What This Project Is
**MathCalc Pro** is a comprehensive calculator suite with 20+ specialized calculators, built with Next.js 15 and internationalization support. It serves Czech users primarily, with English translations.

### Core Philosophy: Simplicity Over Complexity
- **Always choose the simplest working solution**
- **Implement robust fallback mechanisms**
- **Prefer explicit code over clever abstractions**
- **Maintain backward compatibility**

## 🏗️ Current Architecture (As of Latest Cleanup)

### Project Structure
```
├── src/
│   ├── app/[locale]/          # Internationalized routes
│   │   └── calculator/        # Calculator pages (cleaned up duplicates)
│   ├── components/
│   │   └── calculators/       # Calculator components
│   ├── messages/              # i18n files (cs.json, en.json)
│   ├── i18n/                  # i18n configuration (consolidated)
│   └── lib/                   # Utilities
├── docs/                      # Documentation (this file)
└── public/                    # Static assets
```

### Recent Major Changes (Document for Context)
1. **✅ Localization Consolidated**: Removed duplicate i18n config files (`i18n.js`, `next-intl.config.ts`)
2. **✅ Cleanup Completed**: Removed all `.bak`, `.obsolete`, and `-new` duplicate directories
3. **✅ Dependencies Organized**: Moved from custom `strictDependencies` to standard npm structure
4. **✅ Console Logging**: Replaced debug logs with proper error handling
5. **✅ TypeScript**: Prepared for gradual strict mode implementation

## 📋 Key Files & Their Purposes

### Configuration Files
- **`i18n.ts`** - Single source of truth for internationalization
- **`next.config.js`** - Next.js configuration with next-intl
- **`package.json`** - Cleaned up dependencies structure
- **`tsconfig.json`** - TypeScript config (strict mode planned)

### Critical Components
- **`src/components/calculators/CalculatorBase.tsx`** - Base calculator component
- **`src/app/[locale]/layout.tsx`** - Main layout with proper error handling
- **`src/messages/cs.json`** & **`src/messages/en.json`** - Translation files

## 🛠️ Development Rules for AI

### 1. Before Making Changes
- **✅ Always read this file first**
- **✅ Check existing patterns in the codebase**
- **✅ Look for similar implementations before creating new ones**
- **✅ Verify the change aligns with simplicity philosophy**

### 2. Code Standards
```typescript
// ✅ GOOD: Simple, explicit, with fallbacks
const validLocale = locale && locales.includes(locale) ? locale : 'cs';

// ❌ BAD: Clever but fragile
const validLocale = locales.find(l => l === locale) ?? 'cs';
```

### 3. Error Handling Pattern
```typescript
// ✅ GOOD: Development vs production logging
if (process.env.NODE_ENV !== 'production') {
  console.error('Debug info:', error);
}
// Always provide user-friendly fallback
```

### 4. File Naming Conventions
- **Calculator components**: `[Name]Calculator.tsx` (e.g., `BMICalculator.tsx`)
- **Pages**: Follow Next.js conventions in `app/[locale]/calculator/[name]/page.tsx`
- **No backup files**: Never create `.bak`, `.new`, or similar files

## 🌐 Internationalization Rules

### Translation Structure
```json
{
  "calculators": {
    "bmi": {
      "title": "BMI Calculator",
      "height_label": "Height (cm)",
      "weight_label": "Weight (kg)",
      "calculate": "Calculate",
      "result": "Your BMI is {bmi}"
    }
  }
}
```

### Component Translation Usage
```typescript
// ✅ GOOD: Proper t() usage with fallbacks
const t = useTranslations('calculators.bmi');
<Label>{t('height_label')}</Label>

// ✅ GOOD: With fallback for new keys
<Label>{t('height_label', {fallback: 'Height'})}</Label>
```

### Locale Handling
- **Primary locale**: `cs` (Czech)
- **Secondary locale**: `en` (English)
- **Always provide fallbacks** to prevent 404s

## 🧮 Calculator Development Pattern

### 1. Standard Calculator Structure
```typescript
interface CalculatorProps {
  // Keep props minimal and typed
}

export default function ExampleCalculator() {
  const t = useTranslations('calculators.example');
  
  // Use useState for local state
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  
  const handleCalculate = () => {
    try {
      // Calculation logic with error handling
      const calculatedResult = performCalculation(values);
      setResult(calculatedResult);
    } catch (error) {
      // Proper error handling
      if (process.env.NODE_ENV !== 'production') {
        console.error('Calculation error:', error);
      }
      setResult({ error: t('calculation_error') });
    }
  };
  
  return (
    // JSX with proper accessibility
  );
}
```

### 2. Page Structure for Calculators
```typescript
// src/app/[locale]/calculator/[name]/page.tsx
export default function ExamplePage() {
  return (
    <SimpleCalculatorLayout
      title={t('calculators.example.title')}
      description={t('calculators.example.description')}
    >
      <ExampleCalculator />
    </SimpleCalculatorLayout>
  );
}
```

## 🚨 Common Pitfalls to Avoid

### 1. Don't Create Duplicates
- **❌ Never create** `-new`, `-test`, or `.bak` files
- **✅ Always edit** existing files or create properly named new ones
- **✅ Check** if similar functionality already exists

### 2. Don't Break i18n
- **❌ Never hardcode** text in components
- **✅ Always use** `t()` function for user-facing text
- **✅ Add** new translation keys to both `cs.json` and `en.json`

### 3. Don't Ignore Error Handling
- **❌ Never assume** user input is valid
- **✅ Always validate** inputs before processing
- **✅ Always provide** user-friendly error messages

### 4. Don't Overcomplicate
- **❌ Don't** create abstractions until you need them
- **✅ Do** solve the immediate problem simply
- **✅ Do** add complexity only when it provides clear value

## 📊 Testing Guidelines

### Manual Testing Checklist
```bash
# Always test these routes after changes
curl -I http://localhost:3000/
curl -I http://localhost:3000/cs
curl -I http://localhost:3000/en
curl -I http://localhost:3000/cs/calculator/bmi

# Verify no console errors in browser
# Test calculator functionality
# Test language switching
```

### Build Testing
```bash
# Always verify the build works
npm run build
npm start
```

## 🔄 When Updating Documentation

### This File (CLAUDE.md)
- **Update architecture changes**
- **Document new patterns**
- **Update pitfalls based on experience**
- **Keep examples current**

### Other Documentation
- **Update** `README.md` for user-facing changes
- **Update** calculator specifications for new calculators
- **Keep** troubleshooting guide current with new issues

## 🎯 Success Criteria for Changes

Before considering any change complete:

1. **✅ Functionality**: Feature works as intended
2. **✅ Simplicity**: Solution is as simple as possible
3. **✅ Robustness**: Includes proper error handling
4. **✅ Consistency**: Follows existing patterns
5. **✅ Documentation**: Updated if architecture changed
6. **✅ Testing**: Manual testing completed
7. **✅ Build**: Project builds and runs correctly

## 🤖 AI-Specific Notes

### Context Window Management
- **This file contains the most critical context**
- **Refer to specific documentation files as needed**
- **Don't assume patterns that aren't documented**

### Code Analysis Approach
1. **Understand the request**
2. **Check existing patterns**
3. **Choose the simplest approach**
4. **Implement with error handling**
5. **Test manually**
6. **Update documentation if needed**

### Communication with User
- **Be explicit about changes made**
- **Explain architectural decisions**
- **Point out potential issues**
- **Suggest testing approaches**

---

## 📈 Project Evolution

This project follows an iterative improvement approach:
- **Phase 1**: ✅ Core functionality (completed)
- **Phase 2**: ✅ Code cleanup (completed)  
- **Phase 3**: 🔄 Documentation optimization (in progress)
- **Phase 4**: ⏳ Performance optimization
- **Phase 5**: ⏳ Feature expansion

Remember: **The best code is code that works reliably and can be easily understood by both humans and AI.**