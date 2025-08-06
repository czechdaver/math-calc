// src/components/calculators/NPVCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import { AlertCircle, Calculator as CalcIcon, TrendingUp, Plus, Minus, DollarSign } from 'lucide-react';

interface CashFlow {
  period: number;
  amount: number;
}

interface NPVResult {
  npv: number;
  totalInvestment: number;
  totalReturns: number;
  profitabilityIndex: number;
  presentValueOfReturns: number;
  discountRate: number;
  isValid: boolean;
}

const NPVCalculator: React.FC = () => {
  const t = useTranslations();
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([
    { period: 0, amount: -100000 }, // Initial investment
    { period: 1, amount: 25000 },
    { period: 2, amount: 30000 },
    { period: 3, amount: 35000 },
    { period: 4, amount: 40000 }
  ]);
  const [discountRate, setDiscountRate] = useState<string>('10');
  
  const [result, setResult] = useState<NPVResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ' Kč';
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return value.toLocaleString('cs-CZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + '%';
  };

  // Format ratio
  const formatRatio = (value: number): string => {
    return value.toLocaleString('cs-CZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calculate NPV
  const calculateNPV = (rate: number, flows: CashFlow[]): number => {
    return flows.reduce((npv, flow) => {
      return npv + (flow.amount / Math.pow(1 + rate / 100, flow.period));
    }, 0);
  };

  // Calculate present value of individual cash flow
  const calculatePresentValue = (amount: number, period: number, rate: number): number => {
    return amount / Math.pow(1 + rate / 100, period);
  };

  // Validation function
  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    const discountRateNum = parseFloat(discountRate);
    if (!discountRate || isNaN(discountRateNum) || discountRateNum < 0) {
      newErrors.discountRate = 'Zadejte platnou diskontní sazbu';
    }

    // Check for valid cash flow amounts
    cashFlows.forEach((flow, index) => {
      if (isNaN(flow.amount)) {
        newErrors[`cashFlow_${index}`] = 'Zadejte platnou částku';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate NPV and related metrics
  const calculateResult = (): NPVResult => {
    const rate = parseFloat(discountRate);
    const npv = calculateNPV(rate, cashFlows);
    
    const totalInvestment = Math.abs(cashFlows.filter(flow => flow.amount < 0).reduce((sum, flow) => sum + flow.amount, 0));
    const totalReturns = cashFlows.filter(flow => flow.amount > 0).reduce((sum, flow) => sum + flow.amount, 0);
    
    // Present value of positive cash flows only
    const presentValueOfReturns = cashFlows
      .filter(flow => flow.amount > 0)
      .reduce((sum, flow) => sum + calculatePresentValue(flow.amount, flow.period, rate), 0);
    
    // Profitability Index = PV of returns / Initial investment
    const profitabilityIndex = presentValueOfReturns / totalInvestment;

    return {
      npv,
      totalInvestment,
      totalReturns,
      profitabilityIndex,
      presentValueOfReturns,
      discountRate: rate,
      isValid: true
    };
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs()) {
      const calculatedResult = calculateResult();
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [cashFlows, discountRate]);

  // Add new cash flow
  const addCashFlow = () => {
    const newPeriod = Math.max(...cashFlows.map(cf => cf.period)) + 1;
    setCashFlows([...cashFlows, { period: newPeriod, amount: 0 }]);
  };

  // Remove cash flow
  const removeCashFlow = (index: number) => {
    if (cashFlows.length > 2) {
      setCashFlows(cashFlows.filter((_, i) => i !== index));
    }
  };

  // Update cash flow amount
  const updateCashFlow = (index: number, amount: number) => {
    const updatedFlows = [...cashFlows];
    updatedFlows[index].amount = amount;
    setCashFlows(updatedFlows);
  };

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Discount Rate */}
      <div className="space-y-2">
        <Label htmlFor="discountRate" className="text-sm font-medium">
          {t('calculators.npv.discount_rate')} (%)
        </Label>
        <Input
          id="discountRate"
          type="number"
          value={discountRate}
          onChange={(e) => setDiscountRate(e.target.value)}
          placeholder="10"
          className={`${errors.discountRate ? 'border-red-500' : ''}`}
          min="0"
          step="0.1"
        />
        {errors.discountRate && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.discountRate}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.npv.discount_rate_hint')}
        </p>
      </div>

      {/* Cash Flows */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{t('calculators.npv.cash_flows')}</Label>
          <Button
            type="button"
            onClick={addCashFlow}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('calculators.npv.add_period')}
          </Button>
        </div>

        <div className="space-y-3">
          {cashFlows.map((flow, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-600">
                {flow.period === 0 ? t('calculators.npv.beginning') : `${t('calculators.npv.year')} ${flow.period}`}
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  value={flow.amount}
                  onChange={(e) => updateCashFlow(index, parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className={`${errors[`cashFlow_${index}`] ? 'border-red-500' : ''} ${flow.amount < 0 ? 'text-red-600' : 'text-green-600'}`}
                  step="1000"
                />
                {errors[`cashFlow_${index}`] && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors[`cashFlow_${index}`]}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 text-xs text-gray-500">
                Kč
              </div>
              {cashFlows.length > 2 && (
                <Button
                  type="button"
                  onClick={() => removeCashFlow(index)}
                  size="sm"
                  variant="outline"
                  className="flex-shrink-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• {t('calculators.npv.negative_values')}</p>
          <p>• {t('calculators.npv.positive_values')}</p>
          <p>• {t('calculators.npv.period_zero')}</p>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2 flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t('calculators.npv.npv_analysis')} - {cashFlows.length} {t('calculators.npv.periods')}
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {t('calculators.npv.discount_rate')} {discountRate}% • {cashFlows.filter(cf => cf.amount < 0).length} {t('calculators.npv.investments')} • {cashFlows.filter(cf => cf.amount > 0).length} {t('calculators.npv.returns')}
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
        <div className={`inline-flex items-center gap-4 p-6 rounded-xl ${result.npv > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="text-center">
            <div className={`text-3xl font-bold ${result.npv > 0 ? 'text-green-900' : 'text-red-900'}`}>
              {formatCurrency(result.npv)}
            </div>
            <div className={`text-sm mt-1 ${result.npv > 0 ? 'text-green-700' : 'text-red-700'}`}>
              {t('calculators.npv.npv_result')}
            </div>
            <div className={`text-xs mt-1 ${result.npv > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {result.npv > 0 ? t('calculators.npv.investment_profitable') : t('calculators.npv.investment_unprofitable')}
            </div>
          </div>
          <TrendingUp className={`w-8 h-8 ${result.npv > 0 ? 'text-green-600' : 'text-red-600'}`} />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">
              {formatRatio(result.profitabilityIndex)}
            </div>
            <div className="text-sm text-blue-700 mt-1">{t('calculators.npv.profitability_index')}</div>
            <div className="text-xs text-blue-600 mt-1">
              {result.profitabilityIndex > 1 ? t('calculators.npv.profitable') : t('calculators.npv.unprofitable')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800">
              {formatCurrency(result.presentValueOfReturns)}
            </div>
            <div className="text-sm text-purple-700 mt-1">{t('calculators.npv.present_value_returns')}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-orange-800">
              {formatPercentage(result.discountRate)}
            </div>
            <div className="text-sm text-orange-700 mt-1">{t('calculators.npv.discount_rate')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-900 mb-2">
              {formatCurrency(result.totalInvestment)}
            </div>
            <div className="text-sm text-red-700">
              {t('calculators.npv.total_investment')}
            </div>
            <div className="text-xs text-red-600 mt-1">
              {t('calculators.irr.sum_all_expenses')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-900 mb-2">
              {formatCurrency(result.totalReturns)}
            </div>
            <div className="text-sm text-green-700">
              {t('calculators.npv.total_returns')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              Nominální hodnota příjmů
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
              <h4 className="font-semibold text-gray-900 mb-2">Detailní analýza</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>NPV při {result.discountRate}%:</span>
                  <span className={`font-mono ${result.npv > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(result.npv)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Index ziskovosti (PI):</span>
                  <span className={`font-mono ${result.profitabilityIndex > 1 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatRatio(result.profitabilityIndex)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Současná hodnota výnosů:</span>
                  <span className="font-mono">{formatCurrency(result.presentValueOfReturns)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Poměr NPV k investici:</span>
                  <span className="font-mono">{formatRatio(result.npv / result.totalInvestment)}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>Doporučení:</span>
                  <span className={`font-mono ${result.npv > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.npv > 0 ? 'PŘIJMOUT' : 'ODMÍTNOUT'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Present Value Breakdown */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Rozklad současných hodnot</h4>
          <div className="space-y-2">
            {cashFlows.map((flow, index) => {
              const presentValue = calculatePresentValue(flow.amount, flow.period, result.discountRate);
              return (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="text-sm font-medium">
                    {flow.period === 0 ? 'Počátek' : `Rok ${flow.period}`}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-mono ${flow.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {flow.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(flow.amount))}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className={`font-mono ${presentValue < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {presentValue < 0 ? '-' : '+'}{formatCurrency(Math.abs(presentValue))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-2 border-t flex justify-between font-semibold">
            <span>{t('calculators.npv.total_npv')}:</span>
            <span className={`font-mono ${result.npv < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(result.npv)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('calculators.npv.enter_cash_flows')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('calculators.npv.title')}
      description={t('calculators.npv.description')}
      category={t('categories.financial')}
      seo={{
        title: "Kalkulátor NPV - Čistá současná hodnota | MathCalc",
        description: "Bezplatný kalkulátor NPV. Vypočítejte čistou současnou hodnotu investice, index ziskovosti a analyzujte výhodnost projektu.",
        keywords: ["NPV", "čistá současná hodnota", "investice", "diskontní sazba", "index ziskovosti", "finanční analýza", "kalkulátor NPV"]
      }}
      formula={{
        latex: "NPV = \\sum_{t=0}^{n} \\frac{CF_t}{(1+r)^t}",
        description: "NPV je součet současných hodnot všech peněžních toků diskontovaných požadovanou výnosností."
      }}
      examples={{
        title: "Příklady výpočtu NPV",
        description: "Praktické použití kalkulátoru NPV",
        scenarios: [
          {
            title: "Investice do stroje",
            description: "Investice -500 000 Kč, výnosy 150 000 Kč ročně, r=10%",
            example: "NPV = 25 394 Kč, PI = 1,05 → výhodná investice"
          },
          {
            title: "Nemovitostní projekt",
            description: "Investice -2 000 000 Kč, rostoucí výnosy, r=8%",
            example: "NPV = 234 567 Kč, PI = 1,12 → velmi výhodná"
          },
          {
            title: "IT projekt",
            description: "Investice -300 000 Kč, výnosy 80 000 Kč po 5 let, r=12%",
            example: "NPV = -11 456 Kč, PI = 0,96 → nevýhodná investice"
          }
        ]
      }}
      faq={[
        {
          question: "Co je NPV?",
          answer: "Čistá současná hodnota (Net Present Value) je rozdíl mezi současnou hodnotou příjmů a výdajů. Kladná NPV znamená výhodnou investici."
        },
        {
          question: "Jak vybrat diskontní sazbu?",
          answer: "Diskontní sazba odpovídá nákladům kapitálu nebo požadované minimální výnosnosti. Obvykle 8-15% podle rizika projektu."
        },
        {
          question: "Co je index ziskovosti (PI)?",
          answer: "PI = současná hodnota výnosů / investice. Hodnota > 1 znamená výhodnou investici. Umožňuje porovnání projektů různých velikostí."
        },
        {
          question: "Jaký je rozdíl mezi NPV a IRR?",
          answer: "NPV udává absolutní hodnotu zisku, IRR udává procentuální výnosnost. NPV je spolehlivější při porovnání projektů."
        }
      ]}
      relatedCalculators={[
        {
          title: "Kalkulátor IRR",
          description: "Vnitřní výnosové procento",
          href: "/calculator/financie-rozsirene/irr",
          category: "Finanční"
        },
        {
          title: "Kalkulátor ROI",
          description: "Návratnost investice",
          href: "/calculator/financie-rozsirene/roi",
          category: "Finanční"
        },
        {
          title: "Složené úročení",
          description: "Výpočet složeného úročení",
          href: "/calculator/slozene-uroceni",
          category: "Finanční"
        },
        {
          title: "Anuitní splátka",
          description: "Výpočet splátek úvěru",
          href: "/calculator/anuitni-splatka",
          category: "Finanční"
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

export default NPVCalculator;
