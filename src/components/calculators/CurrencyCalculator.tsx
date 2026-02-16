// src/components/calculators/CurrencyCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
// import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, DollarSign, ArrowRightLeft, TrendingUp } from 'lucide-react';

interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  symbol: string;
}

interface ConversionResult {
  fromAmount: number;
  toAmount: number;
  fromCurrency: CurrencyRate;
  toCurrency: CurrencyRate;
  rate: number;
  isValid: boolean;
}

const CurrencyCalculator: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  // const params = useParams();
  // const locale = params.locale as string;
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('CZK');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [errors, setErrors] = useState<{ amount?: string }>({});

  // Mock exchange rates (in real app, these would come from an API)
  const currencies: CurrencyRate[] = [
    { code: 'CZK', name: 'Česká koruna', rate: 1, symbol: 'Kč' },
    { code: 'EUR', name: 'Euro', rate: 0.041, symbol: '€' },
    { code: 'USD', name: 'Americký dolar', rate: 0.044, symbol: '$' },
    { code: 'GBP', name: 'Britská libra', rate: 0.035, symbol: '£' },
    { code: 'CHF', name: 'Švýcarský frank', rate: 0.040, symbol: 'CHF' },
    { code: 'PLN', name: 'Polský zlotý', rate: 0.18, symbol: 'zł' },
    { code: 'HUF', name: 'Maďarský forint', rate: 15.8, symbol: 'Ft' },
    { code: 'JPY', name: 'Japonský jen', rate: 6.5, symbol: '¥' },
    { code: 'CAD', name: 'Kanadský dolar', rate: 0.060, symbol: 'C$' },
    { code: 'AUD', name: 'Australský dolar', rate: 0.067, symbol: 'A$' }
  ];

  // Get currency by code
  const getCurrency = (code: string): CurrencyRate => {
    return currencies.find(c => c.code === code) || currencies[0];
  };

  // Format currency amount
  const formatCurrency = (amount: number, currency: CurrencyRate): string => {
    const formatted = amount.toLocaleString('cs-CZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${formatted} ${currency.symbol}`;
  };

  // Validation function
  const validateInputs = (amountStr: string) => {
    const newErrors: { amount?: string } = {};

    const amountNum = parseFloat(amountStr);

    if (!amountStr || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = t('currency_error_amount');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Convert currency
  const convertCurrency = (
    amount: number,
    fromCur: CurrencyRate,
    toCur: CurrencyRate
  ): ConversionResult => {
    // Convert from source currency to CZK (base), then to target currency
    const amountInCZK = amount / fromCur.rate;
    const convertedAmount = amountInCZK * toCur.rate;
    const exchangeRate = toCur.rate / fromCur.rate;

    return {
      fromAmount: amount,
      toAmount: convertedAmount,
      fromCurrency: fromCur,
      toCurrency: toCur,
      rate: exchangeRate,
      isValid: true
    };
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(amount)) {
      const amountNum = parseFloat(amount);
      const fromCur = getCurrency(fromCurrency);
      const toCur = getCurrency(toCurrency);

      const conversionResult = convertCurrency(amountNum, fromCur, toCur);
      setResult(conversionResult);
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, fromCurrency, toCurrency]);

  // Swap currencies
  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Quick amount buttons
  const setQuickAmount = (value: string) => {
    setAmount(value);
  };

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-medium">
          {t('calculators.currency.amount')}
        </Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100"
          className={`text-lg ${errors.amount ? 'border-red-500' : ''}`}
          min="0"
          step="0.01"
        />
        {errors.amount && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.amount}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.currency.amount_hint')}
        </p>
      </div>

      {/* Quick Amount Buttons */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t('calculators.currency.quick_amounts')}</Label>
        <div className="flex flex-wrap gap-2">
          {['100', '500', '1000', '5000', '10000'].map((value) => (
            <button
              key={value}
              onClick={() => setQuickAmount(value)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              {parseInt(value).toLocaleString('cs-CZ')}
            </button>
          ))}
        </div>
      </div>

      {/* Currency Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* From Currency */}
        <div className="space-y-2">
          <Label htmlFor="fromCurrency" className="text-sm font-medium">
            {t('calculators.currency.from_currency')}
          </Label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger>
              <SelectValue placeholder={t('currency_from_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{currency.symbol}</span>
                    <span>{currency.code}</span>
                    <span className="text-gray-500 text-sm">- {currency.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Swap Button */}
        <div className="flex items-end justify-center md:col-span-2">
          <button
            onClick={swapCurrencies}
            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
            title={t('calculators.currency.swap_currencies')}
          >
            <ArrowRightLeft className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        {/* To Currency */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="toCurrency" className="text-sm font-medium">
            {t('calculators.currency.to_currency')}
          </Label>
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger>
              <SelectValue placeholder={t('currency_to_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{currency.symbol}</span>
                    <span>{currency.code}</span>
                    <span className="text-gray-500 text-sm">- {currency.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Conversion Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2">
              {t('currency_summary_title')}
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {formatCurrency(parseFloat(amount || '0'), getCurrency(fromCurrency))} → {getCurrency(toCurrency).symbol}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {getCurrency(fromCurrency).name} {t('currency_to')} {getCurrency(toCurrency).name}
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
              {formatCurrency(result.toAmount, result.toCurrency)}
            </div>
            <div className="text-sm text-green-700 mt-1">
              {t('currency_result_converted')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {result.fromCurrency.code} → {result.toCurrency.code}
            </div>
          </div>
          <DollarSign className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Exchange Rate */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{t('currency_result_exchange_rate')}</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-900">
                1 {result.fromCurrency.code} = {result.rate.toFixed(6)} {result.toCurrency.code}
              </div>
              <div className="text-xs text-blue-600">
                {t('currency_result_current_rate')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Details */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-700 mb-1">{t('currency_result_original')}</div>
            <div className="text-lg font-bold text-gray-800">
              {formatCurrency(result.fromAmount, result.fromCurrency)}
            </div>
            <div className="text-xs text-gray-600 mt-1">{result.fromCurrency.name}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-700 mb-1">{t('currency_result_converted')}</div>
            <div className="text-lg font-bold text-gray-800">
              {formatCurrency(result.toAmount, result.toCurrency)}
            </div>
            <div className="text-xs text-gray-600 mt-1">{result.toCurrency.name}</div>
          </CardContent>
        </Card>
      </div>

      {/* Calculation Details */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('currency_result_calculation')}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>{t('currency_detail_amount')}</span>
                  <span className="font-mono">{formatCurrency(result.fromAmount, result.fromCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('currency_detail_rate')}</span>
                  <span className="font-mono">1 {result.fromCurrency.code} = {result.rate.toFixed(6)} {result.toCurrency.code}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>{t('currency_detail_result')}</span>
                  <span className="font-mono">{formatCurrency(result.toAmount, result.toCurrency)}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {t('currency_detail_formula')} {result.fromAmount.toLocaleString(locale === 'cs' ? 'cs-CZ' : 'en-US')} × {result.rate.toFixed(6)} = {result.toAmount.toLocaleString(locale === 'cs' ? 'cs-CZ' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Conversions */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">{t('currency_popular_title')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span>1 EUR =</span>
              <span className="font-mono">{(1 / getCurrency('EUR').rate).toFixed(2)} CZK</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span>1 USD =</span>
              <span className="font-mono">{(1 / getCurrency('USD').rate).toFixed(2)} CZK</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span>1 GBP =</span>
              <span className="font-mono">{(1 / getCurrency('GBP').rate).toFixed(2)} CZK</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span>1 CHF =</span>
              <span className="font-mono">{(1 / getCurrency('CHF').rate).toFixed(2)} CZK</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('common.enter_values')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('calculators.currency.title')}
      description={t('calculators.currency.description')}
      category={t('categories.practical')}
      calculatorId="currency"
      seo={{
        title: t('currency_seo_title'),
        description: t('currency_seo_description'),
        keywords: t('currency_seo_keywords').split(',')
      }}
      formula={{
        latex: t('currency_formula_latex'),
        description: t('currency_formula_description')
      }}
      examples={{
        title: t('currency_examples_title'),
        description: t('currency_examples_description'),
        scenarios: [
          {
            title: t('currency_example_1_title'),
            description: t('currency_example_1_description'),
            example: t('currency_example_1_example')
          },
          {
            title: t('currency_example_2_title'),
            description: t('currency_example_2_description'),
            example: t('currency_example_2_example')
          },
          {
            title: t('currency_example_3_title'),
            description: t('currency_example_3_description'),
            example: t('currency_example_3_example')
          }
        ]
      }}
      faq={[
        {
          question: t('currency_faq_1_q'),
          answer: t('currency_faq_1_a')
        },
        {
          question: t('currency_faq_2_q'),
          answer: t('currency_faq_2_a')
        },
        {
          question: t('currency_faq_3_q'),
          answer: t('currency_faq_3_a')
        },
        {
          question: t('currency_faq_4_q'),
          answer: t('currency_faq_4_a')
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

export default CurrencyCalculator;
