import {
  isValidNumber,
  formatNumber,
  parseNumber,
  calculatePercentage,
  calculatePercentageChange,
  round,
  formatNumberWithCommas,
  isValidMathExpression,
  evaluateMathExpression,
  convertUnit,
  range,
} from '../calculatorUtils';

type TestCase<T, U> = {
  input: T;
  expected: U;
  description: string;
};

describe('Calculator Utilities', () => {
  describe('isValidNumber', () => {
    const validCases: TestCase<any, boolean>[] = [
      { input: '123', expected: true, description: 'positive integer string' },
      { input: '123.45', expected: true, description: 'positive decimal string' },
      { input: '-123.45', expected: true, description: 'negative decimal string' },
      { input: '0', expected: true, description: 'zero string' },
      { input: '1e3', expected: true, description: 'scientific notation' },
      { input: '   123   ', expected: true, description: 'string with whitespace' },
      { input: 123, expected: true, description: 'number type' },
      { input: 0, expected: true, description: 'number zero' },
    ];

    const invalidCases: TestCase<any, boolean>[] = [
      { input: '', expected: false, description: 'empty string' },
      { input: 'abc', expected: false, description: 'non-numeric string' },
      { input: '123abc', expected: false, description: 'partially numeric string' },
      { input: undefined, expected: false, description: 'undefined' },
      { input: null, expected: false, description: 'null' },
      { input: true, expected: false, description: 'boolean true' },
      { input: false, expected: false, description: 'boolean false' },
      { input: {}, expected: false, description: 'empty object' },
      { input: [], expected: false, description: 'empty array' },
      { input: () => {}, expected: false, description: 'function' },
      { input: NaN, expected: false, description: 'NaN' },
      { input: Infinity, expected: false, description: 'Infinity' },
      { input: -Infinity, expected: false, description: '-Infinity' },
    ];

    validCases.forEach(({ input, expected, description }) => {
      it(`should return ${expected} for ${description} (${JSON.stringify(input)})`, () => {
        expect(isValidNumber(input)).toBe(expected);
      });
    });

    invalidCases.forEach(({ input, expected, description }) => {
      it(`should return ${expected} for ${description} (${JSON.stringify(input)})`, () => {
        expect(isValidNumber(input)).toBe(expected);
      });
    });
  });

  describe('formatNumber', () => {
    const testCases: TestCase<[number, number?], string>[] = [
      { input: [123.4567, 2], expected: '123.46', description: 'rounds to 2 decimal places' },
      { input: [123.4, 2], expected: '123.4', description: 'keeps single decimal when specified' },
      { input: [123, 2], expected: '123', description: 'integer remains integer' },
      { input: [123.4567, 0], expected: '123', description: 'rounds to 0 decimal places' },
      { input: [123.5, 0], expected: '124', description: 'rounds up at 0.5' },
      { input: [123.4, 0], expected: '123', description: 'rounds down below 0.5' },
      { input: [0.0001, 3], expected: '0', description: 'very small number' },
      { input: [1e-7, 8], expected: '0.0000001', description: 'scientific notation' },
      { input: [123.4567], expected: '123.46', description: 'uses default decimals (2)' },
      { input: [123.9999, 2], expected: '124', description: 'rounding causes carryover' },
    ];

    testCases.forEach(({ input, expected, description }) => {
      it(`should format number: ${description}`, () => {
        expect(formatNumber(...input)).toBe(expected);
      });
    });

    it('should handle edge cases', () => {
      expect(() => formatNumber(NaN, 2)).toThrow();
      expect(() => formatNumber(Infinity, 2)).toThrow();
      expect(() => formatNumber(-Infinity, 2)).toThrow();
    });
  });

  describe('parseNumber', () => {
    const testCases: TestCase<[string, number?], number>[] = [
      { input: ['123.45'], expected: 123.45, description: 'parses decimal string' },
      { input: ['123'], expected: 123, description: 'parses integer string' },
      { input: ['  123.45  '], expected: 123.45, description: 'trims whitespace' },
      { input: ['-123.45'], expected: -123.45, description: 'parses negative numbers' },
      { input: ['1e3'], expected: 1000, description: 'parses scientific notation' },
      { input: ['0xFF'], expected: 255, description: 'parses hexadecimal' },
      { input: [''], expected: 0, description: 'returns 0 for empty string by default' },
      { input: ['abc', 10], expected: 10, description: 'returns default for invalid string' },
      { input: ['', 42], expected: 42, description: 'returns custom default for empty string' },
    ];

    testCases.forEach(({ input, expected, description }) => {
      it(`should parse number: ${description}`, () => {
        expect(parseNumber(...input)).toBe(expected);
      });
    });

    it('should handle edge cases', () => {
      // @ts-ignore - Testing invalid input
      expect(parseNumber(null, 42)).toBe(42);
      // @ts-ignore - Testing invalid input
      expect(parseNumber(undefined, 42)).toBe(42);
      // @ts-ignore - Testing invalid input
      expect(parseNumber({}, 42)).toBe(42);
    });
  });

  describe('calculatePercentage', () => {
    const testCases: TestCase<[number, number], number>[] = [
      { input: [10, 100], expected: 10, description: '10% of 100' },
      { input: [50, 200], expected: 100, description: '50% of 200' },
      { input: [0, 100], expected: 0, description: '0% of anything is 0' },
      { input: [100, 0], expected: 0, description: 'any% of 0 is 0' },
      { input: [25, 80], expected: 20, description: '25% of 80' },
      { input: [33.33, 300], expected: 99.99, description: 'decimal percentage' },
      { input: [100, 100], expected: 100, description: '100% of number is the number itself' },
      { input: [200, 100], expected: 200, description: 'percentage > 100%' },
      { input: [-10, 100], expected: -10, description: 'negative percentage' },
      { input: [10, -100], expected: -10, description: 'negative base number' },
      { input: [10, 0.1], expected: 0.01, description: 'very small base number' },
    ];

    testCases.forEach(({ input, expected, description }) => {
      it(`should calculate: ${description}`, () => {
        const result = calculatePercentage(...input);
        expect(result).toBeCloseTo(expected, 10); // Use toBeCloseTo for floating point comparison
      });
    });

    it('should handle edge cases', () => {
      // @ts-ignore - Testing invalid input
      expect(calculatePercentage('10%', 100)).toBeNaN();
      // @ts-ignore - Testing invalid input
      expect(calculatePercentage(10, '100')).toBeNaN();
      expect(calculatePercentage(Infinity, 100)).toBe(Infinity);
      expect(calculatePercentage(10, Infinity)).toBe(Infinity);
    });
  });

  describe('calculatePercentageChange', () => {
    const testCases: TestCase<[number, number], number>[] = [
      { input: [100, 150], expected: 50, description: '50% increase' },
      { input: [100, 50], expected: -50, description: '50% decrease' },
      { input: [0, 100], expected: 0, description: 'from 0 (avoids division by zero)' },
      { input: [100, 100], expected: 0, description: 'no change' },
      { input: [200, 100], expected: -50, description: '50% decrease from 200 to 100' },
      { input: [-100, -50], expected: 50, description: '50% increase from -100 to -50' },
      { input: [100, -100], expected: -200, description: '200% decrease to negative' },
      { input: [-100, 100], expected: -200, description: '200% increase from negative' },
      { input: [0.1, 0.2], expected: 100, description: 'small numbers' },
      { input: [1e6, 1.5e6], expected: 50, description: 'large numbers' },
    ];

    testCases.forEach(({ input, expected, description }) => {
      it(`should calculate: ${description}`, () => {
        const result = calculatePercentageChange(...input);
        expect(result).toBeCloseTo(expected, 10);
      });
    });

    it('should handle edge cases', () => {
      // @ts-ignore - Testing invalid input
      expect(calculatePercentageChange('100', 150)).toBeNaN();
      // @ts-ignore - Testing invalid input
      expect(calculatePercentageChange(100, '150')).toBeNaN();
      expect(calculatePercentageChange(0, 0)).toBe(0);
      expect(calculatePercentageChange(Infinity, 100)).toBe(-100);
      expect(calculatePercentageChange(100, Infinity)).toBe(Infinity);
      expect(calculatePercentageChange(-Infinity, 100)).toBe(Infinity);
      expect(calculatePercentageChange(100, -Infinity)).toBe(-Infinity);
    });
  });

  describe('round', () => {
    it('should round numbers to specified decimal places', () => {
      expect(round(123.4567, 2)).toBe(123.46);
      expect(round(123.4, 2)).toBe(123.4);
      expect(round(123.5, 0)).toBe(124);
    });
  });

  describe('formatNumberWithCommas', () => {
    it('should format numbers with thousand separators', () => {
      expect(formatNumberWithCommas(1000)).toBe('1,000');
      expect(formatNumberWithCommas(1000000)).toBe('1,000,000');
      expect(formatNumberWithCommas(1234.56, 1)).toBe('1,234.6');
    });
  });

  describe('isValidMathExpression', () => {
    const validExpressions: TestCase<string, boolean>[] = [
      { input: '2 + 2', expected: true, description: 'basic addition' },
      { input: '2 * (3 + 4)', expected: true, description: 'nested operations' },
      { input: 'sin(90) + cos(0)', expected: true, description: 'trigonometric functions' },
      { input: 'sqrt(16) + pow(2, 3)', expected: true, description: 'math functions' },
      { input: '1.23e-4 * 5.67e+8', expected: true, description: 'scientific notation' },
      { input: 'a + b * c', expected: true, description: 'variables' },
      { input: '2 * PI', expected: true, description: 'constants' },
      { input: '1 + 2 * 3 - 4 / 5', expected: true, description: 'operator precedence' },
    ];

    const invalidExpressions: TestCase<string | number | null | undefined, boolean>[] = [
      { input: '2 + ', expected: false, description: 'incomplete expression' },
      { input: 'abc', expected: false, description: 'non-math text' },
      { input: '2 + * 3', expected: false, description: 'consecutive operators' },
      { input: 'sin(90', expected: false, description: 'unclosed parenthesis' },
      { input: '2 + )3', expected: false, description: 'mismatched parentheses' },
      { input: '', expected: false, description: 'empty string' },
      { input: '   ', expected: false, description: 'whitespace only' },
      { input: null, expected: false, description: 'null input' },
      { input: undefined, expected: false, description: 'undefined input' },
      { input: 123, expected: false, description: 'number input' },
    ];

    validExpressions.forEach(({ input, expected, description }) => {
      it(`should validate as valid: ${description} (${input})`, () => {
        expect(isValidMathExpression(input)).toBe(expected);
      });
    });

    invalidExpressions.forEach(({ input, expected, description }) => {
      it(`should validate as invalid: ${description} (${JSON.stringify(input)})`, () => {
        // @ts-ignore - Testing invalid input types
        expect(isValidMathExpression(input)).toBe(expected);
      });
    });
  });

  describe('evaluateMathExpression', () => {
    const testCases: TestCase<[string, Record<string, any>?], number | null>[] = [
      { input: ['2 + 2'], expected: 4, description: 'basic addition' },
      { input: ['2 * (3 + 4)'], expected: 14, description: 'nested operations' },
      { input: ['a + b', { a: 2, b: 3 }], expected: 5, description: 'with variables' },
      { input: ['PI'], expected: Math.PI, description: 'math constant' },
      { input: ['sin(PI/2)'], expected: 1, description: 'trigonometric function' },
      { input: ['sqrt(16)'], expected: 4, description: 'square root' },
      { input: ['pow(2, 3)'], expected: 8, description: 'power function' },
      { input: ['1.5 * (2 + 3) / 2.5'], expected: 3, description: 'decimal operations' },
      { input: ['-5 + 10'], expected: 5, description: 'negative numbers' },
      { input: ['2 * PI * r', { r: 5 }], expected: 2 * Math.PI * 5, description: 'formula with variables' },
    ];

    const errorCases: TestCase<[string, Record<string, any>?], null>[] = [
      { input: ['2 + '], expected: null, description: 'incomplete expression' },
      { input: ['a + b'], expected: null, description: 'undefined variables' },
      { input: ['1 / 0'], expected: null, description: 'division by zero' },
      { input: ['Math.alert(1)'], expected: null, description: 'insecure function' },
      { input: ['process.exit()'], expected: null, description: 'dangerous function' },
      { input: ['x'], expected: null, description: 'undefined variable' },
      { input: [''], expected: null, description: 'empty string' },
      { input: ['   '], expected: null, description: 'whitespace only' },
      // @ts-ignore - Testing invalid input types
      { input: [null], expected: null, description: 'null expression' },
      // @ts-ignore - Testing invalid input types
      { input: [undefined, {}], expected: null, description: 'undefined expression' },
      // @ts-ignore - Testing invalid input types
      { input: [123], expected: null, description: 'number input' },
    ];

    testCases.forEach(({ input, expected, description }) => {
      it(`should evaluate: ${description} (${input[0]})`, () => {
        const result = evaluateMathExpression(input[0], input[1]);
        if (typeof expected === 'number' && typeof result === 'number') {
          expect(result).toBeCloseTo(expected, 10);
        } else {
          expect(result).toBe(expected);
        }
      });
    });

    errorCases.forEach(({ input, expected, description }) => {
      it(`should handle error case: ${description} (${JSON.stringify(input[0])})`, () => {
        // @ts-ignore - Testing invalid input types
        expect(evaluateMathExpression(input[0], input[1])).toBe(expected);
      });
    });
  });

  describe('convertUnit', () => {
    const conversionRates = {
      // Length
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344,
      // Mass
      g: 1,
      kg: 1000,
      mg: 0.001,
      lb: 453.592,
      oz: 28.3495,
    };

    const testCases: TestCase<[number, string, string, Record<string, number>], number | null>[] = [
      // Length conversions
      { input: [1, 'km', 'm', conversionRates], expected: 1000, description: 'kilometers to meters' },
      { input: [100, 'cm', 'm', conversionRates], expected: 1, description: 'centimeters to meters' },
      { input: [1, 'm', 'cm', conversionRates], expected: 100, description: 'meters to centimeters' },
      { input: [1, 'm', 'mm', conversionRates], expected: 1000, description: 'meters to millimeters' },
      { input: [12, 'in', 'ft', conversionRates], expected: 1, description: 'inches to feet' },
      { input: [3, 'ft', 'yd', conversionRates], expected: 1, description: 'feet to yards' },
      { input: [1760, 'yd', 'mi', conversionRates], expected: 1, description: 'yards to miles' },
      
      // Mass conversions
      { input: [1, 'kg', 'g', conversionRates], expected: 1000, description: 'kilograms to grams' },
      { input: [1000, 'mg', 'g', conversionRates], expected: 1, description: 'milligrams to grams' },
      { input: [1, 'lb', 'g', conversionRates], expected: 453.592, description: 'pounds to grams' },
      { input: [16, 'oz', 'lb', conversionRates], expected: 1, description: 'ounces to pounds' },
      
      // Edge cases
      { input: [0, 'km', 'm', conversionRates], expected: 0, description: 'zero value' },
      { input: [-1, 'km', 'm', conversionRates], expected: -1000, description: 'negative value' },
    ];

    const errorCases: TestCase<[any, any, any, any], null>[] = [
      { input: [1, 'kg', 'm', conversionRates], expected: null, description: 'incompatible units' },
      { input: [1, 'm', 'kg', conversionRates], expected: null, description: 'reverse incompatible units' },
      { input: [1, 'unknown', 'm', conversionRates], expected: null, description: 'unknown from unit' },
      { input: [1, 'm', 'unknown', conversionRates], expected: null, description: 'unknown to unit' },
      // @ts-ignore - Testing invalid input
      { input: ['not a number', 'm', 'cm', conversionRates], expected: null, description: 'invalid value' },
      // @ts-ignore - Testing invalid input
      { input: [1, 123, 'cm', conversionRates], expected: null, description: 'invalid from unit type' },
      // @ts-ignore - Testing invalid input
      { input: [1, 'm', 123, conversionRates], expected: null, description: 'invalid to unit type' },
      // @ts-ignore - Testing invalid input
      { input: [1, 'm', 'cm', null], expected: null, description: 'null conversion rates' },
      // @ts-ignore - Testing invalid input
      { input: [1, 'm', 'cm', {}], expected: null, description: 'empty conversion rates' },
      // @ts-ignore - Testing invalid input
      { input: [1, 'm', 'cm', { m: 'invalid' }], expected: null, description: 'invalid rate value' },
    ];

    testCases.forEach(({ input, expected, description }) => {
      it(`should convert: ${description}`, () => {
        const result = convertUnit(...input);
        if (typeof expected === 'number') {
          expect(result).toBeCloseTo(expected, 3);
        } else {
          expect(result).toBe(expected);
        }
      });
    });

    errorCases.forEach(({ input, expected, description }) => {
      it(`should handle error case: ${description}`, () => {
        // @ts-ignore - Testing invalid input types
        expect(convertUnit(...input)).toBe(expected);
      });
    });
  });

  describe('range', () => {
    const testCases: TestCase<[number, number, number?], number[]>[] = [
      { input: [1, 5], expected: [1, 2, 3, 4, 5], description: 'positive range with step 1' },
      { input: [0, 10, 2], expected: [0, 2, 4, 6, 8, 10], description: 'range with step 2' },
      { input: [5, 1, -1], expected: [5, 4, 3, 2, 1], description: 'decreasing range' },
      { input: [0, 0], expected: [0], description: 'single value range' },
      { input: [-3, 3], expected: [-3, -2, -1, 0, 1, 2, 3], description: 'range including negative numbers' },
      { input: [1, 10, 3], expected: [1, 4, 7, 10], description: 'range with step 3' },
      { input: [10, 1, -3], expected: [10, 7, 4, 1], description: 'decreasing range with negative step' },
      { input: [1, 5, 0.5], expected: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5], description: 'range with fractional step' },
      { input: [1, 1], expected: [1], description: 'same start and end' },
      { input: [-2, 2, 0.5], expected: [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2], description: 'range with fractional step including negatives' },
    ];

    const errorCases: TestCase<[number, number, number?], number[]>[] = [
      { input: [1, 5, 0], expected: [], description: 'zero step' },
      { input: [1, 5, -1], expected: [], description: 'positive range with negative step' },
      { input: [5, 1, 1], expected: [], description: 'decreasing range with positive step' },
      { input: [1, 5, -0.5], expected: [], description: 'positive range with negative fractional step' },
      { input: [1, 5, NaN], expected: [], description: 'NaN step' },
      { input: [1, 5, Infinity], expected: [], description: 'infinite step' },
      { input: [NaN, 5], expected: [], description: 'NaN start' },
      { input: [1, NaN], expected: [], description: 'NaN end' },
      { input: [Infinity, 5], expected: [], description: 'infinite start' },
      { input: [1, -Infinity], expected: [], description: 'infinite end' },
    ];

    testCases.forEach(({ input, expected, description }) => {
      it(`should generate range: ${description} (${input.join(', ')})`, () => {
        const result = range(...input);
        expect(result).toEqual(expected);
      });
    });

    errorCases.forEach(({ input, expected, description }) => {
      it(`should handle error case: ${description} (${input.join(', ')})`, () => {
        const result = range(...input);
        expect(result).toEqual(expected);
      });
    });
  });
});
