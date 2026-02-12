// src/hooks/useNPVCalculator.ts
import { useState, useEffect } from 'react';
import type { CashFlow } from '@/components/calculators/shared/CashFlowEditor';

export interface NPVResult {
  npv: number;
  totalInvestment: number;
  totalReturns: number;
  profitabilityIndex: number;
  presentValueOfReturns: number;
  discountRate: number;
}

export function calculateNPV(rate: number, flows: CashFlow[]): number {
  return flows.reduce((npv, flow) => {
    return npv + (flow.amount / Math.pow(1 + rate / 100, flow.period));
  }, 0);
}

export function calculatePresentValue(amount: number, period: number, rate: number): number {
  return amount / Math.pow(1 + rate / 100, period);
}

interface NPVValidationMessages {
  discountRate: string;
  cashFlow: string;
}

export function useNPVCalculator(validationMessages: NPVValidationMessages) {
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([
    { period: 0, amount: -100000 },
    { period: 1, amount: 25000 },
    { period: 2, amount: 30000 },
    { period: 3, amount: 35000 },
    { period: 4, amount: 40000 },
  ]);
  const [discountRate, setDiscountRate] = useState<string>('10');
  const [result, setResult] = useState<NPVResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    const rateNum = parseFloat(discountRate);
    if (!discountRate || isNaN(rateNum) || rateNum < 0) {
      newErrors.discountRate = validationMessages.discountRate;
    }
    cashFlows.forEach((flow, index) => {
      if (isNaN(flow.amount)) {
        newErrors[`cashFlow_${index}`] = validationMessages.cashFlow;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (!validateInputs()) {
      setResult(null);
      return;
    }
    const rate = parseFloat(discountRate);
    const npv = calculateNPV(rate, cashFlows);
    const totalInvestment = Math.abs(cashFlows.filter(f => f.amount < 0).reduce((s, f) => s + f.amount, 0));
    const totalReturns = cashFlows.filter(f => f.amount > 0).reduce((s, f) => s + f.amount, 0);
    const presentValueOfReturns = cashFlows
      .filter(f => f.amount > 0)
      .reduce((s, f) => s + calculatePresentValue(f.amount, f.period, rate), 0);
    const profitabilityIndex = totalInvestment > 0 ? presentValueOfReturns / totalInvestment : 0;

    setResult({ npv, totalInvestment, totalReturns, profitabilityIndex, presentValueOfReturns, discountRate: rate });
  }, [cashFlows, discountRate]);

  return { cashFlows, setCashFlows, discountRate, setDiscountRate, result, errors };
}
