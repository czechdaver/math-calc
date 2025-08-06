// src/components/calculators/TipCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, DollarSign, Users, Receipt, Percent } from 'lucide-react';

interface TipResult {
  billAmount: number;
  tipPercentage: number;
  tipAmount: number;
  totalAmount: number;
  perPersonBill: number;
  perPersonTip: number;
  perPersonTotal: number;
  numberOfPeople: number;
  serviceQuality: string;
  isValid: boolean;
}

const TipCalculator: React.FC = () => {
  const t = useTranslations();
  const [billAmount, setBillAmount] = useState<string>('500');
  const [tipPercentage, setTipPercentage] = useState<string>('15');
  const [numberOfPeople, setNumberOfPeople] = useState<string>('2');
  const [serviceQuality, setServiceQuality] = useState<string>('good');
  const [customTip, setCustomTip] = useState<string>('');
  const [result, setResult] = useState<TipResult | null>(null);
  const [errors, setErrors] = useState<{ 
    billAmount?: string; tipPercentage?: string; numberOfPeople?: string; customTip?: string;
  }>({});

  // Format currency with Czech locale
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Format number with Czech locale
  const formatNumber = (num: number, decimals: number = 1): string => {
    return num.toLocaleString('cs-CZ', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Get service quality description and recommended tip
  const getServiceQualityInfo = (quality: string): { description: string; recommendedTip: number; color: string } => {
    switch (quality) {
      case 'poor':
        return { description: t('calculators.tip.service_poor'), recommendedTip: 5, color: 'text-red-600' };
      case 'average':
        return { description: t('calculators.tip.service_average'), recommendedTip: 10, color: 'text-yellow-600' };
      case 'good':
        return { description: t('calculators.tip.service_good'), recommendedTip: 15, color: 'text-green-600' };
      case 'excellent':
        return { description: t('calculators.tip.service_excellent'), recommendedTip: 20, color: 'text-blue-600' };
      case 'custom':
        return { description: t('calculators.tip.service_custom'), recommendedTip: 0, color: 'text-purple-600' };
      default:
        return { description: t('calculators.tip.service_good'), recommendedTip: 15, color: 'text-green-600' };
    }
  };

  // Calculate tip and totals
  const calculateTip = (
    billAmountNum: number,
    tipPercentageNum: number,
    numberOfPeopleNum: number,
    serviceQualityStr: string
  ): TipResult => {
    const tipAmount = (billAmountNum * tipPercentageNum) / 100;
    const totalAmount = billAmountNum + tipAmount;
    const perPersonBill = billAmountNum / numberOfPeopleNum;
    const perPersonTip = tipAmount / numberOfPeopleNum;
    const perPersonTotal = totalAmount / numberOfPeopleNum;

    return {
      billAmount: billAmountNum,
      tipPercentage: tipPercentageNum,
      tipAmount: Math.round(tipAmount),
      totalAmount: Math.round(totalAmount),
      perPersonBill: Math.round(perPersonBill),
      perPersonTip: Math.round(perPersonTip),
      perPersonTotal: Math.round(perPersonTotal),
      numberOfPeople: numberOfPeopleNum,
      serviceQuality: serviceQualityStr,
      isValid: true
    };
  };

  // Validation function
  const validateInputs = (
    billAmountStr: string,
    tipPercentageStr: string,
    numberOfPeopleStr: string,
    customTipStr: string
  ) => {
    const newErrors: { 
      billAmount?: string; tipPercentage?: string; numberOfPeople?: string; customTip?: string;
    } = {};
    
    const billAmountNum = parseFloat(billAmountStr);
    const tipPercentageNum = parseFloat(tipPercentageStr);
    const numberOfPeopleNum = parseFloat(numberOfPeopleStr);
    const customTipNum = customTipStr ? parseFloat(customTipStr) : 0;

    if (!billAmountStr || isNaN(billAmountNum) || billAmountNum <= 0 || billAmountNum > 100000) {
      newErrors.billAmount = t('calculators.tip.validation.bill_amount');
    }

    if (!tipPercentageStr || isNaN(tipPercentageNum) || tipPercentageNum < 0 || tipPercentageNum > 100) {
      newErrors.tipPercentage = t('calculators.tip.validation.tip_percentage');
    }

    if (!numberOfPeopleStr || isNaN(numberOfPeopleNum) || numberOfPeopleNum < 1 || numberOfPeopleNum > 50) {
      newErrors.numberOfPeople = t('calculators.tip.validation.number_of_people');
    }

    if (serviceQuality === 'custom' && customTipStr && (!isNaN(customTipNum) && (customTipNum < 0 || customTipNum > 100))) {
      newErrors.customTip = t('calculators.tip.validation.custom_tip');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Effect for real-time calculation
  useEffect(() => {
    let currentTipPercentage = parseFloat(tipPercentage);
    
    // Use service quality recommended tip or custom tip
    if (serviceQuality !== 'custom') {
      const { recommendedTip } = getServiceQualityInfo(serviceQuality);
      currentTipPercentage = recommendedTip;
      setTipPercentage(recommendedTip.toString());
    } else if (customTip) {
      currentTipPercentage = parseFloat(customTip);
      setTipPercentage(customTip);
    }

    if (validateInputs(billAmount, currentTipPercentage.toString(), numberOfPeople, customTip)) {
      const billAmountNum = parseFloat(billAmount);
      const numberOfPeopleNum = parseFloat(numberOfPeople);

      setResult(calculateTip(billAmountNum, currentTipPercentage, numberOfPeopleNum, serviceQuality));
    } else {
      setResult(null);
    }
  }, [billAmount, tipPercentage, numberOfPeople, serviceQuality, customTip]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Bill Amount */}
      <div className="space-y-2">
        <Label htmlFor="billAmount" className="text-sm font-medium">
          {t('calculators.tip.bill_amount')}
        </Label>
        <div className="relative">
          <Input
            id="billAmount"
            type="number"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            placeholder="500"
            className={`pr-12 ${errors.billAmount ? 'border-red-500' : ''}`}
            min="1"
            max="100000"
            step="1"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {t('common.currency')}
          </span>
        </div>
        {errors.billAmount && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.billAmount}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          Celková částka účtu před spropitným
        </p>
      </div>

      {/* Service Quality */}
      <div className="space-y-2">
        <Label htmlFor="serviceQuality" className="text-sm font-medium">
          Kvalita obsluhy
        </Label>
        <Select value={serviceQuality} onValueChange={setServiceQuality}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte kvalitu obsluhy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="poor">Špatná (5%)</SelectItem>
            <SelectItem value="average">Průměrná (10%)</SelectItem>
            <SelectItem value="good">Dobrá (15%)</SelectItem>
            <SelectItem value="excellent">Výborná (20%)</SelectItem>
            <SelectItem value="custom">Vlastní procento</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {getServiceQualityInfo(serviceQuality).description} - doporučené spropitné
        </p>
      </div>

      {/* Custom Tip Percentage */}
      {serviceQuality === 'custom' && (
        <div className="space-y-2">
          <Label htmlFor="customTip" className="text-sm font-medium">
            Vlastní procento spropitného
          </Label>
          <div className="relative">
            <Input
              id="customTip"
              type="number"
              value={customTip}
              onChange={(e) => setCustomTip(e.target.value)}
              placeholder="15"
              className={`pr-12 ${errors.customTip ? 'border-red-500' : ''}`}
              min="0"
              max="100"
              step="0.5"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              %
            </span>
          </div>
          {errors.customTip && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.customTip}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            Zadejte vlastní procento spropitného
          </p>
        </div>
      )}

      {/* Number of People */}
      <div className="space-y-2">
        <Label htmlFor="numberOfPeople" className="text-sm font-medium">
          Počet lidí
        </Label>
        <div className="relative">
          <Input
            id="numberOfPeople"
            type="number"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            placeholder="2"
            className={`pr-12 ${errors.numberOfPeople ? 'border-red-500' : ''}`}
            min="1"
            max="50"
            step="1"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            osob
          </span>
        </div>
        {errors.numberOfPeople && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.numberOfPeople}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          Počet lidí, kteří si účet rozdělí
        </p>
      </div>

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2">
              Shrnutí objednávky
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-semibold text-blue-900">Účet</div>
                <div className="text-blue-700">{formatCurrency(parseFloat(billAmount || '0'))} Kč</div>
              </div>
              <div>
                <div className="font-semibold text-blue-900">Lidé</div>
                <div className="text-blue-700">{numberOfPeople} osob</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              Spropitné: {tipPercentage}% ({getServiceQualityInfo(serviceQuality).description.toLowerCase()})
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Results section
  const resultsSection = result ? (
    <div className="space-y-6">
      {/* Main Result - Total Amount */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">
              {formatCurrency(result.totalAmount)} Kč
            </div>
            <div className="text-sm text-green-700 mt-1">
              {t('calculators.tip.total_to_pay')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {t('calculators.tip.bill_plus_tip')} {result.tipPercentage}%
            </div>
          </div>
          <Receipt className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <div className="text-sm font-medium text-blue-700">{t('calculators.tip.original_bill')}</div>
            </div>
            <div className="text-lg font-bold text-blue-800">
              {formatCurrency(result.billAmount)} Kč
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Původní částka
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Percent className="w-4 h-4 text-yellow-600" />
              <div className="text-sm font-medium text-yellow-700">Spropitné</div>
            </div>
            <div className="text-lg font-bold text-yellow-800">
              {formatCurrency(result.tipAmount)} Kč
            </div>
            <div className="text-xs text-yellow-600 mt-1">
              {result.tipPercentage}% z účtu
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per Person Breakdown */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-purple-900">Na osobu ({result.numberOfPeople} lidí)</h4>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-purple-700 mb-1">Účet</div>
              <div className="text-lg font-bold text-purple-800">
                {formatCurrency(result.perPersonBill)} Kč
              </div>
            </div>
            <div>
              <div className="text-sm text-purple-700 mb-1">Spropitné</div>
              <div className="text-lg font-bold text-purple-800">
                {formatCurrency(result.perPersonTip)} Kč
              </div>
            </div>
            <div>
              <div className="text-sm text-purple-700 mb-1">Celkem</div>
              <div className="text-lg font-bold text-purple-800">
                {formatCurrency(result.perPersonTotal)} Kč
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Quality Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Receipt className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Spropitné v České republice</h4>
              <p className="text-gray-600 text-sm mb-2">
                V ČR se spropitné obvykle pohybuje mezi 10-15% v restauracích. 
                Při výborné obsluze je vhodné dát až 20%. V barech a kavárnách stačí zaokrouhlit nahoru.
              </p>
              <div className="text-xs text-gray-500">
                Kvalita obsluhy: {getServiceQualityInfo(result.serviceQuality).description} | 
                Spropitné: {result.tipPercentage}% | 
                Celkem: {formatCurrency(result.totalAmount)} Kč
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <CalcIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('common.enter_values')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('calculators.tip.title')}
      description={t('calculators.tip.description')}
      category={t('categories.practical')}
      seo={{
        title: "Kalkulátor spropitného - Výpočet spropitného pro restaurace | MathCalc",
        description: "Bezplatný kalkulátor spropitného. Vypočítejte správnou výši spropitného podle kvality obsluhy a rozdělte účet mezi více lidí.",
        keywords: ["spropitné", "tip calculator", "restaurace", "obsluha", "účet", "rozdělení účtu", "procenta", "kalkulátor"]
      }}
      formula={{
        latex: "Spropitné = Účet \\times \\frac{Procento}{100}",
        description: "Celková částka = Účet + Spropitné. Na osobu = Celková částka ÷ Počet lidí."
      }}
      examples={{
        title: "Příklady výpočtu spropitného",
        description: "Různé situace a doporučené procenta",
        scenarios: [
          {
            title: "Restaurace, dobrá obsluha",
            description: "Účet 800 Kč, 15% spropitné = 120 Kč",
            example: "Celkem k zaplacení: 920 Kč"
          },
          {
            title: "Rozdělení mezi 4 osoby",
            description: "Účet 1200 Kč, 15% spropitné, 4 osoby",
            example: "Na osobu: 345 Kč (300 + 45 spropitné)"
          },
          {
            title: "Výborná obsluha",
            description: "Účet 600 Kč, 20% spropitné = 120 Kč",
            example: "Celkem: 720 Kč (odměna za skvělý servis)"
          }
        ]
      }}
      faq={[
        {
          question: "Kolik spropitného dát v České republice?",
          answer: "V restauracích je obvyklé 10-15% spropitné. Při výborné obsluze až 20%. V barech a kavárnách stačí zaokrouhlit nahoru nebo dát 5-10%."
        },
        {
          question: "Kdy nedávat spropitné?",
          answer: "Pokud byla obsluha skutečně špatná, není spropitné povinné. Můžete dát méně (5%) nebo vůbec nic, ale je slušné to zdůvodnit."
        },
        {
          question: "Jak rozdělit účet mezi více lidí?",
          answer: "Celkovou částku (účet + spropitné) vydělte počtem lidí. Kalkulátor automaticky spočítá částku na osobu včetně podílu na spropitném."
        },
        {
          question: "Platí se spropitné z DPH?",
          answer: "Ano, spropitné se počítá z celkové částky účtu včetně DPH. Je to celková částka, kterou zaplatíte za jídlo a pití."
        }
      ]}
      relatedCalculators={[
        {
          title: "Procento z čísla",
          description: "Vypočítejte X% z daného čísla",
          href: "/calculator/procenta/procento-z-cisla",
          category: "Procenta"
        },
        {
          title: "DPH kalkulátor",
          description: "Výpočet DPH a cen",
          href: "/calculator/dph",
          category: "Finance"
        },
        {
          title: "Převodník jednotek",
          description: "Převod mezi různými jednotkami",
          href: "/calculator/prevodnik-jednotek",
          category: "Praktické"
        },
        {
          title: "BMI kalkulátor",
          description: "Výpočet indexu tělesné hmotnosti",
          href: "/calculator/bmi",
          category: "Zdraví"
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

export default TipCalculator;
