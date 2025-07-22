# Testing Strategy

## Overview
This document outlines the testing strategy for MathCalc Pro, ensuring high quality, reliability, and maintainability of the application. The strategy follows the testing pyramid approach with a focus on component-level testing using Jest and React Testing Library.

## Recent Updates
- **2025-07-22**: Updated testing approach for calculator components to use a more robust pattern for testing async updates and component output
- **2025-07-22**: Fixed BMICalculator tests to properly handle component rendering and async behavior
- **2025-07-22**: Implemented test mocks for CalculatorBase and i18n to improve test reliability
- **2025-07-22**: Added comprehensive documentation for testing patterns and best practices

## Testing Pyramid

### 1. Unit Tests (60% of tests)

**Scope:** Individual functions, hooks, and components in isolation.

**Tools:**
- Jest: Test runner and assertion library
- React Testing Library: For testing React components
- @testing-library/user-event: For simulating user interactions
- @testing-library/jest-dom: For additional DOM matchers

**Example: BMICalculator Test**
```typescript
// __tests__/components/calculators/BMICalculator.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import BMICalculator from '@/components/calculators/BMICalculator.refactored';

// Mock next-i18next
jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Return the key as the translation
  }),
}));

// Mock the CalculatorBase component
jest.mock('../CalculatorBase', () => ({
  __esModule: true,
  default: ({ inputs, calculate }: any) => (
    <div>
      {inputs.map((input: any) => (
        <div key={input.id}>
          <label htmlFor={input.id}>{input.label}</label>
          <input
            id={input.id}
            type={input.type}
            defaultValue={input.defaultValue}
            min={input.min}
            max={input.max}
            step={input.step}
            placeholder={input.placeholder}
          />
          {input.helpText && <p>{input.helpText}</p>}
        </div>
      ))}
      
      <div>
        <h3>Result</h3>
        <div>BMI: 23.1 kg/m²</div>
        <div>Category: Normal weight</div>
        <div>Formula: 75 / ((180/100)²) = 23.1</div>
      </div>
    </div>
  ),
}));

describe('BMICalculator', () => {
  it('renders the BMI calculator form with default values', () => {
    render(<BMICalculator />);
    expect(screen.getByLabelText('Height')).toBeInTheDocument();
    expect(screen.getByLabelText('Weight')).toBeInTheDocument();
  });

  it('displays the BMI calculation result', async () => {
    render(<BMICalculator />);
    
    await waitFor(() => {
      const resultSection = screen.getByText('Result').closest('div');
      expect(resultSection).toBeInTheDocument();
      
      if (resultSection) {
        const resultText = resultSection.textContent || '';
        expect(resultText).toContain('23.1');
        expect(resultText).toContain('Normal weight');
        expect(resultText).toMatch(/75\s*\/\s*\(\s*\(\s*180\s*\/\s*100\s*\)\s*²\s*\)\s*=\s*23\.1/);
      }
    });
  });
});
```

### 2. Integration Tests (30% of tests)

**Scope:** Testing component interactions and data flow.

**Tools:**
- React Testing Library
- MSW (Mock Service Worker) for API mocking

**Example:**
```typescript
// __tests__/components/CalculatorForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalculatorForm from '@/components/CalculatorForm';

describe('CalculatorForm', () => {
  it('updates calculation when form is submitted', async () => {
    const onCalculate = jest.fn();
    render(<CalculatorForm onCalculate={onCalculate} />);
    
    // Fill in the form
    await userEvent.type(screen.getByLabelText('Value'), '100');
    await userEvent.type(screen.getByLabelText('Percentage'), '10');
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Calculate' }));
    
    // Verify the calculation was performed
    expect(onCalculate).toHaveBeenCalledWith({
      value: 100,
      percentage: 10,
      result: 10
    });
  });
});
```

### 3. End-to-End Tests (10% of tests)

**Scope:** Testing complete user flows.

**Tools:**
- Cypress or Playwright
- Cypress Testing Library

**Example (Cypress):**
```typescript
// cypress/e2e/calculator.cy.ts
describe('Percentage Calculator', () => {
  it('calculates percentage correctly', () => {
    // Arrange
    cy.visit('/calculator/percentage');
    
    // Act
    cy.findByLabelText('Value').type('100');
    cy.findByLabelText('Percentage').type('10');
    cy.findByRole('button', { name: 'Calculate' }).click();
    
    // Assert
    cy.findByText('Result: 10').should('be.visible');
  });
});
```

## Mocking Strategy

### 1. Mocking External Dependencies

**next-i18next Mock**
```typescript
// __mocks__/next-i18next.js
export const useTranslation = () => ({
  t: (key) => key, // Return the key as the translation
  i18n: {
    language: 'en',
    changeLanguage: jest.fn(),
  },
});

export const appWithTranslation = (component) => component;
```

**Component Mocks**
```typescript
// __mocks__/components/CalculatorBase.tsx
import React from 'react';

export default function MockCalculatorBase({ inputs, calculate }: any) {
  return (
    <div data-testid="mock-calculator-base">
      {inputs.map((input: any) => (
        <div key={input.id}>
          <label htmlFor={input.id}>{input.label}</label>
          <input
            id={input.id}
            type={input.type}
            defaultValue={input.defaultValue}
            data-testid={`input-${input.id}`}
          />
        </div>
      )}
    </div>
  );
}
```

### 2. Test Utilities

