// src/components/calculators/CalculatorBase.tsx
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'select' | 'radio' | 'checkbox' | 'text';
  required?: boolean;
  min?: number;
  max?: number;
  step?: number | string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  helpText?: string;
  unit?: string;
  defaultValue?: any;
}

export interface CalculatorResult {
  value: any;
  details?: {
    label: string;
    value: any;
    unit?: string;
    highlight?: boolean;
  }[];
  formula?: string;
  explanation?: string;
}

interface CalculatorBaseProps {
  id: string;
  title: string;
  description?: string;
  category: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  inputs: CalculatorInput[];
  calculate: (inputs: Record<string, any>) => CalculatorResult;
  resultComponent?: React.ComponentType<{ result: CalculatorResult }>;
  className?: string;
}

const CalculatorBase: React.FC<CalculatorBaseProps> = ({
  id,
  title,
  description,
  inputs,
  calculate,
  resultComponent: ResultComponent,
  className = '',
}) => {
  const t = useTranslations();
  
  // Initialize form state with default values
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const initialValues: Record<string, any> = {};
    inputs.forEach((input) => {
      initialValues[input.id] = input.defaultValue ?? '';
    });
    return initialValues;
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form inputs
  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    inputs.forEach((input) => {
      const value = formValues[input.id];
      
      // Check required fields
      if (input.required && (value === '' || value === undefined || value === null)) {
        newErrors[input.id] = t('validation.required');
        isValid = false;
      }
      
      // Check min/max for number inputs
      if (input.type === 'number' && value !== '') {
        const numValue = parseFloat(value);
        
        if (input.min !== undefined && numValue < input.min) {
          newErrors[input.id] = t('validation.min', { min: input.min });
          isValid = false;
        }
        
        if (input.max !== undefined && numValue > input.max) {
          newErrors[input.id] = t('validation.max', { max: input.max });
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle input changes
  const handleInputChange = (id: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Perform calculation
  const handleCalculate = () => {
    if (validateInputs()) {
      try {
        const calculationResult = calculate(formValues);
        setResult(calculationResult);
      } catch (error) {
        // Only log in development for debugging
        if (process.env.NODE_ENV !== 'production') {
          console.error('Calculation error:', error);
        }
        // Set a generic error message
        setErrors((prev) => ({
          ...prev,
          _calculation: t('validation.calculation_error'),
        }));
      }
    }
  };

  // Recalculate when inputs change
  useEffect(() => {
    handleCalculate();
  }, [formValues]);

  // Render input field based on type
  const renderInput = (input: CalculatorInput) => {
    const { id, label, type, placeholder, helpText, unit, options = [], ...rest } = input;
    const inputId = `input-${id}`;
    const error = errors[id];

    const inputProps = {
      id: inputId,
      name: id,
      value: formValues[id] ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        handleInputChange(id, e.target.value),
      className: `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
        error ? 'border-red-500' : ''
      }`,
      ...rest,
    };

    return (
      <div key={id} className="mb-4">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          {type === 'select' ? (
            <select {...inputProps}>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <>
              <input
                type={type}
                {...inputProps}
                className={`${inputProps.className} pr-10`}
              />
              {unit && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{unit}</span>
                </div>
              )}
            </>
          )}
        </div>
        {helpText && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      
      <div className="space-y-4">
        {inputs.map((input) => renderInput(input))}
      </div>

      {errors._calculation && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {errors._calculation}
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-lg font-semibold mb-2">{t('result')}</h3>
          
          {/* Default result display */}
          {!ResultComponent && (
            <div>
              <p className="text-2xl font-bold">{result.value}</p>
              
              {result.details && result.details.length > 0 && (
                <div className="mt-4 space-y-2">
                  {result.details.map((detail, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-700">{detail.label}:</span>
                      <span className="font-medium">
                        {detail.value} {detail.unit || ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {result.formula && (
                <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">{t('formula')}:</p>
                  <div className="text-sm font-mono">{result.formula}</div>
                </div>
              )}
              
              {result.explanation && (
                <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-800">
                  {result.explanation}
                </div>
              )}
            </div>
          )}
          
          {/* Custom result display */}
          {ResultComponent && <ResultComponent result={result} />}
        </div>
      )}
    </div>
  );
};

export default CalculatorBase;
