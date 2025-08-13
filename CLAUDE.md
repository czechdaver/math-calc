# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Always read this file before making any changes.**

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
│   ├── app/[locale]/          # Internationalized App Router pages
│   │   ├── calculator/        # Calculator routes organized by category
│   │   │   ├── bmi*/         # BMI calculator variants
│   │   │   ├── finance/      # Financial calculators (roi, npv, compound-interest, etc.)
│   │   │   ├── health/       # Health calculators (bmr, calories, ideal-weight, etc.)
│   │   │   ├── construction/ # Construction tools (concrete, materials, etc.)
│   │   │   ├── percentages/  # Percentage calculators
│   │   │   └── practical/    # Everyday tools (currency, discount, fuel, etc.)
│   │   └── [other pages]/    # Contact, privacy, cookies, etc.
│   ├── components/
│   │   ├── calculators/      # Calculator components with comprehensive suite
│   │   │   ├── enhanced/     # Enhanced UI calculator variants
│   │   │   ├── shared/       # Shared calculator components
│   │   │   └── __tests__/    # Calculator unit tests
│   │   ├── ui/               # Reusable UI components (Button, Card, etc.)
│   │   ├── navigation/       # Navigation components
│   │   └── layout/           # Layout components
│   ├── messages/             # i18n translation files (cs.json, en.json)
│   ├── lib/                  # Utilities and configurations
│   ├── utils/                # Utility functions with tests
│   ├── i18n/                 # i18n configuration files
│   ├── types/                # TypeScript type definitions
│   └── styles/               # Global styles
├── docs/                     # Documentation
├── jest.config.js            # Jest testing configuration  
├── jest.setup.js             # Jest testing setup
└── public/                   # Static assets
```

### Recent Major Changes (Document for Context)
1. **✅ Localization Consolidated**: Removed duplicate i18n config files (`i18n.js`, `next-intl.config.ts`)
2. **✅ Cleanup Completed**: Removed all `.bak`, `.obsolete`, and `-new` duplicate directories
3. **✅ Dependencies Organized**: Moved from custom `strictDependencies` to standard npm structure  
4. **✅ Console Logging**: Replaced debug logs with proper error handling
5. **✅ TypeScript**: Prepared for gradual strict mode implementation
6. **✅ Testing Framework**: Jest configured with Next.js integration and comprehensive test patterns

## 📋 Key Files & Their Purposes

### Configuration Files
- **`i18n.ts`** - Single source of truth for internationalization
- **`next.config.mjs`** - Next.js configuration with next-intl (ESM format)
- **`package.json`** - Dependencies and scripts configuration
- **`tsconfig.json`** - TypeScript config with strict mode prepared
- **`jest.config.js`** - Jest testing configuration with Next.js integration
- **`jest.setup.js`** - Jest setup for testing environment

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
- **✅ Consult** `docs/reference/coding-standards.md` for dependency management rules

## 🧪 Testing Architecture & Guidelines  

### Jest Configuration
The project uses Jest with Next.js integration (`jest.config.js`):
- **Test Environment**: jsdom for React component testing
- **Module Mapping**: `@/` aliases to `src/` directory
- **Setup Files**: `jest.setup.js` for global test configuration
- **Coverage**: Configured but disabled by default
- **Watch Plugins**: TypeAhead for filename and test name filtering

### Testing Patterns
```typescript
// Component Testing Pattern
import { render, screen, fireEvent } from '@testing-library/react';
import BMICalculator from '../BMICalculator';

describe('BMICalculator', () => {
  it('calculates BMI correctly', () => {
    render(<BMICalculator />);
    // Test implementation...
  });
});

// Utility Testing Pattern  
import { calculateBMI } from '../../utils/calculatorUtils';

