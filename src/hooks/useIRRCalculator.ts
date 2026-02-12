// src/hooks/useIRRCalculator.ts
import { useState, useEffect } from 'react';
import type { CashFlow } from '@/components/calculators/shared/CashFlowEditor';
import { calculateNPV } from './useNPVCalculator';

export interface IRRResult {
  irr: number;
  npv: number;
  paybackPeriod: number;
  totalInvestment: number;
  totalReturns: number;
  netProfit: number;
}

function calculateIRR(flows: CashFlow[]): number {
  let rate = 10;
  const maxIterations = 100;
  const tolerance = 0.0001;

  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPV(rate, flows);
    const derivative = flows.reduce((sum, flow) => {
      if (flow.period === 0) return sum;
      return sum - (flow.period * flow.amount) / Math.pow(1 + rate / 100, flow.period + 1) / 100;
    }, 0);

    if (Math.abs(derivative) < tolerance) break;

    const newRate = rate - npv / derivative;
    if (Math.abs(newRate - rate) < tolerance) return newRate;
    rate = newRate;
  }
  return rate;
}

function calculatePaybackPeriod(flows: CashFlow[]): number {
  let cumulative = 0;
  for (let i = 0; i < flows.length; i++) {
    cumulative += flows[i].amount;
    if (cumulative > 0 && i > 0) {
      const prev = cumulative - flows[i].amount;
      const fraction = -prev / flows[i].amount;
      return flows[i].period - 1 + fraction;
    }
  }
  return Infinity;
}

interface IRRValidationMessages {
  discountRate: string;
  cashFlows: string;
  cashFlow: string;
}

export function useIRRCalculator(validationMessages: IRRValidationMessages) {
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([
    { period: 0, amount: -100000 },
    { period: 1, amount: 25000 },
    { period: 2, amount: 30000 },
    { period: 3, amount: 35000 },
    { period: 4, amount: 40000 },
  ]);
  const [discountRate, setDiscountRate] = useState<string>('10');
  const [result, setResult] = useState<IRRResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    const rateNum = parseFloat(discountRate);
    if (!discountRate || isNaN(rateNum)) {
      newErrors.discountRate = validationMessages.discountRate;
    }
    const hasNeg = cashFlows.some(f => f.amount < 0);
    const hasPos = cashFlows.some(f => f.amount > 0);
    if (!hasNeg || !hasPos) {
      newErrors.cashFlows = validationMessages.cashFlows;
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
    const irr = calculateIRR(cashFlows);
    const npv = calculateNPV(parseFloat(discountRate), cashFlows);
    const paybackPeriod = calculatePaybackPeriod(cashFlows);
    const totalInvestment = Math.abs(cashFlows.filter(f => f.amount < 0).reduce((s, f) => s + f.amount, 0));
    const totalReturns = cashFlows.filter(f => f.amount > 0).reduce((s, f) => s + f.amount, 0);
    const netProfit = totalReturns - totalInvestment;

    setResult({ irr, npv, paybackPeriod, totalInvestment, totalReturns, netProfit });
  }, [cashFlows, discountRate]);

  return { cashFlows, setCashFlows, discountRate, setDiscountRate, result, errors };
}
