// src/components/calculators/VolumeCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Box, Cylinder, Pyramid, Circle } from 'lucide-react';

interface VolumeResult {
  volume: number;
  surfaceArea: number;
  shape: string;
  dimensions: Record<string, number>;
  isValid: boolean;
}

const VolumeCalculator: React.FC = () => {
  const t = useTranslations();
  const [shape, setShape] = useState<string>('cube');
  
  // Cube/Rectangular prism dimensions
  const [length, setLength] = useState<string>('10');
  const [width, setWidth] = useState<string>('8');
  const [height, setHeight] = useState<string>('6');
  
  // Sphere dimensions
  const [radius, setRadius] = useState<string>('5');
  
  // Cylinder dimensions
  const [cylRadius, setCylRadius] = useState<string>('4');
  const [cylHeight, setCylHeight] = useState<string>('10');
  
  // Cone dimensions
  const [coneRadius, setConeRadius] = useState<string>('3');
  const [coneHeight, setConeHeight] = useState<string>('8');
  
  const [result, setResult] = useState<VolumeResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format volume
  const formatVolume = (volume: number): string => {
    return volume.toLocaleString('cs-CZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' m³';
  };

  // Format surface area
  const formatSurfaceArea = (area: number): string => {
    return area.toLocaleString('cs-CZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' m²';
  };

  // Validation function
  const validateInputs = (shapeType: string) => {
    const newErrors: Record<string, string> = {};
    
    if (shapeType === 'cube' || shapeType === 'rectangular') {
      const lengthNum = parseFloat(length);
      const widthNum = parseFloat(width);
      const heightNum = parseFloat(height);
      
      if (!length || isNaN(lengthNum) || lengthNum <= 0) {
        newErrors.length = 'Zadejte platnou délku';
      }
      if (shapeType === 'rectangular') {
        if (!width || isNaN(widthNum) || widthNum <= 0) {
          newErrors.width = 'Zadejte platnou šířku';
        }
        if (!height || isNaN(heightNum) || heightNum <= 0) {
          newErrors.height = 'Zadejte platnou výšku';
        }
      }
    } else if (shapeType === 'sphere') {
      const radiusNum = parseFloat(radius);
      
      if (!radius || isNaN(radiusNum) || radiusNum <= 0) {
        newErrors.radius = 'Zadejte platný poloměr';
      }
    } else if (shapeType === 'cylinder') {
      const radiusNum = parseFloat(cylRadius);
      const heightNum = parseFloat(cylHeight);
      
      if (!cylRadius || isNaN(radiusNum) || radiusNum <= 0) {
        newErrors.cylRadius = 'Zadejte platný poloměr';
      }
      if (!cylHeight || isNaN(heightNum) || heightNum <= 0) {
        newErrors.cylHeight = 'Zadejte platnou výšku';
      }
    } else if (shapeType === 'cone') {
      const radiusNum = parseFloat(coneRadius);
      const heightNum = parseFloat(coneHeight);
      
      if (!coneRadius || isNaN(radiusNum) || radiusNum <= 0) {
        newErrors.coneRadius = 'Zadejte platný poloměr';
      }
      if (!coneHeight || isNaN(heightNum) || heightNum <= 0) {
        newErrors.coneHeight = 'Zadejte platnou výšku';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate cube volume
  const calculateCube = (side: number): VolumeResult => {
    const volume = side * side * side;
    const surfaceArea = 6 * side * side;
    
    return {
      volume,
      surfaceArea,
      shape: 'cube',
      dimensions: { side },
      isValid: true
    };
  };

  // Calculate rectangular prism volume
  const calculateRectangular = (l: number, w: number, h: number): VolumeResult => {
    const volume = l * w * h;
    const surfaceArea = 2 * (l * w + l * h + w * h);
    
    return {
      volume,
      surfaceArea,
      shape: 'rectangular',
      dimensions: { length: l, width: w, height: h },
      isValid: true
    };
  };

  // Calculate sphere volume
  const calculateSphere = (r: number): VolumeResult => {
    const volume = (4 / 3) * Math.PI * r * r * r;
    const surfaceArea = 4 * Math.PI * r * r;
    
    return {
      volume,
      surfaceArea,
      shape: 'sphere',
      dimensions: { radius: r },
      isValid: true
    };
  };

  // Calculate cylinder volume
  const calculateCylinder = (r: number, h: number): VolumeResult => {
    const volume = Math.PI * r * r * h;
    const surfaceArea = 2 * Math.PI * r * (r + h);
    
    return {
      volume,
      surfaceArea,
      shape: 'cylinder',
      dimensions: { radius: r, height: h },
      isValid: true
    };
  };

  // Calculate cone volume
  const calculateCone = (r: number, h: number): VolumeResult => {
    const volume = (1 / 3) * Math.PI * r * r * h;
    const slantHeight = Math.sqrt(r * r + h * h);
    const surfaceArea = Math.PI * r * (r + slantHeight);
    
    return {
      volume,
      surfaceArea,
      shape: 'cone',
      dimensions: { radius: r, height: h },
      isValid: true
    };
  };

  // Get shape description
  const getShapeDescription = (shapeType: string): string => {
    switch (shapeType) {
      case 'cube': return 'Krychle';
      case 'rectangular': return 'Kvádr';
      case 'sphere': return 'Koule';
      case 'cylinder': return 'Válec';
      case 'cone': return 'Kužel';
      default: return 'Krychle';
    }
  };

  // Get shape icon
  const getShapeIcon = (shapeType: string) => {
    switch (shapeType) {
      case 'cube': return <Box className="w-6 h-6 text-green-600" />;
      case 'rectangular': return <Box className="w-6 h-6 text-green-600" />;
      case 'sphere': return <Circle className="w-6 h-6 text-green-600" />;
      case 'cylinder': return <Cylinder className="w-6 h-6 text-green-600" />;
      case 'cone': return <Pyramid className="w-6 h-6 text-green-600" />;
      default: return <Box className="w-6 h-6 text-green-600" />;
    }
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(shape)) {
      let calculatedResult: VolumeResult;

      if (shape === 'cube') {
        const side = parseFloat(length);
        calculatedResult = calculateCube(side);
      } else if (shape === 'rectangular') {
        const l = parseFloat(length);
        const w = parseFloat(width);
        const h = parseFloat(height);
        calculatedResult = calculateRectangular(l, w, h);
      } else if (shape === 'sphere') {
        const r = parseFloat(radius);
        calculatedResult = calculateSphere(r);
      } else if (shape === 'cylinder') {
        const r = parseFloat(cylRadius);
        const h = parseFloat(cylHeight);
        calculatedResult = calculateCylinder(r, h);
      } else {
        const r = parseFloat(coneRadius);
        const h = parseFloat(coneHeight);
        calculatedResult = calculateCone(r, h);
      }

      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [shape, length, width, height, radius, cylRadius, cylHeight, coneRadius, coneHeight]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Shape Selection */}
      <div className="space-y-2">
        <Label htmlFor="shape" className="text-sm font-medium">
          3D tvar
        </Label>
        <Select value={shape} onValueChange={setShape}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte tvar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cube">Krychle</SelectItem>
            <SelectItem value="rectangular">Kvádr</SelectItem>
            <SelectItem value="sphere">Koule</SelectItem>
            <SelectItem value="cylinder">Válec</SelectItem>
            <SelectItem value="cone">Kužel</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {getShapeDescription(shape)} - výpočet objemu a povrchu
        </p>
      </div>

      {/* Dynamic inputs based on shape */}
      {shape === 'cube' && (
        <div className="space-y-2">
          <Label htmlFor="length" className="text-sm font-medium">Hrana (m)</Label>
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
      )}

      {shape === 'rectangular' && (
        <div className="space-y-4">
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
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium">Výška (m)</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="6"
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
        </div>
      )}

      {shape === 'sphere' && (
        <div className="space-y-2">
          <Label htmlFor="radius" className="text-sm font-medium">Poloměr (m)</Label>
          <Input
            id="radius"
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            placeholder="5"
            className={`${errors.radius ? 'border-red-500' : ''}`}
            min="0"
            step="0.1"
          />
          {errors.radius && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.radius}
            </p>
          )}
        </div>
      )}

      {shape === 'cylinder' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cylRadius" className="text-sm font-medium">Poloměr (m)</Label>
            <Input
              id="cylRadius"
              type="number"
              value={cylRadius}
              onChange={(e) => setCylRadius(e.target.value)}
              placeholder="4"
              className={`${errors.cylRadius ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.cylRadius && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.cylRadius}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cylHeight" className="text-sm font-medium">Výška (m)</Label>
            <Input
              id="cylHeight"
              type="number"
              value={cylHeight}
              onChange={(e) => setCylHeight(e.target.value)}
              placeholder="10"
              className={`${errors.cylHeight ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.cylHeight && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.cylHeight}
              </p>
            )}
          </div>
        </div>
      )}

      {shape === 'cone' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coneRadius" className="text-sm font-medium">Poloměr základny (m)</Label>
            <Input
              id="coneRadius"
              type="number"
              value={coneRadius}
              onChange={(e) => setConeRadius(e.target.value)}
              placeholder="3"
              className={`${errors.coneRadius ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.coneRadius && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.coneRadius}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="coneHeight" className="text-sm font-medium">Výška (m)</Label>
            <Input
              id="coneHeight"
              type="number"
              value={coneHeight}
              onChange={(e) => setConeHeight(e.target.value)}
              placeholder="8"
              className={`${errors.coneHeight ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.coneHeight && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.coneHeight}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2 flex items-center justify-center gap-2">
              {getShapeIcon(shape)}
              Výpočet objemu - {getShapeDescription(shape)}
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {shape === 'cube' && `hrana ${length} m`}
              {shape === 'rectangular' && `${length} × ${width} × ${height} m`}
              {shape === 'sphere' && `r = ${radius} m`}
              {shape === 'cylinder' && `r = ${cylRadius} m, v = ${cylHeight} m`}
              {shape === 'cone' && `r = ${coneRadius} m, v = ${coneHeight} m`}
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
              Objem {getShapeDescription(result.shape).toLowerCase()}
            </div>
          </div>
          {getShapeIcon(result.shape)}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">
              {formatVolume(result.volume)}
            </div>
            <div className="text-sm text-blue-700 mt-1">Objem</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800">
              {formatSurfaceArea(result.surfaceArea)}
            </div>
            <div className="text-sm text-purple-700 mt-1">Povrch</div>
          </CardContent>
        </Card>
      </div>

      {/* Calculation Details */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Detailní výpočet</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Tvar:</span>
                  <span className="font-mono">{getShapeDescription(result.shape)}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>Objem:</span>
                  <span className="font-mono">{formatVolume(result.volume)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Povrch:</span>
                  <span className="font-mono">{formatSurfaceArea(result.surfaceArea)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volume Conversions */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Převody objemu</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="font-medium text-gray-800">{(result.volume * 1000).toLocaleString('cs-CZ', { maximumFractionDigits: 0 })}</div>
              <div className="text-gray-600 text-xs">litrů</div>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="font-medium text-gray-800">{(result.volume * 1000000).toLocaleString('cs-CZ', { maximumFractionDigits: 0 })}</div>
              <div className="text-gray-600 text-xs">cm³</div>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="font-medium text-gray-800">{(result.volume / 1000000).toLocaleString('cs-CZ', { maximumFractionDigits: 6 })}</div>
              <div className="text-gray-600 text-xs">km³</div>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="font-medium text-gray-800">{(result.volume * 264.172).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })}</div>
              <div className="text-gray-600 text-xs">galonů (US)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <Box className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>Zadejte rozměry pro výpočet objemu</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title="Kalkulátor objemu"
      description="Vypočítejte objem a povrch 3D těles - krychle, kvádru, koule, válce a kužele. Užitečné pro stavebnictví a průmysl."
      category="Stavební"
      seo={{
        title: "Kalkulátor objemu - Výpočet objemu krychle, koule, válce | MathCalc",
        description: "Bezplatný kalkulátor objemu. Vypočítejte objem a povrch krychle, kvádru, koule, válce a kužele s převody jednotek.",
        keywords: ["objem", "povrch", "krychle", "kvádr", "koule", "válec", "kužel", "geometrie", "stavebnictví", "kalkulátor objemu"]
      }}
      formula={{
        latex: "V_{krychle} = a^3 \\quad V_{koule} = \\frac{4}{3}\\pi r^3 \\quad V_{válec} = \\pi r^2 h",
        description: "Vzorce pro výpočet objemu různých 3D geometrických těles podle jejich specifických rozměrů."
      }}
      examples={{
        title: "Příklady výpočtu objemu",
        description: "Praktické použití kalkulátoru objemu",
        scenarios: [
          {
            title: "Betonová deska",
            description: "Kvádr 10 × 8 × 0,2 m = 16 m³",
            example: "Objem betonu pro podlahovou desku"
          },
          {
            title: "Kruhová nádrž",
            description: "Válec r = 2 m, v = 3 m = 37,7 m³",
            example: "Kapacita vodní nádrže"
          },
          {
            title: "Kuličková hala",
            description: "Koule r = 10 m = 4 189 m³",
            example: "Objem vzduchu ve sportovní hale"
          }
        ]
      }}
      faq={[
        {
          question: "Jak vypočítat objem nepravidelného tělesa?",
          answer: "Nepravidelné těleso rozdělte na menší pravidelné části (krychle, kvádry, válce), vypočítejte jejich objemy a sečtěte je."
        },
        {
          question: "Jaký je rozdíl mezi objemem a povrchem?",
          answer: "Objem je velikost prostoru uvnitř tělesa (m³), povrch je velikost vnější plochy tělesa (m²). Objem se používá pro kapacitu, povrch pro nátěry."
        },
        {
          question: "Jak převést jednotky objemu?",
          answer: "1 m³ = 1000 litrů = 1 000 000 cm³. Při převodu se násobí/dělí třetí mocninou převodního čísla."
        },
        {
          question: "Kolik materiálu potřebuji na daný objem?",
          answer: "Závisí na typu materiálu. Například beton má hustotu cca 2400 kg/m³, voda 1000 kg/m³. Vždy přidejte rezervu 5-10%."
        }
      ]}
      relatedCalculators={[
        {
          title: "Kalkulátor plochy",
          description: "Výpočet plochy 2D tvarů",
          href: "/calculator/stavebni/plocha",
          category: "Stavební"
        },
        {
          title: "Převodník jednotek",
          description: "Převod mezi různými jednotkami",
          href: "/calculator/prevodnik-jednotek",
          category: "Praktické"
        },
        {
          title: "Kalkulátor materiálů",
          description: "Výpočet potřeby stavebních materiálů",
          href: "/calculator/stavebni/materialy",
          category: "Stavební"
        },
        {
          title: "Pythagorova věta",
          description: "Výpočet stran pravoúhlého trojúhelníku",
          href: "/calculator/matematicke/pythagoras",
          category: "Matematické"
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

export default VolumeCalculator;
