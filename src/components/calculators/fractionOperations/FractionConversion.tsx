import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CalculatorInput, CalculatorSelect } from '../shared';
import {
  improperToMixed, mixedToImproper, fractionToDecimal, decimalToFraction,
  simplifyFraction, formatFraction, formatMixed, isValidFraction,
  type Fraction, type MixedNumber
} from '@/utils/math/fractions';

type ConversionType = 'improper_to_mixed' | 'mixed_to_improper' | 'fraction_to_decimal' | 'decimal_to_fraction';

const FractionConversion: React.FC = () => {
  const t = useTranslations();
  const [convType, setConvType] = useState<string>('improper_to_mixed');

  // Improper fraction inputs
  const [impNum, setImpNum] = useState('');
  const [impDen, setImpDen] = useState('');

  // Mixed number inputs
  const [mixWhole, setMixWhole] = useState('');
  const [mixNum, setMixNum] = useState('');
  const [mixDen, setMixDen] = useState('');

  // Fraction → decimal inputs
  const [fracNum, setFracNum] = useState('');
  const [fracDen, setFracDen] = useState('');

  // Decimal input
  const [decimalVal, setDecimalVal] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const e: Record<string, string> = {};
    if (convType === 'improper_to_mixed' && impDen !== '' && parseInt(impDen, 10) === 0)
      e.impDen = t('fractions_error_zero_denominator');
    if (convType === 'mixed_to_improper' && mixDen !== '' && parseInt(mixDen, 10) === 0)
      e.mixDen = t('fractions_error_zero_denominator');
    if (convType === 'fraction_to_decimal' && fracDen !== '' && parseInt(fracDen, 10) === 0)
      e.fracDen = t('fractions_error_zero_denominator');
    setErrors(e);
  }, [convType, impDen, mixDen, fracDen, t]);

  const conversionOptions = [
    { value: 'improper_to_mixed', label: t('fractions_conv_improper_to_mixed') },
    { value: 'mixed_to_improper', label: t('fractions_conv_mixed_to_improper') },
    { value: 'fraction_to_decimal', label: t('fractions_conv_fraction_to_decimal') },
    { value: 'decimal_to_fraction', label: t('fractions_conv_decimal_to_fraction') },
  ];

  const renderResult = () => {
    switch (convType as ConversionType) {
      case 'improper_to_mixed': {
        const v = isValidFraction(impNum, impDen);
        if (!v.valid) return null;
        const f: Fraction = { numerator: parseInt(impNum, 10), denominator: parseInt(impDen, 10) };
        const mixed: MixedNumber = improperToMixed(f);
        return (
          <div className="text-2xl font-bold text-center">
            {formatFraction(f)} = {formatMixed(mixed)}
          </div>
        );
      }
      case 'mixed_to_improper': {
        if (mixWhole === '' || mixNum === '' || mixDen === '') return null;
        const w = parseInt(mixWhole, 10);
        const n = parseInt(mixNum, 10);
        const d = parseInt(mixDen, 10);
        if (isNaN(w) || isNaN(n) || isNaN(d) || d === 0) return null;
        const m: MixedNumber = { whole: w, numerator: n, denominator: d };
        const result = mixedToImproper(m);
        const simplified = simplifyFraction(result);
        return (
          <div className="space-y-2">
            <div className="text-2xl font-bold text-center">
              {formatMixed(m)} = {formatFraction(result)}
            </div>
            {(result.numerator !== simplified.numerator || result.denominator !== simplified.denominator) && (
              <p className="text-sm text-muted-foreground text-center">
                = {formatFraction(simplified)} ({t('fractions_simplified')})
              </p>
            )}
          </div>
        );
      }
      case 'fraction_to_decimal': {
        const v = isValidFraction(fracNum, fracDen);
        if (!v.valid) return null;
        const f: Fraction = { numerator: parseInt(fracNum, 10), denominator: parseInt(fracDen, 10) };
        const decimal = fractionToDecimal(f);
        return (
          <div className="text-2xl font-bold text-center">
            {formatFraction(f)} = {decimal.toLocaleString(undefined, { maximumFractionDigits: 10 })}
          </div>
        );
      }
      case 'decimal_to_fraction': {
        if (decimalVal === '') return null;
        const d = parseFloat(decimalVal);
        if (isNaN(d)) return null;
        const result = decimalToFraction(d);
        return (
          <div className="text-2xl font-bold text-center">
            {d} = {formatFraction(result)}
          </div>
        );
      }
      default: return null;
    }
  };

  const renderInputs = () => {
    switch (convType as ConversionType) {
      case 'improper_to_mixed':
        return (
          <div className="grid grid-cols-2 gap-4">
            <CalculatorInput id="conv-imp-num" label={t('fractions_numerator')} value={impNum} onChange={setImpNum} placeholder="0" step="1" />
            <CalculatorInput id="conv-imp-den" label={t('fractions_denominator')} value={impDen} onChange={setImpDen} placeholder="0" step="1" error={errors.impDen} />
          </div>
        );
      case 'mixed_to_improper':
        return (
          <div className="grid grid-cols-3 gap-4">
            <CalculatorInput id="conv-mix-whole" label={t('fractions_whole_number')} value={mixWhole} onChange={setMixWhole} placeholder="0" step="1" />
            <CalculatorInput id="conv-mix-num" label={t('fractions_numerator')} value={mixNum} onChange={setMixNum} placeholder="0" step="1" />
            <CalculatorInput id="conv-mix-den" label={t('fractions_denominator')} value={mixDen} onChange={setMixDen} placeholder="0" step="1" error={errors.mixDen} />
          </div>
        );
      case 'fraction_to_decimal':
        return (
          <div className="grid grid-cols-2 gap-4">
            <CalculatorInput id="conv-frac-num" label={t('fractions_numerator')} value={fracNum} onChange={setFracNum} placeholder="0" step="1" />
            <CalculatorInput id="conv-frac-den" label={t('fractions_denominator')} value={fracDen} onChange={setFracDen} placeholder="0" step="1" error={errors.fracDen} />
          </div>
        );
      case 'decimal_to_fraction':
        return (
          <CalculatorInput id="conv-decimal" label={t('fractions_decimal_value')} value={decimalVal} onChange={setDecimalVal} placeholder="0.75" step="0.01" />
        );
      default: return null;
    }
  };

  const resultContent = renderResult();

  return (
    <div className="space-y-4">
      <CalculatorSelect
        id="conv-type"
        label={t('fractions_conversion_type')}
        value={convType}
        onChange={setConvType}
        options={conversionOptions}
      />

      {renderInputs()}

      {resultContent && (
        <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
          {resultContent}
        </div>
      )}
    </div>
  );
};

export default FractionConversion;
