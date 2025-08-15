'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations, useMessages, useLocale } from 'next-intl';
import { Calculator, Percent, ArrowRightLeft, Flag } from 'lucide-react';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { 
  CalculatorInput,
  CalculatorSelect,
  CalculatorToggle,
  CalculatorResult,
  CalculatorDisclaimer
} from '@/components/calculators/shared';

/**
 * Enhanced VAT Calculator Prototype
 * 
 * This prototype demonstrates:
 * - CalculatorToggle for direction switching
 * - CalculatorSelect for country selection with descriptions
 * - CalculatorInput with currency formatting
 * - Real-time calculation with enhanced validation
 * - Professional result display with breakdown
 * 
 * Pattern: Toggle-based direction switching with country-specific rates
 * Template: Perfect for tax/percentage calculators
 */

type CountryCode = 'cz' | 'sk' | 'at' | 'de' | 'pl';
type CalculationDirection = 'base-to-total' | 'total-to-base';

interface VATResult {
  baseAmount: number;
  vatAmount: number;
  totalAmount: number;
  vatRate: number;
  country: string;
  isValid: boolean;
}

export default function EnhancedVATCalculator() {
  const t = useTranslations();
  const messages = useMessages() as any;
  const locale = useLocale();

  // Enhanced state management
  const [inputs, setInputs] = useState({
    amount: '1000',
    country: 'cz' as CountryCode,
    direction: 'base-to-total' as CalculationDirection
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Enhanced country options with descriptions
  const countryOptions = [
    { 
      value: 'cz', 
      label: t('vat_enhanced.countries.cz.label'), 
      description: t('vat_enhanced.countries.cz.description') 
    },
    { 
      value: 'sk', 
      label: t('vat_enhanced.countries.sk.label'), 
      description: t('vat_enhanced.countries.sk.description') 
    },
    { 
      value: 'at', 
      label: t('vat_enhanced.countries.at.label'), 
      description: t('vat_enhanced.countries.at.description') 
    },
    { 
      value: 'de', 
      label: t('vat_enhanced.countries.de.label'), 
      description: t('vat_enhanced.countries.de.description') 
    },
    { 
      value: 'pl', 
      label: t('vat_enhanced.countries.pl.label'), 
      description: t('vat_enhanced.countries.pl.description') 
    }
  ];

  // Direction options for toggle
  const directionOptions = [
    { 
      value: 'base-to-total', 
      label: t('vat_enhanced.direction_base_to_total'),
      description: t('vat_enhanced.direction_base_to_total_desc')
    },
    { 
      value: 'total-to-base', 
      label: t('vat_enhanced.direction_total_to_base'),
      description: t('vat_enhanced.direction_total_to_base_desc')
    }
  ];

  // VAT rates for different countries
  const vatRates: Record<CountryCode, number> = {
    'cz': 0.21, // 21%
    'sk': 0.20, // 20%  
    'at': 0.20, // 20%
    'de': 0.19, // 19%
    'pl': 0.23  // 23%
  };

  // Enhanced validation
  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    const amount = parseFloat(inputs.amount.replace(/\s/g, '').replace(',', '.'));
    
    if (!inputs.amount || isNaN(amount)) {
      newErrors.amount = t('vat_enhanced.errors.invalid_amount');
    } else if (amount <= 0) {
      newErrors.amount = t('vat_enhanced.errors.must_be_positive');
    } else if (amount > 999999999) {
      newErrors.amount = t('vat_enhanced.errors.too_large');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced calculation with detailed results
  const result = useMemo(() => {
    if (!validateInputs()) return null;
    
    try {
      const amount = parseFloat(inputs.amount.replace(/\s/g, '').replace(',', '.'));
      const vatRate = vatRates[inputs.country];
      const countryName = countryOptions.find(c => c.value === inputs.country)?.label || '';
      
      let baseAmount: number;
      let totalAmount: number;
      let vatAmount: number;

      if (inputs.direction === 'base-to-total') {
        // Calculate from base amount (without VAT)
        baseAmount = amount;
        totalAmount = baseAmount * (1 + vatRate);
        vatAmount = totalAmount - baseAmount;
      } else {
        // Calculate from total amount (with VAT)
        totalAmount = amount;
        baseAmount = totalAmount / (1 + vatRate);
        vatAmount = totalAmount - baseAmount;
      }

      return {
        baseAmount: Math.round(baseAmount * 100) / 100,
        vatAmount: Math.round(vatAmount * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        vatRate,
        country: countryName,
        isValid: true
      };
    } catch (error) {
      console.error('VAT calculation error:', error);
      return null;
    }
  }, [inputs]);

  // Input change handlers
  const handleInputChange = (field: string, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Use localized LaTeX from raw messages (safe for KaTeX)
  const formulaLatex = inputs.direction === 'base-to-total'
    ? (messages?.vat_enhanced?.formula?.base_to_total_latex as string) || '\\text{sDPH} = \\text{bezDPH} \\times (1 + \\text{sazba})'
    : (messages?.vat_enhanced?.formula?.total_to_base_latex as string) || '\\text{bezDPH} = \\dfrac{\\text{sDPH}}{1 + \\text{sazba}}';

  const formulaDescription = inputs.direction === 'base-to-total'
    ? t('vat_enhanced.formula.base_to_total_desc')
    : t('vat_enhanced.formula.total_to_base_desc');

  return (
    <SimpleCalculatorLayout
      title={t('vat_enhanced.title')}
      description={t('vat_enhanced.description')}
      category="finance"
      calculatorId="vat"
      enhanced={true}
      seo={{
        title: t('vat_enhanced.title') + ' | ' + t('vat_enhanced.description'),
        description: t('vat_enhanced.description'),
        keywords: messages?.vat_enhanced?.seo_keywords || []
      }}
      formula={{
        latex: formulaLatex,
        description: formulaDescription
      }}
      resultSection={result && (
        <CalculatorResult
          title={t('vat_enhanced.result_title')}
          value={`${result.totalAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${t('vat_enhanced.currency')}`}
          description={t('vat_enhanced.result_description', {country: result.country})}
          formula={inputs.direction === 'base-to-total' 
            ? `${result.baseAmount.toFixed(2)} × ${(1 + result.vatRate).toFixed(2)} = ${result.totalAmount.toFixed(2)} ${t('vat_enhanced.currency')}`
            : `${result.totalAmount.toFixed(2)} ÷ ${(1 + result.vatRate).toFixed(2)} = ${result.baseAmount.toFixed(2)} ${t('vat_enhanced.currency')}`
          }
          additionalInfo={
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="enhanced-result-grid blue">
                  <div className="font-bold text-blue-600">
                    {result.baseAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {t('vat_enhanced.currency')}
                  </div>
                  <div className="text-xs text-gray-700">{t('vat_enhanced.result_base')}</div>
                </div>
                <div className="enhanced-result-grid amber">
                  <div className="font-bold text-amber-600">
                    {result.vatAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {t('vat_enhanced.currency')}
                  </div>
                  <div className="text-xs text-gray-700">{t('vat_enhanced.result_vat', {rate: (result.vatRate * 100).toFixed(0)})}</div>
                </div>
                <div className="enhanced-result-grid green">
                  <div className="font-bold text-green-600">
                    {result.totalAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {t('vat_enhanced.currency')}
                  </div>
                  <div className="text-xs text-gray-700">{t('vat_enhanced.result_total')}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <strong>{t('vat_enhanced.vat_rate')}:</strong> {(result.vatRate * 100).toFixed(0)}% ({result.country})
              </div>
            </div>
          }
        />
      )}
      examples={{
        title: t('vat_enhanced.examples.title'),
        description: t('vat_enhanced.examples.description'),
        scenarios: [
          {
            title: t('vat_enhanced.examples.scenario1.title'),
            description: t('vat_enhanced.examples.scenario1.description'),
            example: t('vat_enhanced.examples.scenario1.example')
          },
          {
            title: t('vat_enhanced.examples.scenario2.title'),
            description: t('vat_enhanced.examples.scenario2.description'),
            example: t('vat_enhanced.examples.scenario2.example')
          },
          {
            title: t('vat_enhanced.examples.scenario3.title'),
            description: t('vat_enhanced.examples.scenario3.description'),
            example: t('vat_enhanced.examples.scenario3.example')
          }
        ]
      }}
      faq={messages?.vat_enhanced?.faq || []}
      relatedCalculators={messages?.vat_enhanced?.related_calculators || []}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Country Selection */}
        <CalculatorSelect
          id="country"
          label={t('vat_enhanced.country_label')}
          value={inputs.country}
          onChange={(value) => handleInputChange('country', value)}
          options={countryOptions}
          helpText={t('vat_enhanced.country_help')}
          labelIcon={Flag}
          color="indigo"
        />
        
        {/* Direction Toggle */}
        <CalculatorToggle
          name="direction"
          label={t('vat_enhanced.direction_label')}
          value={inputs.direction}
          onChange={(value) => handleInputChange('direction', value)}
          options={directionOptions}
          helpText={t('vat_enhanced.direction_help')}
          color="amber"
          layout="horizontal"
        />

        {/* Amount Input */}
        <CalculatorInput
          id="amount"
          label={inputs.direction === 'base-to-total' ? t('vat_enhanced.amount_without_vat') : t('vat_enhanced.amount_with_vat')}
          value={inputs.amount}
          onChange={(value) => handleInputChange('amount', value)}
          placeholder="1000"
          step="0.01"
          min="0"
          unit={t('vat_enhanced.currency')}
          helpText={inputs.direction === 'base-to-total' 
            ? t('vat_enhanced.amount_help_base_to_total')
            : t('vat_enhanced.amount_help_total_to_base')
          }
          error={errors.amount}
          labelIcon={ArrowRightLeft}
          color="blue"
          quickAdjustSteps={[100, 500, 1000]}
        />
      </div>

      {/* Information Disclaimer */}
      <CalculatorDisclaimer type="info" title={t('vat_enhanced.disclaimer_title')}>
        {t('vat_enhanced.disclaimer_text')}
      </CalculatorDisclaimer>
    </SimpleCalculatorLayout>
  );
}