'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Calculator, Info } from 'lucide-react';

// Unit conversion definitions
const UNIT_CATEGORIES = {
  length: {
    name: 'Length',
    units: {
      mm: { name: 'Millimeters', symbol: 'mm', toBase: 0.001 },
      cm: { name: 'Centimeters', symbol: 'cm', toBase: 0.01 },
      m: { name: 'Meters', symbol: 'm', toBase: 1 },
      km: { name: 'Kilometers', symbol: 'km', toBase: 1000 },
      in: { name: 'Inches', symbol: 'in', toBase: 0.0254 },
      ft: { name: 'Feet', symbol: 'ft', toBase: 0.3048 },
      yd: { name: 'Yards', symbol: 'yd', toBase: 0.9144 },
      mi: { name: 'Miles', symbol: 'mi', toBase: 1609.34 },
    }
  },
  weight: {
    name: 'Weight',
    units: {
      mg: { name: 'Milligrams', symbol: 'mg', toBase: 0.000001 },
      g: { name: 'Grams', symbol: 'g', toBase: 0.001 },
      kg: { name: 'Kilograms', symbol: 'kg', toBase: 1 },
      oz: { name: 'Ounces', symbol: 'oz', toBase: 0.0283495 },
      lb: { name: 'Pounds', symbol: 'lb', toBase: 0.453592 },
      st: { name: 'Stones', symbol: 'st', toBase: 6.35029 },
      t: { name: 'Tonnes', symbol: 't', toBase: 1000 },
    }
  },
  temperature: {
    name: 'Temperature',
    units: {
      c: { name: 'Celsius', symbol: '°C', toBase: (val: number) => val },
      f: { name: 'Fahrenheit', symbol: '°F', toBase: (val: number) => (val - 32) * 5/9 },
      k: { name: 'Kelvin', symbol: 'K', toBase: (val: number) => val - 273.15 },
    }
  },
  volume: {
    name: 'Volume',
    units: {
      ml: { name: 'Milliliters', symbol: 'ml', toBase: 0.001 },
      l: { name: 'Liters', symbol: 'l', toBase: 1 },
      m3: { name: 'Cubic Meters', symbol: 'm³', toBase: 1000 },
      tsp: { name: 'Teaspoons', symbol: 'tsp', toBase: 0.00492892 },
      tbsp: { name: 'Tablespoons', symbol: 'tbsp', toBase: 0.0147868 },
      cup: { name: 'Cups', symbol: 'cup', toBase: 0.236588 },
      pt: { name: 'Pints', symbol: 'pt', toBase: 0.473176 },
      qt: { name: 'Quarts', symbol: 'qt', toBase: 0.946353 },
      gal: { name: 'Gallons', symbol: 'gal', toBase: 3.78541 },
    }
  },
  area: {
    name: 'Area',
    units: {
      mm2: { name: 'Square Millimeters', symbol: 'mm²', toBase: 0.000001 },
      cm2: { name: 'Square Centimeters', symbol: 'cm²', toBase: 0.0001 },
      m2: { name: 'Square Meters', symbol: 'm²', toBase: 1 },
      km2: { name: 'Square Kilometers', symbol: 'km²', toBase: 1000000 },
      in2: { name: 'Square Inches', symbol: 'in²', toBase: 0.00064516 },
      ft2: { name: 'Square Feet', symbol: 'ft²', toBase: 0.092903 },
      ac: { name: 'Acres', symbol: 'ac', toBase: 4046.86 },
      ha: { name: 'Hectares', symbol: 'ha', toBase: 10000 },
    }
  }
} as const;

type CategoryKey = keyof typeof UNIT_CATEGORIES;
type UnitKey<T extends CategoryKey> = keyof typeof UNIT_CATEGORIES[T]['units'];
type UnitDefinition = {
  name: string;
  symbol: string;
  toBase: number | ((val: number) => number);
};

interface ConversionResult {
  value: number;
  fromUnit: string;
  toUnit: string;
  category: string;
  formula?: string;
}

