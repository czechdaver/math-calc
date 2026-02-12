import { useState, useEffect } from 'react';

export interface VolumeResult {
  volume: number;
  surfaceArea: number;
  shape: string;
  isValid: boolean;
}

export type VolumeShape = 'cube' | 'rectangular' | 'sphere' | 'cylinder' | 'cone';

export function useVolumeCalculator() {
  const [shape, setShape] = useState<VolumeShape>('cube');

  // Cube/Rectangular prism
  const [length, setLength] = useState<string>('10');
  const [width, setWidth] = useState<string>('8');
  const [height, setHeight] = useState<string>('6');

  // Sphere
  const [radius, setRadius] = useState<string>('5');

  // Cylinder
  const [cylRadius, setCylRadius] = useState<string>('4');
  const [cylHeight, setCylHeight] = useState<string>('10');

  // Cone
  const [coneRadius, setConeRadius] = useState<string>('3');
  const [coneHeight, setConeHeight] = useState<string>('8');

  const [result, setResult] = useState<VolumeResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = (s: VolumeShape, errorMessages: Record<string, string>): boolean => {
    const newErrors: Record<string, string> = {};
    const check = (val: string, key: string) => {
      const n = parseFloat(val);
      if (!val || isNaN(n) || n <= 0) newErrors[key] = errorMessages[key] || '';
    };

    if (s === 'cube') {
      check(length, 'length');
    } else if (s === 'rectangular') {
      check(length, 'length');
      check(width, 'width');
      check(height, 'height');
    } else if (s === 'sphere') {
      check(radius, 'radius');
    } else if (s === 'cylinder') {
      check(cylRadius, 'cylRadius');
      check(cylHeight, 'cylHeight');
    } else {
      check(coneRadius, 'coneRadius');
      check(coneHeight, 'coneHeight');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = (errorMessages: Record<string, string>) => {
    if (!validateInputs(shape, errorMessages)) {
      setResult(null);
      return;
    }

    let volume = 0;
    let surfaceArea = 0;

    if (shape === 'cube') {
      const a = parseFloat(length);
      volume = a * a * a;
      surfaceArea = 6 * a * a;
    } else if (shape === 'rectangular') {
      const l = parseFloat(length);
      const w = parseFloat(width);
      const h = parseFloat(height);
      volume = l * w * h;
      surfaceArea = 2 * (l * w + l * h + w * h);
    } else if (shape === 'sphere') {
      const r = parseFloat(radius);
      volume = (4 / 3) * Math.PI * r * r * r;
      surfaceArea = 4 * Math.PI * r * r;
    } else if (shape === 'cylinder') {
      const r = parseFloat(cylRadius);
      const h = parseFloat(cylHeight);
      volume = Math.PI * r * r * h;
      surfaceArea = 2 * Math.PI * r * (r + h);
    } else {
      const r = parseFloat(coneRadius);
      const h = parseFloat(coneHeight);
      volume = (1 / 3) * Math.PI * r * r * h;
      const slant = Math.sqrt(r * r + h * h);
      surfaceArea = Math.PI * r * (r + slant);
    }

    setResult({ volume, surfaceArea, shape, isValid: true });
  };

  return {
    shape, setShape: setShape as (v: string) => void,
    length, setLength, width, setWidth, height, setHeight,
    radius, setRadius,
    cylRadius, setCylRadius, cylHeight, setCylHeight,
    coneRadius, setConeRadius, coneHeight, setConeHeight,
    result, errors, calculate,
  };
}
