import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { CalculatorInput, CalculatorResult } from './shared';
import { Info } from 'lucide-react';
import { getRelatedCalculators } from '@/lib/calculatorDataUtils';

interface DirectProportionResult {
  value: number;
  a: number;
  b: number;
  c: number;
  isValid: boolean;
}

const DirectProportionCalculator: React.FC = () => {
  const t = useTranslations();
  const [a, setA] = useState<string>('1');
  const [b, setB] = useState<string>('2');
  const [c, setC] = useState<string>('10');
  const [result, setResult] = useState<DirectProportionResult | null>(null);
  const [errors, setErrors] = useState<{ a?: string; b?: string; c?: string }>({});

  // Calculate direct proportion (a : b = c : x)
  const calculate = (aVal: number, bVal: number, cVal: number): DirectProportionResult => {
    if (isNaN(aVal) || isNaN(bVal) || isNaN(cVal) || bVal === 0) {
      return { value: null, a: aVal, b: bVal, c: cVal, isValid: false };
    }

    const x = (cVal * bVal) / aVal;

    return {
      value: x,
      a: aVal,
      b: bVal,
      c: cVal,
      isValid: true
    };
  };

  // Validation function
  const validateInputs = () => {
    const newErrors: { a?: string; b?: string; c?: string } = {};

    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    const cNum = parseFloat(c);

    if (!a || isNaN(aNum) || aNum <= 0) {
      newErrors.a = 'Zadejte platné kladné číslo větší než 0';
    }

    if (!b || isNaN(bNum) || bNum <= 0) {
      newErrors.b = 'Zadejte platné kladné číslo větší než 0';
    }

    if (!c || isNaN(cNum) || cNum <= 0) {
      newErrors.c = 'Zadejte platné kladné číslo větší než 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs()) {
      const aNum = parseFloat(a);
      const bNum = parseFloat(b);
      const cNum = parseFloat(c);
      const calculatedResult = calculate(aNum, bNum, cNum);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [a, b, c]);

  // Related calculators
  const relatedCalculators = getRelatedCalculators('direct-proportion', 'cs', t);

  return (
    <SimpleCalculatorLayout
      title="Přímá úměra"
      description="Vypočítejte neznámou hodnotu x v přímé úměře: a : b = c : x"
      category="matematika"
      calculatorId="direct-proportion"
      seo={{
        title: 'Kalkulátor: Přímá úměra - Výpočet neznámé x | MathCalc',
        description: 'Vypočítejte neznámou hodnotu v přímé úměře (a : b = c : x). Ideální pro úměrové výpočty.',
        keywords: [
          'přímá úměra',
          'kalkulačka',
          'matematika',
          'výpočet'
        ]
      }}
      formula={{
        latex: 'x = \\frac{c \\times b}{a}',
        description: 'V přímé úměře je neznámá x rovna podílu součinu c a b, dělené hodnotou a.'
      }}
      examples={{
        title: 'Příklady přímé úměry',
        description: 'Praktické příklady výpočtu přímé úměry',
        scenarios: [
          {
            title: 'Výpočet ceny',
            description: 'Když 5 kg jabek stojí 100 Kč, kolik stojí 10 kg?',
            example: '10 kg = (10 × 100) / 5 = 200 Kč'
          },
          {
            title: 'Výpočet vzdálenosti',
            description: 'Auto jede 120 km/h za 3 hodiny. Jakou vzdálenost ujede za 5 hodin?',
            example: '5 h = (5 × 120) / 3 = 200 km'
          }
        ]
      }}
      faq={[
        {
          question: 'Co je přímá úměra?',
          answer: 'Přímá úměra je matematický vztah, kde se hodnoty dvou veličin mění úměrně mění ve stejném poměru. Příkladem: když zdvojnásobíte množství suroviny, zdvojnásobíte i nákladů.'
        },
        {
          question: 'Jak se počítá neznámá x?',
          answer: 'Neznámou x získáte vynásobením hodnoty c a b a vydělením hodnotou a. Vzorec je: x = (c × b) / a'
        },
        {
          question: 'Kdy se používá přímá úměra?',
          answer: 'Přímá úměry se používají při výpočtu cen, spotřeby materiálů, času, výkonnosti a v mnoha dalších oblastech.'
        }
      ]}
      relatedCalculators={relatedCalculators}
      resultSection={result && result.isValid && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Hodnota A</div>
              <div className="text-2xl font-bold text-blue-600">{result.a}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Hodnota B</div>
              <div className="text-2xl font-bold text-green-600">{result.b}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Hodnota C</div>
              <div className="text-2xl font-bold text-purple-600">{result.c}</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2"><strong>Výsledek:</strong></p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-xl font-semibold">x = {result.value}</span>
              </div>
              <div className="text-xs text-gray-500">
                {result.b} × {result.a} / {result.a} = <strong>{result.value.toFixed(4)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-6">
        <CalculatorInput
          id="a"
          label="Hodnota A"
          type="number"
          value={a}
          onChange={setA}
          placeholder="1"
          min="0.0001"
          step="any"
          helpText="Zadejte hodnotu A (základní hodnota přímé úměry)"
          error={errors.a}
        />

        <CalculatorInput
          id="b"
          label="Hodnota B"
          type="number"
          value={b}
          onChange={setB}
          placeholder="1"
          min="0.0001"
          step="any"
          helpText="Zadejte hodnotu B (porovnávací hodnota přímé úměry)"
          error={errors.b}
        />

        <CalculatorInput
          id="c"
          label="Hodnota C"
          type="number"
          value={c}
          onChange={setC}
          placeholder="1"
          min="0.0001"
          step="any"
          helpText="Zadejte výslednou hodnotu přímé úměry"
          error={errors.c}
        />
      </div>
    </SimpleCalculatorLayout>
  );
};

export default DirectProportionCalculator;
