import { useState, useEffect, useCallback } from 'react';

export type UnitType = 'length' | 'weight' | 'volume' | 'temperature';

const unitConversions = {
  length: {
    units: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
    factors: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.34 }
  },
  weight: {
    units: ['mg', 'g', 'kg', 't', 'oz', 'lb', 'st'],
    factors: { mg: 0.001, g: 1, kg: 1000, t: 1000000, oz: 28.3495, lb: 453.592, st: 6350.29 }
  },
  volume: {
    units: ['ml', 'l', 'm3', 'tsp', 'tbsp', 'fl-oz', 'cup', 'pt', 'qt', 'gal'],
    factors: { ml: 1, l: 1000, m3: 1000000, tsp: 4.92892, tbsp: 14.7868, 'fl-oz': 29.5735, cup: 236.588, pt: 473.176, qt: 946.353, gal: 3785.41 }
  },
  temperature: {
    units: ['°C', '°F', 'K'],
    factors: {} as Record<string, number>
  }
} as const;

const defaultUnits: Record<UnitType, { from: string; to: string }> = {
  length: { from: 'm', to: 'km' },
  weight: { from: 'g', to: 'kg' },
  volume: { from: 'ml', to: 'l' },
  temperature: { from: '°C', to: '°F' }
};

function convertTemperature(value: number, from: string, to: string): number {
  let celsius = value;
  if (from === '°F') celsius = (value - 32) * 5 / 9;
  else if (from === 'K') celsius = value - 273.15;

  if (to === '°F') return (celsius * 9 / 5) + 32;
  if (to === 'K') return celsius + 273.15;
  return celsius;
}

export function useUnitConverter() {
  const [unitType, setUnitType] = useState<UnitType>('length');
  const [inputValue, setInputValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('km');
  const [result, setResult] = useState<number | null>(null);

  const currentUnits = unitConversions[unitType].units as readonly string[];

  const convertValue = useCallback((value: number, from: string, to: string, type: UnitType = unitType): number => {
    if (type === 'temperature') return convertTemperature(value, from, to);
    const factors = unitConversions[type].factors as Record<string, number>;
    return (value * factors[from]) / factors[to];
  }, [unitType]);

  useEffect(() => {
    if (inputValue && !isNaN(parseFloat(inputValue))) {
      setResult(convertValue(parseFloat(inputValue), fromUnit, toUnit));
    } else {
      setResult(null);
    }
  }, [inputValue, fromUnit, toUnit, unitType, convertValue]);

  const handleUnitTypeChange = (newType: UnitType) => {
    setUnitType(newType);
    setFromUnit(defaultUnits[newType].from);
    setToUnit(defaultUnits[newType].to);
    setInputValue('');
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const formatResult = (value: number | null): string => {
    if (value === null) return '';
    if (Math.abs(value) < 0.0001) return value.toExponential(4);
    if (Math.abs(value) < 1) return value.toFixed(6).replace(/\.?0+$/, '');
    if (Math.abs(value) < 10) return value.toFixed(4).replace(/\.?0+$/, '');
    return value.toFixed(2).replace(/\.?0+$/, '');
  };

  return {
    unitType, inputValue, setInputValue, fromUnit, setFromUnit, toUnit, setToUnit,
    result, currentUnits, handleUnitTypeChange, swapUnits, formatResult, convertValue
  };
}
