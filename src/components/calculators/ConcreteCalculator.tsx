// src/components/calculators/ConcreteCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Truck, Package, Building } from 'lucide-react';

interface ConcreteResult {
  volume: number;
  cement: number;
  sand: number;
  gravel: number;
  water: number;
  cost: number;
  concreteType: string;
  isValid: boolean;
}

const ConcreteCalculator: React.FC = () => {
  const t = useTranslations();
  const [calculationType, setCalculationType] = useState<string>('slab');
  const [concreteGrade, setConcreteGrade] = useState<string>('C20/25');
  
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

  // Concrete mix ratios
  const concreteGrades = {
    'C12/15': { cement: 1, sand: 3, gravel: 6, strength: 'Nízká pevnost', use: 'Podkladní betony' },
    'C16/20': { cement: 1, sand: 2.5, gravel: 5, strength: 'Střední pevnost', use: 'Základy, podlahy' },
    'C20/25': { cement: 1, sand: 2, gravel: 4, strength: 'Vysoká pevnost', use: 'Nosné konstrukce' },
    'C25/30': { cement: 1, sand: 1.5, gravel: 3, strength: 'Velmi vysoká', use: 'Sloupy, průvlaky' },
    'C30/37': { cement: 1, sand: 1.5, gravel: 2.5, strength: 'Extrémní pevnost', use: 'Speciální konstrukce' }
  };

  // Format functions
  const formatVolume = (volume: number): string => {
    return volume.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' m³';
  };

  const formatWeight = (weight: number): string => {
    return weight.toLocaleString('cs-CZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' kg';
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('cs-CZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' Kč';
  };

  // Validation function
  const validateInputs = (type: string) => {
    const newErrors: Record<string, string> = {};
    
    if (type === 'slab') {
      const lengthNum = parseFloat(length);
      const widthNum = parseFloat(width);
      const thicknessNum = parseFloat(thickness);
      
      if (!length || isNaN(lengthNum) || lengthNum <= 0) newErrors.length = 'Zadejte platnou délku';
      if (!width || isNaN(widthNum) || widthNum <= 0) newErrors.width = 'Zadejte platnou šířku';
      if (!thickness || isNaN(thicknessNum) || thicknessNum <= 0) newErrors.thickness = 'Zadejte platnou tloušťku';
    } else if (type === 'column') {
      const diameterNum = parseFloat(diameter);
      const heightNum = parseFloat(height);
      const quantityNum = parseFloat(quantity);
      
      if (!diameter || isNaN(diameterNum) || diameterNum <= 0) newErrors.diameter = 'Zadejte platný průměr';
      if (!height || isNaN(heightNum) || heightNum <= 0) newErrors.height = 'Zadejte platnou výšku';
      if (!quantity || isNaN(quantityNum) || quantityNum <= 0) newErrors.quantity = 'Zadejte platný počet';
    }

    const cementPriceNum = parseFloat(cementPrice);
    const sandPriceNum = parseFloat(sandPrice);
    const gravelPriceNum = parseFloat(gravelPrice);

    if (!cementPrice || isNaN(cementPriceNum) || cementPriceNum <= 0) newErrors.cementPrice = 'Zadejte platnou cenu cementu';
    if (!sandPrice || isNaN(sandPriceNum) || sandPriceNum <= 0) newErrors.sandPrice = 'Zadejte platnou cenu písku';
    if (!gravelPrice || isNaN(gravelPriceNum) || gravelPriceNum <= 0) newErrors.gravelPrice = 'Zadejte platnou cenu štěrku';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate concrete needs
  const calculateConcrete = (
    volume: number,
    grade: keyof typeof concreteGrades,
    cementPricePerKg: number,
    sandPricePerM3: number,
    gravelPricePerM3: number
  ): ConcreteResult => {
    const mix = concreteGrades[grade];
    const totalRatio = mix.cement + mix.sand + mix.gravel;
    
    // Calculate material volumes (with 5% waste)
    const wasteMultiplier = 1.05;
    const cementVolume = (volume * mix.cement / totalRatio) * wasteMultiplier;
    const sandVolume = (volume * mix.sand / totalRatio) * wasteMultiplier;
    const gravelVolume = (volume * mix.gravel / totalRatio) * wasteMultiplier;
    
    // Convert to weights
    const cementWeight = cementVolume * 1500;
    const sandWeight = sandVolume * 1600;
    const gravelWeight = gravelVolume * 1600;
    const waterWeight = cementWeight * 0.5;
    
    // Cost calculation
    const cementCost = (cementWeight / 1000) * cementPricePerKg;
    const sandCost = sandVolume * sandPricePerM3;
    const gravelCost = gravelVolume * gravelPricePerM3;
    const totalCost = cementCost + sandCost + gravelCost;

    return {
      volume: volume * wasteMultiplier,
      cement: cementWeight,
      sand: sandWeight,
      gravel: gravelWeight,
      water: waterWeight,
      cost: totalCost,
      concreteType: grade,
      isValid: true
    };
  };

  // Get calculation type description
  const getCalculationDescription = (type: string): string => {
    switch (type) {
      case 'slab': return 'Betonová deska';
      case 'column': return 'Betonové sloupy';
      default: return 'Betonová deska';
    }
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(calculationType)) {
      let volume = 0;
      
      if (calculationType === 'slab') {
        const l = parseFloat(length);
        const w = parseFloat(width);
        const t = parseFloat(thickness);
        volume = l * w * t;
      } else if (calculationType === 'column') {
        const d = parseFloat(diameter);
        const h = parseFloat(height);
        const q = parseFloat(quantity);
        const radius = d / 2;
        volume = Math.PI * radius * radius * h * q;
      }

      const cementPriceNum = parseFloat(cementPrice);
      const sandPriceNum = parseFloat(sandPrice);
      const gravelPriceNum = parseFloat(gravelPrice);

      const calculatedResult = calculateConcrete(
        volume,
        concreteGrade as keyof typeof concreteGrades,
        cementPriceNum,
        sandPriceNum,
        gravelPriceNum
      );
      
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [calculationType, concreteGrade, length, width, thickness, diameter, height, quantity, cementPrice, sandPrice, gravelPrice]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Calculation Type */}
      <div className="space-y-2">
        <Label htmlFor="calculationType" className="text-sm font-medium">Typ konstrukce</Label>
        <Select value={calculationType} onValueChange={setCalculationType}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte typ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="slab">Betonová deska</SelectItem>
            <SelectItem value="column">Betonové sloupy</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">{getCalculationDescription(calculationType)}</p>
      </div>

      {/* Concrete Grade */}
      <div className="space-y-2">
        <Label htmlFor="concreteGrade" className="text-sm font-medium">Třída betonu</Label>
        <Select value={concreteGrade} onValueChange={setConcreteGrade}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte třídu" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(concreteGrades).map(([grade, info]) => (
              <SelectItem key={grade} value={grade}>
                <div className="flex flex-col">
                  <span>{grade}</span>
                  <span className="text-xs text-gray-500">{info.use}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {concreteGrades[concreteGrade as keyof typeof concreteGrades].strength} - {concreteGrades[concreteGrade as keyof typeof concreteGrades].use}
        </p>
      </div>

      {/* Dimension Inputs */}
      {calculationType === 'slab' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length" className="text-sm font-medium">Délka (m)</Label>
              <Input
                id="length"
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="10"
                className={`${errors.length ? 'border-red-500' : ''}`}
                min="0"
                step="0.1"
              />
              {errors.length && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.length}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="width" className="text-sm font-medium">Šířka (m)</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="8"
                className={`${errors.width ? 'border-red-500' : ''}`}
                min="0"
                step="0.1"
              />
              {errors.width && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.width}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="thickness" className="text-sm font-medium">Tloušťka (m)</Label>
            <Input
              id="thickness"
              type="number"
              value={thickness}
              onChange={(e) => setThickness(e.target.value)}
              placeholder="0.15"
              className={`${errors.thickness ? 'border-red-500' : ''}`}
              min="0"
              step="0.01"
            />
            {errors.thickness && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.thickness}
              </p>
            )}
          </div>
        </div>
      )}

      {calculationType === 'column' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diameter" className="text-sm font-medium">Průměr (m)</Label>
              <Input
                id="diameter"
                type="number"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                placeholder="0.3"
                className={`${errors.diameter ? 'border-red-500' : ''}`}
                min="0"
                step="0.01"
              />
              {errors.diameter && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.diameter}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm font-medium">Výška (m)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="3"
                className={`${errors.height ? 'border-red-500' : ''}`}
                min="0"
                step="0.1"
              />
              {errors.height && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.height}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">Počet sloupů</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="4"
                className={`${errors.quantity ? 'border-red-500' : ''}`}
                min="1"
                step="1"
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.quantity}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Material Prices */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Ceny materiálů</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cementPrice" className="text-sm font-medium">Cement (Kč/kg)</Label>
            <Input
              id="cementPrice"
              type="number"
              value={cementPrice}
              onChange={(e) => setCementPrice(e.target.value)}
              placeholder="150"
              className={`${errors.cementPrice ? 'border-red-500' : ''}`}
              min="0"
              step="1"
            />
            {errors.cementPrice && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.cementPrice}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sandPrice" className="text-sm font-medium">Písek (Kč/m³)</Label>
            <Input
              id="sandPrice"
              type="number"
              value={sandPrice}
              onChange={(e) => setSandPrice(e.target.value)}
              placeholder="400"
              className={`${errors.sandPrice ? 'border-red-500' : ''}`}
              min="0"
              step="1"
            />
            {errors.sandPrice && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.sandPrice}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gravelPrice" className="text-sm font-medium">Štěrk (Kč/m³)</Label>
            <Input
              id="gravelPrice"
              type="number"
              value={gravelPrice}
              onChange={(e) => setGravelPrice(e.target.value)}
              placeholder="350"
              className={`${errors.gravelPrice ? 'border-red-500' : ''}`}
              min="0"
              step="1"
            />
            {errors.gravelPrice && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.gravelPrice}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2 flex items-center justify-center gap-2">
              <Building className="w-5 h-5" />
              Výpočet betonu - {getCalculationDescription(calculationType)}
            </div>
            <div className="text-lg font-semibold text-blue-900">
              Třída {concreteGrade} • {getCalculationDescription(calculationType)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Results section
  const resultsSection = result ? (
    <div className="space-y-6">
      {/* Main Result */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">
              {formatVolume(result.volume)}
            </div>
            <div className="text-sm text-green-700 mt-1">
              Potřebný objem betonu
            </div>
            <div className="text-xs text-green-600 mt-1">
              Třída {result.concreteType} (včetně 5% odpadu)
            </div>
          </div>
          <Truck className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Material Requirements */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4 text-center">
            <Package className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-800">
              {formatWeight(result.cement)}
            </div>
            <div className="text-sm text-gray-700 mt-1">Cement</div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <Package className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-yellow-800">
              {formatWeight(result.sand)}
            </div>
            <div className="text-sm text-yellow-700 mt-1">Písek</div>
          </CardContent>
        </Card>

        <Card className="bg-stone-50 border-stone-200">
          <CardContent className="p-4 text-center">
            <Package className="w-6 h-6 text-stone-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-stone-800">
              {formatWeight(result.gravel)}
            </div>
            <div className="text-sm text-stone-700 mt-1">Štěrk</div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-blue-800">
              {formatWeight(result.water)}
            </div>
            <div className="text-sm text-blue-700 mt-1">Voda</div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900 mb-2">
              {formatCurrency(result.cost)}
            </div>
            <div className="text-sm text-green-700">
              Celková cena materiálů
            </div>
            <div className="text-xs text-green-600 mt-1">
              Bez dopravy a práce
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Details */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Detailní výpočet</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Typ konstrukce:</span>
                  <span className="font-mono">{getCalculationDescription(calculationType)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Třída betonu:</span>
                  <span className="font-mono">{result.concreteType}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>Objem s odpadem:</span>
                  <span className="font-mono">{formatVolume(result.volume)}</span>
                </div>
                <div className="flex justify-between font-semibold text-green-700">
                  <span>Celková cena:</span>
                  <span className="font-mono">{formatCurrency(result.cost)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>Zadejte parametry pro výpočet betonu</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title="Kalkulátor betonu"
      description="Vypočítejte potřebné množství betonu a materiálů pro stavbu. Betonové desky, sloupy s různými třídami betonu."
      category="Stavební"
      seo={{
        title: "Kalkulátor betonu - Výpočet materiálů pro beton | MathCalc",
        description: "Bezplatný kalkulátor betonu. Vypočítejte cement, písek, štěrk a vodu pro různé třídy betonu a konstrukce.",
        keywords: ["beton", "cement", "písek", "štěrk", "stavba", "betonová deska", "sloupy", "kalkulátor betonu", "stavební materiály"]
      }}
      formula={{
        latex: "V_{beton} = V_{konstrukce} \\times 1.05 \\quad M_{cement} = \\frac{V \\times poměr_{cement}}{celkový\\,poměr} \\times 1500",
        description: "Objem betonu se počítá s 5% odpadem, hmotnosti materiálů podle směšovacích poměrů a hustot."
      }}
      examples={{
        title: "Příklady výpočtu betonu",
        description: "Praktické použití kalkulátoru betonu",
        scenarios: [
          {
            title: "Podlahová deska",
            description: "10×8×0,15 m = 12,6 m³ betonu C20/25",
            example: "Betonová deska pro rodinný dům"
          },
          {
            title: "Betonové sloupy",
            description: "4 sloupy ⌀30 cm, v=3 m = 0,85 m³ betonu C25/30",
            example: "Nosné sloupy pro pergolu"
          },
          {
            title: "Základové pásy",
            description: "12×0,6×0,8 m = 6,05 m³ betonu C16/20",
            example: "Základy pro zahradní domek"
          }
        ]
      }}
      faq={[
        {
          question: "Jakou třídu betonu vybrat?",
          answer: "C12/15 pro podklady, C16/20 pro základy a podlahy, C20/25 pro nosné konstrukce, C25/30 pro sloupy a průvlaky, C30/37 pro speciální konstrukce."
        },
        {
          question: "Jak se míchá beton?",
          answer: "Nejprve smíchejte suché složky (cement, písek, štěrk), pak postupně přidávejte vodu. Míchejte dokud není směs homogenní."
        },
        {
          question: "Kolik vody přidat do betonu?",
          answer: "Vodní součinitel w/c = 0,5 znamená 0,5 kg vody na 1 kg cementu. Příliš mnoho vody snižuje pevnost betonu."
        },
        {
          question: "Jak dlouho beton tvrdne?",
          answer: "Počáteční tvrdnutí 24-48 hodin, konečná pevnost za 28 dní. Chraňte před rychlým schnutím a mrazem."
        }
      ]}
      relatedCalculators={[
        {
          title: "Kalkulátor materiálů",
          description: "Výpočet stavebních materiálů",
          href: "/calculator/stavebni/materialy",
          category: "Stavební"
        },
        {
          title: "Kalkulátor objemu",
          description: "Výpočet objemu 3D těles",
          href: "/calculator/stavebni/objem",
          category: "Stavební"
        },
        {
          title: "Kalkulátor plochy",
          description: "Výpočet plochy různých tvarů",
          href: "/calculator/stavebni/plocha",
          category: "Stavební"
        },
        {
          title: "Převodník jednotek",
          description: "Převod mezi různými jednotkami",
          href: "/calculator/prevodnik-jednotek",
          category: "Praktické"
        }
      ]}
      schemaData={{
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any"
      }}
      resultSection={resultsSection}
    >
      {calculatorForm}
    </SimpleCalculatorLayout>
  );
};

export default ConcreteCalculator;
