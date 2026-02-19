/**
 * Mathematical Expression Evaluation Utilities
 *
 * Provides functions for validating and evaluating mathematical expressions.
 */

/**
 * Safely evaluates a mathematical expression
 * @param expression The expression to evaluate
 * @param variables Optional variables to use in the expression
 * @returns The result of the evaluation or null if invalid
 */
export function evaluateMathExpression(
  expression: string,
  variables: Record<string, number> = {}
): number | null {
  // Remove all whitespace from the expression
  const expr = expression.replace(/\s+/g, '');

  // Check for empty expression
  if (!expr) return null;

  // Check if it's a simple number (including scientific notation)
  const numberMatch = expr.match(/^([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)$/);
  if (numberMatch) {
    return parseFloat(numberMatch[1]);
  }

  // Handle variables and constants
  const variableMatch = expr.match(/^[a-zA-Z]+$/);
  if (variableMatch) {
    const varName = variableMatch[0];
    const upperVarName = varName.toUpperCase();

    // Check for constants (case-insensitive)
    if (upperVarName === 'PI') return Math.PI;
    if (upperVarName === 'E') return Math.E;

    // Check for variables (case-sensitive)
    if (variables.hasOwnProperty(varName)) {
      return variables[varName];
    }

    // Unknown variable
    return null;
  }

  // Handle parentheses - most deeply nested first
  const parenthesesMatch = expr.match(/\(([^()]+)\)/);
  if (parenthesesMatch) {
    const innerExpr = parenthesesMatch[1];
    let innerResult = evaluateMathExpression(innerExpr, variables);

    // If we couldn't evaluate the inner expression, try replacing PI and E
    if (innerResult === null) {
      const processedInner = innerExpr
        .replace(/PI/g, Math.PI.toString())
        .replace(/E/g, Math.E.toString());
      innerResult = evaluateMathExpression(processedInner, variables);
    }

    if (innerResult === null) return null;

    // Replace the parenthesized expression with its result and evaluate again
    const newExpr = expr.replace(parenthesesMatch[0], innerResult.toString());
    return evaluateMathExpression(newExpr, variables);
  }

  // Handle mathematical functions (sin, cos, tan, sqrt, log, pow)
  const funcMatch = expr.match(/(sin|cos|tan|sqrt|log|pow)\(([^()]*)\)/);
  if (funcMatch) {
    const fn = funcMatch[1];
    const argsStr = funcMatch[2];
    let argResult: number | null = null;

    // First try to evaluate the argument as a simple number
    if (/^[-+]?\d*\.?\d+([eE][-+]?\d+)?$/.test(argsStr)) {
      argResult = parseFloat(argsStr);
    } else {
      // Otherwise, try to evaluate as an expression
      argResult = evaluateMathExpression(argsStr, variables);
    }

    // If we couldn't evaluate the argument, try replacing PI and E
    if (argResult === null) {
      const processedArgs = argsStr
        .replace(/PI/g, Math.PI.toString())
        .replace(/E/g, Math.E.toString());

      if (/^[-+]?\d*\.?\d+([eE][-+]?\d+)?$/.test(processedArgs)) {
        argResult = parseFloat(processedArgs);
      } else {
        argResult = evaluateMathExpression(processedArgs, variables);
      }
    }

    if (argResult === null) return null;

    // Apply the function to the evaluated argument
    switch (fn) {
      case 'sin':
        return Math.sin(argResult);
      case 'cos':
        return Math.cos(argResult);
      case 'tan':
        return Math.tan(argResult);
      case 'sqrt':
        return argResult >= 0 ? Math.sqrt(argResult) : null;
      case 'log':
        return argResult > 0 ? Math.log(argResult) : null;
      case 'pow':
        // pow should be handled differently as it needs two arguments
        return null;
      default:
        return null;
    }
  }

  // Handle multiplication and division (left to right)
  const mulDivMatch = expr.match(/^([-+]?[\d.]+)([*/])([-+]?[\d.]+)$/);
  if (mulDivMatch) {
    const [_, a, op, b] = mulDivMatch;
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) return null;

    if (op === '*') return numA * numB;
    if (op === '/') return numB !== 0 ? numA / numB : null;
    if (op === '/' && numB !== 0) return numA / numB;
    return null;
  }

  // Handle addition and subtraction (left to right)
  const addSubMatch = expr.match(/^([-+]?[\d.]+)([+-])([-+]?[\d.]+)$/);
  if (addSubMatch) {
    const [_, a, op, b] = addSubMatch;
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) return null;

    return op === '+' ? numA + numB : numA - numB;
  }

  // Handle variables and constants
  const varMatch = expr.match(/^[a-zA-Z]+$/);
  if (varMatch) {
    const varName = varMatch[0];
    const upperVarName = varName.toUpperCase();

    // Check for constants first (case-insensitive)
    if (upperVarName === 'PI') return Math.PI;
    if (upperVarName === 'E') return Math.E;

    // Then check for variables (case-sensitive)
    if (variables.hasOwnProperty(varName)) {
      return variables[varName];
    }

    // If it's a single variable not found in variables, return null
    return null;
  }

  // Handle implicit multiplication (e.g., 2x, 2PI, etc.)
  const implicitMultMatch = expr.match(/^([-+]?\d*\.?\d+)([a-zA-Z]+)$/);
  if (implicitMultMatch) {
    const [_, numStr, varPart] = implicitMultMatch;
    const num = parseFloat(numStr);
    const varValue = evaluateMathExpression(varPart, variables);

    if (varValue !== null) {
      const result = num * varValue;
      return isFinite(result) ? result : null;
    }
  }

  // Handle expressions with operators in the middle (e.g., a + b, 2 * x, etc.)
  const operatorMatch = expr.match(/^(.+?)([+\-*/])(.+)$/);
  if (operatorMatch) {
    const [_, left, op, right] = operatorMatch;
    const leftVal = evaluateMathExpression(left, variables);
    const rightVal = evaluateMathExpression(right, variables);

    if (leftVal === null || rightVal === null) return null;

    switch (op) {
      case '+': return leftVal + rightVal;
      case '-': return leftVal - rightVal;
      case '*': return leftVal * rightVal;
      case '/': return rightVal !== 0 ? leftVal / rightVal : null;
    }
  }

  // If we get here, the expression couldn't be evaluated
  return null;


}
