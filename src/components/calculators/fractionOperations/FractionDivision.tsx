// src/components/calculators/fractionOperations/FractionDivision.tsx
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

const FractionDivision: React.FC = () => {
  const { t } = useTranslation('common');
  const [num1, setNum1] = useState('');
  const [den1, setDen1] = useState('');
  const [num2, setNum2] = useState('');
  const [den2, setDen2] = useState('');
  const [result, setResult] = useState<{ numerator: number | null, denominator: number | null } | null>(null);

  const handleCalculate = () => {
    const n1 = parseFloat(num1);
    const d1 = parseFloat(den1);
    const n2 = parseFloat(num2);
    const d2 = parseFloat(den2);

    // Kontrola dělení nulou (jmenovatel prvního zlomku, čitatel a jmenovatel druhého zlomku)
    if (!isNaN(n1) && !isNaN(d1) && d1 !== 0 && !isNaN(n2) && !isNaN(d2) && d2 !== 0 && n2 !== 0) {
      // Dělení = násobení převrácenou hodnotou druhého zlomku
      const resultNumerator = n1 * d2;
      const resultDenominator = d1 * n2;

      // Zkrácení výsledku
      const simplifiedResult = simplifyFraction(resultNumerator, resultDenominator);

      setResult(simplifiedResult);
    } else {
      setResult(null);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [num1, den1, num2, den2]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{t('zlomky_operation_deleni')}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Zlomek 1 */}
        <div>
          <label htmlFor="num1" className="block text-sm font-medium text-gray-700">{t('numerator_label')}</label>
          <input
            type="number"
            id="num1"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="den1" className="block text-sm font-medium text-gray-700">{t}('denominator_label')</label>
          <input
            type="number"
            id="den1"
            value={den1}
            onChange={(e) => setDen1(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Zlomek 2 */}
        <div>
          <label htmlFor="num2" className="block text-sm font-medium text-gray-700">{t}('numerator_label')</label>
          <input
            type="number"
            id="num2"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="den2" className="block text-sm font-medium text-gray-700">{t}('denominator_label')</label>
          <input
            type="number"
            id="den2"
            value={den2}
            onChange={(e) => setDen2(e.target.value)}
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

export default FractionDivision;
