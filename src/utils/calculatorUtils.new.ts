/**
 * Common utility functions for calculator components
 */

// Helper function to evaluate binary operations
const evaluateBinaryOperation = (a: number, b: number, op: string): number | null => {
  try {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : null;
      case '^': return Math.pow(a, b);
      default: return null;
    }
  } catch (e) {
    return null;
  }
};

// Helper to evaluate a single token (number or variable)
const evaluateToken = (token: string, variables: Record<string, number>): number | null => {
  // Check if it's a number
  if (/^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/.test(token)) {
    return parseFloat(token);
  }
  
  // Check for constants (case-insensitive)
  const upperToken = token.toUpperCase();
  if (upperToken === 'PI') return Math.PI;
  if (upperToken === 'E') return Math.E;
  
  // Check for variables (case-sensitive)
  if (variables.hasOwnProperty(token)) {
    return variables[token];
  }
  
  return null;
};

// Helper to evaluate a function call
const evaluateFunction = (fn: string, argStr: string, variables: Record<string, number>): number | null => {
  // Evaluate the argument expression
  const arg = evaluateMathExpression(argStr, variables);
  if (arg === null) return null;
  
  // Apply the function
  switch (fn.toLowerCase()) {
    case 'sin': return Math.sin(arg);
    case 'cos': return Math.cos(arg);
    case 'tan': return Math.tan(arg);
    case 'sqrt': return arg >= 0 ? Math.sqrt(arg) : null;
    case 'log': return arg > 0 ? Math.log(arg) : null;
    default: return null;
  }
};

// Helper to evaluate power operation (right-associative)
const evaluatePower = (tokens: string[], variables: Record<string, number>): number | null => {
  let result = evaluateToken(tokens[0], variables);
  if (result === null) return null;
  
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    if (op !== '^') continue;
    
    const right = evaluateToken(tokens[i + 1], variables);
    if (right === null) return null;
    
    result = Math.pow(result, right);
  }
  
  return result;
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
    const varMatch = expr.match(/^[a-zA-Z]+$/);
    if (varMatch) {
      const varName = varMatch[0];
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
    const parenMatch = expr.match(/\(([^()]+)\)/);
    if (parenMatch) {
      const innerExpr = parenMatch[1];
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
      const newExpr = expr.replace(parenMatch[0], innerResult.toString());
      return evaluateMathExpression(newExpr, variables);
    }
    
    // Handle mathematical functions (sin, cos, tan, sqrt, log, pow)
    const functionMatch = expr.match(/(sin|cos|tan|sqrt|log|pow)\(([^()]*)\)/);
    if (functionMatch) {
      const [fullMatch, fn, argsStr] = functionMatch;
      
      // First try to evaluate the arguments as an expression
      let argResult = evaluateMathExpression(argsStr, variables);
      
      // If that fails, try replacing PI and E in the arguments
      if (argResult === null) {
        const processedArgs = argsStr
          .replace(/PI/g, Math.PI.toString())
          .replace(/E/g, Math.E.toString());
        
        // Handle pow function with two arguments
        if (fn === 'pow') {
          const args = processedArgs.split(',').map(s => s.trim());
          if (args.length !== 2) return null;
          
          const base = evaluateMathExpression(args[0], variables);
          const exp = evaluateMathExpression(args[1], variables);
          
          if (base === null || exp === null) return null;
          return Math.pow(base, exp);
        }
        
        // For single-argument functions, evaluate the processed arguments
        argResult = evaluateMathExpression(processedArgs, variables);
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
          // If we get here, pow wasn't handled above, which shouldn't happen
          return null;
        default:
          return null;
      }
    }
    
    // Handle binary operations (+, -, *, /, ^)
    const binaryOpMatch = expr.match(/^([-+]?\d*\.?\d+)([+\-*/^])([-+]?\d*\.?\d+)$/);
    if (binaryOpMatch) {
      const [_, a, op, b] = binaryOpMatch;
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      
      if (isNaN(numA) || isNaN(numB)) return null;
      
      return evaluateBinaryOperation(numA, numB, op);
    }
    
    // If we get here, we couldn't evaluate the expression
    return null;
    
  } catch (error) {
    console.error('Error evaluating expression:', error);
    return null;
  }
};
