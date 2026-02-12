import { useState } from 'react';

type Country = 'cz' | 'sk';

interface NetSalaryResult {
  grossSalary: number;
  netSalary: number;
  socialInsurance: number;
  healthInsurance: number;
  tax: number;
  totalDeductions: number;
  deductionPercent: number;
  isValid: boolean;
}

const taxRates: Record<Country, { social: number; health: number; tax: number }> = {
  cz: { social: 0.065, health: 0.045, tax: 0.15 },
  sk: { social: 0.094, health: 0.04, tax: 0.19 }
};

export function useNetSalaryCalculator() {
  const [grossSalary, setGrossSalary] = useState<string>('30000');
  const [country, setCountry] = useState<Country>('cz');
  const [result, setResult] = useState<NetSalaryResult | null>(null);
  const [errors, setErrors] = useState<{ grossSalary?: string }>({});

  const validate = (errorMsg: string): boolean => {
    const newErrors: { grossSalary?: string } = {};
    const gross = parseFloat(grossSalary);
    if (!grossSalary || isNaN(gross) || gross <= 0) {
      newErrors.grossSalary = errorMsg;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    const gross = parseFloat(grossSalary) || 0;
    const rates = taxRates[country];

    const socialInsurance = gross * rates.social;
    const healthInsurance = gross * rates.health;
    const taxBase = gross - socialInsurance - healthInsurance;
    const tax = Math.max(0, taxBase * rates.tax);
    const netSalary = gross - socialInsurance - healthInsurance - tax;
    const totalDeductions = gross - netSalary;
    const deductionPercent = gross > 0 ? (totalDeductions / gross) * 100 : 0;

    setResult({
      grossSalary: gross,
      netSalary,
      socialInsurance,
      healthInsurance,
      tax,
      totalDeductions,
      deductionPercent,
      isValid: true
    });
  };

  return {
    grossSalary, setGrossSalary,
    country, setCountry,
    result, errors, validate, calculate
  };
}
