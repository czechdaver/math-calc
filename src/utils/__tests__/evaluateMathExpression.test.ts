import { evaluateMathExpression } from '../calculatorUtils.new';

describe('evaluateMathExpression', () => {
  // Test basic arithmetic
  test('evaluates basic arithmetic', () => {
    expect(evaluateMathExpression('2 + 2')).toBe(4);
    expect(evaluateMathExpression('10 - 3')).toBe(7);
    expect(evaluateMathExpression('4 * 5')).toBe(20);
    expect(evaluateMathExpression('20 / 4')).toBe(5);
  });

  // Test order of operations
  test('respects order of operations', () => {
    expect(evaluateMathExpression('2 + 3 * 4')).toBe(14);
    expect(evaluateMathExpression('(2 + 3) * 4')).toBe(20);
    expect(evaluateMathExpression('2 + 3 * 4 - 6 / 2')).toBe(11);
  });

  // Test constants
  test('evaluates constants', () => {
    expect(evaluateMathExpression('PI')).toBeCloseTo(Math.PI);
    expect(evaluateMathExpression('E')).toBeCloseTo(Math.E);
    expect(evaluateMathExpression('pi')).toBeCloseTo(Math.PI); // case insensitive
    expect(evaluateMathExpression('e')).toBeCloseTo(Math.E);   // case insensitive
  });

  // Test functions
  test('evaluates functions', () => {
    expect(evaluateMathExpression('sin(0)')).toBe(0);
    expect(evaluateMathExpression('cos(0)')).toBe(1);
    expect(evaluateMathExpression('sqrt(16)')).toBe(4);
    expect(evaluateMathExpression('log(1)')).toBe(0);
    expect(evaluateMathExpression('pow(2, 3)')).toBe(8);
  });

  // Test functions with constants
  test('evaluates functions with constants', () => {
    expect(evaluateMathExpression('sin(PI/2)')).toBeCloseTo(1);
    expect(evaluateMathExpression('cos(PI)')).toBeCloseTo(-1);
    expect(evaluateMathExpression('sqrt(E^2)')).toBeCloseTo(Math.E);
  });

  // Test variables
  test('evaluates with variables', () => {
    expect(evaluateMathExpression('x', { x: 5 })).toBe(5);
    expect(evaluateMathExpression('x + y', { x: 2, y: 3 })).toBe(5);
    expect(evaluateMathExpression('sqrt(x)', { x: 16 })).toBe(4);
  });

  // Test error cases
  test('returns null for invalid expressions', () => {
    expect(evaluateMathExpression('')).toBeNull();
    expect(evaluateMathExpression('   ')).toBeNull();
    expect(evaluateMathExpression('x')).toBeNull();
    expect(evaluateMathExpression('sqrt(-1)')).toBeNull();
    expect(evaluateMathExpression('1 / 0')).toBeNull();
    expect(evaluateMathExpression('sin()')).toBeNull();
    expect(evaluateMathExpression('pow(2)')).toBeNull();
  });

  // Test scientific notation
  test('handles scientific notation', () => {
    expect(evaluateMathExpression('1e3')).toBe(1000);
    expect(evaluateMathExpression('1.5e-2')).toBe(0.015);
    expect(evaluateMathExpression('2.5e3 + 1.5e3')).toBe(4000);
  });
});
