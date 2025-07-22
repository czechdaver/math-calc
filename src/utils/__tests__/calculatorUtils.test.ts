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

describe('Calculator Utilities', () => {
  describe('isValidNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isValidNumber('123')).toBe(true);
      expect(isValidNumber('123.45')).toBe(true);
      expect(isValidNumber('-123.45')).toBe(true);
      expect(isValidNumber('0')).toBe(true);
    });

    it('should return false for invalid numbers', () => {
      expect(isValidNumber('')).toBe(false);
      expect(isValidNumber('abc')).toBe(false);
      expect(isValidNumber('123abc')).toBe(false);
      expect(isValidNumber(undefined)).toBe(false);
      expect(isValidNumber(null)).toBe(false);
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with specified decimal places', () => {
      expect(formatNumber(123.4567, 2)).toBe('123.46');
      expect(formatNumber(123.4, 2)).toBe('123.4');
      expect(formatNumber(123, 2)).toBe('123');
      expect(formatNumber(123.4567, 0)).toBe('123');
    });
  });

  describe('parseNumber', () => {
    it('should parse string numbers to numbers', () => {
      expect(parseNumber('123.45')).toBe(123.45);
      expect(parseNumber('123')).toBe(123);
      expect(parseNumber('')).toBe(0);
      expect(parseNumber('abc', 10)).toBe(10);
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage of a number', () => {
      expect(calculatePercentage(10, 100)).toBe(10);
      expect(calculatePercentage(50, 200)).toBe(100);
      expect(calculatePercentage(0, 100)).toBe(0);
    });
  });

  describe('calculatePercentageChange', () => {
    it('should calculate percentage change between two numbers', () => {
      expect(calculatePercentageChange(100, 150)).toBe(50);
      expect(calculatePercentageChange(100, 50)).toBe(-50);
      expect(calculatePercentageChange(0, 100)).toBe(0); // Avoid division by zero
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
    it('should validate mathematical expressions', () => {
      expect(isValidMathExpression('2 + 2')).toBe(true);
      expect(isValidMathExpression('2 * (3 + 4)')).toBe(true);
      expect(isValidMathExpression('2 + ')).toBe(false);
      expect(isValidMathExpression('abc')).toBe(false);
    });
  });

  describe('evaluateMathExpression', () => {
    it('should evaluate mathematical expressions', () => {
      expect(evaluateMathExpression('2 + 2')).toBe(4);
      expect(evaluateMathExpression('2 * (3 + 4)')).toBe(14);
      expect(evaluateMathExpression('a + b', { a: 2, b: 3 })).toBe(5);
      expect(evaluateMathExpression('2 + ')).toBeNull();
    });
  });

  describe('convertUnit', () => {
    const conversionRates = {
      m: 1,
      km: 1000,
      cm: 0.01,
    };

    it('should convert between compatible units', () => {
      expect(convertUnit(1, 'km', 'm', conversionRates)).toBe(1000);
      expect(convertUnit(100, 'cm', 'm', conversionRates)).toBe(1);
      expect(convertUnit(1, 'm', 'cm', conversionRates)).toBe(100);
    });

    it('should return null for incompatible units', () => {
      expect(convertUnit(1, 'kg', 'm', conversionRates)).toBeNull();
    });
  });

  describe('range', () => {
    it('should generate a range of numbers', () => {
      expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
      expect(range(5, 1, -1)).toEqual([5, 4, 3, 2, 1]);
    });
  });
});
