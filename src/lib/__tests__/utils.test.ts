import { toTitleCase } from '../utils';

describe('toTitleCase', () => {
  it('should convert a string to title case', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
    expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
    expect(toTitleCase('hElLo wOrLd')).toBe('Hello World');
  });

  it('should handle empty strings', () => {
    expect(toTitleCase('')).toBe('');
  });

  it('should handle single character strings', () => {
    expect(toTitleCase('a')).toBe('A');
    expect(toTitleCase('A')).toBe('A');
  });
});
