/**
 * Common utility functions for calculator components
 */

// Helper functions for expression validation
const isMathOperator = (char: string): boolean => ['+', '-', '*', '/', '^'].includes(char);
const isMathFunction = (str: string): boolean => ['sin', 'cos', 'tan', 'sqrt', 'log', 'pow'].includes(str);
const isMathConstant = (str: string): boolean => ['PI', 'E'].includes(str);

/**
 * Validates if a string is a valid mathematical expression
 * Supports basic arithmetic, functions (sin, cos, tan, sqrt, log, pow), and constants (PI, E)
 */
export const isValidMathExpression = (expression: string): boolean => {
  // Basic input validation
  if (!expression || typeof expression !== 'string') {
    return false;
  }
  
  // Remove all whitespace for easier processing
  const trimmed = expression.replace(/\s+/g, '');
  if (!trimmed) {
    return false;
  }
  
  // Check for balanced parentheses
  let balance = 0;
  for (const char of trimmed) {
    if (char === '(') balance++;
    if (char === ')') balance--;
    if (balance < 0) return false; // More closing than opening parentheses
  }
  if (balance !== 0) return false; // Unbalanced parentheses
  
  // Check for valid first and last characters
  const firstChar = trimmed[0];
  const lastChar = trimmed[trimmed.length - 1];
  
  // Expression can't start with */^,)
  if (['*', '/', '^', ')', ','].includes(firstChar)) {
    return false;
  }
  
  // Expression can't end with +-*/^,(
  if (['+', '-', '*', '/', '^', '(', ','].includes(lastChar)) {
    return false;
  }
  
  // Check for valid token sequence
  let i = 0;
  let prevTokenType: string | null = null;
  
  while (i < trimmed.length) {
    const char = trimmed[i];
    
    // Skip whitespace (shouldn't be any at this point, but just in case)
    if (char === ' ') {
      i++;
      continue;
    }
    
    // Check for numbers (including scientific notation)
    const numberMatch = trimmed.slice(i).match(/^-?\d+(\.\d+)?([eE][-+]?\d+)?/);
    if (numberMatch) {
      const num = numberMatch[0];
      i += num.length;
      prevTokenType = 'number';
      continue;
    }
    
    // Check for functions and constants
    let foundFunctionOrConst = false;
    for (const func of ['sin', 'cos', 'tan', 'sqrt', 'log', 'pow', 'PI', 'E']) {
      if (trimmed.startsWith(func, i)) {
        // Check if this is a function call (must be followed by '(')
        if (isMathFunction(func)) {
          if (i + func.length >= trimmed.length || trimmed[i + func.length] !== '(') {
            return false; // Function not followed by '('
          }
        }
        i += func.length;
        prevTokenType = isMathFunction(func) ? 'function' : 'constant';
        foundFunctionOrConst = true;
        break;
      }
    }
    if (foundFunctionOrConst) continue;
    
    // Check for single-letter variables
    if (/^[a-z]$/i.test(char)) {
      // Variable must be followed by an operator, closing parenthesis, or end of string
      if (i + 1 < trimmed.length && !['+', '-', '*', '/', '^', ')', ','].includes(trimmed[i + 1])) {
        return false;
      }
      i++;
      prevTokenType = 'variable';
      continue;
    }
    
    // Check for operators and parentheses
    if (isMathOperator(char) || ['(', ')', ','].includes(char)) {
      // Handle unary minus
      if (char === '-' && (prevTokenType === null || ['operator', '('].includes(prevTokenType))) {
        // This is a unary minus, which is allowed
      } else if (isMathOperator(char)) {
        // Check for consecutive operators
        if (prevTokenType === 'operator') {
          return false;
        }
      }
      
      // Handle function arguments
      if (char === ',' && prevTokenType !== 'number' && prevTokenType !== 'variable' && prevTokenType !== ')') {
        return false; // Comma not between valid expressions
      }
      
      prevTokenType = isMathOperator(char) || char === ',' ? 'operator' : char;
      i++;
      continue;
    }
    
    // If we get here, we encountered an invalid character
    return false;
  }
  
  return true;
};