describe('calculateBMI', () => {
  it('returns correct BMI value', () => {
    expect(calculateBMI(70, 175)).toBeCloseTo(22.86, 2);
  });
});
```

### Test Organization
- **Component tests**: `src/components/**/__tests__/`
- **Utility tests**: `src/utils/__tests__/` 
- **Integration tests**: `src/__tests__/`

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

## 🔧 Common Development Commands

### Essential Commands
```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Testing
npm test                 # Run Jest test suite
npm test -- --watch     # Run tests in watch mode
npm test -- --coverage  # Run tests with coverage report

# Type Checking
npx tsc --noEmit        # Type check without emitting files

# Building
npm run build           # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint -- --fix  # Fix linting issues automatically
```

### Build Testing
```bash
# Always verify the build works
npm run build
npm start
```

### Running Single Tests
```bash
# Run specific test file
npm test -- src/components/calculators/__tests__/BMICalculator.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="BMI"
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
5. **✅ Testing**: Unit tests pass (`npm test`)
6. **✅ Type Safety**: No TypeScript errors (`npx tsc --noEmit`)
7. **✅ Code Quality**: Linting passes (`npm run lint`)
8. **✅ Build**: Project builds and runs correctly (`npm run build && npm start`)
9. **✅ Documentation**: Updated if architecture changed

## 📚 Documentation Navigation

This project has extensive documentation in the `/docs` directory. **Use these resources proactively for complex tasks:**

### Essential References for AI Development

#### **High-Priority Documentation** (Read when relevant):
- **`docs/development/troubleshooting-guide.md`** - Critical Next.js 15 + next-intl solutions, debugging patterns
- **`docs/reference/coding-standards.md`** - Dependency management rules, coding patterns  
- **`docs/calculator-specification.md`** - Technical specs for all calculator types
- **`docs/reference/testing-guide.md`** - Testing methodologies and patterns

#### **Architecture & Implementation Guidance**:
- **`docs/development/README.md`** - Core development principles and patterns
- **`docs/reference/state-management.md`** - Application state patterns
- **`docs/reference/api-documentation.md`** - Complete API reference
- **`docs/design/ui-components.md`** - Reusable component library guide

#### **Quick Reference Index**:
- **`docs/_INDEX.md`** - Complete documentation navigation (start here for complex tasks)
- **`docs/development/localization-status.md`** - i18n implementation progress
- **`docs/migration/URL_MIGRATION_MAP.md`** - Route mapping for changes

### When to Consult Documentation

| Task Type | Primary References |
|-----------|-------------------|
| **Bug Fixes** | `troubleshooting-guide.md`, `coding-standards.md` |
| **New Calculator** | `calculator-specification.md`, `development/README.md` |
| **UI Components** | `design/ui-components.md`, `design/style-guide.md` |
| **Testing Issues** | `reference/testing-guide.md`, `troubleshooting-guide.md` |
| **Architecture Changes** | `reference/state-management.md`, `reference/api-documentation.md` |
| **Localization** | `development/localization-status.md` |

### Documentation Best Practices
- **Read relevant docs BEFORE implementing** complex features
- **Update documentation** when making architectural changes  
- **Reference specific sections** like `troubleshooting-guide.md#css-tailwind-compilation-issues`
- **Use `docs/_INDEX.md`** as a navigation hub for complex tasks

## 🤖 AI-Specific Notes

### Context Window Management  
- **This file (CLAUDE.md) contains the most critical context**
- **Consult documentation files proactively** for complex implementations
- **Don't assume patterns** - verify against actual documentation
- **Use docs/_INDEX.md** to navigate extensive documentation efficiently

### Code Analysis Approach
1. **Understand the request**
2. **Consult relevant documentation** (see Documentation Navigation above)
3. **Check existing patterns** in codebase
4. **Choose the simplest approach** (per project philosophy)
5. **Implement with proper error handling** (see troubleshooting-guide.md)
6. **Follow coding standards** (see reference/coding-standards.md)
7. **Test implementation** (see reference/testing-guide.md)
8. **Update documentation if needed**

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