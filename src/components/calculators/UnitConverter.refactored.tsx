// src/components/calculators/UnitConverter.refactored.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import CalculatorBase from './CalculatorBase';
import type { CalculatorInput, CalculatorResult } from './CalculatorBase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Tabs from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

type UnitType = 'length' | 'weight' | 'volume' | 'temperature';

// Define conversion factors for each unit type
const unitConversions = {
  length: {
    units: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
    factors: {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.34
    }
  },
  weight: {
    units: ['mg', 'g', 'kg', 't', 'oz', 'lb', 'st'],
    factors: {
      mg: 0.001,
      g: 1,
      kg: 1000,
      t: 1000000,
      oz: 28.3495,
      lb: 453.592,
      st: 6350.29
    }
  },
  volume: {
    units: ['ml', 'l', 'm3', 'tsp', 'tbsp', 'fl-oz', 'cup', 'pt', 'qt', 'gal'],
    factors: {
      ml: 1,
      l: 1000,
      m3: 1000000,
      tsp: 4.92892,
      tbsp: 14.7868,
      'fl-oz': 29.5735,
      cup: 236.588,
      pt: 473.176,
      qt: 946.353,
      gal: 3785.41
    }
  },
  temperature: {
    units: ['°C', '°F', 'K'],
    special: true // Temperature requires special conversion
  }
};

const UnitConverter: React.FC = () => {
  const { t } = useTranslation('unitConverter');
  const [unitType, setUnitType] = useState<UnitType>('length');
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [result, setResult] = useState<number | null>(null);

  // Get the current unit configuration based on the selected unit type
  const currentUnitConfig = unitConversions[unitType];

  // Handle temperature conversion (special case)
  const convertTemperature = (value: number, from: string, to: string): number => {
    let tempInCelsius = value;
    
    // Convert from source unit to Celsius
    if (from === '°F') {
      tempInCelsius = (value - 32) * 5/9;
    } else if (from === 'K') {
      tempInCelsius = value - 273.15;
    }
    
    // Convert from Celsius to target unit
    if (to === '°F') {
      return (tempInCelsius * 9/5) + 32;
    } else if (to === 'K') {
      return tempInCelsius + 273.15;
    }
    
    return tempInCelsius; // Already in Celsius
  };

  // Handle regular unit conversion
  const convertValue = (value: number, from: string, to: string): number => {
    if (unitType === 'temperature') {
      return convertTemperature(value, from, to);
    }
    
    const factors = unitConversions[unitType].factors as Record<string, number>;
    const valueInBase = value * factors[from];
    return valueInBase / factors[to];
  };

  // Update result when inputs change
  useEffect(() => {
    if (inputValue && !isNaN(parseFloat(inputValue))) {
      const numValue = parseFloat(inputValue);
      const converted = convertValue(numValue, fromUnit, toUnit);
      setResult(converted);
    } else {
      setResult(null);
    }
  }, [inputValue, fromUnit, toUnit, unitType]);

  // Format the result with appropriate precision
  const formatResult = (value: number | null): string => {
    if (value === null) return '';
    
    // Use more precision for very small numbers
    if (Math.abs(value) < 0.0001) {
      return value.toExponential(4);
    }
    
    // For regular numbers, use fixed decimal places based on magnitude
    if (Math.abs(value) < 1) return value.toFixed(6).replace(/\.?0+$/, '');
    if (Math.abs(value) < 10) return value.toFixed(4).replace(/\.?0+$/, '');
    if (Math.abs(value) < 1000) return value.toFixed(2).replace(/\.?0+$/, '');
    return value.toFixed(2).replace(/\.?0+$/, '');
  };

  // Handle unit type change
  const handleUnitTypeChange = (newType: UnitType) => {
    setUnitType(newType);
    // Reset units to defaults for the new type
    const defaultUnits = {
      length: { from: 'm', to: 'km' },
      weight: { from: 'g', to: 'kg' },
      volume: { from: 'ml', to: 'l' },
      temperature: { from: '°C', to: '°F' }
    };
    setFromUnit(defaultUnits[newType].from);
    setToUnit(defaultUnits[newType].to);
    setInputValue('');
  };

  // Swap units
  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="space-y-6">
      {/* Unit Type Selector */}
      <Tabs 
        activeTab={unitType}
        onChange={(tabId) => handleUnitTypeChange(tabId as UnitType)}
        variant="segmented"
        fullWidth
        className="w-full mb-6"
      >
        <Tabs.Item label={t('length')} _id="length">
          <div className="sr-only">Length units</div>
        </Tabs.Item>
        <Tabs.Item label={t('weight')} _id="weight">
          <div className="sr-only">Weight units</div>
        </Tabs.Item>
        <Tabs.Item label={t('volume')} _id="volume">
          <div className="sr-only">Volume units</div>
        </Tabs.Item>
        <Tabs.Item label={t('temperature')} _id="temperature">
          <div className="sr-only">Temperature units</div>
        </Tabs.Item>
      </Tabs>

      {/* Conversion Interface */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1">
            <Label htmlFor="inputValue">{t('value')}</Label>
            <Input
              id="inputValue"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('enter_value')}
              className="mt-1"
            />
          </div>
          
          <div className="w-full sm:w-auto">
            <Label>{t('from')}</Label>
            <Select
              value={fromUnit}
              onValueChange={(value) => setFromUnit(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px] mt-1">
                <SelectValue placeholder={t('select_unit')} />
              </SelectTrigger>
              <SelectContent>
                {currentUnitConfig.units.map((unit) => (
                  <SelectItem key={`from-${unit}`} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <button 
            onClick={swapUnits}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label={t('swap_units')}
            title={t('swap_units')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M21 17H3"></path>
              <path d="M18 4L21 7L18 10"></path>
              <path d="M21 7H3"></path>
              <path d="M18 20L21 17L18 14"></path>
            </svg>
          </button>
          
          <div className="w-full sm:w-auto">
            <Label>{t('to')}</Label>
            <Select
              value={toUnit}
              onValueChange={(value) => setToUnit(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px] mt-1">
                <SelectValue placeholder={t('select_unit')} />
              </SelectTrigger>
              <SelectContent>
                {currentUnitConfig.units.map((unit) => (
                  <SelectItem key={`to-${unit}`} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Result */}
        {inputValue && !isNaN(parseFloat(inputValue)) && result !== null && (
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t('result')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatResult(parseFloat(inputValue))} {fromUnit} = {formatResult(result)} {toUnit}
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{t('conversion_note')}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Quick Conversions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">{t('quick_conversions')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentUnitConfig.units.slice(0, 6).map((unit) => (
            unit !== fromUnit && (
              <button
                key={`quick-${unit}`}
                onClick={() => {
                  setToUnit(unit);
                }}
                className="text-left p-3 rounded-md border hover:bg-muted/50 transition-colors"
              >
                <div className="font-medium">
                  {formatResult(1)} {fromUnit} = {formatResult(convertValue(1, fromUnit, unit))} {unit}
                </div>
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

const UnitConverterWithBase: React.FC = () => {
  const { t } = useTranslation('unitConverter');
  
  // Since CalculatorBase doesn't support children, we'll use the render prop pattern
  // by returning the UnitConverter component directly
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t('unit_converter')}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t('unit_converter_description')}
        </p>
      </div>
      <UnitConverter />
    </div>
  );
};

export default UnitConverterWithBase;
