// src/components/calculators/fractionOperations/FractionSimplification.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

// Pomocná funkce pro nalezení největšího společného dělitele (GCD)
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

// Pomocná funkce pro zkrácení zlomku
const simplifyFraction = (numerator: number, denominator: number): { numerator: number, denominator: number } => {
  if (denominator === 0) {
    return { numerator, denominator }; // Nelze zkrátit, pokud je jmenovatel 0
  }
  const commonDivisor = gcd(Math.abs(numerator), Math.abs(denominator));
  return {
    numerator: numerator / commonDivisor,
    denominator: denominator / commonDivisor,
  };
};

const FractionSimplification: React.FC = () => {
  const { t } = useTranslation('common');
  const [num, setNum] = useState('');
  const [den, setDen] = useState('');
  const [result, setResult] = useState<{ numerator: number | null, denominator: number | null } | null>(null);

  const handleCalculate = () => {
    const n = parseFloat(num);
    const d = parseFloat(den);

    if (!isNaN(n) && !isNaN(d) && d !== 0) {
      const simplifiedResult = simplifyFraction(n, d);
      setResult(simplifiedResult);
    } else {
      setResult(null);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [num, den]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{t('zlomky_operation_zkracovani')}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Zlomek */}
        <div>
          <label htmlFor="num" className="block text-sm font-medium text-gray-700">{t('numerator_label')}</label>
          <input
            type="number"
            id="num"
            value={num}
            onChange={(e) => setNum(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="den" className="block text-sm font-medium text-gray-700">{t}('denominator_label')</label>
          <input
            type="number"
            id="den"
            value={den}
            onChange={(e) => setDen(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>

      {result !== null && result.denominator !== 0 && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {t('vysledek_label')}: {result.numerator} / {result.denominator}
        </div>
      )}
       {result !== null && result.denominator === 0 && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {t('error_division_by_zero')}
        </div>
      )}
    </div>
  );
};

export default FractionSimplification;
