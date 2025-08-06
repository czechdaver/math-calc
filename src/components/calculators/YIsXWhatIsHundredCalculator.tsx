// src/components/calculators/YIsXWhatIsHundredCalculator.tsx
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Calculator, AlertCircle } from 'lucide-react';

interface CalculationResult {
  result: number;
  isValid: boolean;
}

const YJeXKolikJeStoCalculator: React.FC = () => {
  const t = useTranslations();
  const [y, setY] = useState<string>('25');
  const [x, setX] = useState<string>('15');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<{ y?: string; x?: string }>({});

  // Format number with spaces as thousand separators and comma as decimal separator
  const formatNumber = (num: number): string => {
    return num.toLocaleString('cs-CZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  };

  // Validation function
  const validateInputs = (yStr: string, xStr: string): boolean => {
    const newErrors: { y?: string; x?: string } = {};
    const yNum = parseFloat(yStr);
    const xNum = parseFloat(xStr);
    
    if (!yStr || isNaN(yNum)) {
      newErrors.y = 'Zadejte platnou hodnotu Y';
    }
    if (!xStr || isNaN(xNum) || xNum === 0) {
      newErrors.x = 'Zadejte platnou hodnotu X (nesmí být 0)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate result
  const calculateResult = (yNum: number, xNum: number): CalculationResult => {
    const calculatedResult = (yNum / xNum) * 100;
    return {
      result: calculatedResult,
      isValid: true
    };
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(y, x)) {
      const yNum = parseFloat(y);
      const xNum = parseFloat(x);
      const calculatedResult = calculateResult(yNum, xNum);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [y, x]);

  // Calculator form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Y Value */}
      <div className="mb-4">
        <Label htmlFor="y" className="block text-sm font-medium text-gray-700 mb-2">
          {t('hodnota_y_label_y_is_x_percent') || 'Hodnota Y'}
        </Label>
        <Input
          id="y"
          type="number"
          value={y}
          onChange={(e) => setY(e.target.value)}
          placeholder="25"
          step="0.01"
          className="w-full"
        />
        <p className="text-sm text-gray-500 mt-1">
          {t('y_je_x_kolik_je_sto_help_y') || 'Zadejte hodnotu Y (např. 25 pokud Y = 25)'}
        </p>
        {errors.y && (
          <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" />
            {errors.y}
          </p>
        )}
      </div>

      {/* X Percentage */}
      <div className="mb-6">
        <Label htmlFor="x" className="block text-sm font-medium text-gray-700 mb-2">
          {t('hodnota_x_label_y_is_x_percent') || 'Hodnota X (%)'}
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            id="x"
            type="number"
            value={x}
            onChange={(e) => setX(e.target.value)}
            placeholder="15"
            step="0.01"
            className="flex-1"
          />
          <span className="text-gray-500">%</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {t('y_je_x_kolik_je_sto_help_x') || 'Zadejte procentuální hodnotu X (např. 15 pro 15%)'}
        </p>
        {errors.x && (
          <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" />
            {errors.x}
          </p>
        )}
      </div>
    </div>
  );

  // Examples
  const examples = {
    title: 'Příklady výpočtů',
    description: 'Praktické příklady použití kalkulačky',
    scenarios: [
      {
        title: 'Základní výpočet',
        description: 'Pokud 25 je 15%, kolik je 100%?',
        calculation: '(25 ÷ 15) × 100 = 166,67'
      },
      {
        title: 'Finanční příklad',
        description: 'Pokud sleva 500 Kč představuje 20%, jaká je původní cena?',
        calculation: '(500 ÷ 20) × 100 = 2500 Kč'
      }
    ]
  };

  // FAQ
  const faq = [
    {
      question: 'Jak funguje výpočet Y je X% - kolik je 100%?',
      answer: 'Vzorec je: (Y ÷ X) × 100. Pokud znáte část (Y) a její procentuální podíl (X), můžete vypočítat celkovou hodnotu (100%).'
    },
    {
      question: 'Kdy použiji tento typ výpočtu?',
      answer: 'Například při výpočtu původní ceny před slevou, celkového rozpočtu z částečné částky, nebo celkového počtu z procentuálního vzorku.'
    }
  ];

  // Related calculators
  const relatedCalculators = [
    {
      title: 'Kalkulačka procent',
      description: 'Základní výpočty s procenty',
      href: '/cs/calculator/procenta',
      category: 'finance'
    },
    {
      title: 'Kolik procent je X z Y',
      description: 'Výpočet procentuálního podílu',
      href: '/cs/calculator/kolik-procent-je-x-z-y',
      category: 'finance'
    }
  ];

  return (
    <SimpleCalculatorLayout
      title={t('y_je_x_kolik_je_sto_title') || 'Y je X% - kolik je 100%?'}
      description={t('y_je_x_kolik_je_sto_description') || 'Výpočet celkové hodnoty (100%), pokud znáte část (Y) a její procentuální podíl (X%).'}
      category="finance"
      seo={{
        title: (t('y_je_x_kolik_je_sto_title') || 'Y je X% - kolik je 100%?') + ' | MathCalc',
        description: t('y_je_x_kolik_je_sto_seo_description') || 'Spočítejte si celkovou hodnotu (100%), pokud znáte část (Y) a její procentuální podíl (X%).',
        keywords: [
          'percentages', 'výpočet', 'kalkulačka', '100%', 'celková hodnota', 'procentuální podíl',
          'finance', 'matematika', 'výpočet procent', 'kolik je 100%'
        ],
      }}
      formula={{
        latex: '\\text{Celková hodnota} = \\frac{Y}{X} \\times 100',
        description: 'Celková hodnota se vypočítá jako podíl známé části (Y) a jejího procentuálního podílu (X), vynásobený 100.'
      }}
      examples={examples}
      faq={faq}
      relatedCalculators={relatedCalculators}
      resultSection={result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Výsledek
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formatNumber(result.result)}
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  100% = {formatNumber(result.result)}
                </div>
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <p>
                  Pokud {formatNumber(parseFloat(y))} je {formatNumber(parseFloat(x))}%, 
                  pak 100% je <strong>{formatNumber(result.result)}</strong>.
                </p>
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

export default YJeXKolikJeStoCalculator;
