import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CalculatorInput } from '../shared';
import {
  divideFractions, formatFraction,
  isValidFraction, fractionToDecimal, divisionSteps,
  type Fraction, type FractionStep
} from '@/utils/math/fractions';

const FractionDivision: React.FC = () => {
  const t = useTranslations();
  const [num1, setNum1] = useState('');
  const [den1, setDen1] = useState('');
  const [num2, setNum2] = useState('');
  const [den2, setDen2] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const e: Record<string, string> = {};
    if (den1 !== '' && parseInt(den1, 10) === 0) e.den1 = t('fractions_error_zero_denominator');
    if (den2 !== '' && parseInt(den2, 10) === 0) e.den2 = t('fractions_error_zero_denominator');
    if (num2 !== '' && parseInt(num2, 10) === 0) e.num2 = t('fractions_error_zero_divisor');
    setErrors(e);
  }, [den1, den2, num2, t]);

  const v1 = isValidFraction(num1, den1);
  const v2 = isValidFraction(num2, den2);
  const n2 = parseInt(num2, 10);
  const bothValid = v1.valid && v2.valid && n2 !== 0;

  const a: Fraction = { numerator: parseInt(num1, 10), denominator: parseInt(den1, 10) };
  const b: Fraction = { numerator: parseInt(num2, 10), denominator: parseInt(den2, 10) };
  const result = bothValid ? divideFractions(a, b) : null;
  const steps: FractionStep[] = bothValid ? divisionSteps(a, b) : [];

  const stepLabels: Record<string, string> = {
    flip_second: t('fractions_step_flip_second'),
    multiply: t('fractions_step_multiply'),
    simplify: t('fractions_step_simplify'),
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <CalculatorInput id="div-num1" label={t('fractions_numerator_1')} value={num1} onChange={setNum1} placeholder="0" step="1" />
        <CalculatorInput id="div-den1" label={t('fractions_denominator_1')} value={den1} onChange={setDen1} placeholder="0" step="1" error={errors.den1} />
      </div>
      <div className="text-center text-xl font-bold text-muted-foreground">&divide;</div>
      <div className="grid grid-cols-2 gap-4">
        <CalculatorInput id="div-num2" label={t('fractions_numerator_2')} value={num2} onChange={setNum2} placeholder="0" step="1" error={errors.num2} />
        <CalculatorInput id="div-den2" label={t('fractions_denominator_2')} value={den2} onChange={setDen2} placeholder="0" step="1" error={errors.den2} />
      </div>

      {bothValid && result && (
        <div className="p-4 rounded-lg border bg-primary/5 border-primary/20 space-y-3">
          <div className="text-2xl font-bold text-center">
            {formatFraction(a)} &divide; {formatFraction(b)} = {formatFraction(result)}
          </div>

          <div className="text-sm space-y-1 text-muted-foreground">
            {steps.map((step, i) => (
              <p key={i}>{i + 1}. {stepLabels[step.description] || step.description}: {step.expression}</p>
            ))}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            ≈ {fractionToDecimal(result).toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </p>
        </div>
      )}
    </div>
  );
};

export default FractionDivision;
