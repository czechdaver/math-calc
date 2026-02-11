// src/hooks/useNumberInput.ts
'use client';

import { useState, useCallback } from 'react';
import { isValidNumber } from '@/lib/calculatorValidation';

export interface UseNumberInputOptions {
  min?: number;
  max?: number;
  required?: boolean;
  integerOnly?: boolean;
  decimals?: number;
  initialValue?: string;
}

export interface UseNumberInputReturn {
  value: string;
  error: string | undefined;
  isValid: boolean;
  setValue: (value: string) => void;
  clearError: () => void;
  validate: () => boolean;
  reset: () => void;
}

/**
 * Hook for managing number input state with validation.
 * Provides automatic validation, error handling, and value management.
 *
 * @param options - Validation options
 * @returns Number input state and control functions
 *
 * @example
 * const { value, error, setValue, validate } = useNumberInput({
 *   min: 0,
 *   max: 100,
 *   required: true,
 *   integerOnly: true
 * });
 */
export function useNumberInput(options: UseNumberInputOptions = {}): UseNumberInputReturn {
  const {
    min,
    max,
    required = false,
    integerOnly = false,
    decimals,
    initialValue = ''
  } = options;

  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | undefined>();

  const validate = useCallback((): boolean => {
    // Check required
    if (required && !value) {
      setError('Toto pole je povinné');
      return false;
    }

    // Skip validation if empty and not required
    if (!value && !required) {
      setError(undefined);
      return true;
    }

    // Check if valid number
    if (!isValidNumber(value)) {
      setError('Prosím zadejte platné číslo');
      return false;
    }

    const numValue = parseFloat(value);

    // Check integer only
    if (integerOnly && !Number.isInteger(numValue)) {
      setError('Prosím zadejte celé číslo');
      return false;
    }

    // Check decimals
    if (decimals !== undefined) {
      const decimalPart = value.split('.')[1];
      if (decimalPart && decimalPart.length > decimals) {
        setError(`Maximálně ${decimals} desetinných míst`);
        return false;
      }
    }

    // Check min
    if (min !== undefined && numValue < min) {
      setError(`Hodnota musí být alespoň ${min}`);
      return false;
    }

    // Check max
    if (max !== undefined && numValue > max) {
      setError(`Hodnota musí být nejvíce ${max}`);
      return false;
    }

    setError(undefined);
    return true;
  }, [value, required, integerOnly, decimals, min, max]);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(undefined);
  }, [initialValue]);

  return {
    value,
    error,
    isValid: !error,
    setValue,
    clearError,
    validate,
    reset
  };
}
