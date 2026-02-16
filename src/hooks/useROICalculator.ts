// src/hooks/useROICalculator.ts
import { useState, useEffect, useCallback } from 'react';

export interface ROIResult {
  roi: number;
  annualizedROI: number;
  totalReturn: number;
  netProfit: number;
  investmentPeriod: number;
  breakEvenPoint: number;
  totalInvestment: number;
}

interface ROIState {
  calculationType: string;
  initialInvestment: string;
  finalValue: string;
  additionalCosts: string;
  timePeriod: string;
  timeUnit: string;
  annualReturn: string;
}

interface ROIValidationMessages {
  initialInvestment: string;
  finalValue: string;
  annualReturn: string;
  additionalCosts: string;
  timePeriod: string;
}

export function useROICalculator(validationMessages: ROIValidationMessages) {
  const [state, setState] = useState<ROIState>({
    calculationType: 'simple',
    initialInvestment: '100000',
    finalValue: '125000',
    additionalCosts: '5000',
    timePeriod: '2',
    timeUnit: 'years',
    annualReturn: '12000',
  });

  const [result, setResult] = useState<ROIResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (field: keyof ROIState, value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const convertToYears = (period: number, unit: string): number => {
    switch (unit) {
      case 'months': return period / 12;
      case 'days': return period / 365;
      default: return period;
    }
  };

  const validateInputs = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    const initialNum = parseFloat(state.initialInvestment);
    const finalNum = parseFloat(state.finalValue);
    const costsNum = parseFloat(state.additionalCosts);
    const periodNum = parseFloat(state.timePeriod);
    const annualNum = parseFloat(state.annualReturn);

    if (!state.initialInvestment || isNaN(initialNum) || initialNum <= 0) {
      newErrors.initialInvestment = validationMessages.initialInvestment;
    }
    if (state.calculationType === 'simple') {
      if (!state.finalValue || isNaN(finalNum) || finalNum < 0) {
        newErrors.finalValue = validationMessages.finalValue;
      }
    } else {
      if (!state.annualReturn || isNaN(annualNum)) {
        newErrors.annualReturn = validationMessages.annualReturn;
      }
    }
    if (!state.additionalCosts || isNaN(costsNum) || costsNum < 0) {
      newErrors.additionalCosts = validationMessages.additionalCosts;
    }
    if (!state.timePeriod || isNaN(periodNum) || periodNum <= 0) {
      newErrors.timePeriod = validationMessages.timePeriod;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [state, validationMessages]);

  useEffect(() => {
    if (!validateInputs()) {
      setResult(null);
      return;
    }

    const initialInv = parseFloat(state.initialInvestment);
    const additionalCost = parseFloat(state.additionalCosts);
    const totalInvestment = initialInv + additionalCost;
    const period = parseFloat(state.timePeriod);
    const periodInYears = convertToYears(period, state.timeUnit);

    let totalReturn: number;
    let netProfit: number;
    let roi: number;

    if (state.calculationType === 'simple') {
      const finalVal = parseFloat(state.finalValue);
      totalReturn = finalVal;
      netProfit = finalVal - totalInvestment;
      roi = (netProfit / totalInvestment) * 100;
    } else {
      const annualRet = parseFloat(state.annualReturn);
      totalReturn = annualRet * periodInYears;
      netProfit = totalReturn - additionalCost;
      roi = (totalReturn / totalInvestment) * 100;
    }

    let annualizedROI: number;
    if (periodInYears > 0) {
      annualizedROI = (Math.pow(1 + roi / 100, 1 / periodInYears) - 1) * 100;
    } else {
      annualizedROI = roi;
    }

    let breakEvenPoint: number;
    if (state.calculationType === 'simple') {
      breakEvenPoint = periodInYears;
    } else {
      const annualRet = parseFloat(state.annualReturn);
      breakEvenPoint = annualRet > 0 ? totalInvestment / annualRet : Infinity;
    }

    setResult({ roi, annualizedROI, totalReturn, netProfit, investmentPeriod: periodInYears, breakEvenPoint, totalInvestment });
  }, [state.calculationType, state.initialInvestment, state.finalValue, state.additionalCosts, state.timePeriod, state.timeUnit, state.annualReturn, validateInputs]);

  return { state, setField, result, errors };
}
