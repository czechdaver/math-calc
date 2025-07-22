/**
 * Common utility functions for calculator components
 */

/**
 * Validates if a value is a valid number
 * @param value The value to validate
 * @returns boolean indicating if the value is a valid number
 */
export const isValidNumber = (value: any): boolean => {
  return value !== '' && !isNaN(Number(value)) && isFinite(Number(value));
};

/**
 * Formats a number with a fixed number of decimal places
 * @param value The value to format
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted number as string
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return Number(value.toFixed(decimals)).toString();
};

/**
 * Parses a string to a number, handling empty strings and invalid numbers
 * @param value The value to parse
 * @param defaultValue Default value if parsing fails (default: 0)
 * @returns Parsed number or defaultValue
 */
export const parseNumber = (value: string, defaultValue: number = 0): number => {
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Calculates percentage of a number
 * @param percentage The percentage value (e.g., 10 for 10%)
 * @param number The number to calculate percentage of
 * @returns The calculated percentage value
 */
export const calculatePercentage = (percentage: number, number: number): number => {
  return (percentage / 100) * number;
};

/**
 * Calculates percentage change between two numbers
 * @param oldValue The original value
 * @param newValue The new value
 * @returns The percentage change
 */
export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
};

/**
 * Rounds a number to a specified number of decimal places
 * @param value The value to round
 * @param decimals Number of decimal places (default: 2)
 * @returns Rounded number
 */
export const round = (value: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

/**
 * Formats a number with thousand separators and decimal places
 * @param value The value to format
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export const formatNumberWithCommas = (value: number, decimals: number = 2): string => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/**
 * Validates if a string is a valid mathematical expression
 * @param expression The expression to validate
 * @returns boolean indicating if the expression is valid
 */
export const isValidMathExpression = (expression: string): boolean => {
  try {
    // eslint-disable-next-line no-new-func
    new Function(`return ${expression}`);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Safely evaluates a mathematical expression
 * @param expression The expression to evaluate
 * @param variables Optional variables to use in the expression
 * @returns The result of the evaluation or null if invalid
 */
export const evaluateMathExpression = (
  expression: string,
  variables: Record<string, number> = {}
): number | null => {
  try {
    // Replace variable placeholders with their values
    let expr = expression;
    Object.entries(variables).forEach(([key, value]) => {
      expr = expr.replace(new RegExp(`\\b${key}\\b`, 'g'), value.toString());
    });

    // Use Function constructor to safely evaluate the expression
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${expr}`)();
    
    if (typeof result !== 'number' || !isFinite(result)) {
      return null;
    }
    
    return result;
  } catch (e) {
    return null;
  }
};

/**
 * Converts a value to a specific unit
 * @param value The value to convert
 * @param fromUnit The unit to convert from
 * @param toUnit The unit to convert to
 * @param conversionRates Object containing conversion rates
 * @returns The converted value or null if conversion is not possible
 */
export const convertUnit = (
  value: number,
  fromUnit: string,
  toUnit: string,
  conversionRates: Record<string, number>
): number | null => {
  if (fromUnit === toUnit) return value;
  
  const fromRate = conversionRates[fromUnit];
  const toRate = conversionRates[toUnit];
  
  if (fromRate === undefined || toRate === undefined) return null;
  
  // Convert to base unit first, then to target unit
  return (value * fromRate) / toRate;
};

/**
 * Generates a range of numbers
 * @param start Start value
 * @param end End value
 * @param step Step size (default: 1)
 * @returns Array of numbers in the specified range
 */
export const range = (start: number, end: number, step: number = 1): number[] => {
  const result = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
};
