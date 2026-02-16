// src/hooks/useEarlyRepaymentCalculator.ts
import { useState, useEffect, useCallback } from 'react';

export interface EarlyRepaymentResult {
  originalMonthlyPayment: number;
  remainingBalance: number;
  earlyRepaymentAmount: number;
  totalSavings: number;
  interestSavings: number;
  newMonthlyPayment: number;
  newLoanTerm: number;
  originalTotalInterest: number;
  newTotalInterest: number;
  repaymentType: string;
}

interface EarlyRepaymentState {
  loanAmount: string;
  interestRate: string;
  loanTerm: string;
  paidMonths: string;
  repaymentAmount: string;
  repaymentType: string;
}

interface ValidationMessages {
  loanAmount: string;
  interestRate: string;
  loanTerm: string;
  paidMonths: string;
  paidMonthsOverflow: string;
  repaymentAmount: string;
}

function calculateMonthlyPayment(principal: number, rate: number, months: number): number {
  const monthlyRate = rate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

function calculateRemainingBalance(principal: number, rate: number, totalMonths: number, paidMonths: number): number {
  const monthlyRate = rate / 100 / 12;
  const monthlyPayment = calculateMonthlyPayment(principal, rate, totalMonths);
  if (monthlyRate === 0) return principal - (monthlyPayment * paidMonths);
  return principal * Math.pow(1 + monthlyRate, paidMonths) - monthlyPayment * (Math.pow(1 + monthlyRate, paidMonths) - 1) / monthlyRate;
}

function calculateTotalInterest(principal: number, rate: number, months: number): number {
  return (calculateMonthlyPayment(principal, rate, months) * months) - principal;
}

export function useEarlyRepaymentCalculator(validationMessages: ValidationMessages) {
  const [state, setState] = useState<EarlyRepaymentState>({
    loanAmount: '2000000',
    interestRate: '4.5',
    loanTerm: '25',
    paidMonths: '36',
    repaymentAmount: '300000',
    repaymentType: 'reduce_term',
  });

  const [result, setResult] = useState<EarlyRepaymentResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (field: keyof EarlyRepaymentState, value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const validateInputs = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    const loanNum = parseFloat(state.loanAmount);
    const rateNum = parseFloat(state.interestRate);
    const termNum = parseFloat(state.loanTerm);
    const paidNum = parseFloat(state.paidMonths);
    const repayNum = parseFloat(state.repaymentAmount);

    if (!state.loanAmount || isNaN(loanNum) || loanNum <= 0) newErrors.loanAmount = validationMessages.loanAmount;
    if (!state.interestRate || isNaN(rateNum) || rateNum < 0) newErrors.interestRate = validationMessages.interestRate;
    if (!state.loanTerm || isNaN(termNum) || termNum <= 0) newErrors.loanTerm = validationMessages.loanTerm;
    if (!state.paidMonths || isNaN(paidNum) || paidNum < 0) {
      newErrors.paidMonths = validationMessages.paidMonths;
    } else if (paidNum >= termNum * 12) {
      newErrors.paidMonths = validationMessages.paidMonthsOverflow;
    }
    if (!state.repaymentAmount || isNaN(repayNum) || repayNum <= 0) newErrors.repaymentAmount = validationMessages.repaymentAmount;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [state, validationMessages]);

  useEffect(() => {
    if (!validateInputs()) {
      setResult(null);
      return;
    }

    const principal = parseFloat(state.loanAmount);
    const rate = parseFloat(state.interestRate);
    const termMonths = parseFloat(state.loanTerm) * 12;
    const paid = parseFloat(state.paidMonths);
    const earlyAmount = parseFloat(state.repaymentAmount);

    const originalMonthlyPayment = calculateMonthlyPayment(principal, rate, termMonths);
    const remainingBalance = calculateRemainingBalance(principal, rate, termMonths, paid);
    const originalTotalInterest = calculateTotalInterest(principal, rate, termMonths);
    const remainingMonths = termMonths - paid;
    const newBalance = remainingBalance - earlyAmount;

    let newMonthlyPayment: number;
    let newLoanTerm: number;
    let newTotalInterest: number;

    if (state.repaymentType === 'reduce_term') {
      newMonthlyPayment = originalMonthlyPayment;
      const monthlyRate = rate / 100 / 12;
      if (monthlyRate === 0) {
        newLoanTerm = Math.ceil(newBalance / newMonthlyPayment);
      } else {
        newLoanTerm = Math.ceil(Math.log(1 + (newBalance * monthlyRate) / newMonthlyPayment) / Math.log(1 + monthlyRate));
      }
      const interestAlreadyPaid = (originalMonthlyPayment * paid) - (principal - remainingBalance);
      newTotalInterest = interestAlreadyPaid + (newMonthlyPayment * newLoanTerm) - newBalance;
    } else {
      newLoanTerm = remainingMonths;
      newMonthlyPayment = calculateMonthlyPayment(newBalance, rate, newLoanTerm);
      const interestAlreadyPaid = (originalMonthlyPayment * paid) - (principal - remainingBalance);
      newTotalInterest = interestAlreadyPaid + calculateTotalInterest(newBalance, rate, newLoanTerm);
    }

    const interestSavings = originalTotalInterest - newTotalInterest;

    setResult({
      originalMonthlyPayment,
      remainingBalance,
      earlyRepaymentAmount: earlyAmount,
      totalSavings: interestSavings,
      interestSavings,
      newMonthlyPayment,
      newLoanTerm: paid + newLoanTerm,
      originalTotalInterest,
      newTotalInterest,
      repaymentType: state.repaymentType,
    });
  }, [validateInputs, state.loanAmount, state.interestRate, state.loanTerm, state.paidMonths, state.repaymentAmount, state.repaymentType]);

  return { state, setField, result, errors };
}
