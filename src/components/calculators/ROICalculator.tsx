// src/components/calculators/ROICalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, TrendingUp, DollarSign, Clock } from 'lucide-react';

interface ROIResult {
  roi: number;
  annualizedROI: number;
  totalReturn: number;
  netProfit: number;
  investmentPeriod: number;
  breakEvenPoint: number;
  isValid: boolean;
}

const ROICalculator: React.FC = () => {
  const t = useTranslations();
  const [calculationType, setCalculationType] = useState<string>('simple');
  const [initialInvestment, setInitialInvestment] = useState<string>('100000');
  const [finalValue, setFinalValue] = useState<string>('125000');
  const [additionalCosts, setAdditionalCosts] = useState<string>('5000');
  const [timePeriod, setTimePeriod] = useState<string>('2');
  const [timeUnit, setTimeUnit] = useState<string>('years');
  
  // For annualized calculation
  const [annualReturn, setAnnualReturn] = useState<string>('12000');
  
  const [result, setResult] = useState<ROIResult | null>(null);
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

  // Format time period
  const formatTimePeriod = (period: number, unit: string): string => {
    const unitText = unit === 'years' ? 'let' : unit === 'months' ? 'měsíců' : 'dní';
    return `${period.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} ${unitText}`;
  };

  // Convert time period to years
  const convertToYears = (period: number, unit: string): number => {
    switch (unit) {
      case 'months': return period / 12;
      case 'days': return period / 365;
      default: return period;
    }
  };

  // Validation function
  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    const initialInvestmentNum = parseFloat(initialInvestment);
    const finalValueNum = parseFloat(finalValue);
    const additionalCostsNum = parseFloat(additionalCosts);
    const timePeriodNum = parseFloat(timePeriod);
    const annualReturnNum = parseFloat(annualReturn);

    if (!initialInvestment || isNaN(initialInvestmentNum) || initialInvestmentNum <= 0) {
      newErrors.initialInvestment = 'Zadejte platnou počáteční investici';
    }

    if (calculationType === 'simple') {
      if (!finalValue || isNaN(finalValueNum) || finalValueNum < 0) {
        newErrors.finalValue = 'Zadejte platnou konečnou hodnotu';
      }
    } else {
      if (!annualReturn || isNaN(annualReturnNum)) {
        newErrors.annualReturn = 'Zadejte platný roční výnos';
      }
    }

    if (!additionalCosts || isNaN(additionalCostsNum) || additionalCostsNum < 0) {
      newErrors.additionalCosts = 'Zadejte platné dodatečné náklady';
    }

    if (!timePeriod || isNaN(timePeriodNum) || timePeriodNum <= 0) {
      newErrors.timePeriod = 'Zadejte platné časové období';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate ROI
  const calculateROI = (): ROIResult => {
    const initialInv = parseFloat(initialInvestment);
    const additionalCost = parseFloat(additionalCosts);
    const totalInvestment = initialInv + additionalCost;
    const period = parseFloat(timePeriod);
    const periodInYears = convertToYears(period, timeUnit);

    let finalVal: number;
    let totalReturn: number;
    let netProfit: number;
    let roi: number;
    let annualizedROI: number;

    if (calculationType === 'simple') {
      finalVal = parseFloat(finalValue);
      totalReturn = finalVal;
      netProfit = finalVal - totalInvestment;
      roi = (netProfit / totalInvestment) * 100;
    } else {
      // Annualized calculation
      const annualRet = parseFloat(annualReturn);
      totalReturn = annualRet * periodInYears;
      netProfit = totalReturn - additionalCost; // Don't subtract initial investment for ongoing returns
      roi = (totalReturn / totalInvestment) * 100;
    }

    // Calculate annualized ROI
    if (periodInYears > 0) {
      annualizedROI = (Math.pow(1 + roi / 100, 1 / periodInYears) - 1) * 100;
    } else {
      annualizedROI = roi;
    }

    // Calculate break-even point (in years)
    let breakEvenPoint: number;
    if (calculationType === 'simple') {
      breakEvenPoint = periodInYears; // Simple case - break even at the end
    } else {
      const annualRet = parseFloat(annualReturn);
      if (annualRet > 0) {
        breakEvenPoint = totalInvestment / annualRet;
      } else {
        breakEvenPoint = Infinity;
      }
    }

    return {
      roi,
      annualizedROI,
      totalReturn,
      netProfit,
      investmentPeriod: periodInYears,
      breakEvenPoint,
      isValid: true
    };
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs()) {
      const calculatedResult = calculateROI();
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [calculationType, initialInvestment, finalValue, additionalCosts, timePeriod, timeUnit, annualReturn]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Calculation Type */}
      <div className="space-y-2">
        <Label htmlFor="calculationType" className="text-sm font-medium">
          {t('calculators.roi.calculation_type')}
        </Label>
        <Select value={calculationType} onValueChange={setCalculationType}>
          <SelectTrigger>
            <SelectValue placeholder={t('calculators.roi.select_type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">{t('calculators.roi.simple_investment')}</SelectItem>
            <SelectItem value="annualized">{t('calculators.roi.regular_returns')}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {calculationType === 'simple' 
            ? t('calculators.roi.simple_hint')
            : t('calculators.roi.annualized_hint')
          }
        </p>
      </div>

      {/* Initial Investment */}
      <div className="space-y-2">
        <Label htmlFor="initialInvestment" className="text-sm font-medium">
          {t('calculators.roi.initial_investment')} (Kč)
        </Label>
        <Input
          id="initialInvestment"
          type="number"
          value={initialInvestment}
          onChange={(e) => setInitialInvestment(e.target.value)}
          placeholder="100000"
          className={`${errors.initialInvestment ? 'border-red-500' : ''}`}
          min="0"
          step="1000"
        />
        {errors.initialInvestment && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.initialInvestment}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.roi.initial_investment_hint')}
        </p>
      </div>

      {/* Final Value or Annual Return */}
      {calculationType === 'simple' ? (
        <div className="space-y-2">
          <Label htmlFor="finalValue" className="text-sm font-medium">
            {t('calculators.roi.final_value')} (Kč)
          </Label>
          <Input
            id="finalValue"
            type="number"
            value={finalValue}
            onChange={(e) => setFinalValue(e.target.value)}
            placeholder="125000"
            className={`${errors.finalValue ? 'border-red-500' : ''}`}
            min="0"
            step="1000"
          />
          {errors.finalValue && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.finalValue}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            {t('calculators.roi.final_value_hint')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="annualReturn" className="text-sm font-medium">
            {t('calculators.roi.annualized_roi')} (Kč)
          </Label>
          <Input
            id="annualReturn"
            type="number"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(e.target.value)}
            placeholder="12000"
            className={`${errors.annualReturn ? 'border-red-500' : ''}`}
            step="1000"
          />
          {errors.annualReturn && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.annualReturn}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            {t('calculators.roi.annual_return_hint')}
          </p>
        </div>
      )}

      {/* Additional Costs */}
      <div className="space-y-2">
        <Label htmlFor="additionalCosts" className="text-sm font-medium">
          {t('calculators.roi.additional_costs')} (Kč)
        </Label>
        <Input
          id="additionalCosts"
          type="number"
          value={additionalCosts}
          onChange={(e) => setAdditionalCosts(e.target.value)}
          placeholder="5000"
          className={`${errors.additionalCosts ? 'border-red-500' : ''}`}
          min="0"
          step="1000"
        />
        {errors.additionalCosts && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.additionalCosts}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.roi.additional_costs_hint')}
        </p>
      </div>

      {/* Time Period */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t('calculators.roi.investment_period')}</Label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            placeholder="2"
            className={`${errors.timePeriod ? 'border-red-500' : ''}`}
            min="0"
            step="0.1"
          />
          <Select value={timeUnit} onValueChange={setTimeUnit}>
            <SelectTrigger>
              <SelectValue placeholder={t('common.unit')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="years">{t('calculators.roi.years')}</SelectItem>
              <SelectItem value="months">{t('calculators.roi.months')}</SelectItem>
              <SelectItem value="days">{t('common.days')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {errors.timePeriod && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.timePeriod}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.roi.time_period_hint')}
        </p>
      </div>

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2 flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t('calculators.roi.roi_analysis')} - {calculationType === 'simple' ? t('calculators.roi.simple_investment') : t('calculators.roi.regular_returns')}
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {formatCurrency(parseFloat(initialInvestment) || 0)} • {formatTimePeriod(parseFloat(timePeriod) || 0, timeUnit)}
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
        <div className={`inline-flex items-center gap-4 p-6 rounded-xl ${result.roi > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="text-center">
            <div className={`text-3xl font-bold ${result.roi > 0 ? 'text-green-900' : 'text-red-900'}`}>
              {formatPercentage(result.roi)}
            </div>
            <div className={`text-sm mt-1 ${result.roi > 0 ? 'text-green-700' : 'text-red-700'}`}>
              {t('calculators.roi.title')}
            </div>
            <div className={`text-xs mt-1 ${result.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {result.roi > 0 ? t('calculators.roi.profitable_investment') : t('calculators.roi.unprofitable_investment')}
            </div>
          </div>
          <TrendingUp className={`w-8 h-8 ${result.roi > 0 ? 'text-green-600' : 'text-red-600'}`} />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">
              {formatPercentage(result.annualizedROI)}
            </div>
            <div className="text-sm text-blue-700 mt-1">{t('calculators.roi.annualized_roi_result')}</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800">
              {formatCurrency(result.netProfit)}
            </div>
            <div className="text-sm text-purple-700 mt-1">{t('calculators.roi.net_profit')}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-orange-800">
              {result.breakEvenPoint === Infinity ? 'N/A' : formatTimePeriod(result.breakEvenPoint, 'years')}
            </div>
            <div className="text-sm text-orange-700 mt-1">{t('calculators.roi.breakeven_point')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-900 mb-2">
              {formatCurrency(parseFloat(initialInvestment) + parseFloat(additionalCosts))}
            </div>
            <div className="text-sm text-red-700">
              {t('calculators.roi.total_investment')}
            </div>
            <div className="text-xs text-red-600 mt-1">
              {t('calculators.roi.including_costs')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-900 mb-2">
              {formatCurrency(result.totalReturn)}
            </div>
            <div className="text-sm text-green-700">
              Celkový výnos
            </div>
            <div className="text-xs text-green-600 mt-1">
              Za celé období
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
                  <span>Celkové ROI:</span>
                  <span className={`font-mono ${result.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(result.roi)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Roční ROI:</span>
                  <span className={`font-mono ${result.annualizedROI > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(result.annualizedROI)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Doba investice:</span>
                  <span className="font-mono">{formatTimePeriod(result.investmentPeriod, 'years')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Čistý zisk:</span>
                  <span className={`font-mono ${result.netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(result.netProfit)}
                  </span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>Doporučení:</span>
                  <span className={`font-mono ${result.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.roi > 0 ? 'VÝHODNÁ' : 'NEVÝHODNÁ'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('calculators.roi.enter_parameters')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('calculators.roi.title')}
      description={t('calculators.roi.description')}
      category={t('categories.financial')}
      seo={{
        title: "Kalkulátor ROI - Návratnost investice | MathCalc",
        description: "Bezplatný kalkulátor ROI. Vypočítejte návratnost investice, roční ROI a analyzujte výhodnost vašich investičních projektů.",
        keywords: ["ROI", "návratnost investice", "return on investment", "výnosnost", "investice", "finanční analýza", "kalkulátor ROI"]
      }}
      formula={{
        latex: "ROI = \\frac{Výnos - Investice}{Investice} \\times 100\\%",
        description: "ROI se počítá jako poměr čistého zisku k celkové investici vynásobený 100."
      }}
      examples={{
        title: "Příklady výpočtu ROI",
        description: "Praktické použití kalkulátoru ROI",
        scenarios: [
          {
            title: "Investice do akcií",
            description: "Investice 100 000 Kč, prodej za 125 000 Kč po 2 letech",
            example: "ROI = 25%, roční ROI = 11,8%"
          },
          {
            title: "Nemovitostní investice",
            description: "Investice 2 000 000 Kč, roční příjem 180 000 Kč",
            example: "ROI = 9% ročně, doba návratnosti 11,1 roku"
          },
          {
            title: "Podnikatelský projekt",
            description: "Investice 500 000 Kč, zisk 150 000 Kč za 3 roky",
            example: "ROI = 30%, roční ROI = 9,1%"
          }
        ]
      }}
      faq={[
        {
          question: "Co je ROI?",
          answer: "Return on Investment (návratnost investice) je finanční ukazatel, který měří efektivnost investice jako poměr zisku k vložené částce."
        },
        {
          question: "Jaký je dobrý ROI?",
          answer: "Dobrý ROI závisí na odvětví a riziku. Obecně 7-10% ročně je solidní, 15%+ je výborné. Porovnejte s alternativními investicemi."
        },
        {
          question: "Rozdíl mezi celkovým a ročním ROI?",
          answer: "Celkové ROI je za celé období, roční ROI je přepočteno na jeden rok. Roční ROI umožňuje porovnání investic různých délek."
        },
        {
          question: "Co zahrnout do dodatečných nákladů?",
          answer: "Poplatky, provize, daně, údržbu, pojištění a všechny další náklady spojené s investicí pro přesný výpočet ROI."
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
          title: "Kalkulátor NPV",
          description: "Čistá současná hodnota",
          href: "/calculator/financie-rozsirene/npv",
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

export default ROICalculator;
