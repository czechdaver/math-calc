import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CalculatorInput } from '../shared';
import { simplifyFraction, gcd, formatFraction, isValidFraction, fractionToDecimal } from '@/utils/math/fractions';

const FractionSimplification: React.FC = () => {
  const t = useTranslations();
  const [num, setNum] = useState('');
  const [den, setDen] = useState('');
  const [errors, setErrors] = useState<{ num?: string; den?: string }>({});

  const n = parseInt(num, 10);
  const d = parseInt(den, 10);
  const validation = isValidFraction(num, den);
  const hasInput = num !== '' && den !== '';

  useEffect(() => {
    const newErrors: { num?: string; den?: string } = {};
    if (den !== '' && parseInt(den, 10) === 0) {
      newErrors.den = t('fractions_error_zero_denominator');
    }
    setErrors(newErrors);
  }, [num, den, t]);

  const result = validation.valid ? simplifyFraction({ numerator: n, denominator: d }) : null;
  const commonDiv = validation.valid ? gcd(Math.abs(n), Math.abs(d)) : 0;
  const isAlreadySimplified = result && result.numerator === n && result.denominator === d;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <CalculatorInput
          id="simp-num" label={t('fractions_numerator')} value={num}
          onChange={setNum} placeholder="0" step="1" error={errors.num}
        />
        <CalculatorInput
          id="simp-den" label={t('fractions_denominator')} value={den}
          onChange={setDen} placeholder="0" step="1" error={errors.den}
        />
      </div>

      {hasInput && result && (
        <div className="p-4 rounded-lg border bg-primary/5 border-primary/20 space-y-3">
          <div className="text-2xl font-bold text-center">
            {formatFraction({ numerator: n, denominator: d })} = {formatFraction(result)}
          </div>

          {isAlreadySimplified ? (
            <p className="text-center text-muted-foreground">{t('fractions_already_simplified')}</p>
          ) : (
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>{t('fractions_step_gcd')}: GCD({Math.abs(n)}, {Math.abs(d)}) = {commonDiv}</p>
              <p>{t('fractions_step_divide')}: {n}÷{commonDiv} / {d}÷{commonDiv} = {formatFraction(result)}</p>
            </div>
          )}

          <p className="text-sm text-muted-foreground text-center">
            ≈ {fractionToDecimal(result).toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </p>
        </div>
      )}
    </div>
  );
};

export default FractionSimplification;
