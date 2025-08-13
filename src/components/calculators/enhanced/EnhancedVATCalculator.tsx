'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
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
      label: 'Česká republika', 
      description: 'DPH 21% (základní sazba)' 
    },
    { 
      value: 'sk', 
      label: 'Slovensko', 
      description: 'DPH 20% (základní sazba)' 
    },
    { 
      value: 'at', 
      label: 'Rakousko', 
      description: 'DPH 20% (základní sazba)' 
    },
    { 
      value: 'de', 
      label: 'Německo', 
      description: 'DPH 19% (základní sazba)' 
    },
    { 
      value: 'pl', 
      label: 'Polsko', 
      description: 'DPH 23% (základní sazba)' 
    }
  ];

  // Direction options for toggle
  const directionOptions = [
    { 
      value: 'base-to-total', 
      label: 'Bez DPH → S DPH',
      description: 'Vypočítám celkovou částku včetně DPH'
    },
    { 
      value: 'total-to-base', 
      label: 'S DPH → Bez DPH',
      description: 'Vypočítám základ bez DPH'
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
      newErrors.amount = 'Zadejte platnou částku';
    } else if (amount <= 0) {
      newErrors.amount = 'Částka musí být větší než 0';
    } else if (amount > 999999999) {
      newErrors.amount = 'Částka je příliš velká';
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

  return (
    <SimpleCalculatorLayout
      title="DPH Kalkulátor"
      description="Pokročilý kalkulátor DPH s podporou více zemí střední Evropy. Výpočet daně z přidané hodnoty v obou směrech."
      category="finance"
      calculatorId="vat"
      enhanced={true}
      seo={{
        title: 'Pokročilý DPH Kalkulátor | Výpočet daně z přidané hodnoty',
        description: 'Profesionální kalkulátor DPH pro ČR, SK, AT, DE a PL. Rychlý výpočet s DPH i bez DPH s aktuálními sazbami.',
        keywords: [
          'DPH kalkulátor',
          'daň z přidané hodnoty', 
          'výpočet DPH',
          'VAT calculator',
          'česká republika',
          'slovensko'
        ]
      }}
      formula={{
        latex: inputs.direction === 'base-to-total' 
          ? 'S\\,DPH = Bez\\,DPH \\times (1 + \\text{sazba})'
          : 'Bez\\,DPH = \\frac{S\\,DPH}{1 + \\text{sazba}}',
        description: inputs.direction === 'base-to-total'
          ? 'Výpočet celkové částky: základ se násobí koeficientem (1 + sazba DPH)'
          : 'Výpočet základu: celková částka se dělí koeficientem (1 + sazba DPH)'
      }}
      resultSection={result && (
        <CalculatorResult
          title="Rozpis DPH"
          value={`${result.totalAmount.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kč`}
          description={`Celková částka s DPH pro ${result.country}`}
          formula={inputs.direction === 'base-to-total' 
            ? `${result.baseAmount.toFixed(2)} × ${(1 + result.vatRate).toFixed(2)} = ${result.totalAmount.toFixed(2)} Kč`
            : `${result.totalAmount.toFixed(2)} ÷ ${(1 + result.vatRate).toFixed(2)} = ${result.baseAmount.toFixed(2)} Kč`
          }
          additionalInfo={
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="enhanced-result-grid blue">
                  <div className="font-bold text-blue-600">
                    {result.baseAmount.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kč
                  </div>
                  <div className="text-xs text-gray-700">Základ bez DPH</div>
                </div>
                <div className="enhanced-result-grid amber">
                  <div className="font-bold text-amber-600">
                    {result.vatAmount.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kč
                  </div>
                  <div className="text-xs text-gray-700">DPH ({(result.vatRate * 100).toFixed(0)}%)</div>
                </div>
                <div className="enhanced-result-grid green">
                  <div className="font-bold text-green-600">
                    {result.totalAmount.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kč
                  </div>
                  <div className="text-xs text-gray-700">Celkem s DPH</div>
                </div>
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <strong>Sazba DPH:</strong> {(result.vatRate * 100).toFixed(0)}% ({result.country})
              </div>
            </div>
          }
        />
      )}
      examples={{
        title: 'Praktické příklady',
        description: 'Typické situace při výpočtu DPH',
        scenarios: [
          {
            title: 'Tvorba ceny s DPH',
            description: 'Máte náklady 1000 Kč a potřebujete vypočítat prodejní cenu s DPH',
            example: '1000 Kč × 1,21 = 1210 Kč (ČR, 21%)'
          },
          {
            title: 'Analýza faktury',
            description: 'Na faktuře je 1210 Kč s DPH, potřebujete znát základ',
            example: '1210 Kč ÷ 1,21 = 1000 Kč (základ bez DPH)'
          },
          {
            title: 'Mezinárodní obchod',
            description: 'Porovnání sazeb DPH v různých zemích',
            example: 'ČR: 21%, SK: 20%, DE: 19%, PL: 23%'
          }
        ]
      }}
      faq={[
        {
          question: 'Jaké sazby DPH kalkulátor podporuje?',
          answer: 'Kalkulátor podporuje aktuální základní sazby DPH pro ČR (21%), SK (20%), AT (20%), DE (19%) a PL (23%). Snížené sazby nejsou zahrnuty.'
        },
        {
          question: 'Jak se zaokrouhluje výsledek?',
          answer: 'Všechny výpočty se provádějí s maximální přesností a výsledek se zaokrouhluje na haléře (2 desetinná místa) podle matematických pravidel.'
        },
        {
          question: 'Lze kalkulátor použít pro jiné daně?',
          answer: 'Ano, princip výpočtu je univerzální a lze jej použít pro jakoukoliv procentuální daň nebo poplatek.'
        }
      ]}
      relatedCalculators={[
        {
          title: 'Kalkulátor čisté mzdy',
          description: 'Výpočet mzdy po odečtení daní a pojištění',
          href: '/calculator/cista-mzda', 
          category: 'finance'
        },
        {
          title: 'Kalkulátor procent',
          description: 'Obecný kalkulátor procentuálních výpočtů',
          href: '/calculator/procenta',
          category: 'mathematics'
        }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Country Selection */}
        <CalculatorSelect
          id="country"
          label="Země a sazba DPH"
          value={inputs.country}
          onChange={(value) => handleInputChange('country', value)}
          options={countryOptions}
          helpText="Vyberte zemi pro správnou sazbu DPH"
          labelIcon={Flag}
          color="indigo"
        />
        
        {/* Direction Toggle */}
        <CalculatorToggle
          name="direction"
          label="Směr výpočtu"
          value={inputs.direction}
          onChange={(value) => handleInputChange('direction', value)}
          options={directionOptions}
          helpText="Vyberte, zda počítáte z částky s DPH nebo bez DPH"
          color="amber"
          layout="vertical"
        />

        {/* Amount Input */}
        <CalculatorInput
          id="amount"
          label={inputs.direction === 'base-to-total' ? 'Částka bez DPH' : 'Částka s DPH'}
          value={inputs.amount}
          onChange={(value) => handleInputChange('amount', value)}
          placeholder="1000"
          step="0.01"
          min="0"
          unit="Kč"
          helpText={inputs.direction === 'base-to-total' 
            ? 'Zadejte částku bez DPH pro výpočet celkové ceny'
            : 'Zadejte celkovou částku s DPH pro výpočet základu'
          }
          error={errors.amount}
          labelIcon={ArrowRightLeft}
          color="blue"
          quickAdjustSteps={[100, 500, 1000]}
        />
      </div>

      {/* Information Disclaimer */}
      <CalculatorDisclaimer type="info" title="Důležité informace">
        Kalkulátor používá základní sazby DPH platné pro rok 2024. Pro přesné daňové poradenství 
        se obraťte na odborníka. Výsledky jsou pouze orientační a nenahrazují profesionální konzultaci.
      </CalculatorDisclaimer>
    </SimpleCalculatorLayout>
  );
}