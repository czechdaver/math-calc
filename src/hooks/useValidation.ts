// src/hooks/useValidation.ts
'use client';

import { useState, useCallback } from 'react';

export type ValidationRule = {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
};

export type ValidationRules = Record<string, ValidationRule>;

export interface UseValidationReturn {
  errors: Record<string, string>;
  isValid: boolean;
  validate: (data: Record<string, any>) => boolean;
  validateField: (field: string, value: any) => string | null;
  clearErrors: () => void;
  clearFieldError: (field: string) => void;
}

/**
 * Hook for form validation with configurable rules.
 * Supports common validation patterns and custom validators.
 *
 * @param rules - Validation rules for each field
 * @returns Validation state and validation functions
 *
 * @example
 * const { errors, validate, clearFieldError } = useValidation({
 *   email: {
 *     required: true,
 *     pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
 *   },
 *   age: {
 *     required: true,
 *     min: 18,
 *     max: 120
 *   }
 * });
 */
export function useValidation(rules: ValidationRules): UseValidationReturn {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((field: string, value: any): string | null => {
    const rule = rules[field];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value === '')) {
      return 'Toto pole je povinné';
    }

    // Skip other validations if value is empty and not required
    if (!value || value === '') {
      return null;
    }

    // Min validation (for numbers)
    if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
      return `Hodnota musí být alespoň ${rule.min}`;
    }

    // Max validation (for numbers)
    if (rule.max !== undefined && typeof value === 'number' && value > rule.max) {
      return `Hodnota musí být nejvíce ${rule.max}`;
    }

    // MinLength validation (for strings)
    if (rule.minLength !== undefined && typeof value === 'string' && value.length < rule.minLength) {
      return `Minimální délka je ${rule.minLength} znaků`;
    }

    // MaxLength validation (for strings)
    if (rule.maxLength !== undefined && typeof value === 'string' && value.length > rule.maxLength) {
      return `Maximální délka je ${rule.maxLength} znaků`;
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return 'Formát hodnoty není správný';
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const validate = useCallback((data: Record<string, any>): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const field in rules) {
      const error = validateField(field, data[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    validate,
    validateField,
    clearErrors,
    clearFieldError
  };
}
