// src/components/calculators/DiscountCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Tag, Percent, DollarSign, TrendingDown } from 'lucide-react';

interface DiscountResult {
  originalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  finalPrice: number;
  savings: number;
  calculationType: string;
  isValid: boolean;
}

const DiscountCalculator: React.FC = () => {
  const t = useTranslations();
  const [calculationType, setCalculationType] = useState<string>('percentage');
  const [originalPrice, setOriginalPrice] = useState<string>('1000');
  const [discountPercentage, setDiscountPercentage] = useState<string>('20');
  const [discountAmount, setDiscountAmount] = useState<string>('');
  const [finalPrice, setFinalPrice] = useState<string>('');
  const [result, setResult] = useState<DiscountResult | null>(null);
  const [errors, setErrors] = useState<{ 
    originalPrice?: string; discountPercentage?: string; 
    discountAmount?: string; finalPrice?: string;
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

  // Calculate discount from percentage
  const calculateFromPercentage = (originalPriceNum: number, discountPercentageNum: number): DiscountResult => {
    const discountAmountCalc = (originalPriceNum * discountPercentageNum) / 100;
    const finalPriceCalc = originalPriceNum - discountAmountCalc;

    return {
      originalPrice: originalPriceNum,
      discountPercentage: discountPercentageNum,
      discountAmount: Math.round(discountAmountCalc),
      finalPrice: Math.round(finalPriceCalc),
      savings: Math.round(discountAmountCalc),
      calculationType: 'percentage',
      isValid: true
    };
  };

  // Calculate discount from amount
  const calculateFromAmount = (originalPriceNum: number, discountAmountNum: number): DiscountResult => {
    const discountPercentageCalc = (discountAmountNum / originalPriceNum) * 100;
    const finalPriceCalc = originalPriceNum - discountAmountNum;

    return {
      originalPrice: originalPriceNum,
      discountPercentage: Math.round(discountPercentageCalc * 10) / 10,
      discountAmount: discountAmountNum,
      finalPrice: Math.round(finalPriceCalc),
      savings: discountAmountNum,
      calculationType: 'amount',
      isValid: true
    };
  };

  // Calculate discount from final price
  const calculateFromFinalPrice = (originalPriceNum: number, finalPriceNum: number): DiscountResult => {
    const discountAmountCalc = originalPriceNum - finalPriceNum;
    const discountPercentageCalc = (discountAmountCalc / originalPriceNum) * 100;

    return {
      originalPrice: originalPriceNum,
      discountPercentage: Math.round(discountPercentageCalc * 10) / 10,
      discountAmount: Math.round(discountAmountCalc),
      finalPrice: finalPriceNum,
      savings: Math.round(discountAmountCalc),
      calculationType: 'finalPrice',
      isValid: true
    };
  };

  // Get calculation type description
  const getCalculationTypeDescription = (type: string): string => {
    switch (type) {
      case 'percentage': return 'Výpočet z procenta slevy';
      case 'amount': return 'Výpočet z částky slevy';
      case 'finalPrice': return 'Výpočet z konečné ceny';
      default: return 'Výpočet z procenta slevy';
    }
  };

  // Validation function
  const validateInputs = (
    originalPriceStr: string,
    discountPercentageStr: string,
    discountAmountStr: string,
    finalPriceStr: string,
    calcType: string
  ) => {
    const newErrors: { 
      originalPrice?: string; discountPercentage?: string; 
      discountAmount?: string; finalPrice?: string;
    } = {};
    
    const originalPriceNum = parseFloat(originalPriceStr);
    const discountPercentageNum = parseFloat(discountPercentageStr);
    const discountAmountNum = parseFloat(discountAmountStr);
    const finalPriceNum = parseFloat(finalPriceStr);

    // Original price is always required
    if (!originalPriceStr || isNaN(originalPriceNum) || originalPriceNum <= 0 || originalPriceNum > 1000000) {
      newErrors.originalPrice = 'Zadejte platnou původní cenu (1-1 000 000 Kč)';
    }

    // Validate based on calculation type
    if (calcType === 'percentage') {
      if (!discountPercentageStr || isNaN(discountPercentageNum) || discountPercentageNum < 0 || discountPercentageNum > 100) {
        newErrors.discountPercentage = 'Zadejte platné procento slevy (0-100%)';
      }
    } else if (calcType === 'amount') {
      if (!discountAmountStr || isNaN(discountAmountNum) || discountAmountNum < 0 || discountAmountNum > originalPriceNum) {
        newErrors.discountAmount = 'Zadejte platnou částku slevy (0 až původní cena)';
      }
    } else if (calcType === 'finalPrice') {
      if (!finalPriceStr || isNaN(finalPriceNum) || finalPriceNum < 0 || finalPriceNum > originalPriceNum) {
        newErrors.finalPrice = 'Zadejte platnou konečnou cenu (0 až původní cena)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(originalPrice, discountPercentage, discountAmount, finalPrice, calculationType)) {
      const originalPriceNum = parseFloat(originalPrice);

      let calculatedResult: DiscountResult;

      if (calculationType === 'percentage') {
        const discountPercentageNum = parseFloat(discountPercentage);
        calculatedResult = calculateFromPercentage(originalPriceNum, discountPercentageNum);
      } else if (calculationType === 'amount') {
        const discountAmountNum = parseFloat(discountAmount);
        calculatedResult = calculateFromAmount(originalPriceNum, discountAmountNum);
      } else {
        const finalPriceNum = parseFloat(finalPrice);
        calculatedResult = calculateFromFinalPrice(originalPriceNum, finalPriceNum);
      }

      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [originalPrice, discountPercentage, discountAmount, finalPrice, calculationType]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Calculation Type */}
      <div className="space-y-2">
        <Label htmlFor="calculationType" className="text-sm font-medium">
          Typ výpočtu
        </Label>
        <Select value={calculationType} onValueChange={setCalculationType}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte typ výpočtu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Mám procento slevy</SelectItem>
            <SelectItem value="amount">Mám částku slevy</SelectItem>
            <SelectItem value="finalPrice">Mám konečnou cenu</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {getCalculationTypeDescription(calculationType)}
        </p>
      </div>

      {/* Original Price */}
      <div className="space-y-2">
        <Label htmlFor="originalPrice" className="text-sm font-medium">
          Původní cena
        </Label>
        <div className="relative">
          <Input
            id="originalPrice"
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="1000"
            className={`pr-12 ${errors.originalPrice ? 'border-red-500' : ''}`}
            min="1"
            max="1000000"
            step="1"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            Kč
          </span>
        </div>
        {errors.originalPrice && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.originalPrice}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          Cena před slevou
        </p>
      </div>

      {/* Discount Percentage */}
      {calculationType === 'percentage' && (
        <div className="space-y-2">
          <Label htmlFor="discountPercentage" className="text-sm font-medium">
            Procento slevy
          </Label>
          <div className="relative">
            <Input
              id="discountPercentage"
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              placeholder="20"
              className={`pr-12 ${errors.discountPercentage ? 'border-red-500' : ''}`}
              min="0"
              max="100"
              step="0.1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              %
            </span>
          </div>
          {errors.discountPercentage && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.discountPercentage}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            Procento slevy (např. 20% sleva)
          </p>
        </div>
      )}

      {/* Discount Amount */}
      {calculationType === 'amount' && (
        <div className="space-y-2">
          <Label htmlFor="discountAmount" className="text-sm font-medium">
            Částka slevy
          </Label>
          <div className="relative">
            <Input
              id="discountAmount"
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              placeholder="200"
              className={`pr-12 ${errors.discountAmount ? 'border-red-500' : ''}`}
              min="0"
              max={originalPrice}
              step="1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              Kč
            </span>
          </div>
          {errors.discountAmount && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.discountAmount}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            Částka slevy v korunách
          </p>
        </div>
      )}

      {/* Final Price */}
      {calculationType === 'finalPrice' && (
        <div className="space-y-2">
          <Label htmlFor="finalPrice" className="text-sm font-medium">
            Konečná cena
          </Label>
          <div className="relative">
            <Input
              id="finalPrice"
              type="number"
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
              placeholder="800"
              className={`pr-12 ${errors.finalPrice ? 'border-red-500' : ''}`}
              min="0"
              max={originalPrice}
              step="1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              Kč
            </span>
          </div>
          {errors.finalPrice && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.finalPrice}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            Cena po slevě
          </p>
        </div>
      )}

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2">
              Shrnutí slevy
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-semibold text-blue-900">Původní cena</div>
                <div className="text-blue-700">{formatCurrency(parseFloat(originalPrice || '0'))} Kč</div>
              </div>
              <div>
                <div className="font-semibold text-blue-900">Typ výpočtu</div>
                <div className="text-blue-700">
                  {calculationType === 'percentage' ? 'Procento' : 
                   calculationType === 'amount' ? 'Částka' : 'Konečná cena'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Results section
  const resultsSection = result ? (
    <div className="space-y-6">
      {/* Main Result - Final Price */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">
              {formatCurrency(result.finalPrice)} Kč
            </div>
            <div className="text-sm text-green-700 mt-1">
              Cena po slevě
            </div>
            <div className="text-xs text-green-600 mt-1">
              Sleva {formatNumber(result.discountPercentage)}%
            </div>
          </div>
          <Tag className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Discount Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <div className="text-sm font-medium text-red-700">Sleva</div>
            </div>
            <div className="text-lg font-bold text-red-800">
              {formatCurrency(result.discountAmount)} Kč
            </div>
            <div className="text-xs text-red-600 mt-1">
              {formatNumber(result.discountPercentage)}% z původní ceny
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <div className="text-sm font-medium text-blue-700">Původní cena</div>
            </div>
            <div className="text-lg font-bold text-blue-800">
              {formatCurrency(result.originalPrice)} Kč
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Cena před slevou
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Highlight */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Percent className="w-5 h-5 text-yellow-600" />
            <div className="text-sm font-medium text-yellow-700">Vaše úspora</div>
          </div>
          <div className="text-xl font-bold text-yellow-800">
            {formatCurrency(result.savings)} Kč
          </div>
          <div className="text-sm text-yellow-600 mt-1">
            Ušetříte {formatNumber(result.discountPercentage)}% z původní ceny
          </div>
        </CardContent>
      </Card>

      {/* Calculation Details */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Výpočet slevy</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Původní cena:</span>
                  <span className="font-mono">{formatCurrency(result.originalPrice)} Kč</span>
                </div>
                <div className="flex justify-between">
                  <span>Sleva ({formatNumber(result.discountPercentage)}%):</span>
                  <span className="font-mono">-{formatCurrency(result.discountAmount)} Kč</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>Konečná cena:</span>
                  <span className="font-mono">{formatCurrency(result.finalPrice)} Kč</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Typ výpočtu: {getCalculationTypeDescription(result.calculationType)} | 
                Sleva: {formatNumber(result.discountPercentage)}% | 
                Úspora: {formatCurrency(result.savings)} Kč
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
      title={t('calculators.discount.title')}
      description={t('calculators.discount.description')}
      category={t('categories.practical')}
      seo={{
        title: t('calculators.discount.seo.title'),
        description: t('calculators.discount.seo.description'),
        keywords: t('calculators.discount.seo.keywords').split(',')
      }}
      formula={{
        latex: t('calculators.discount.formula.latex'),
        description: t('calculators.discount.formula.description')
      }}
      examples={{
        title: t('calculators.discount.examples.title'),
        description: t('calculators.discount.examples.description'),
        scenarios: [
          {
            title: t('calculators.discount.examples.scenario1.title'),
            description: t('calculators.discount.examples.scenario1.description'),
            example: t('calculators.discount.examples.scenario1.example')
          },
          {
            title: t('calculators.discount.examples.scenario2.title'),
            description: t('calculators.discount.examples.scenario2.description'),
            example: t('calculators.discount.examples.scenario2.example')
          },
          {
            title: t('calculators.discount.examples.scenario3.title'),
            description: t('calculators.discount.examples.scenario3.description'),
            example: t('calculators.discount.examples.scenario3.example')
          }
        ]
      }}
      faq={[
        {
          question: t('calculators.discount.faq.q1.question'),
          answer: t('calculators.discount.faq.q1.answer')
        },
        {
          question: t('calculators.discount.faq.q2.question'),
          answer: t('calculators.discount.faq.q2.answer')
        },
        {
          question: t('calculators.discount.faq.q3.question'),
          answer: t('calculators.discount.faq.q3.answer')
        },
        {
          question: t('calculators.discount.faq.q4.question'),
          answer: t('calculators.discount.faq.q4.answer')
        }
      ]}
      relatedCalculators={[
        {
          title: t('calculators.discount.related.percentage.title'),
          description: t('calculators.discount.related.percentage.description'),
          href: "/calculator/procenta/procento-z-cisla",
          category: t('categories.percentages')
        },
        {
          title: t('calculators.discount.related.tip.title'),
          description: t('calculators.discount.related.tip.description'),
          href: "/calculator/prakticke-vypocty/kalkulacka-1",
          category: t('categories.practical')
        },
        {
          title: t('calculators.discount.related.vat.title'),
          description: t('calculators.discount.related.vat.description'),
          href: "/calculator/dph",
          category: t('categories.financial')
        },
        {
          title: t('calculators.discount.related.bmi.title'),
          description: t('calculators.discount.related.bmi.description'),
          href: "/calculator/bmi",
          category: t('categories.health')
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

export default DiscountCalculator;
