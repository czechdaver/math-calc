// src/utils/math/fractions.ts
// Shared math utilities for fraction operations

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface MixedNumber {
  whole: number;
  numerator: number;
  denominator: number;
}

export interface FractionStep {
  description: string;
  expression: string;
}

/** Greatest Common Divisor (Euclidean algorithm) */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

/** Least Common Multiple */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

/** Simplify a fraction to lowest terms */
export function simplifyFraction(f: Fraction): Fraction {
  if (f.denominator === 0) return f;
  const d = gcd(Math.abs(f.numerator), Math.abs(f.denominator));
  let num = f.numerator / d;
  let den = f.denominator / d;
  // Keep negative sign on numerator only
  if (den < 0) {
    num = -num;
    den = -den;
  }
  return { numerator: num, denominator: den };
}

/** Add two fractions */
export function addFractions(a: Fraction, b: Fraction): Fraction {
  const num = a.numerator * b.denominator + b.numerator * a.denominator;
  const den = a.denominator * b.denominator;
  return simplifyFraction({ numerator: num, denominator: den });
}

/** Subtract two fractions */
export function subtractFractions(a: Fraction, b: Fraction): Fraction {
  const num = a.numerator * b.denominator - b.numerator * a.denominator;
  const den = a.denominator * b.denominator;
  return simplifyFraction({ numerator: num, denominator: den });
}

/** Multiply two fractions */
export function multiplyFractions(a: Fraction, b: Fraction): Fraction {
  const num = a.numerator * b.numerator;
  const den = a.denominator * b.denominator;
  return simplifyFraction({ numerator: num, denominator: den });
}

/** Divide two fractions */
export function divideFractions(a: Fraction, b: Fraction): Fraction {
  if (b.numerator === 0) return { numerator: 0, denominator: 0 };
  const num = a.numerator * b.denominator;
  const den = a.denominator * b.numerator;
  return simplifyFraction({ numerator: num, denominator: den });
}

/** Convert fraction to decimal */
export function fractionToDecimal(f: Fraction): number {
  if (f.denominator === 0) return NaN;
  return f.numerator / f.denominator;
}

/** Convert decimal to fraction (with precision limit) */
export function decimalToFraction(decimal: number): Fraction {
  if (!isFinite(decimal)) return { numerator: 0, denominator: 1 };
  if (Number.isInteger(decimal)) return { numerator: decimal, denominator: 1 };

  const sign = decimal < 0 ? -1 : 1;
  decimal = Math.abs(decimal);
  const precision = 1e10;
  const num = Math.round(decimal * precision);
  const den = precision;
  const d = gcd(num, den);
  return { numerator: sign * (num / d), denominator: den / d };
}

/** Convert improper fraction to mixed number */
export function improperToMixed(f: Fraction): MixedNumber {
  const simplified = simplifyFraction(f);
  const whole = Math.trunc(simplified.numerator / simplified.denominator);
  const remainder = Math.abs(simplified.numerator % simplified.denominator);
  return {
    whole,
    numerator: remainder,
    denominator: Math.abs(simplified.denominator)
  };
}

/** Convert mixed number to improper fraction */
export function mixedToImproper(m: MixedNumber): Fraction {
  const sign = m.whole < 0 ? -1 : 1;
  const num = Math.abs(m.whole) * m.denominator + m.numerator;
  return { numerator: sign * num, denominator: m.denominator };
}

/** Format fraction as string: "a/b" */
export function formatFraction(f: Fraction): string {
  return `${f.numerator}/${f.denominator}`;
}

/** Format mixed number as string: "W a/b" or just "W" */
export function formatMixed(m: MixedNumber): string {
  if (m.numerator === 0) return `${m.whole}`;
  if (m.whole === 0) return `${m.numerator}/${m.denominator}`;
  return `${m.whole} ${m.numerator}/${m.denominator}`;
}

/** Check if a fraction is valid (non-zero denominator, integer parts) */
export function isValidFraction(num: string, den: string): { valid: boolean; error?: string } {
  const n = parseInt(num, 10);
  const d = parseInt(den, 10);
  if (num === '' || den === '') return { valid: false };
  if (isNaN(n) || isNaN(d)) return { valid: false, error: 'invalid_number' };
  if (d === 0) return { valid: false, error: 'zero_denominator' };
  return { valid: true };
}

