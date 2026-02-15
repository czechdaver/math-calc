// src/components/calculators/VATCalculator.tsx
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, AlertCircle } from 'lucide-react';

type CountryCode = 'cz' | 'sk';
type CalculationDirection = 'base-to-total' | 'total-to-base';

interface VATResult {
  baseAmount: number;
  vatAmount: number;
  totalAmount: number;
  vatRate: number;
  isValid: boolean;
}

const VATCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [country, setCountry] = useState<CountryCode>('cz');
  const [direction, setDirection] = useState<CalculationDirection>('base-to-total');
  const [amount, setAmount] = useState<string>('1000');
  const [result, setResult] = useState<VATResult | null>(null);
  const [errors, setErrors] = useState<{ amount?: string }>({});

  const calculateVAT = (amountNum: number, countryCode: CountryCode, calcDirection: CalculationDirection): VATResult => {
    const vatRate = countryCode === 'cz' ? 0.21 : 0.20;
    let baseAmount, totalAmount, vatAmount;

    if (calcDirection === 'base-to-total') {
      baseAmount = amountNum;
      totalAmount = baseAmount * (1 + vatRate);
      vatAmount = totalAmount - baseAmount;
    } else {
      totalAmount = amountNum;
      baseAmount = totalAmount / (1 + vatRate);
      vatAmount = totalAmount - baseAmount;
    }

    return { baseAmount, vatAmount, totalAmount, vatRate, isValid: true };
  };

  const validateInputs = (amountStr: string) => {
    const newErrors: { amount?: string } = {};
    const amountNum = parseFloat(amountStr);
    if (!amountStr || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = t('vat_amount_error');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (validateInputs(amount)) {
      const amountNum = parseFloat(amount);
      setResult(calculateVAT(amountNum, country, direction));
    } else {
      setResult(null);
    }
  }, [amount, country, direction]);

  const calculatorForm = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="country" className="text-sm font-medium">
          {t('vat_country_label')}
        </Label>
        <Select value={country} onValueChange={(value: CountryCode) => setCountry(value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('vat_country_placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cz">{t('vat_country_cz')}</SelectItem>
            <SelectItem value="sk">{t('vat_country_sk')}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {t('vat_country_help')}
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t('vat_direction_label')}
        </Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="base-to-total"
              name="direction"
              value="base-to-total"
              checked={direction === 'base-to-total'}
              onChange={(e) => setDirection(e.target.value as CalculationDirection)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor="base-to-total">{t('vat_direction_base_to_total')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="total-to-base"
              name="direction"
              value="total-to-base"
              checked={direction === 'total-to-base'}
              onChange={(e) => setDirection(e.target.value as CalculationDirection)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor="total-to-base">{t('vat_direction_total_to_base')}</Label>
          </div>
        </div>
        <p className="text-gray-500 text-xs">
          {t('vat_direction_help')}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-medium">
          {direction === 'base-to-total' ? t('vat_amount_label_base') : t('vat_amount_label_total')}
        </Label>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
            className={`${errors.amount ? 'border-red-500' : ''}`}
            min="0"
            step="0.01"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {t('vat_currency')}
          </span>
        </div>
        {errors.amount && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.amount}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('vat_amount_help')}
        </p>
      </div>
    </div>
  );

  const examples = {
    title: t('vat_examples_title'),
    description: t('vat_examples_description'),
    scenarios: [
      {
        title: t('vat_example1_title'),
        description: t('vat_example1_description'),
        example: t('vat_example1_example')
      },
      {
        title: t('vat_example2_title'),
        description: t('vat_example2_description'),
        example: t('vat_example2_example')
      }
    ]
  };

  const faq = [
    { question: t('vat_faq1_q'), answer: t('vat_faq1_a') },
    { question: t('vat_faq2_q'), answer: t('vat_faq2_a') },
    { question: t('vat_faq3_q'), answer: t('vat_faq3_a') }
  ];


  return (
    <SimpleCalculatorLayout
      title={t('vat_title')}
      description={t('vat_description')}
      category="finance"
      calculatorId="vat"
      seo={{
        title: t('vat_seo_title'),
        description: t('vat_seo_description'),
        keywords: t('vat_seo_keywords').split(',')
      }}
      formula={{
        latex: direction === 'base-to-total'
          ? 'S\\,DPH = Bez\\,DPH \\times (1 + sazba)'
          : 'Bez\\,DPH = \\frac{S\\,DPH}{1 + sazba}',
        description: direction === 'base-to-total'
          ? t('vat_formula_base_desc')
          : t('vat_formula_total_desc')
      }}
      examples={examples}
      faq={faq}
      schemaData={{
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any"
      }}
      resultSection={result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              {t('vat_result_title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">{t('vat_result_base')}</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {result.baseAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {t('vat_currency')}
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">{t('vat_result_vat')} ({(result.vatRate * 100).toFixed(0)}%)</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {result.vatAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {t('vat_currency')}
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">{t('vat_result_total')}</div>
                  <div className="text-2xl font-bold text-green-600">
                    {result.totalAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {t('vat_currency')}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <p><strong>{t('vat_result_calculation')}:</strong> {direction === 'base-to-total'
                  ? `${result.baseAmount.toFixed(2)} × ${(1 + result.vatRate).toFixed(2)} = ${result.totalAmount.toFixed(2)} ${t('vat_currency')}`
                  : `${result.totalAmount.toFixed(2)} ÷ ${(1 + result.vatRate).toFixed(2)} = ${result.baseAmount.toFixed(2)} ${t('vat_currency')}`
                }</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    >
      {calculatorForm}
    </SimpleCalculatorLayout>
  );
};

export default VATCalculator;
