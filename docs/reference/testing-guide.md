---
title: Testing Guide
category: Reference
version: 1.2.0
updated: 2025-07-23
---

# UI Testing Plan

## Test Environment Setup
- Desktop: Chrome, Firefox, Safari, Edge (latest versions)
- Mobile: iOS Safari, Chrome for Android
- Tablet: iPadOS Safari, Android Chrome
- Screen sizes: 320px, 768px, 1024px, 1440px, and 1920px widths

## Test Cases

### 1. Navigation
- [ ] Main navigation menu works on all screen sizes
- [ ] Mobile menu toggles correctly
- [ ] All links in navigation direct to correct pages
- [ ] Active state highlights current page

### 2. Calculator Components
- [ ] All calculator forms load without errors
- [ ] Form validation works as expected
- [ ] Calculation results are accurate
- [ ] Responsive layout on all screen sizes
- [ ] Error messages are clear and helpful

#### Specific Calculators to Test:
- [ ] BMI Calculator
- [ ] DPH (VAT) Calculator
- [ ] Compound Interest Calculator
- [ ] Net Salary Calculator (Net Salary)
- [ ] Unit Converter
- [ ] Annuity Payment Calculator (Annuity Payment)
- [ ] Percentage Calculators
- [ ] Fractions Calculator

### 3. Responsive Design
- [ ] Layout adjusts properly on mobile, tablet, and desktop
- [ ] Text remains readable at all screen sizes
- [ ] Buttons and form elements are appropriately sized for touch on mobile
- [ ] No horizontal scrolling on mobile devices
- [ ] Images and media scale appropriately

### 4. Dark/Light Mode
- [ ] Theme toggles correctly between light and dark modes
- [ ] All text remains readable in both themes
- [ ] No contrast issues in either theme
- [ ] Theme preference persists across page refreshes

### 5. Accessibility
- [ ] All images have appropriate alt text
- [ ] Sufficient color contrast for text
- [ ] All interactive elements are keyboard accessible
- [ ] Proper heading hierarchy
- [ ] ARIA labels where appropriate

### 6. Performance
- [ ] Pages load within 3 seconds on 3G connection
- [ ] No JavaScript errors in console
- [ ] No 404 errors for assets
- [ ] Proper caching headers set

### 7. Cross-browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome for Android

## Testing Tools
- BrowserStack for cross-browser testing
- Lighthouse for performance, accessibility, and PWA testing
- WAVE for accessibility testing
- Google PageSpeed Insights for performance analysis

## Execution
1. Run automated tests
2. Perform manual testing on key user flows
3. Document any issues found
4. Prioritize and fix critical issues
5. Verify fixes and retest

## Issue Tracking
- Use GitHub Issues to track found issues
- Label issues with priority (High, Medium, Low)
- Include screenshots and reproduction steps for each issue
