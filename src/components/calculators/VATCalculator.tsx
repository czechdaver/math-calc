// src/components/calculators/VATCalculator.tsx
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
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
  const [country, setCountry] = useState<CountryCode>('cz');
  const [direction, setDirection] = useState<CalculationDirection>('base-to-total');
  const [amount, setAmount] = useState<string>('1000');
  const [result, setResult] = useState<VATResult | null>(null);
  const [errors, setErrors] = useState<{ amount?: string }>({});

  // Calculate VAT
  const calculateVAT = (amountNum: number, countryCode: CountryCode, calcDirection: CalculationDirection): VATResult => {
    const vatRate = countryCode === 'cz' ? 0.21 : 0.20; // 21% for CZ, 20% for SK
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

    return {
      baseAmount,
      vatAmount,
      totalAmount,
      vatRate,
      isValid: true
    };
  };

  // Validation function
  const validateInputs = (amountStr: string) => {
    const newErrors: { amount?: string } = {};
    
    const amountNum = parseFloat(amountStr);
    
    if (!amountStr || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Zadejte platnou částku větší než 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(amount)) {
      const amountNum = parseFloat(amount);
      const calculatedResult = calculateVAT(amountNum, country, direction);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [amount, country, direction]);

  // Calculator form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Country Selection */}
      <div className="space-y-2">
        <Label htmlFor="country" className="text-sm font-medium">
          Země
        </Label>
        <Select value={country} onValueChange={(value: CountryCode) => setCountry(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte zemi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cz">Česká republika (21%)</SelectItem>
            <SelectItem value="sk">Slovensko (20%)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          Vyberte zemi pro správnou sazbu DPH
        </p>
      </div>

      {/* Direction Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Typ výpočtu
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
            <Label htmlFor="base-to-total">Bez DPH → S DPH</Label>
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
            <Label htmlFor="total-to-base">S DPH → Bez DPH</Label>
          </div>
        </div>
        <p className="text-gray-500 text-xs">
          Vyberte směr výpočtu DPH
        </p>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-medium">
          {direction === 'base-to-total' ? 'Částka bez DPH' : 'Částka s DPH'}
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
            Kč
          </span>
        </div>
        {errors.amount && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.amount}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          Zadejte částku pro výpočet DPH
        </p>
      </div>
    </div>
  );

  // Examples for SimpleCalculatorLayout
  const examples = {
    title: 'Příklady výpočtu DPH',
    description: 'Praktické příklady výpočtu DPH pro různé situace',
    scenarios: [
      {
        title: 'Výpočet DPH z částky bez DPH',
        description: 'Máte částku 1000 Kč bez DPH a chcete zjistit celkovou částku s DPH.',
        example: '1000 × 1.21 = 1210 Kč (DPH: 210 Kč)'
      },
      {
        title: 'Výpočet základu z částky s DPH',
        description: 'Máte celkovou částku 1210 Kč s DPH a chcete zjistit základ bez DPH.',
        example: '1210 ÷ 1.21 = 1000 Kč (DPH: 210 Kč)'
      }
    ]
  };

  // FAQ for SimpleCalculatorLayout
  const faq = [
    {
      question: 'Jaká je aktuální sazba DPH v ČR a SK?',
      answer: 'V České republice je základní sazba DPH 21%, na Slovensku 20%. Existují také snížené sazby pro určité druhy zboží a služeb.'
    },
    {
      question: 'Jak se počítá DPH z částky bez DPH?',
      answer: 'Částka s DPH = Částka bez DPH × (1 + sazba DPH). Například: 1000 × 1.21 = 1210 Kč.'
    },
    {
      question: 'Jak se počítá základ z částky s DPH?',
      answer: 'Částka bez DPH = Částka s DPH ÷ (1 + sazba DPH). Například: 1210 ÷ 1.21 = 1000 Kč.'
    }
  ];

  // Related calculators
  const relatedCalculators = [
    {
      title: 'Kalkulátor čisté mzdy',
      description: 'Výpočet čisté mzdy po odečtení daní a pojištění',
      href: '/calculator/cista-mzda',
      category: 'finance'
    },
    {
      title: 'Kalkulátor procent',
      description: 'Výpočet procent z čísla a další procentuální výpočty',
      href: '/calculator/procenta',
      category: 'math'
    }
  ];

  return (
    <SimpleCalculatorLayout
      title="DPH Kalkulátor"
      description="Vypočítejte DPH (daň z přidané hodnoty) pro Českou republiku a Slovensko. Převod mezi částkami s DPH a bez DPH."
      category="finance"
      seo={{
        title: 'DPH Kalkulátor - Výpočet daně z přidané hodnoty | MathCalc',
        description: 'Bezplatný DPH kalkulátor pro výpočet daně z přidané hodnoty. Podporuje sazby pro ČR (21%) a SK (20%). Převod mezi částkami s DPH a bez DPH.',
        keywords: [
          'DPH kalkulátor',
          'daň z přidané hodnoty',
          'výpočet DPH',
          'kalkulátor s DPH',
          'kalkulátor bez DPH'
        ]
      }}
      formula={{
        latex: direction === 'base-to-total' 
          ? 'S\\,DPH = Bez\\,DPH \\times (1 + sazba)'
          : 'Bez\\,DPH = \\frac{S\\,DPH}{1 + sazba}',
        description: direction === 'base-to-total'
          ? 'Pro výpočet částky s DPH se základ násobí koeficientem (1 + sazba DPH).'
          : 'Pro výpočet základu se částka s DPH dělí koeficientem (1 + sazba DPH).'
      }}
      examples={examples}
      faq={faq}
      relatedCalculators={relatedCalculators}
      resultSection={result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Výsledek výpočtu DPH
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Bez DPH</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {result.baseAmount.toFixed(2)} Kč
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">DPH ({(result.vatRate * 100).toFixed(0)}%)</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {result.vatAmount.toFixed(2)} Kč
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">S DPH</div>
                  <div className="text-2xl font-bold text-green-600">
                    {result.totalAmount.toFixed(2)} Kč
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <p><strong>Výpočet:</strong> {direction === 'base-to-total' 
                  ? `${result.baseAmount.toFixed(2)} × ${(1 + result.vatRate).toFixed(2)} = ${result.totalAmount.toFixed(2)} Kč`
                  : `${result.totalAmount.toFixed(2)} ÷ ${(1 + result.vatRate).toFixed(2)} = ${result.baseAmount.toFixed(2)} Kč`
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
