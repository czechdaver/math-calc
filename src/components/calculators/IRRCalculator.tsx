// src/components/calculators/IRRCalculator.tsx
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

interface IRRResult {
  irr: number;
  npv: number;
  paybackPeriod: number;
  totalInvestment: number;
  totalReturns: number;
  netProfit: number;
  isValid: boolean;
}

const IRRCalculator: React.FC = () => {
  const t = useTranslations();
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([
    { period: 0, amount: -100000 }, // Initial investment
    { period: 1, amount: 25000 },
    { period: 2, amount: 30000 },
    { period: 3, amount: 35000 },
    { period: 4, amount: 40000 }
  ]);
  const [discountRate, setDiscountRate] = useState<string>('10');
  
  const [result, setResult] = useState<IRRResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format percentage
  const formatPercentage = (value: number): string => {
    return value.toLocaleString('cs-CZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + '%';
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ' Kč';
  };

  // Format years
  const formatYears = (years: number): string => {
    if (years === Infinity || isNaN(years)) return 'N/A';
    return years.toLocaleString('cs-CZ', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }) + ' let';
  };

  // Calculate NPV for given rate
  const calculateNPV = (rate: number, flows: CashFlow[]): number => {
    return flows.reduce((npv, flow) => {
      return npv + (flow.amount / Math.pow(1 + rate / 100, flow.period));
    }, 0);
  };

  // Calculate IRR using Newton-Raphson method
  const calculateIRR = (flows: CashFlow[]): number => {
    let rate = 10; // Initial guess
    let iteration = 0;
    const maxIterations = 100;
    const tolerance = 0.0001;

    while (iteration < maxIterations) {
      const npv = calculateNPV(rate, flows);
      
      // Calculate derivative (NPV')
      const derivative = flows.reduce((sum, flow) => {
        if (flow.period === 0) return sum;
        return sum - (flow.period * flow.amount) / Math.pow(1 + rate / 100, flow.period + 1) / 100;
      }, 0);

      if (Math.abs(derivative) < tolerance) break;
      
      const newRate = rate - npv / derivative;
      
      if (Math.abs(newRate - rate) < tolerance) {
        return newRate;
      }
      
      rate = newRate;
      iteration++;
    }

    return rate;
  };

  // Calculate payback period
  const calculatePaybackPeriod = (flows: CashFlow[]): number => {
    let cumulativeFlow = 0;
    
    for (let i = 0; i < flows.length; i++) {
      cumulativeFlow += flows[i].amount;
      if (cumulativeFlow > 0 && i > 0) {
        // Linear interpolation for more precise payback period
        const previousCumulative = cumulativeFlow - flows[i].amount;
        const fraction = -previousCumulative / flows[i].amount;
        return flows[i].period - 1 + fraction;
      }
    }
    
    return Infinity;
  };

  // Validation function
  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    const discountRateNum = parseFloat(discountRate);
    if (!discountRate || isNaN(discountRateNum)) {
      newErrors.discountRate = 'Zadejte platnou diskontní sazbu';
    }

    // Check if we have at least one negative and one positive cash flow
    const hasNegative = cashFlows.some(flow => flow.amount < 0);
    const hasPositive = cashFlows.some(flow => flow.amount > 0);
    
    if (!hasNegative || !hasPositive) {
      newErrors.cashFlows = 'Musí existovat alespoň jeden záporný a jeden kladný peněžní tok';
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

  // Calculate IRR and related metrics
  const calculateResult = (): IRRResult => {
    const irr = calculateIRR(cashFlows);
    const npv = calculateNPV(parseFloat(discountRate), cashFlows);
    const paybackPeriod = calculatePaybackPeriod(cashFlows);
    
    const totalInvestment = Math.abs(cashFlows.filter(flow => flow.amount < 0).reduce((sum, flow) => sum + flow.amount, 0));
    const totalReturns = cashFlows.filter(flow => flow.amount > 0).reduce((sum, flow) => sum + flow.amount, 0);
    const netProfit = totalReturns - totalInvestment;

    return {
      irr,
      npv,
      paybackPeriod,
      totalInvestment,
      totalReturns,
      netProfit,
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
    if (cashFlows.length > 2) { // Keep at least 2 cash flows
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
          {t('calculators.irr.discount_rate')} (%)
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
          {t('calculators.irr.discount_rate_hint')}
        </p>
      </div>

      {/* Cash Flows */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{t('calculators.irr.cash_flows')}</Label>
          <Button
            type="button"
            onClick={addCashFlow}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('calculators.irr.add_period')}
          </Button>
        </div>

        {errors.cashFlows && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.cashFlows}
          </p>
        )}

        <div className="space-y-3">
          {cashFlows.map((flow, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-600">
                {flow.period === 0 ? t('calculators.irr.beginning') : `${t('calculators.irr.year')} ${flow.period}`}
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
          <p>• {t('calculators.irr.negative_values')}</p>
          <p>• {t('calculators.irr.positive_values')}</p>
          <p>• {t('calculators.irr.period_zero')}</p>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2 flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t('calculators.irr.investment_analysis')} - {cashFlows.length} {t('calculators.irr.periods')}
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {t('calculators.irr.discount_rate')} {discountRate}% • {cashFlows.filter(cf => cf.amount < 0).length} {t('calculators.irr.investments')} • {cashFlows.filter(cf => cf.amount > 0).length} {t('calculators.irr.returns')}
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
              {formatPercentage(result.irr)}
            </div>
            <div className="text-sm text-green-700 mt-1">
              {t('calculators.irr.irr_result')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {result.irr > parseFloat(discountRate) ? t('calculators.irr.investment_profitable') : t('calculators.irr.investment_unprofitable')}
            </div>
          </div>
          <TrendingUp className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className={`${result.npv > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <CardContent className="p-4 text-center">
            <div className={`text-lg font-bold ${result.npv > 0 ? 'text-green-800' : 'text-red-800'}`}>
              {formatCurrency(result.npv)}
            </div>
            <div className={`text-sm mt-1 ${result.npv > 0 ? 'text-green-700' : 'text-red-700'}`}>
              {t('calculators.irr.npv_result')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">
              {formatYears(result.paybackPeriod)}
            </div>
            <div className="text-sm text-blue-700 mt-1">{t('calculators.irr.payback_period')}</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800">
              {formatCurrency(result.netProfit)}
            </div>
            <div className="text-sm text-purple-700 mt-1">{t('calculators.irr.net_profit')}</div>
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
              {t('calculators.irr.total_investment')}
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
              {t('calculators.irr.total_returns')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {t('calculators.irr.sum_all_income')}
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
                  <span>IRR (vnitřní výnosové procento):</span>
                  <span className="font-mono">{formatPercentage(result.irr)}</span>
                </div>
                <div className="flex justify-between">
                  <span>NPV při {discountRate}%:</span>
                  <span className={`font-mono ${result.npv > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(result.npv)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Doba návratnosti:</span>
                  <span className="font-mono">{formatYears(result.paybackPeriod)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Poměr výnosů k investici:</span>
                  <span className="font-mono">{(result.totalReturns / result.totalInvestment).toLocaleString('cs-CZ', { maximumFractionDigits: 2 })}×</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>Doporučení:</span>
                  <span className={`font-mono ${result.irr > parseFloat(discountRate) ? 'text-green-600' : 'text-red-600'}`}>
                    {result.irr > parseFloat(discountRate) ? 'PŘIJMOUT' : 'ODMÍTNOUT'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Timeline */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Časová osa peněžních toků</h4>
          <div className="space-y-2">
            {cashFlows.map((flow, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium">
                  {flow.period === 0 ? 'Počátek' : `Rok ${flow.period}`}
                </div>
                <div className={`text-sm font-mono ${flow.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {flow.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(flow.amount))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('calculators.irr.enter_cash_flows')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('calculators.irr.title')}
      description={t('calculators.irr.description')}
      category={t('categories.financial')}
      seo={{
        title: t('calculators.irr.seo_title'),
        description: t('calculators.irr.seo_description'),
        keywords: ["IRR", "vnitřní výnosové procento", "NPV", "investice", "výnosnost", "peněžní toky", "finanční analýza", "kalkulátor IRR"]
      }}
      formula={{
        latex: "NPV = \\sum_{t=0}^{n} \\frac{CF_t}{(1+IRR)^t} = 0",
        description: t('calculators.irr.formula_description')
      }}
      examples={{
        title: t('calculators.irr.examples_title'),
        description: t('calculators.irr.examples_description'),
        scenarios: [
          {
            title: "Investice do stroje",
            description: "Investice -500 000 Kč, výnosy 150 000 Kč ročně po 4 roky",
            example: "IRR = 12,6%, NPV při 10% = 25 394 Kč"
          },
          {
            title: "Nemovitostní projekt",
            description: "Investice -2 000 000 Kč, výnosy rostoucí 300-500 tis. Kč",
            example: "IRR = 18,2%, doba návratnosti 4,2 roku"
          },
          {
            title: "Startup investice",
            description: "Investice -1 000 000 Kč, exit za 5 let 5 000 000 Kč",
            example: "IRR = 37,9%, velmi výhodná investice"
          }
        ]
      }}
      faq={[
        {
          question: "Co je IRR?",
          answer: "Vnitřní výnosové procento (Internal Rate of Return) je diskontní sazba, při které je NPV investice rovna nule. Udává skutečnou výnosnost investice."
        },
        {
          question: "Jak interpretovat IRR?",
          answer: "Pokud je IRR vyšší než požadovaná výnosnost (diskontní sazba), investice je výhodná. Čím vyšší IRR, tím lepší investice."
        },
        {
          question: "Co je NPV?",
          answer: "Čistá současná hodnota (Net Present Value) je rozdíl mezi současnou hodnotou příjmů a výdajů. Kladná NPV znamená výhodnou investici."
        },
        {
          question: "Jak se počítá doba návratnosti?",
          answer: "Doba návratnosti je čas potřebný k tomu, aby kumulativní peněžní toky pokryly počáteční investici. Kratší doba je lepší."
        }
      ]}
      relatedCalculators={[
        {
          title: "Kalkulátor NPV",
          description: "Výpočet čisté současné hodnoty",
          href: "/calculator/financie-rozsirene/npv",
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

export default IRRCalculator;
