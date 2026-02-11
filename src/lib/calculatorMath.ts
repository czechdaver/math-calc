/**
 * Calculator Math Utilities
 *
 * Provides general math functions for calculator operations.
 */

/**
 * Parses a string to a number, handling empty strings and invalid numbers
 * @param value The value to parse
 * @param defaultValue Default value if parsing fails (default: 0)
 * @returns Parsed number or defaultValue
 */
export const parseNumber = (value: any, defaultValue: number = 0): number => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }

  // Handle string inputs
  if (typeof value === 'string') {
    // Trim whitespace
    const trimmed = value.trim();

    // Handle hexadecimal (0x or 0X prefix)
    if (/^0[xX][0-9a-fA-F]+$/.test(trimmed)) {
      return parseInt(trimmed, 16);
    }

    // Handle binary (0b or 0B prefix)
    if (/^0[bB][01]+$/.test(trimmed)) {
      return parseInt(trimmed.substring(2), 2);
    }

    // Handle octal (0o or 0O prefix)
    if (/^0[oO][0-7]+$/.test(trimmed)) {
      return parseInt(trimmed.substring(2), 8);
    }

    // Handle regular decimal numbers
    const num = Number(trimmed);
    return isNaN(num) ? defaultValue : num;
  }

  // Handle number inputs
  if (typeof value === 'number') {
    return isFinite(value) ? value : defaultValue;
  }

  // Handle other types (boolean, object, etc.)
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Converts a value from one unit to another using the provided conversion rates
 * @param value The value to convert
 * @param fromUnit The unit to convert from
 * @param toUnit The unit to convert to
 * @param conversionRates Object containing conversion rates between units
 * @returns The converted value or null if conversion is not possible
 */
export const convertUnit = (
  value: number,
  fromUnit: string,
  toUnit: string,
  conversionRates: Record<string, number> | null
): number | null => {
  // Handle null or undefined conversion rates
  if (!conversionRates) {
    return null;
  }

  // Handle invalid input types
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return null;
  }

  // If units are the same, return the value as-is
  if (fromUnit === toUnit) {
    return value;
  }

  // Get conversion rates
  const fromRate = conversionRates[fromUnit];
  const toRate = conversionRates[toUnit];

  // Check if both units exist in the conversion rates
  if (fromRate === undefined || toRate === undefined) {
    return null;
  }

  // Check for division by zero
  if (toRate === 0) {
    return null;
  }

  try {
    // Convert to base unit first, then to target unit
    const result = (value * fromRate) / toRate;

    // Check for invalid results
    if (isNaN(result) || !isFinite(result)) {
      return null;
    }

    return result;
  } catch (error) {
    return null;
  }
};

/**
 * Generates a range of numbers
 * @param start Start value
 * @param end End value
 * @param step Step size (default: 1)
 * @returns Array of numbers in the specified range, or empty array for invalid inputs
 */
export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];

  // Handle invalid inputs
  if (typeof start !== 'number' || typeof end !== 'number' || typeof step !== 'number' ||
      isNaN(start) || isNaN(end) || isNaN(step) || !isFinite(start) || !isFinite(end) || !isFinite(step)) {
    return [];
  }

  // Handle zero step
  if (step === 0) {
    return [];
  }

  // Handle infinite step
  if (!isFinite(step)) {
    return [start];
  }

  // Handle infinite start or end
  if (!isFinite(start) || !isFinite(end)) {
    return [start];
  }

  // Handle the case where start equals end
  if (start === end) {
    return [start];
  }

  // Handle invalid ranges based on step direction
  if ((step > 0 && start > end) || (step < 0 && start < end)) {
    return [];
  }

  // Generate the range
  for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
    // Protect against potential infinite loops with very small steps
    if (result.length > 1000000) {
      console.warn('Range function generated too many elements, truncating');
      break;
    }
    result.push(i);
  }

  return result;
};
