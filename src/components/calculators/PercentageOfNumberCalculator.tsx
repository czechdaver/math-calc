// src/components/calculators/PercentageOfNumberCalculator.tsx
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Info, AlertCircle } from 'lucide-react';

interface PercentageResult {
  result: number;
  percentage: number;
  number: number;
  isValid: boolean;
}

const PercentageOfNumberCalculator: React.FC = () => {
  const t = useTranslations();
  const [percentage, setPercentage] = useState<string>('15');
  const [number, setNumber] = useState<string>('1000');
  const [result, setResult] = useState<PercentageResult | null>(null);
  const [errors, setErrors] = useState<{ percentage?: string; number?: string }>({});

  // Calculate percentage of number
  const calculatePercentage = (percentageNum: number, numberNum: number): PercentageResult => {
    const result = (percentageNum / 100) * numberNum;
    
    return {
      result,
      percentage: percentageNum,
      number: numberNum,
      isValid: true
    };
  };

  // Validation function
  const validateInputs = (percentageStr: string, numberStr: string) => {
    const newErrors: { percentage?: string; number?: string } = {};
    
    const percentageNum = parseFloat(percentageStr);
    const numberNum = parseFloat(numberStr);
    
    if (!percentageStr || isNaN(percentageNum) || percentageNum < 0 || percentageNum > 1000) {
      newErrors.percentage = 'Zadejte platné procento (0-1000%)';
    }
    if (!numberStr || isNaN(numberNum) || numberNum < 0) {
      newErrors.number = 'Zadejte platné kladné číslo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(percentage, number)) {
      const percentageNum = parseFloat(percentage);
      const numberNum = parseFloat(number);
      const calculatedResult = calculatePercentage(percentageNum, numberNum);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [percentage, number]);

  // Format number with spaces as thousand separators and comma as decimal separator
  const formatNumber = (num: number): string => {
    return num.toLocaleString('cs-CZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  };

  // Calculator form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Percentage Input */}
      <div className="space-y-2">
        <Label htmlFor="percentage" className="text-sm font-medium">
          {t('percentages_label') || 'Procenta'}
        </Label>
        <div className="relative">
          <Input
            id="percentage"
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            placeholder="15"
            className={`${errors.percentage ? 'border-red-500' : ''}`}
            min="0"
            max="1000"
            step="0.01"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            %
          </span>
        </div>
        {errors.percentage && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.percentage}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          Zadejte procentuální hodnotu (např. 15 pro 15%)
        </p>
      </div>

      {/* Number Input */}
      <div className="space-y-2">
        <Label htmlFor="number" className="text-sm font-medium">
          {t('cislo_label') || 'Číslo'}
        </Label>
        <div className="relative">
          <Input
            id="number"
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="1000"
            className={`${errors.number ? 'border-red-500' : ''}`}
            min="0"
            step="0.01"
          />
        </div>
        {errors.number && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.number}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          Zadejte číslo, ze kterého chcete vypočítat procenta
        </p>
      </div>
    </div>
  );

  // Examples for SimpleCalculatorLayout
  const examples = {
    title: 'Příklady výpočtu procent z čísla',
    description: 'Praktické příklady procentuálních výpočtů',
    scenarios: [
      {
        title: 'Výpočet slevy',
        description: 'Máte zboží za 1000 Kč a sleva je 15%. Kolik ušetříte?',
        example: '15% z 1000 = 150 Kč (sleva)'
      },
      {
        title: 'Výpočet DPH',
        description: 'Máte cenu bez DPH 1000 Kč a DPH je 21%. Kolik je DPH?',
        example: '21% z 1000 = 210 Kč (DPH)'
      }
    ]
  };

  // FAQ for SimpleCalculatorLayout
  const faq = [
    {
      question: 'Jak se počítá procento z čísla?',
      answer: 'Procento z čísla se počítá podle vzorce: (procento ÷ 100) × číslo. Například 15% z 1000 = (15 ÷ 100) × 1000 = 150.'
    },
    {
      question: 'K čemu se používá výpočet procent z čísla?',
      answer: 'Nejčastěji pro výpočet slev, DPH, spropitného, úroků, provizí a dalších procentuálních poplatků nebo srážek.'
    },
    {
      question: 'Můžu zadat procento větší než 100%?',
      answer: 'Ano, kalkulátor podporuje procenta až do 1000%. To je užitečné například pro výpočet násobků nebo vysokých přirážek.'
    }
  ];

  // Related calculators
  const relatedCalculators = [
    {
      title: 'Kolik procent je X z Y',
      description: 'Zjistěte, kolik procent tvoří jedno číslo z druhého',
      href: '/calculator/kolik-procent-je-x-z-y',
      category: 'math'
    },
    {
      title: 'Y je X%, kolik je 100%',
      description: 'Vypočítejte celkovou hodnotu, když znáte část a její procento',
      href: '/calculator/y-je-x-kolik-je-sto',
      category: 'math'
    }
  ];

  return (
    <SimpleCalculatorLayout
      title={t('procento_z_cisla_title') || 'Procento z čísla'}
      description="Vypočítejte X procent z daného čísla. Ideální pro výpočty slev, DPH, spropitného a dalších procentuálních výpočtů."
      category="math"
      seo={{
        title: 'Kalkulátor: Procento z čísla - Výpočet X% z čísla | MathCalc',
        description: 'Bezplatný kalkulátor pro výpočet procent z čísla. Snadno vypočítejte slevy, DPH, spropitné a další procentuální hodnoty.',
        keywords: [
          'procento z čísla',
          'kalkulátor procent',
          'výpočet slevy',
          'výpočet DPH',
          'procentuální kalkulátor'
        ]
      }}
      formula={{
        latex: t('procento_z_cisla_formula') || '\\frac{Procenta}{100} \\times Číslo = Výsledek',
        description: 'Pro výpočet procenta z čísla se procento vydělí 100 a vynásobí daným číslem.'
      }}
      examples={examples}
      faq={faq}
      relatedCalculators={relatedCalculators}
      resultSection={result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              {t('vysledek_label') || 'Výsledek'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {result.result.toLocaleString('cs-CZ', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {result.percentage}% z {result.number.toLocaleString('cs-CZ')}
                </div>
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <p><strong>Výpočet:</strong> {result.percentage}% × {result.number.toLocaleString('cs-CZ')} = {result.result.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</p>
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

export default PercentageOfNumberCalculator;
