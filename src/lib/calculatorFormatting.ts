/**
 * Calculator Formatting Utilities
 *
 * Provides formatting functions for calculator results and displays.
 */

/**
 * Formats a number with a fixed number of decimal places
 * @param value The value to format
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted number as string
 * @throws {Error} If the input is not a finite number
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  // Handle non-finite numbers
  if (!Number.isFinite(value)) {
    throw new Error('Cannot format non-finite number');
  }

  // Handle very small numbers - format without scientific notation and trim trailing zeros
  if (Math.abs(value) < 1e-6 && value !== 0) {
    return value.toFixed(decimals).replace(/\.?0+$/, '');
  }

  // Format with fixed decimal places, removing trailing zeros and decimal point if not needed
  const fixed = value.toFixed(decimals);
  const num = Number(fixed);

  // If the number doesn't need decimal places, return as integer
  if (num % 1 === 0) {
    return num.toString();
  }

  // Otherwise, remove trailing zeros
  return fixed.replace(/\.?0+$/, '');
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