/** Generate step-by-step for addition */
export function additionSteps(a: Fraction, b: Fraction): FractionStep[] {
  const steps: FractionStep[] = [];
  const commonDen = lcm(a.denominator, b.denominator);
  const multA = commonDen / a.denominator;
  const multB = commonDen / b.denominator;
  const newNumA = a.numerator * multA;
  const newNumB = b.numerator * multB;
  const resultNum = newNumA + newNumB;
  const result = simplifyFraction({ numerator: resultNum, denominator: commonDen });

  steps.push({
    description: 'find_lcd',
    expression: `LCD(${a.denominator}, ${b.denominator}) = ${commonDen}`
  });
  steps.push({
    description: 'convert_fractions',
    expression: `${a.numerator}×${multA}/${a.denominator}×${multA} + ${b.numerator}×${multB}/${b.denominator}×${multB} = ${newNumA}/${commonDen} + ${newNumB}/${commonDen}`
  });
  steps.push({
    description: 'add_numerators',
    expression: `(${newNumA} + ${newNumB})/${commonDen} = ${resultNum}/${commonDen}`
  });
  if (resultNum !== result.numerator || commonDen !== result.denominator) {
    const d = gcd(Math.abs(resultNum), commonDen);
    steps.push({
      description: 'simplify',
      expression: `${resultNum}÷${d}/${commonDen}÷${d} = ${result.numerator}/${result.denominator}`
    });
  }
  return steps;
}

/** Generate step-by-step for subtraction */
export function subtractionSteps(a: Fraction, b: Fraction): FractionStep[] {
  const steps: FractionStep[] = [];
  const commonDen = lcm(a.denominator, b.denominator);
  const multA = commonDen / a.denominator;
  const multB = commonDen / b.denominator;
  const newNumA = a.numerator * multA;
  const newNumB = b.numerator * multB;
  const resultNum = newNumA - newNumB;
  const result = simplifyFraction({ numerator: resultNum, denominator: commonDen });

  steps.push({
    description: 'find_lcd',
    expression: `LCD(${a.denominator}, ${b.denominator}) = ${commonDen}`
  });
  steps.push({
    description: 'convert_fractions',
    expression: `${newNumA}/${commonDen} - ${newNumB}/${commonDen}`
  });
  steps.push({
    description: 'subtract_numerators',
    expression: `(${newNumA} - ${newNumB})/${commonDen} = ${resultNum}/${commonDen}`
  });
  if (resultNum !== result.numerator || commonDen !== result.denominator) {
    const d = gcd(Math.abs(resultNum), commonDen);
    steps.push({
      description: 'simplify',
      expression: `${resultNum}÷${d}/${commonDen}÷${d} = ${result.numerator}/${result.denominator}`
    });
  }
  return steps;
}

/** Generate step-by-step for multiplication */
export function multiplicationSteps(a: Fraction, b: Fraction): FractionStep[] {
  const steps: FractionStep[] = [];
  const rawNum = a.numerator * b.numerator;
  const rawDen = a.denominator * b.denominator;
  const result = simplifyFraction({ numerator: rawNum, denominator: rawDen });

  steps.push({
    description: 'multiply_numerators',
    expression: `${a.numerator} × ${b.numerator} = ${rawNum}`
  });
  steps.push({
    description: 'multiply_denominators',
    expression: `${a.denominator} × ${b.denominator} = ${rawDen}`
  });
  steps.push({
    description: 'raw_result',
    expression: `${rawNum}/${rawDen}`
  });
  if (rawNum !== result.numerator || rawDen !== result.denominator) {
    const d = gcd(Math.abs(rawNum), rawDen);
    steps.push({
      description: 'simplify',
      expression: `${rawNum}÷${d}/${rawDen}÷${d} = ${result.numerator}/${result.denominator}`
    });
  }
  return steps;
}

/** Generate step-by-step for division */
export function divisionSteps(a: Fraction, b: Fraction): FractionStep[] {
  const steps: FractionStep[] = [];
  steps.push({
    description: 'flip_second',
    expression: `${formatFraction(a)} × ${b.denominator}/${b.numerator}`
  });
  const rawNum = a.numerator * b.denominator;
  const rawDen = a.denominator * b.numerator;
  const result = simplifyFraction({ numerator: rawNum, denominator: rawDen });

  steps.push({
    description: 'multiply',
    expression: `${rawNum}/${rawDen}`
  });
  if (rawNum !== result.numerator || rawDen !== result.denominator) {
    const d = gcd(Math.abs(rawNum), Math.abs(rawDen));
    steps.push({
      description: 'simplify',
      expression: `${rawNum}÷${d}/${rawDen}÷${d} = ${result.numerator}/${result.denominator}`
    });
  }
  return steps;
}
