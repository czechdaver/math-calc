# MathCalc Pro - Calculator Specifications

This document outlines the specifications and requirements for all calculators in the MathCalc Pro application.

## Table of Contents
1. [General Requirements](#general-requirements)
2. [Calculator Types](#calculator-types)
3. [Common Features](#common-features)
4. [Performance Requirements](#performance-requirements)
5. [Localization](#localization)
6. [Accessibility](#accessibility)
7. [Error Handling](#error-handling)
8. [SEO Requirements](#seo-requirements)

## General Requirements

- All calculators must be client-side rendered for optimal performance
- Must support both light and dark themes
- Must be fully responsive (mobile, tablet, desktop)
- Must include proper loading states and error boundaries
- Must support internationalization (i18n)
- Must be accessible (WCAG 2.1 AA compliant)

## Calculator Types

### 1. Percentage Calculators
- **Percentage of a Number** (`/procenta/procento-z-cisla`)
  - Input: Number, Percentage
  - Output: Calculated percentage of the number
  - Formula: `result = (percentage / 100) * number`

- **Percentage Increase/Decrease** (`/procenta/prirazka-sleva`)
  - Input: Original Number, Percentage, Operation (Increase/Decrease)
  - Output: New value after percentage change
  - Formula: 
    - Increase: `result = original * (1 + percentage/100)`
    - Decrease: `result = original * (1 - percentage/100)`

- **Percentage Difference** (`/procenta/rozdil-v-procentech`)
  - Input: Original Value, New Value
  - Output: Percentage difference between values
  - Formula: `result = ((new - original) / original) * 100`

### 2. Unit Converters
- **Length Converter** (`/prevody/delka`)
  - Supported units: mm, cm, m, km, in, ft, yd, mi
  - Must support bidirectional conversion

- **Weight Converter** (`/prevody/vaha`)
  - Supported units: mg, g, kg, t, oz, lb, st
  - Must support bidirectional conversion

- **Temperature Converter** (`/prevody/teplota`)
  - Supported units: °C, °F, K
  - Must support bidirectional conversion

- **Volume Converter** (`/prevody/objem`)
  - Supported units: ml, cl, l, m³, in³, ft³, gal (US), gal (UK)
  - Must support bidirectional conversion

### 3. Basic Math Calculators
- **Basic Calculator** (`/zakladni/kalkulacka`)
  - Operations: +, -, *, /, %, ±, ., =
  - Memory functions: M+, M-, MR, MC
  - Must handle order of operations (PEMDAS)

- **Fraction Calculator** (`/zakladni/zlomky`)
  - Support for mixed numbers and improper fractions
  - Operations: +, -, *, /
  - Simplification to lowest terms

## Common Features

### Input Validation
- All inputs must be validated before processing
- Display clear error messages for invalid inputs
- Prevent invalid characters in number inputs

### History
- Maintain calculation history (last 5 calculations)
- Allow recalling previous calculations
- Clear history functionality

### Copy to Clipboard
- One-click copy of results
- Visual feedback when copied
- Accessible button with proper ARIA labels

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly controls

## Performance Requirements

### Loading
- Initial load under 2 seconds on 3G
- Subsequent interactions should feel instant (<100ms)
- Use code splitting for calculator components

### Bundle Size
- Each calculator should be independently loadable
- Shared dependencies should be properly code-split
- Total JS bundle < 100KB gzipped per page

### Caching
- Cache calculation results when appropriate
- Use browser caching for static assets
- Implement service worker for offline functionality

## Localization

### Supported Languages
- Czech (cs) - Primary
- English (en) - Secondary
- More languages can be added in the future

### Translation Keys
All UI text must use translation keys from the i18n system
Common keys should be consistent across all calculators

## Accessibility

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order
- Skip to main content links

### Screen Readers
- Proper ARIA attributes
- Live regions for dynamic content
- Descriptive labels for all controls

### Color Contrast
- Minimum contrast ratio of 4.5:1 for normal text
- 3:1 for large text
- Color should not be the only means of conveying information

## Error Handling

### Input Errors
- Clear, specific error messages
- Error messages should be translatable
- Visual indicators for problematic inputs

### Calculation Errors
- Handle division by zero
- Handle overflow/underflow
- Handle invalid operations

### Network Errors
- Graceful degradation when offline
- Clear messaging for network-related issues
- Automatic retry mechanism

## SEO Requirements

### Meta Information
- Unique, descriptive title for each calculator
- Meta description including key functionality
- Canonical URLs

### Structured Data
- JSON-LD for each calculator type
- Breadcrumb navigation
- FAQ schema where applicable

### Performance
- Lazy loading of non-critical resources
- Optimized images and assets
- Fast First Contentful Paint (FCP) and Largest Contentful Paint (LCP)

## Implementation Notes

### Component Structure
```
components/
  calculators/
    common/
      CalculatorLayout.tsx
      InputField.tsx
      ResultDisplay.tsx
      HistoryPanel.tsx
    percentage/
      PercentageOfNumber.tsx
      PercentageChange.tsx
    unit-converters/
      LengthConverter.tsx
      WeightConverter.tsx
```

### State Management
- Use React hooks for local state
- Consider Context API for shared state
- Keep state as local as possible

### Testing
- Unit tests for all calculation logic
- Integration tests for user flows
- Visual regression testing
- Cross-browser testing

### Analytics
- Track calculator usage
- Monitor performance metrics
- Error tracking and reporting
