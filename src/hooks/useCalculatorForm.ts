// src/hooks/useCalculatorForm.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useValidation, ValidationRules } from './useValidation';

export interface UseCalculatorFormProps<T extends Record<string, any>> {
  initialValues: T;
  validationRules?: ValidationRules;
  onSubmit?: (values: T) => void;
  validateOnChange?: boolean;
}

export interface UseCalculatorFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (field: keyof T, value: any) => void;
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: T | ((prev: T) => T)) => void;
  validate: () => boolean;
  reset: () => void;
  clearErrors: () => void;
}

/**
 * Hook for managing calculator form state with validation.
 * Combines form state management with validation rules.
 *
 * @param props - Form configuration
 * @returns Form state and control functions
 *
 * @example
 * const { values, errors, handleChange, validate, reset } = useCalculatorForm({
 *   initialValues: { height: '', weight: '' },
 *   validationRules: {
 *     height: { required: true, min: 50, max: 250 },
 *     weight: { required: true, min: 10, max: 500 }
 *   }
 * });
 */
export function useCalculatorForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
  validateOnChange = true
}: UseCalculatorFormProps<T>): UseCalculatorFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [isDirty, setIsDirty] = useState(false);
  const { errors, isValid, validate, validateField, clearErrors, clearFieldError } = useValidation(validationRules);

  // Reset isDirty when values are reset
  useEffect(() => {
    if (!isDirty) {
      setValues(initialValues);
    }
  }, [initialValues]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);

    if (validateOnChange) {
      validateField(String(field), value);
    }
  }, [validateOnChange, validateField]);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setIsDirty(false);
    clearErrors();
  }, [initialValues, clearErrors]);

  // Wrapper for validate that passes current values
  const validateForm = useCallback((): boolean => {
    return validate(values);
  }, [validate, values]);

  return {
    values,
    errors,
    isValid,
    isDirty,
    handleChange,
    setValue,
    setValues,
    validate: validateForm,
    reset,
    clearErrors
  };
}
