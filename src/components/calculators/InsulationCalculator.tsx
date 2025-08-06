// src/components/calculators/InsulationCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Thermometer, Shield, Snowflake } from 'lucide-react';

interface InsulationResult {
  area: number;
  thickness: number;
  volume: number;
  thermalResistance: number;
  uValue: number;
  cost: number;
  energySavings: number;
  insulationType: string;
  applicationArea: string;
  isValid: boolean;
}

const InsulationCalculator: React.FC = () => {
  const t = useTranslations();
  const [applicationType, setApplicationType] = useState<string>('wall');
  const [insulationType, setInsulationType] = useState<string>('eps');
  const [area, setArea] = useState<string>('100');
  const [currentUValue, setCurrentUValue] = useState<string>('1.2');
  const [targetUValue, setTargetUValue] = useState<string>('0.3');
  const [pricePerM2, setPricePerM2] = useState<string>('250');
  const [energyPrice, setEnergyPrice] = useState<string>('6');
  
  const [result, setResult] = useState<InsulationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Insulation materials and their properties
  const insulationMaterials = {
    eps: { name: 'Polystyren (EPS)', lambda: 0.04, use: 'Fasády, podlahy' },
    xps: { name: 'Extrudovaný polystyren (XPS)', lambda: 0.035, use: 'Vlhké prostředí, sokly' },
    mineralWool: { name: 'Minerální vata', lambda: 0.045, use: 'Střechy, stěny, akustika' },
    polyurethane: { name: 'Polyuretanová pěna (PUR)', lambda: 0.025, use: 'Vysoké nároky na izolaci' },
    woodFiber: { name: 'Dřevovláknité desky', lambda: 0.05, use: 'Ekologické stavby' }
  };

  // Application areas
  const applicationAreas = {
    wall: { name: 'Obvodové stěny', currentUTypical: 1.2, targetURequired: 0.3 },
    roof: { name: 'Střecha', currentUTypical: 1.5, targetURequired: 0.24 },
    floor: { name: 'Podlaha', currentUTypical: 1.0, targetURequired: 0.45 },
    ceiling: { name: 'Strop', currentUTypical: 1.8, targetURequired: 0.3 }
  };

  // Format functions
  const formatArea = (area: number): string => area.toLocaleString('cs-CZ') + ' m²';
  const formatThickness = (thickness: number): string => (thickness * 1000).toLocaleString('cs-CZ', { maximumFractionDigits: 0 }) + ' mm';
  const formatVolume = (volume: number): string => volume.toLocaleString('cs-CZ', { maximumFractionDigits: 2 }) + ' m³';
  const formatUValue = (uValue: number): string => uValue.toLocaleString('cs-CZ', { maximumFractionDigits: 2 }) + ' W/m²K';
  const formatResistance = (resistance: number): string => resistance.toLocaleString('cs-CZ', { maximumFractionDigits: 2 }) + ' m²K/W';
  const formatCurrency = (amount: number): string => amount.toLocaleString('cs-CZ', { maximumFractionDigits: 0 }) + ' Kč';

  // Validation function
  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    const areaNum = parseFloat(area);
    const currentUNum = parseFloat(currentUValue);
    const targetUNum = parseFloat(targetUValue);
    const priceNum = parseFloat(pricePerM2);
    const energyPriceNum = parseFloat(energyPrice);

    if (!area || isNaN(areaNum) || areaNum <= 0) newErrors.area = 'Zadejte platnou plochu';
    if (!currentUValue || isNaN(currentUNum) || currentUNum <= 0) newErrors.currentUValue = 'Zadejte platnou současnou U-hodnotu';
    if (!targetUValue || isNaN(targetUNum) || targetUNum <= 0) newErrors.targetUValue = 'Zadejte platnou cílovou U-hodnotu';
    else if (targetUNum >= currentUNum) newErrors.targetUValue = 'Cílová U-hodnota musí být nižší než současná';
    if (!pricePerM2 || isNaN(priceNum) || priceNum <= 0) newErrors.pricePerM2 = 'Zadejte platnou cenu';
    if (!energyPrice || isNaN(energyPriceNum) || energyPriceNum <= 0) newErrors.energyPrice = 'Zadejte platnou cenu energie';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate insulation requirements
  const calculateInsulation = (
    areaValue: number,
    currentU: number,
    targetU: number,
    material: typeof insulationMaterials[keyof typeof insulationMaterials],
    price: number,
    energyCost: number
  ): InsulationResult => {
    const currentR = 1 / currentU;
    const targetR = 1 / targetU;
    const requiredR = targetR - currentR;
    const requiredThickness = requiredR * material.lambda;
    const volume = areaValue * requiredThickness;
    const totalCost = areaValue * price;
    
    // Energy savings calculation
    const temperatureDifference = 20;
    const heatingDays = 200;
    const hoursPerDay = 24;
    const currentHeatLoss = currentU * areaValue * temperatureDifference * heatingDays * hoursPerDay / 1000;
    const newHeatLoss = targetU * areaValue * temperatureDifference * heatingDays * hoursPerDay / 1000;
    const energySavingsKWh = currentHeatLoss - newHeatLoss;
    const annualSavings = energySavingsKWh * energyCost;

    return {
      area: areaValue,
      thickness: requiredThickness,
      volume: volume,
      thermalResistance: requiredR,
      uValue: targetU,
      cost: totalCost,
      energySavings: annualSavings,
      insulationType: insulationType,
      applicationArea: applicationType,
      isValid: true
    };
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs()) {
      const areaNum = parseFloat(area);
      const currentUNum = parseFloat(currentUValue);
      const targetUNum = parseFloat(targetUValue);
      const priceNum = parseFloat(pricePerM2);
      const energyPriceNum = parseFloat(energyPrice);
      const material = insulationMaterials[insulationType as keyof typeof insulationMaterials];

      const calculatedResult = calculateInsulation(areaNum, currentUNum, targetUNum, material, priceNum, energyPriceNum);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [applicationType, insulationType, area, currentUValue, targetUValue, pricePerM2, energyPrice]);

  // Set typical values when application type changes
  useEffect(() => {
    const appArea = applicationAreas[applicationType as keyof typeof applicationAreas];
    if (appArea) {
      setCurrentUValue(appArea.currentUTypical.toString());
      setTargetUValue(appArea.targetURequired.toString());
    }
  }, [applicationType]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Application Type */}
      <div className="space-y-2">
        <Label htmlFor="applicationType" className="text-sm font-medium">Oblast aplikace</Label>
        <Select value={applicationType} onValueChange={setApplicationType}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte oblast" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(applicationAreas).map(([key, area]) => (
              <SelectItem key={key} value={key}>{area.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Insulation Type */}
      <div className="space-y-2">
        <Label htmlFor="insulationType" className="text-sm font-medium">Typ izolace</Label>
        <Select value={insulationType} onValueChange={setInsulationType}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte materiál" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(insulationMaterials).map(([key, material]) => (
              <SelectItem key={key} value={key}>
                <div className="flex flex-col">
                  <span>{material.name}</span>
                  <span className="text-xs text-gray-500">λ = {material.lambda} W/mK</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Area Input */}
      <div className="space-y-2">
        <Label htmlFor="area" className="text-sm font-medium">Plocha k izolaci (m²)</Label>
        <Input
          id="area"
          type="number"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="100"
          className={`${errors.area ? 'border-red-500' : ''}`}
          min="0"
          step="1"
        />
        {errors.area && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.area}
          </p>
        )}
      </div>

      {/* U-Values */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentUValue" className="text-sm font-medium">Současná U-hodnota (W/m²K)</Label>
          <Input
            id="currentUValue"
            type="number"
            value={currentUValue}
            onChange={(e) => setCurrentUValue(e.target.value)}
            placeholder="1.2"
            className={`${errors.currentUValue ? 'border-red-500' : ''}`}
            min="0"
            step="0.1"
          />
          {errors.currentUValue && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.currentUValue}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetUValue" className="text-sm font-medium">Cílová U-hodnota (W/m²K)</Label>
          <Input
            id="targetUValue"
            type="number"
            value={targetUValue}
            onChange={(e) => setTargetUValue(e.target.value)}
            placeholder="0.3"
            className={`${errors.targetUValue ? 'border-red-500' : ''}`}
            min="0"
            step="0.01"
          />
          {errors.targetUValue && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.targetUValue}
            </p>
          )}
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pricePerM2" className="text-sm font-medium">Cena za m² (Kč)</Label>
          <Input
            id="pricePerM2"
            type="number"
            value={pricePerM2}
            onChange={(e) => setPricePerM2(e.target.value)}
            placeholder="250"
            className={`${errors.pricePerM2 ? 'border-red-500' : ''}`}
            min="0"
            step="1"
          />
          {errors.pricePerM2 && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.pricePerM2}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="energyPrice" className="text-sm font-medium">Cena energie (Kč/kWh)</Label>
          <Input
            id="energyPrice"
            type="number"
            value={energyPrice}
            onChange={(e) => setEnergyPrice(e.target.value)}
            placeholder="6"
            className={`${errors.energyPrice ? 'border-red-500' : ''}`}
            min="0"
            step="0.1"
          />
          {errors.energyPrice && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.energyPrice}
            </p>
          )}
        </div>
      </div>

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2 flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              Výpočet izolace - {applicationAreas[applicationType as keyof typeof applicationAreas].name}
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {insulationMaterials[insulationType as keyof typeof insulationMaterials].name} • {area} m²
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
              {formatThickness(result.thickness)}
            </div>
            <div className="text-sm text-green-700 mt-1">Potřebná tloušťka izolace</div>
            <div className="text-xs text-green-600 mt-1">
              {insulationMaterials[result.insulationType as keyof typeof insulationMaterials].name}
            </div>
          </div>
          <Thermometer className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">{formatArea(result.area)}</div>
            <div className="text-sm text-blue-700 mt-1">Plocha</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800">{formatVolume(result.volume)}</div>
            <div className="text-sm text-purple-700 mt-1">Objem materiálu</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-orange-800">{formatUValue(result.uValue)}</div>
            <div className="text-sm text-orange-700 mt-1">Cílová U-hodnota</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-green-800">{formatResistance(result.thermalResistance)}</div>
            <div className="text-sm text-green-700 mt-1">Tepelný odpor</div>
          </CardContent>
        </Card>
      </div>

      {/* Cost and Savings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-900 mb-2">{formatCurrency(result.cost)}</div>
            <div className="text-sm text-red-700">Investiční náklady</div>
            <div className="text-xs text-red-600 mt-1">Materiál + montáž</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-900 mb-2">{formatCurrency(result.energySavings)}</div>
            <div className="text-sm text-green-700">Roční úspora energie</div>
            <div className="text-xs text-green-600 mt-1">
              Návratnost: {Math.round(result.cost / result.energySavings)} let
            </div>
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
                  <span>Oblast aplikace:</span>
                  <span className="font-mono">{applicationAreas[result.applicationArea as keyof typeof applicationAreas].name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Materiál:</span>
                  <span className="font-mono">{insulationMaterials[result.insulationType as keyof typeof insulationMaterials].name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tepelná vodivost λ:</span>
                  <span className="font-mono">{insulationMaterials[result.insulationType as keyof typeof insulationMaterials].lambda} W/mK</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>Potřebná tloušťka:</span>
                  <span className="font-mono">{formatThickness(result.thickness)}</span>
                </div>
                <div className="flex justify-between font-semibold text-green-700">
                  <span>Roční úspora:</span>
                  <span className="font-mono">{formatCurrency(result.energySavings)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <Snowflake className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>Zadejte parametry pro výpočet izolace</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title="Kalkulátor izolace"
      description="Vypočítejte potřebnou tloušťku tepelné izolace, náklady a úspory energie. Různé materiály a oblasti aplikace."
      category="Stavební"
      seo={{
        title: "Kalkulátor izolace - Výpočet tepelné izolace | MathCalc",
        description: "Bezplatný kalkulátor tepelné izolace. Vypočítejte tloušťku, náklady a úspory pro zateplení fasády, střechy, podlahy.",
        keywords: ["izolace", "zateplení", "polystyren", "minerální vata", "U-hodnota", "tepelný odpor", "úspora energie", "kalkulátor izolace"]
      }}
      formula={{
        latex: "d = R \\times \\lambda \\quad R = \\frac{1}{U_{cíl}} - \\frac{1}{U_{součas}}",
        description: "Tloušťka izolace se počítá z požadovaného tepelného odporu a tepelné vodivosti materiálu."
      }}
      examples={{
        title: "Příklady výpočtu izolace",
        description: "Praktické použití kalkulátoru izolace",
        scenarios: [
          {
            title: "Zateplení fasády",
            description: "U = 1,2 → 0,3 W/m²K, EPS 120 mm",
            example: "Fasáda rodinného domu 100 m²"
          },
          {
            title: "Izolace střechy",
            description: "U = 1,5 → 0,24 W/m²K, minerální vata 180 mm",
            example: "Šikmá střecha pod krokvemi"
          },
          {
            title: "Podlahová izolace",
            description: "U = 1,0 → 0,45 W/m²K, XPS 80 mm",
            example: "Podlaha nad nevytápěným sklepem"
          }
        ]
      }}
      faq={[
        {
          question: "Co je U-hodnota?",
          answer: "Součinitel prostupu tepla [W/m²K] - čím nižší, tím lepší izolační vlastnosti. Udává množství tepla, které projde 1 m² konstrukce při rozdílu teplot 1°C."
        },
        {
          question: "Jaký materiál vybrat?",
          answer: "EPS pro fasády, XPS do vlhka, minerální vata pro střechy a akustiku, PUR pro vysoké nároky, dřevovlákno pro ekologické stavby."
        },
        {
          question: "Jak se počítá návratnost?",
          answer: "Návratnost = investiční náklady / roční úspora energie. Typicky 8-15 let podle materiálu a cen energií."
        },
        {
          question: "Je potřeba parotěsná zábrana?",
          answer: "Ano, zejména u vnitřních izolací a střech. Zabraňuje kondenzaci vodní páry v konstrukci a poškození materiálu."
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
          title: "Kalkulátor betonu",
          description: "Výpočet betonu a materiálů",
          href: "/calculator/stavebni/beton",
          category: "Stavební"
        },
        {
          title: "Kalkulátor plochy",
          description: "Výpočet plochy různých tvarů",
          href: "/calculator/stavebni/plocha",
          category: "Stavební"
        },
        {
          title: "Kalkulátor slev",
          description: "Výpočet slev a úspor",
          href: "/calculator/prakticke-vypocty/kalkulacka-2",
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

export default InsulationCalculator;
