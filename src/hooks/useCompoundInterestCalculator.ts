import { useState } from 'react';

type Frequency = 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily';

interface CompoundInterestResult {
  futureValue: number;
  totalContributions: number;
  interestEarned: number;
  isValid: boolean;
}

const periodsPerYear: Record<Frequency, number> = {
  daily: 365,
  monthly: 12,
  quarterly: 4,
  'semi-annually': 2,
  annually: 1
};

export function useCompoundInterestCalculator() {
  const [principal, setPrincipal] = useState<string>('10000');
  const [interestRate, setInterestRate] = useState<string>('5');
  const [years, setYears] = useState<string>('10');
  const [frequency, setFrequency] = useState<Frequency>('annually');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('0');
  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const [errors, setErrors] = useState<{ principal?: string; interestRate?: string; years?: string }>({});

  const validate = (validateErrors: Record<string, string>) => {
    const newErrors: { principal?: string; interestRate?: string; years?: string } = {};
    const p = parseFloat(principal);
    const r = parseFloat(interestRate);
    const y = parseFloat(years);

    if (!principal || isNaN(p) || p < 0) newErrors.principal = validateErrors.principal;
    if (!interestRate || isNaN(r) || r < 0 || r > 100) newErrors.interestRate = validateErrors.interestRate;
    if (!years || isNaN(y) || y < 1 || y > 100) newErrors.years = validateErrors.years;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    const p = parseFloat(principal) || 0;
    const annualRate = (parseFloat(interestRate) || 0) / 100;
    const y = parseFloat(years) || 0;
    const mc = parseFloat(monthlyContribution) || 0;
    const n = periodsPerYear[frequency];

    const ratePerPeriod = annualRate / n;
    const totalPeriods = y * n;

    let futureValue = p * Math.pow(1 + ratePerPeriod, totalPeriods);

    if (mc > 0 && annualRate > 0) {
      const monthlyRate = annualRate / 12;
      futureValue += mc * ((Math.pow(1 + monthlyRate, y * 12) - 1) / monthlyRate);
    } else if (mc > 0) {
      futureValue += mc * 12 * y;
    }

    const totalContributions = p + (mc * 12 * y);
    const interestEarned = futureValue - totalContributions;

    setResult({ futureValue, totalContributions, interestEarned, isValid: true });
  };

  return {
    principal, setPrincipal,
    interestRate, setInterestRate,
    years, setYears,
    frequency, setFrequency,
    monthlyContribution, setMonthlyContribution,
    result, errors, validate, calculate
  };
}
