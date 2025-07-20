// src/components/calculators/fractionOperations/FractionConversion.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const FractionConversion: React.FC = () => {
  const { t } = useTranslation('common');
  const [num, setNum] = useState('');
  const [den, setDen] = useState('');
  const [decimalResult, setDecimalResult] = useState<number | null>(null);
  const [mixedNumberResult, setMixedNumberResult] = useState<{ whole: number, numerator: number, denominator: number } | null>(null);

  const handleCalculate = () => {
    const n = parseFloat(num);
    const d = parseFloat(den);

    if (!isNaN(n) && !isNaN(d) && d !== 0) {
      // Převod na desetinné číslo
      setDecimalResult(n / d);

      // Převod na smíšené číslo
      const wholePart = Math.floor(n / d);
      const remainder = n % d;
      // Zkrácení zbytkového zlomku (pokud není nula)
      if (remainder === 0) {
         setMixedNumberResult({ whole: wholePart, numerator: 0, denominator: d });
      } else {
        // Zkrácení zbytkového zlomku
        const commonDivisor = gcd(Math.abs(remainder), Math.abs(d));
        setMixedNumberResult({
          whole: wholePart,
          numerator: remainder / commonDivisor,
          denominator: d / commonDivisor,
        });
      }

    } else {
      setDecimalResult(null);
      setMixedNumberResult(null);
    }
  };

  // Pomocná funkce pro nalezení největšího společného dělitele (GCD)
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  useEffect(() => {
    handleCalculate();
  }, [num, den]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{t('zlomky_operation_prevod')}</h3>
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

      {(decimalResult !== null || mixedNumberResult !== null) && (den !== '0') && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {decimalResult !== null && (
            <p>{t('decimal_representation_label')}: {decimalResult.toFixed(4)}</p> {/* TODO: Přidat do lokalizace */}
          )}
          {mixedNumberResult !== null && (
            <p>{t('mixed_number_representation_label')}: {mixedNumberResult.whole} {mixedNumberResult.numerator}/{mixedNumberResult.denominator}</p> {/* TODO: Přidat do lokalizace */}
          )}
        </div>
      )}
       {den === '0' && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {t('error_division_by_zero')}
        </div>
      )}
    </div>
  );
};

export default FractionConversion;
