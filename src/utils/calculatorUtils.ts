/**
 * Common utility functions for calculator components
 *
 * This file now serves as a re-export layer for modularized utilities.
 * All functions have been moved to more focused modules for better maintainability.
 *
 * Migration guide:
 * - Validation functions → @/lib/calculatorValidation
 * - Formatting functions → @/lib/calculatorFormatting
 * - Math functions → @/lib/calculatorMath
 * - Percentage functions → @/utils/math/percentage
 * - Expression functions → @/utils/math/expression
 * - Geometry functions → @/utils/math/geometry
 */

// Re-export validation functions
export {
  isValidNumber,
  isValidMathExpression
} from '@/lib/calculatorValidation';

// Re-export formatting functions
export {
  formatNumber,
  formatNumberWithCommas,
  round
} from '@/lib/calculatorFormatting';

// Re-export math functions
export {
  parseNumber,
  convertUnit,
  range
} from '@/lib/calculatorMath';

// Re-export percentage functions
export {
  calculatePercentage,
  calculatePercentageChange
} from '@/utils/math/percentage';

// Re-export expression evaluation
export {
  evaluateMathExpression
} from '@/utils/math/expression';
