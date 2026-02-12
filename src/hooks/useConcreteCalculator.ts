import { useState, useEffect } from 'react';

export interface ConcreteResult {
  volume: number;
  cement: number;
  sand: number;
  gravel: number;
  water: number;
  cost: number;
  concreteType: string;
  isValid: boolean;
}

type CalculationType = 'slab' | 'column';
type ConcreteGrade = 'C12/15' | 'C16/20' | 'C20/25' | 'C25/30' | 'C30/37';

interface GradeInfo {
  cement: number;
  sand: number;
  gravel: number;
  strengthKey: string;
  useKey: string;
}

export const concreteGrades: Record<ConcreteGrade, GradeInfo> = {
  'C12/15': { cement: 1, sand: 3, gravel: 6, strengthKey: 'concrete_strength_low', useKey: 'concrete_use_foundations_light' },
  'C16/20': { cement: 1, sand: 2.5, gravel: 5, strengthKey: 'concrete_strength_medium', useKey: 'concrete_use_foundations_floors' },
  'C20/25': { cement: 1, sand: 2, gravel: 4, strengthKey: 'concrete_strength_high', useKey: 'concrete_use_structural' },
  'C25/30': { cement: 1, sand: 1.5, gravel: 3, strengthKey: 'concrete_strength_very_high', useKey: 'concrete_use_columns' },
  'C30/37': { cement: 1, sand: 1.5, gravel: 2.5, strengthKey: 'concrete_strength_extreme', useKey: 'concrete_use_special' },
};

export function useConcreteCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('slab');
  const [concreteGrade, setConcreteGrade] = useState<ConcreteGrade>('C20/25');

  // Slab dimensions
  const [length, setLength] = useState<string>('10');
  const [width, setWidth] = useState<string>('8');
  const [thickness, setThickness] = useState<string>('0.15');

  // Column dimensions
  const [diameter, setDiameter] = useState<string>('0.3');
  const [height, setHeight] = useState<string>('3');
  const [quantity, setQuantity] = useState<string>('4');

  // Pricing
  const [cementPrice, setCementPrice] = useState<string>('150');
  const [sandPrice, setSandPrice] = useState<string>('400');
  const [gravelPrice, setGravelPrice] = useState<string>('350');

  const [result, setResult] = useState<ConcreteResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = (type: CalculationType, errorMessages: Record<string, string>): boolean => {
    const newErrors: Record<string, string> = {};

    if (type === 'slab') {
      const l = parseFloat(length);
      const w = parseFloat(width);
      const th = parseFloat(thickness);
      if (!length || isNaN(l) || l <= 0) newErrors.length = errorMessages.length || '';
      if (!width || isNaN(w) || w <= 0) newErrors.width = errorMessages.width || '';
      if (!thickness || isNaN(th) || th <= 0) newErrors.thickness = errorMessages.thickness || '';
    } else {
      const d = parseFloat(diameter);
      const h = parseFloat(height);
      const q = parseFloat(quantity);
      if (!diameter || isNaN(d) || d <= 0) newErrors.diameter = errorMessages.diameter || '';
      if (!height || isNaN(h) || h <= 0) newErrors.height = errorMessages.height || '';
      if (!quantity || isNaN(q) || q <= 0) newErrors.quantity = errorMessages.quantity || '';
    }

    const cp = parseFloat(cementPrice);
    const sp = parseFloat(sandPrice);
    const gp = parseFloat(gravelPrice);
    if (!cementPrice || isNaN(cp) || cp <= 0) newErrors.cementPrice = errorMessages.cementPrice || '';
    if (!sandPrice || isNaN(sp) || sp <= 0) newErrors.sandPrice = errorMessages.sandPrice || '';
    if (!gravelPrice || isNaN(gp) || gp <= 0) newErrors.gravelPrice = errorMessages.gravelPrice || '';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = (errorMessages: Record<string, string>) => {
    if (!validateInputs(calculationType, errorMessages)) {
      setResult(null);
      return;
    }

    let volume = 0;
    if (calculationType === 'slab') {
      volume = parseFloat(length) * parseFloat(width) * parseFloat(thickness);
    } else {
      const r = parseFloat(diameter) / 2;
      volume = Math.PI * r * r * parseFloat(height) * parseFloat(quantity);
    }

    const mix = concreteGrades[concreteGrade];
    const totalRatio = mix.cement + mix.sand + mix.gravel;
    const wasteMultiplier = 1.05;

    const cementVolume = (volume * mix.cement / totalRatio) * wasteMultiplier;
    const sandVolume = (volume * mix.sand / totalRatio) * wasteMultiplier;
    const gravelVolume = (volume * mix.gravel / totalRatio) * wasteMultiplier;

    const cementWeight = cementVolume * 1500;
    const sandWeight = sandVolume * 1600;
    const gravelWeight = gravelVolume * 1600;
    const waterWeight = cementWeight * 0.5;

    const cementCost = (cementWeight / 1000) * parseFloat(cementPrice);
    const sandCost = sandVolume * parseFloat(sandPrice);
    const gravelCost = gravelVolume * parseFloat(gravelPrice);

    setResult({
      volume: volume * wasteMultiplier,
      cement: cementWeight,
      sand: sandWeight,
      gravel: gravelWeight,
      water: waterWeight,
      cost: cementCost + sandCost + gravelCost,
      concreteType: concreteGrade,
      isValid: true,
    });
  };

  return {
    calculationType, setCalculationType: setCalculationType as (v: string) => void,
    concreteGrade, setConcreteGrade: setConcreteGrade as (v: string) => void,
    length, setLength, width, setWidth, thickness, setThickness,
    diameter, setDiameter, height, setHeight, quantity, setQuantity,
    cementPrice, setCementPrice, sandPrice, setSandPrice, gravelPrice, setGravelPrice,
    result, errors, calculate,
  };
}
