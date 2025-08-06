// src/components/calculators/LoanCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, CreditCard, TrendingUp, PiggyBank, Calendar } from 'lucide-react';

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
  interestRate: number;
  loanTermMonths: number;
  isValid: boolean;
}

const LoanCalculator: React.FC = () => {
  const t = useTranslations();
  const [loanAmount, setLoanAmount] = useState<string>('500000');
  const [interestRate, setInterestRate] = useState<string>('5.5');
  const [loanTerm, setLoanTerm] = useState<string>('20');
  const [termUnit, setTermUnit] = useState<string>('years');
  
  const [result, setResult] = useState<LoanResult | null>(null);
  const [errors, setErrors] = useState<{ 
    loanAmount?: string; interestRate?: string; loanTerm?: string;
  }>({});

  // Format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ' Kč';
  };

  // Format currency with decimals
  const formatCurrencyDetailed = (amount: number): string => {
    return amount.toLocaleString('cs-CZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' Kč';
  };

  // Validation function
  const validateInputs = (
    amount: string,
    rate: string,
    term: string
  ) => {
    const newErrors: { 
      loanAmount?: string; interestRate?: string; loanTerm?: string;
    } = {};
    
    const amountNum = parseFloat(amount);
    const rateNum = parseFloat(rate);
    const termNum = parseFloat(term);

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.loanAmount = 'Zadejte platnou výši půjčky';
    } else if (amountNum > 50000000) {
      newErrors.loanAmount = 'Maximální výše půjčky je 50 000 000 Kč';
    }

    if (!rate || isNaN(rateNum) || rateNum < 0) {
      newErrors.interestRate = 'Zadejte platnou úrokovou sazbu';
    } else if (rateNum > 50) {
      newErrors.interestRate = 'Maximální úroková sazba je 50%';
    }

    if (!term || isNaN(termNum) || termNum <= 0) {
      newErrors.loanTerm = 'Zadejte platnou dobu splatnosti';
    } else if (termUnit === 'years' && termNum > 50) {
      newErrors.loanTerm = 'Maximální doba splatnosti je 50 let';
    } else if (termUnit === 'months' && termNum > 600) {
      newErrors.loanTerm = 'Maximální doba splatnosti je 600 měsíců';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate loan payment
  const calculateLoan = (
    principal: number,
    annualRate: number,
    termMonths: number
  ): LoanResult => {
    const monthlyRate = annualRate / 100 / 12;
    let monthlyPayment: number;

    if (monthlyRate === 0) {
      // Special case for 0% interest
      monthlyPayment = principal / termMonths;
    } else {
      // Standard loan formula: M = P * [r(1 + r)^n] / [(1 + r)^n - 1]
      const factor = Math.pow(1 + monthlyRate, termMonths);
      monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);
    }

    const totalPayment = monthlyPayment * termMonths;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      loanAmount: principal,
      interestRate: annualRate,
      loanTermMonths: termMonths,
      isValid: true
    };
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(loanAmount, interestRate, loanTerm)) {
      const principal = parseFloat(loanAmount);
      const rate = parseFloat(interestRate);
      const termInMonths = termUnit === 'years' 
        ? parseFloat(loanTerm) * 12 
        : parseFloat(loanTerm);

      const calculatedResult = calculateLoan(principal, rate, termInMonths);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [loanAmount, interestRate, loanTerm, termUnit]);

  // Quick amount buttons
  const setQuickAmount = (value: string) => {
    setLoanAmount(value);
  };

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Loan Amount */}
      <div className="space-y-2">
        <Label htmlFor="loanAmount" className="text-sm font-medium">
          Výše půjčky (Kč)
        </Label>
        <Input
          id="loanAmount"
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          placeholder="500000"
          className={`text-lg ${errors.loanAmount ? 'border-red-500' : ''}`}
          min="0"
          step="1000"
        />
        {errors.loanAmount && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.loanAmount}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          Celková výše půjčky, kterou potřebujete
        </p>
      </div>

      {/* Quick Amount Buttons */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Rychlé částky</Label>
        <div className="flex flex-wrap gap-2">
          {['100000', '300000', '500000', '1000000', '2000000'].map((value) => (
            <button
              key={value}
              onClick={() => setQuickAmount(value)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              {parseInt(value).toLocaleString('cs-CZ')} Kč
            </button>
          ))}
        </div>
      </div>

      {/* Interest Rate */}
      <div className="space-y-2">
        <Label htmlFor="interestRate" className="text-sm font-medium">
          Úroková sazba (% p.a.)
        </Label>
        <Input
          id="interestRate"
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          placeholder="5.5"
          className={`${errors.interestRate ? 'border-red-500' : ''}`}
          min="0"
          max="50"
          step="0.1"
        />
        {errors.interestRate && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.interestRate}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          Roční úroková sazba v procentech
        </p>
      </div>

      {/* Loan Term */}
      <div className="space-y-2">
        <Label htmlFor="loanTerm" className="text-sm font-medium">
          Doba splatnosti
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            id="loanTerm"
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            placeholder="20"
            className={`${errors.loanTerm ? 'border-red-500' : ''}`}
            min="1"
            step="1"
          />
          <Select value={termUnit} onValueChange={setTermUnit}>
            <SelectTrigger>
              <SelectValue placeholder="Jednotka" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="years">Roky</SelectItem>
              <SelectItem value="months">Měsíce</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {errors.loanTerm && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.loanTerm}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          Doba, za kterou chcete půjčku splatit
        </p>
      </div>

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2">
              Parametry půjčky
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {formatCurrency(parseFloat(loanAmount || '0'))} • {interestRate}% • {loanTerm} {termUnit === 'years' ? 'let' : 'měsíců'}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Výše • Úrok • Doba splatnosti
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
              {formatCurrency(result.monthlyPayment)}
            </div>
            <div className="text-sm text-green-700 mt-1">
              Měsíční splátka
            </div>
            <div className="text-xs text-green-600 mt-1">
              Po dobu {result.loanTermMonths} měsíců
            </div>
          </div>
          <CreditCard className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <PiggyBank className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-blue-800">
              {formatCurrency(result.loanAmount)}
            </div>
            <div className="text-sm text-blue-700 mt-1">Výše půjčky</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-purple-800">
              {formatCurrency(result.totalInterest)}
            </div>
            <div className="text-sm text-purple-700 mt-1">Celkové úroky</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-orange-800">
              {formatCurrency(result.totalPayment)}
            </div>
            <div className="text-sm text-orange-700 mt-1">Celková částka</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Breakdown */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Rozpis plateb</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span className="text-green-800 font-medium">Měsíční splátka</span>
              <span className="text-green-900 font-bold text-lg">{formatCurrencyDetailed(result.monthlyPayment)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Výše půjčky:</span>
                <span className="font-mono">{formatCurrency(result.loanAmount)}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Úroková sazba:</span>
                <span className="font-mono">{result.interestRate}% p.a.</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Doba splatnosti:</span>
                <span className="font-mono">{result.loanTermMonths} měsíců</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Počet splátek:</span>
                <span className="font-mono">{result.loanTermMonths}×</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Details */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Detailní výpočet</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Výše půjčky:</span>
                  <span className="font-mono">{formatCurrency(result.loanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Měsíční úrok:</span>
                  <span className="font-mono">{(result.interestRate / 12).toFixed(3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Počet splátek:</span>
                  <span className="font-mono">{result.loanTermMonths}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>Měsíční splátka:</span>
                  <span className="font-mono">{formatCurrencyDetailed(result.monthlyPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Celkem zaplatíte:</span>
                  <span className="font-mono">{formatCurrency(result.totalPayment)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Z toho úroky:</span>
                  <span className="font-mono">{formatCurrency(result.totalInterest)}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Vzorec: M = P × [r(1 + r)^n] / [(1 + r)^n - 1], kde P = jistina, r = měsíční úrok, n = počet splátek
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interest vs Principal Chart (Simple Visual) */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Poměr jistiny a úroků</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm">Jistina: {formatCurrency(result.loanAmount)} ({((result.loanAmount / result.totalPayment) * 100).toFixed(1)}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm">Úroky: {formatCurrency(result.totalInterest)} ({((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-blue-500 h-full float-left" 
                style={{ width: `${(result.loanAmount / result.totalPayment) * 100}%` }}
              ></div>
              <div 
                className="bg-red-500 h-full" 
                style={{ width: `${(result.totalInterest / result.totalPayment) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>Zadejte parametry půjčky pro výpočet</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title="Kalkulátor půjček"
      description="Vypočítejte měsíční splátky úvěru, celkové náklady a úroky. Naplánujte si hypotéku, osobní půjčku nebo jiný úvěr."
      category="Praktické"
      seo={{
        title: "Kalkulátor půjček - Výpočet splátek úvěru a hypotéky | MathCalc",
        description: "Bezplatný kalkulátor půjček. Vypočítejte měsíční splátky, celkové náklady a úroky pro hypotéky, osobní půjčky a úvěry.",
        keywords: ["půjčka", "úvěr", "hypotéka", "splátka", "úrok", "kalkulátor půjček", "měsíční splátka", "finanční kalkulátor"]
      }}
      formula={{
        latex: "M = P \\times \\frac{r(1 + r)^n}{(1 + r)^n - 1}",
        description: "Měsíční splátka se počítá podle anuity, kde P = jistina, r = měsíční úroková sazba, n = počet splátek."
      }}
      examples={{
        title: "Příklady výpočtu půjček",
        description: "Praktické použití kalkulátoru půjček",
        scenarios: [
          {
            title: "Hypotéka na bydlení",
            description: "2 000 000 Kč, 4,5% p.a., 25 let → 11 061 Kč/měsíc",
            example: "Výpočet měsíční splátky hypotéky"
          },
          {
            title: "Osobní půjčka",
            description: "300 000 Kč, 8% p.a., 5 let → 6 083 Kč/měsíc",
            example: "Půjčka na rekonstrukci nebo auto"
          },
          {
            title: "Podnikatelský úvěr",
            description: "1 000 000 Kč, 6% p.a., 10 let → 11 102 Kč/měsíc",
            example: "Financování podnikatelských aktivit"
          }
        ]
      }}
      faq={[
        {
          question: "Jak se počítá měsíční splátka půjčky?",
          answer: "Měsíční splátka se počítá podle vzorce pro anuitní splácení: M = P × [r(1 + r)^n] / [(1 + r)^n - 1], kde P je jistina, r měsíční úroková sazba a n počet splátek."
        },
        {
          question: "Co ovlivňuje výši měsíční splátky?",
          answer: "Výši splátky ovlivňuje především výše půjčky, úroková sazba a doba splatnosti. Vyšší úrok nebo kratší doba splatnosti znamenají vyšší splátky."
        },
        {
          question: "Jaký je rozdíl mezi úrokovou sazbou a RPSN?",
          answer: "Úroková sazba je základní cena půjčky, RPSN (roční procentní sazba nákladů) zahrnuje i všechny poplatky a lépe odráží skutečné náklady půjčky."
        },
        {
          question: "Jak snížit celkové náklady na půjčku?",
          answer: "Náklady můžete snížit kratší dobou splatnosti, vyšší splátkou, mimořádnými splátkami nebo refinancováním za lepších podmínek."
        }
      ]}
      relatedCalculators={[
        {
          title: "Složené úročení",
          description: "Výpočet zhodnocení investic",
          href: "/calculator/slozene-uroceni",
          category: "Finanční"
        },
        {
          title: "Anuita",
          description: "Výpočet anuitních splátek",
          href: "/calculator/anuita",
          category: "Finanční"
        },
        {
          title: "Kalkulátor slev",
          description: "Výpočet slev a úspor",
          href: "/calculator/prakticke-vypocty/kalkulacka-2",
          category: "Praktické"
        },
        {
          title: "DPH kalkulátor",
          description: "Výpočet DPH a cen s daní",
          href: "/calculator/dph",
          category: "Finanční"
        }
      ]}
      schemaData={{
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any"
      }}
      resultSection={resultsSection}
    >
      {calculatorForm}
    </SimpleCalculatorLayout>
  );
};

export default LoanCalculator;
