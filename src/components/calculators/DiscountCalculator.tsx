// src/components/calculators/DiscountCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
// import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Tag, Percent, DollarSign, TrendingDown } from 'lucide-react';

import { CalculatorForm } from './shared';
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
  // const params = useParams();
  // const locale = params.locale as string;
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
      case 'percentage': return t('discount_calc_type_percentage_desc');
      case 'amount': return t('discount_calc_type_amount_desc');
      case 'finalPrice': return t('discount_calc_type_final_desc');
      default: return t('discount_calc_type_percentage_desc');
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
      newErrors.originalPrice = t('discount_error_original_price');
    }

    // Validate based on calculation type
    if (calcType === 'percentage') {
      if (!discountPercentageStr || isNaN(discountPercentageNum) || discountPercentageNum < 0 || discountPercentageNum > 100) {
        newErrors.discountPercentage = t('discount_error_percentage');
      }
    } else if (calcType === 'amount') {
      if (!discountAmountStr || isNaN(discountAmountNum) || discountAmountNum < 0 || discountAmountNum > originalPriceNum) {
        newErrors.discountAmount = t('discount_error_amount');
      }
    } else if (calcType === 'finalPrice') {
      if (!finalPriceStr || isNaN(finalPriceNum) || finalPriceNum < 0 || finalPriceNum > originalPriceNum) {
        newErrors.finalPrice = t('discount_error_final_price');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalPrice, discountPercentage, discountAmount, finalPrice, calculationType]);

  // Calculator input form
  const calculatorForm = (
    <CalculatorForm columns={2}>
      {/* Calculation Type */}
      <div className="space-y-2">
        <Label htmlFor="calculationType" className="text-sm font-medium">
          {t('discount_label_calc_type')}
        </Label>
        <Select value={calculationType} onValueChange={setCalculationType}>
          <SelectTrigger>
            <SelectValue placeholder={t('discount_placeholder_calc_type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">{t('discount_option_percentage')}</SelectItem>
            <SelectItem value="amount">{t('discount_option_amount')}</SelectItem>
            <SelectItem value="finalPrice">{t('discount_option_final_price')}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-xs">
          {getCalculationTypeDescription(calculationType)}
        </p>
      </div>

      {/* Original Price */}
      <div className="space-y-2">
        <Label htmlFor="originalPrice" className="text-sm font-medium">
          {t('discount_label_original_price')}
        </Label>
        <div className="relative">
          <Input
            id="originalPrice"
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="1000"
            className={`pr-12 ${errors.originalPrice ? 'border-destructive' : ''}`}
            min="1"
            max="1000000"
            step="1"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
            {t('common.currency')}
          </span>
        </div>
        {errors.originalPrice && (
          <p className="text-destructive text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.originalPrice}
          </p>
        )}
        <p className="text-muted-foreground text-xs">
          {t('discount_hint_original_price')}
        </p>
      </div>

      {/* Discount Percentage */}
      {calculationType === 'percentage' && (
        <div className="space-y-2">
          <Label htmlFor="discountPercentage" className="text-sm font-medium">
            {t('discount_label_discount_percentage')}
          </Label>
          <div className="relative">
            <Input
              id="discountPercentage"
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              placeholder="20"
              className={`pr-12 ${errors.discountPercentage ? 'border-destructive' : ''}`}
              min="0"
              max="100"
              step="0.1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
              %
            </span>
          </div>
          {errors.discountPercentage && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.discountPercentage}
            </p>
          )}
          <p className="text-muted-foreground text-xs">
            {t('discount_hint_discount_percentage')}
          </p>
        </div>
      )}

      {/* Discount Amount */}
      {calculationType === 'amount' && (
        <div className="space-y-2">
          <Label htmlFor="discountAmount" className="text-sm font-medium">
            {t('discount_label_discount_amount')}
          </Label>
          <div className="relative">
            <Input
              id="discountAmount"
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              placeholder="200"
              className={`pr-12 ${errors.discountAmount ? 'border-destructive' : ''}`}
              min="0"
              max={originalPrice}
              step="1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
              {t('common.currency')}
            </span>
          </div>
          {errors.discountAmount && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.discountAmount}
            </p>
          )}
          <p className="text-muted-foreground text-xs">
            {t('discount_hint_discount_amount')}
          </p>
        </div>
      )}

      {/* Final Price */}
      {calculationType === 'finalPrice' && (
        <div className="space-y-2">
          <Label htmlFor="finalPrice" className="text-sm font-medium">
            {t('discount_label_final_price')}
          </Label>
          <div className="relative">
            <Input
              id="finalPrice"
              type="number"
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
              placeholder="800"
              className={`pr-12 ${errors.finalPrice ? 'border-destructive' : ''}`}
              min="0"
              max={originalPrice}
              step="1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
              {t('common.currency')}
            </span>
          </div>
          {errors.finalPrice && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.finalPrice}
            </p>
          )}
          <p className="text-muted-foreground text-xs">
            {t('discount_hint_final_price')}
          </p>
        </div>
      )}

      {/* Summary Card */}
      <Card className="bg-blue-50/50 border-blue-200/50 dark:bg-blue-900/10 dark:border-blue-800/30 md:col-span-2">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              {t('discount_summary_title')}
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-semibold text-blue-900 dark:text-blue-200">{t('discount_label_original_price')}</div>
                <div className="text-blue-700 dark:text-blue-400">{formatCurrency(parseFloat(originalPrice || '0'))} {t('common.currency')}</div>
              </div>
              <div>
                <div className="font-semibold text-blue-900 dark:text-blue-200">{t('discount_label_calc_type')}</div>
                <div className="text-blue-700 dark:text-blue-400">
                  {calculationType === 'percentage' ? t('discount_summary_percentage') :
                    calculationType === 'amount' ? t('discount_summary_amount') : t('discount_summary_final_price')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </CalculatorForm>
  );

  // Results section
  const resultsSection = result ? (
    <div className="space-y-6">
      {/* Main Result - Final Price */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">
              {formatCurrency(result.finalPrice)} {t('common.currency')}
            </div>
            <div className="text-sm text-green-700 mt-1">
              {t('discount_hint_final_price')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {t('discount_result_discount')} {formatNumber(result.discountPercentage)}%
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
              <div className="text-sm font-medium text-red-700">{t('discount_result_discount')}</div>
            </div>
            <div className="text-lg font-bold text-red-800">
              {formatCurrency(result.discountAmount)} {t('common.currency')}
            </div>
            <div className="text-xs text-red-600 mt-1">
              {formatNumber(result.discountPercentage)}% {t('discount_result_of_original')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <div className="text-sm font-medium text-blue-700">{t('discount_label_original_price')}</div>
            </div>
            <div className="text-lg font-bold text-blue-800">
              {formatCurrency(result.originalPrice)} {t('common.currency')}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {t('discount_hint_original_price')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Highlight */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Percent className="w-5 h-5 text-yellow-600" />
            <div className="text-sm font-medium text-yellow-700">{t('discount_result_savings')}</div>
          </div>
          <div className="text-xl font-bold text-yellow-800">
            {formatCurrency(result.savings)} {t('common.currency')}
          </div>
          <div className="text-sm text-yellow-600 mt-1">
            {t('discount_result_you_save', { percent: formatNumber(result.discountPercentage) })}
          </div>
        </CardContent>
      </Card>

      {/* Calculation Details */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('discount_result_calculation')}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>{t('discount_detail_original')}</span>
                  <span className="font-mono">{formatCurrency(result.originalPrice)} {t('common.currency')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('discount_detail_discount_label')} ({formatNumber(result.discountPercentage)}%):</span>
                  <span className="font-mono">-{formatCurrency(result.discountAmount)} {t('common.currency')}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>{t('discount_detail_final')}</span>
                  <span className="font-mono">{formatCurrency(result.finalPrice)} {t('common.currency')}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {t('discount_detail_calc_type')} {getCalculationTypeDescription(result.calculationType)} |
                {t('discount_detail_discount')} {formatNumber(result.discountPercentage)}% |
                {t('discount_detail_savings')} {formatCurrency(result.savings)} {t('common.currency')}
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
      calculatorId="discount"
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