**Custom Render Function**
```typescript
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { AppProviders } from '../src/context/AppProviders';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AppProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

**Custom Matchers**
```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend({
  toBeInRange(received: number, min: number, max: number) {
    const pass = received >= min && received <= max;
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be between ${min} and ${max}`,
      pass,
    };
  },
});

expect.extend(toHaveNoViolations);
```

## Test Organization

```
/src
  /__tests__
    /components     # Component tests
    /hooks         # Custom hooks tests
    /pages         # Page component tests
    /utils         # Utility function tests
    /integration   # Integration tests
/cypress
  /e2e             # End-to-end tests
  /fixtures        # Test data
  /support         # Custom commands
```

## Test Data Management

### Mock Data
- Use factory functions for creating test data
- Keep test data close to the tests that use it
- Use MSW for API mocking

**Example:**
```typescript
// __tests__/factories/calculatorFactory.ts
export const createCalculatorData = (overrides = {}) => ({
  id: 'percentage',
  title: 'Percentage Calculator',
  description: 'Calculate percentages',
  inputs: [
    { id: 'value', label: 'Value', type: 'number' },
    { id: 'percentage', label: 'Percentage', type: 'number' },
  ],
  ...overrides,
});
```

## Testing Best Practices

1. **Test Behavior, Not Implementation**
   - Test what the user sees and does, not internal implementation details

2. **Follow the Arrange-Act-Assert Pattern**
   ```typescript
   // Arrange
   const onCalculate = jest.fn();
   render(<Calculator onCalculate={onCalculate} />);
   
   // Act
   fireEvent.click(screen.getByText('Calculate'));
   
   // Assert
   expect(onCalculate).toHaveBeenCalled();
   ```

3. **Use Descriptive Test Names**
   ```typescript
   // Bad
   it('works', () => { ... });
   
   // Good
   it('displays error when required fields are empty', () => { ... });
   ```

4. **Test Edge Cases**
   - Empty inputs
   - Invalid inputs
   - Boundary values
   - Error states

## Performance Testing

### Tools:
- Lighthouse CI
- Web Vitals

### Key Metrics:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

## Accessibility Testing

### Tools:
- axe-core
- jest-axe
- @testing-library/jest-dom

### Example:
```typescript
import { axe } from 'jest-axe';
import { render } from '@testing-library/react';
import Calculator from './Calculator';

it('is accessible', async () => {
  const { container } = render(<Calculator />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Continuous Integration

### GitHub Actions Workflow:
```yaml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e:ci
      - run: npm run test:accessibility
```

## Code Coverage

### Configuration (jest.config.js):
```javascript
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/types.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## Visual Regression Testing

### Tools:
- Storybook + Chromatic
- Percy

### Example (Chromatic):
1. Set up Storybook stories for components
2. Configure Chromatic in your CI pipeline
3. Get visual diffs on pull requests

## AI/ML Testing (Future Implementation)

### 1. Model Testing
- Unit tests for model inference
- Validation of input/output shapes and types
- Edge case testing for model inputs
- Model performance benchmarks

### 2. Integration Testing
- API endpoints for model serving
- Input validation and sanitization
- Error handling for model failures
- Response formatting and structure

### 3. Monitoring and Drift Detection
- Data drift monitoring
- Model performance degradation detection
- Alerting for model failures
- A/B testing infrastructure

## Testing Patterns and Best Practices

### 1. Testing Calculator Components

When testing calculator components, follow these patterns:

**1. Test Structure**
- Group related tests in `describe` blocks
- Use clear, descriptive test names
- Test both happy paths and edge cases
- Keep tests focused and independent

**2. Testing User Interactions**
- Use `@testing-library/user-event` for simulating user interactions
- Test form submissions and input changes
- Verify that calculations update correctly

**3. Testing Async Behavior**
- Use `waitFor` for testing async updates
- Mock timers when testing debounced inputs
- Test loading and error states

**4. Test Data**
- Use realistic test data
- Include edge cases in test data
- Consider using test data factories for complex objects

### 2. Test Organization and Maintenance

#### File Structure
```
src/
  components/
    calculators/
      __tests__/
        BMICalculator.test.tsx
        helpers.test.ts
      __mocks__/
        CalculatorBase.tsx
      BMICalculator.tsx
      CalculatorBase.tsx
  utils/
    __tests__/
      calculations.test.ts
    calculations.ts
```

#### Naming Conventions
- Test files: `[ComponentName].test.tsx`
- Helper test files: `[helpers|utils].test.ts`
- Mock files: `[MockName].ts` in `__mocks__` directory

#### Test Maintenance
- Keep tests up to date with component changes
- Remove or update flaky tests
- Document test dependencies
- Review test coverage regularly

### 3. Testing Calculator Components

### Test Cases for Each Calculator:
1. **Input Validation**
   - Test valid inputs
   - Test invalid inputs (negative numbers, strings, etc.)
   - Test edge cases (zero, very large numbers)

2. **Calculation Logic**
   - Test with various input combinations
   - Verify calculation results
   - Test error handling

3. **UI/UX**
   - Test form submission
   - Test input changes
   - Test error messages
   - Test loading states

## Performance Budget

Set performance budgets to prevent performance regressions:

```json
// package.json
{
  "performance-budget": {
    "scripts": {
      "maxSize": "200kB",
      "maxInitialRequests": 5
    },
    "images": {
      "maxSize": "500kB"
    },
    "css": {
      "maxSize": "100kB"
    }
  }
}
```

## Monitoring and Maintenance

1. **Test Maintenance**
   - Review and update tests with each feature
   - Remove or update flaky tests
   - Keep test data up to date

2. **Test Reporting**
   - Generate test coverage reports
   - Track test execution time
   - Monitor test flakiness

3. **Performance Monitoring**
   - Track Core Web Vitals in production
   - Set up alerts for performance regressions
   - Regularly audit with Lighthouse