export default function EnhancedUnitConverterCalculator() {
  const t = useTranslations('calculators.unit_converter');
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [showFormula, setShowFormula] = useState(false);

  const currentCategory = UNIT_CATEGORIES[selectedCategory];
  const availableUnits = Object.entries(currentCategory.units);

  // Conversion logic
  const convertUnits = useMemo(() => {
    if (!inputValue || isNaN(Number(inputValue))) return null;

    const value = Number(inputValue);
    const category = UNIT_CATEGORIES[selectedCategory];
    const unitsMap = category.units as Record<string, UnitDefinition>;
    const fromUnitData = unitsMap[fromUnit];
    const toUnitData = unitsMap[toUnit];

    if (!fromUnitData || !toUnitData) return null;

    let convertedValue: number;
    let formula: string;

    if (selectedCategory === 'temperature') {
      // Special handling for temperature conversions
      if (fromUnit === 'c' && toUnit === 'f') {
        convertedValue = (value * 9/5) + 32;
        formula = `°F = (°C × 9/5) + 32 = (${value} × 9/5) + 32`;
      } else if (fromUnit === 'f' && toUnit === 'c') {
        convertedValue = (value - 32) * 5/9;
        formula = `°C = (°F - 32) × 5/9 = (${value} - 32) × 5/9`;
      } else if (fromUnit === 'c' && toUnit === 'k') {
        convertedValue = value + 273.15;
        formula = `K = °C + 273.15 = ${value} + 273.15`;
      } else if (fromUnit === 'k' && toUnit === 'c') {
        convertedValue = value - 273.15;
        formula = `°C = K - 273.15 = ${value} - 273.15`;
      } else if (fromUnit === 'f' && toUnit === 'k') {
        convertedValue = ((value - 32) * 5/9) + 273.15;
        formula = `K = ((°F - 32) × 5/9) + 273.15 = ((${value} - 32) × 5/9) + 273.15`;
      } else if (fromUnit === 'k' && toUnit === 'f') {
        convertedValue = ((value - 273.15) * 9/5) + 32;
        formula = `°F = ((K - 273.15) × 9/5) + 32 = ((${value} - 273.15) × 9/5) + 32`;
      } else {
        convertedValue = value; // Same unit
        formula = `${value} = ${value}`;
      }
    } else {
      // Standard unit conversions using base unit
      const baseValue = value * (fromUnitData.toBase as number);
      convertedValue = baseValue / (toUnitData.toBase as number);
      
      const fromSymbol = fromUnitData.symbol;
      const toSymbol = toUnitData.symbol;
      const ratio = (toUnitData.toBase as number) / (fromUnitData.toBase as number);
      
      formula = `1 ${fromSymbol} = ${ratio} ${toSymbol}, so ${value} ${fromSymbol} = ${value} × ${ratio} ${toSymbol}`;
    }

    return {
      value: convertedValue,
      fromUnit: fromUnitData.symbol,
      toUnit: toUnitData.symbol,
      category: currentCategory.name,
      formula
    };
  }, [inputValue, selectedCategory, fromUnit, toUnit, currentCategory.name]);

  const handleCalculate = () => {
    const conversionResult = convertUnits;
    if (conversionResult) {
      setResult(conversionResult);
    }
  };

  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result) {
      setInputValue(result.value.toString());
      setResult(null);
    }
  };

  const resetCalculator = () => {
    setInputValue('');
    setResult(null);
    setShowFormula(false);
  };

  // Quick conversion suggestions
  const getQuickConversions = () => {
    if (!convertUnits) return [];
    
    const suggestions = [];
    const baseValue = Number(inputValue);
    
    // Get 3 most common units for current category
    const commonUnits = Object.entries(currentCategory.units).slice(0, 3);
    
    for (const [unitKey, unitData] of commonUnits) {
      if (unitKey !== fromUnit) {
        const tempResult = selectedCategory === 'temperature' 
          ? calculateTemperatureConversion(baseValue, fromUnit, unitKey)
          : calculateStandardConversion(baseValue, fromUnit, unitKey);
        
        if (tempResult !== null) {
          suggestions.push({
            unit: unitKey,
            symbol: unitData.symbol,
            value: tempResult
          });
        }
      }
    }
    
    return suggestions;
  };

  const calculateTemperatureConversion = (value: number, from: string, to: string): number | null => {
    // Temperature conversion logic (simplified)
    if (from === to) return value;
    
    // Convert to Celsius first, then to target
    let celsius = value;
    if (from === 'f') celsius = (value - 32) * 5/9;
    if (from === 'k') celsius = value - 273.15;
    
    if (to === 'c') return celsius;
    if (to === 'f') return (celsius * 9/5) + 32;
    if (to === 'k') return celsius + 273.15;
    
    return null;
  };

  const calculateStandardConversion = (value: number, from: string, to: string): number | null => {
    const unitsMap = currentCategory.units as Record<string, UnitDefinition>;
    const fromUnitData = unitsMap[from];
    const toUnitData = unitsMap[to];
    
    if (!fromUnitData || !toUnitData) return null;
    
    const baseValue = value * (fromUnitData.toBase as number);
    return baseValue / (toUnitData.toBase as number);
  };

  const quickConversions = getQuickConversions();

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-violet-700">
            <Calculator className="h-5 w-5" />
            {t('title', { fallback: 'Unit Converter' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              {t('category', { fallback: 'Category' })}
            </Label>
            <Select value={selectedCategory} onValueChange={(value) => {
              setSelectedCategory(value as CategoryKey);
              // Reset units when category changes
              const newCategory = UNIT_CATEGORIES[value as CategoryKey];
              const firstUnit = Object.keys(newCategory.units)[0];
              const secondUnit = Object.keys(newCategory.units)[1] || firstUnit;
              setFromUnit(firstUnit);
              setToUnit(secondUnit);
              setResult(null);
            }}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(UNIT_CATEGORIES).map(([key, category]) => (
                  <SelectItem key={key} value={key}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conversion Input */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <Label htmlFor="value" className="text-sm font-medium text-gray-700">
                {t('value', { fallback: 'Value' })}
              </Label>
              <Input
                id="value"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('enter_value', { fallback: 'Enter value' })}
                className="text-lg"
              />
            </div>

            <div>
              <Label htmlFor="from-unit" className="text-sm font-medium text-gray-700">
                {t('from', { fallback: 'From' })}
              </Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger id="from-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapUnits}
                className="h-10 w-10 rounded-full border-violet-200 hover:bg-violet-50"
                title={t('swap_units', { fallback: 'Swap units' })}
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Label htmlFor="to-unit" className="text-sm font-medium text-gray-700">
                {t('to', { fallback: 'To' })}
              </Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger id="to-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleCalculate} 
              className="flex-1 bg-violet-600 hover:bg-violet-700"
              disabled={!inputValue || isNaN(Number(inputValue))}
            >
              <Calculator className="mr-2 h-4 w-4" />
              {t('convert', { fallback: 'Convert' })}
            </Button>
            <Button variant="outline" onClick={resetCalculator}>
              {t('reset', { fallback: 'Reset' })}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center justify-between">
              {t('result', { fallback: 'Result' })}
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {result.category}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-700 mb-2">
                {result.value.toLocaleString(undefined, { 
                  maximumFractionDigits: 6,
                  minimumFractionDigits: 0 
                })} {result.toUnit}
              </div>
              <div className="text-gray-600">
                {inputValue} {result.fromUnit} = {result.value.toLocaleString(undefined, { 
                  maximumFractionDigits: 6,
                  minimumFractionDigits: 0 
                })} {result.toUnit}
              </div>
            </div>

            {result.formula && (
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFormula(!showFormula)}
                  className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Info className="mr-2 h-4 w-4" />
                  {showFormula ? t('hide_formula', { fallback: 'Hide Formula' }) : t('show_formula', { fallback: 'Show Formula' })}
                </Button>
                
                {showFormula && (
                  <div className="mt-3 p-3 bg-green-100 rounded-lg">
                    <div className="text-sm font-mono text-green-800">
                      {result.formula}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Conversions */}
      {quickConversions.length > 0 && inputValue && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700">
              {t('quick_conversions', { fallback: 'Quick Conversions' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {quickConversions.map((conversion) => (
                <div 
                  key={conversion.unit}
                  className="p-3 bg-gray-50 rounded-lg text-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setToUnit(conversion.unit);
                    handleCalculate();
                  }}
                >
                  <div className="font-semibold text-gray-700">
                    {conversion.value.toLocaleString(undefined, { 
                      maximumFractionDigits: 4,
                      minimumFractionDigits: 0 
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {conversion.symbol}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}