// src/components/calculators/EarlyRepaymentCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, TrendingUp, DollarSign, Clock, Banknote } from 'lucide-react';

interface EarlyRepaymentResult {
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
  isValid: boolean;
}

const EarlyRepaymentCalculator: React.FC = () => {
  const t = useTranslations();
  const [loanAmount, setLoanAmount] = useState<string>('2000000');
  const [interestRate, setInterestRate] = useState<string>('4.5');
  const [loanTerm, setLoanTerm] = useState<string>('25');
  const [paidMonths, setPaidMonths] = useState<string>('36');
  const [repaymentAmount, setRepaymentAmount] = useState<string>('300000');
  const [repaymentType, setRepaymentType] = useState<string>('reduce_term');
  
  const [result, setResult] = useState<EarlyRepaymentResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ' Kč';
  };

  // Format months to years and months
  const formatMonths = (months: number): string => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} měsíců`;
    } else if (remainingMonths === 0) {
      return `${years} let`;
    } else {
      return `${years} let ${remainingMonths} měsíců`;
    }
  };

  // Calculate monthly payment using annuity formula
  const calculateMonthlyPayment = (principal: number, rate: number, months: number): number => {
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) {
      return principal / months;
    }
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  // Calculate remaining balance after n payments
  const calculateRemainingBalance = (principal: number, rate: number, totalMonths: number, paidMonths: number): number => {
    const monthlyRate = rate / 100 / 12;
    const monthlyPayment = calculateMonthlyPayment(principal, rate, totalMonths);
    
    if (monthlyRate === 0) {
      return principal - (monthlyPayment * paidMonths);
    }
    
    return principal * Math.pow(1 + monthlyRate, paidMonths) - monthlyPayment * (Math.pow(1 + monthlyRate, paidMonths) - 1) / monthlyRate;
  };

  // Calculate total interest for a loan
  const calculateTotalInterest = (principal: number, rate: number, months: number): number => {
    const monthlyPayment = calculateMonthlyPayment(principal, rate, months);
    return (monthlyPayment * months) - principal;
  };

  // Validation function
  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    const loanAmountNum = parseFloat(loanAmount);
    const interestRateNum = parseFloat(interestRate);
    const loanTermNum = parseFloat(loanTerm);
    const paidMonthsNum = parseFloat(paidMonths);
    const repaymentAmountNum = parseFloat(repaymentAmount);

    if (!loanAmount || isNaN(loanAmountNum) || loanAmountNum <= 0) {
      newErrors.loanAmount = 'Zadejte platnou výši úvěru';
    }

    if (!interestRate || isNaN(interestRateNum) || interestRateNum < 0) {
      newErrors.interestRate = 'Zadejte platnou úrokovou sazbu';
    }

    if (!loanTerm || isNaN(loanTermNum) || loanTermNum <= 0) {
      newErrors.loanTerm = 'Zadejte platnou dobu splatnosti';
    }

    if (!paidMonths || isNaN(paidMonthsNum) || paidMonthsNum < 0) {
      newErrors.paidMonths = 'Zadejte platný počet splacených měsíců';
    } else if (paidMonthsNum >= loanTermNum * 12) {
      newErrors.paidMonths = 'Počet splacených měsíců musí být menší než celková doba úvěru';
    }

    if (!repaymentAmount || isNaN(repaymentAmountNum) || repaymentAmountNum <= 0) {
      newErrors.repaymentAmount = 'Zadejte platnou částku předčasného splacení';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate early repayment scenarios
  const calculateEarlyRepayment = (): EarlyRepaymentResult => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const termMonths = parseFloat(loanTerm) * 12;
    const paid = parseFloat(paidMonths);
    const earlyAmount = parseFloat(repaymentAmount);

    // Original loan calculations
    const originalMonthlyPayment = calculateMonthlyPayment(principal, rate, termMonths);
    const remainingBalance = calculateRemainingBalance(principal, rate, termMonths, paid);
    const originalTotalInterest = calculateTotalInterest(principal, rate, termMonths);
    
    // Remaining months before early repayment
    const remainingMonths = termMonths - paid;
    
    // New balance after early repayment
    const newBalance = remainingBalance - earlyAmount;
    
    let newMonthlyPayment: number;
    let newLoanTerm: number;
    let newTotalInterest: number;
    let totalSavings: number;
    let interestSavings: number;

    if (repaymentType === 'reduce_term') {
      // Keep same monthly payment, reduce term
      newMonthlyPayment = originalMonthlyPayment;
      
      // Calculate new term with same payment
      const monthlyRate = rate / 100 / 12;
      if (monthlyRate === 0) {
        newLoanTerm = Math.ceil(newBalance / newMonthlyPayment);
      } else {
        newLoanTerm = Math.ceil(Math.log(1 + (newBalance * monthlyRate) / newMonthlyPayment) / Math.log(1 + monthlyRate));
      }
      
      // Calculate interest for remaining period
      const interestAlreadyPaid = (originalMonthlyPayment * paid) - (principal - remainingBalance);
      newTotalInterest = interestAlreadyPaid + (newMonthlyPayment * newLoanTerm) - newBalance;
      
    } else {
      // Keep same term, reduce monthly payment
      newLoanTerm = remainingMonths;
      newMonthlyPayment = calculateMonthlyPayment(newBalance, rate, newLoanTerm);
      
      // Calculate total interest
      const interestAlreadyPaid = (originalMonthlyPayment * paid) - (principal - remainingBalance);
      newTotalInterest = interestAlreadyPaid + calculateTotalInterest(newBalance, rate, newLoanTerm);
    }

    interestSavings = originalTotalInterest - newTotalInterest;
    totalSavings = interestSavings;

    return {
      originalMonthlyPayment,
      remainingBalance,
      earlyRepaymentAmount: earlyAmount,
      totalSavings,
      interestSavings,
      newMonthlyPayment,
      newLoanTerm: paid + newLoanTerm,
      originalTotalInterest,
      newTotalInterest,
      repaymentType,
      isValid: true
    };
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs()) {
      const calculatedResult = calculateEarlyRepayment();
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [loanAmount, interestRate, loanTerm, paidMonths, repaymentAmount, repaymentType]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Loan Amount */}
      <div className="space-y-2">
        <Label htmlFor="loanAmount" className="text-sm font-medium">
          {t('calculators.early_repayment.loan_amount')}
        </Label>
        <Input
          id="loanAmount"
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          placeholder="2000000"
          className={`${errors.loanAmount ? 'border-red-500' : ''}`}
          min="0"
          step="10000"
        />
        {errors.loanAmount && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.loanAmount}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.early_repayment.loan_amount_hint')}
        </p>
      </div>

      {/* Interest Rate */}
      <div className="space-y-2">
        <Label htmlFor="interestRate" className="text-sm font-medium">
          {t('calculators.early_repayment.interest_rate')}
        </Label>
        <Input
          id="interestRate"
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          placeholder="4.5"
          className={`${errors.interestRate ? 'border-red-500' : ''}`}
          min="0"
          step="0.1"
        />
        {errors.interestRate && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.interestRate}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.early_repayment.interest_rate_hint')}
        </p>
      </div>

      {/* Loan Term */}
      <div className="space-y-2">
        <Label htmlFor="loanTerm" className="text-sm font-medium">
          {t('calculators.early_repayment.loan_term')}
        </Label>
        <Input
          id="loanTerm"
          type="number"
          value={loanTerm}
          onChange={(e) => setLoanTerm(e.target.value)}
          placeholder="25"
          className={`${errors.loanTerm ? 'border-red-500' : ''}`}
          min="1"
          step="1"
        />
        {errors.loanTerm && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.loanTerm}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.early_repayment.loan_term_hint')}
        </p>
      </div>

      {/* Paid Months */}
      <div className="space-y-2">
        <Label htmlFor="paidMonths" className="text-sm font-medium">
          {t('calculators.early_repayment.paid_months')}
        </Label>
        <Input
          id="paidMonths"
          type="number"
          value={paidMonths}
          onChange={(e) => setPaidMonths(e.target.value)}
          placeholder="36"
          className={`${errors.paidMonths ? 'border-red-500' : ''}`}
          min="0"
          step="1"
        />
        {errors.paidMonths && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.paidMonths}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.early_repayment.paid_months_hint')}
        </p>
      </div>

      {/* Early Repayment Amount */}
      <div className="space-y-2">
        <Label htmlFor="repaymentAmount" className="text-sm font-medium">
          {t('calculators.early_repayment.repayment_amount')}
        </Label>
        <Input
          id="repaymentAmount"
          type="number"
          value={repaymentAmount}
          onChange={(e) => setRepaymentAmount(e.target.value)}
          placeholder="300000"
          className={`${errors.repaymentAmount ? 'border-red-500' : ''}`}
          min="0"
          step="10000"
        />
        {errors.repaymentAmount && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.repaymentAmount}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.early_repayment.repayment_amount_hint')}
        </p>
      </div>

      {/* Repayment Type */}
      <div className="space-y-2">
        <Label htmlFor="repaymentType" className="text-sm font-medium">
          {t('calculators.early_repayment.repayment_type')}
        </Label>
        <Select value={repaymentType} onValueChange={setRepaymentType}>
          <SelectTrigger>
            <SelectValue placeholder={t('calculators.early_repayment.select_type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reduce_term">{t('calculators.early_repayment.reduce_term')}</SelectItem>
            <SelectItem value="reduce_payment">{t('calculators.early_repayment.reduce_payment')}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {repaymentType === 'reduce_term' 
            ? t('calculators.early_repayment.keep_payment_reduce_term')
            : t('calculators.early_repayment.keep_term_reduce_payment')
          }
        </p>
      </div>

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2 flex items-center justify-center gap-2">
              <Banknote className="w-5 h-5" />
              {t('calculators.early_repayment.early_loan_repayment')}
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {formatCurrency(parseFloat(repaymentAmount) || 0)} • {repaymentType === 'reduce_term' ? t('calculators.early_repayment.reduce_term_short') : t('calculators.early_repayment.reduce_payment_short')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Results section
  const resultsSection = result ? (
    <div className="space-y-6">
      {/* Main Result */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">
              {formatCurrency(result.totalSavings)}
            </div>
            <div className="text-sm text-green-700 mt-1">
              {t('calculators.early_repayment.total_interest_savings')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {result.repaymentType === 'reduce_term' ? t('calculators.early_repayment.term_reduction') : t('calculators.early_repayment.payment_reduction')}
            </div>
          </div>
          <TrendingUp className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">
              {formatCurrency(result.newMonthlyPayment)}
            </div>
            <div className="text-sm text-blue-700 mt-1">{t('calculators.early_repayment.new_monthly_payment')}</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800">
              {formatMonths(result.newLoanTerm)}
            </div>
            <div className="text-sm text-purple-700 mt-1">{t('calculators.early_repayment.new_loan_term')}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-orange-800">
              {formatCurrency(result.remainingBalance)}
            </div>
            <div className="text-sm text-orange-700 mt-1">Zůstatek před splacením</div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-red-800 mb-3">{t('calculators.early_repayment.results.original_loan')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('calculators.early_repayment.results.monthly_payment')}:</span>
                <span className="font-mono">{formatCurrency(result.originalMonthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('calculators.early_repayment.results.loan_term')}:</span>
                <span className="font-mono">{formatMonths(parseFloat(loanTerm) * 12)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>{t('calculators.early_repayment.results.total_interest')}:</span>
                <span className="font-mono">{formatCurrency(result.originalTotalInterest)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-green-800 mb-3">{t('calculators.early_repayment.results.after_repayment')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('calculators.early_repayment.results.monthly_payment')}:</span>
                <span className="font-mono">{formatCurrency(result.newMonthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('calculators.early_repayment.results.loan_term')}:</span>
                <span className="font-mono">{formatMonths(result.newLoanTerm)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>{t('calculators.early_repayment.results.total_interest')}:</span>
                <span className="font-mono">{formatCurrency(result.newTotalInterest)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculation Details */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('calculators.early_repayment.results.detailed_analysis')}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>{t('calculators.early_repayment.results.remaining_balance')}:</span>
                  <span className="font-mono">{formatCurrency(result.remainingBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('calculators.early_repayment.results.early_payment')}:</span>
                  <span className="font-mono">{formatCurrency(result.earlyRepaymentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('calculators.early_repayment.results.new_balance')}:</span>
                  <span className="font-mono">{formatCurrency(result.remainingBalance - result.earlyRepaymentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('calculators.early_repayment.results.interest_savings')}:</span>
                  <span className="font-mono text-green-600">{formatCurrency(result.interestSavings)}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>{t('calculators.early_repayment.results.total_savings')}:</span>
                  <span className="font-mono text-green-600">{formatCurrency(result.totalSavings)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">{t('calculators.early_repayment.results.tips_title')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-green-50 rounded">
              <div className="font-medium text-green-800 mb-1">{t('calculators.early_repayment.results.tips.term_reduction.title')}</div>
              <div className="text-green-700">{t('calculators.early_repayment.results.tips.term_reduction.description')}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <div className="font-medium text-blue-800 mb-1">{t('calculators.early_repayment.results.tips.payment_reduction.title')}</div>
              <div className="text-blue-700">{t('calculators.early_repayment.results.tips.payment_reduction.description')}</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <div className="font-medium text-yellow-800 mb-1">{t('calculators.early_repayment.results.tips.fees.title')}</div>
              <div className="text-yellow-700">{t('calculators.early_repayment.results.tips.fees.description')}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <div className="font-medium text-purple-800 mb-1">{t('calculators.early_repayment.results.tips.alternatives.title')}</div>
              <div className="text-purple-700">{t('calculators.early_repayment.results.tips.alternatives.description')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('calculators.early_repayment.enter_parameters')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('calculators.early_repayment.title')}
      description={t('calculators.early_repayment.description')}
      category={t('categories.financial')}
      seo={{
        title: t('calculators.early_repayment.seo.title'),
        description: t('calculators.early_repayment.seo.description'),
        keywords: t('calculators.early_repayment.seo.keywords').split(',')
      }}
      formula={{
        latex: "S = \\sum_{{t=1}}^{{n_1}} PMT - \\sum_{{t=1}}^{{n_2}} PMT_{{new}}",
        description: t('calculators.early_repayment.formula.description')
      }}
      examples={{
        title: t('calculators.early_repayment.examples.title'),
        description: t('calculators.early_repayment.examples.description'),
        scenarios: [
          {
            title: t('calculators.early_repayment.examples.scenario1.title'),
            description: t('calculators.early_repayment.examples.scenario1.description'),
            example: t('calculators.early_repayment.examples.scenario1.example')
          },
          {
            title: t('calculators.early_repayment.examples.scenario2.title'),
            description: t('calculators.early_repayment.examples.scenario2.description'),
            example: t('calculators.early_repayment.examples.scenario2.example')
          },
          {
            title: t('calculators.early_repayment.examples.scenario3.title'),
            description: t('calculators.early_repayment.examples.scenario3.description'),
            example: t('calculators.early_repayment.examples.scenario3.example')
          }
        ]
      }}
      faq={[
        {
          question: t('calculators.early_repayment.faq.q1.question'),
          answer: t('calculators.early_repayment.faq.q1.answer')
        },
        {
          question: t('calculators.early_repayment.faq.q2.question'),
          answer: t('calculators.early_repayment.faq.q2.answer')
        },
        {
          question: t('calculators.early_repayment.faq.q3.question'),
          answer: t('calculators.early_repayment.faq.q3.answer')
        },
        {
          question: t('calculators.early_repayment.faq.q4.question'),
          answer: t('calculators.early_repayment.faq.q4.answer')
        }
      ]}
      relatedCalculators={[
        {
          title: t('calculators.early_repayment.related.annuity.title'),
          description: t('calculators.early_repayment.related.annuity.description'),
          href: "/calculator/anuitni-splatka",
          category: t('categories.financial')
        },
        {
          title: t('calculators.early_repayment.related.compound_interest.title'),
          description: t('calculators.early_repayment.related.compound_interest.description'),
          href: "/calculator/slozene-uroceni",
          category: t('categories.financial')
        },
        {
          title: t('calculators.early_repayment.related.roi.title'),
          description: t('calculators.early_repayment.related.roi.description'),
          href: "/calculator/financie-rozsirene/roi",
          category: t('categories.financial')
        },
        {
          title: t('calculators.early_repayment.related.npv.title'),
          description: t('calculators.early_repayment.related.npv.description'),
          href: "/calculator/financie-rozsirene/npv",
          category: t('categories.financial')
        }
      ]}
      schemaData={{
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any"
      }}
      resultSection={resultsSection}
    >
      {calculatorForm}
    </SimpleCalculatorLayout>
  );
};

export default EarlyRepaymentCalculator;
