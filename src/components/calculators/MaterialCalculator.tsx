// src/components/calculators/MaterialCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Package, Truck, Hammer, Palette } from 'lucide-react';

interface MaterialResult {
  quantity: number;
  quantityWithWaste: number;
  wastePercentage: number;
  unit: string;
  cost: number;
  materialType: string;
  area: number;
  isValid: boolean;
}

const MaterialCalculator: React.FC = () => {
  const t = useTranslations();
  const [materialType, setMaterialType] = useState<string>('tiles');
  const [area, setArea] = useState<string>('50');
  const [unitPrice, setUnitPrice] = useState<string>('500');
  const [wastePercentage, setWastePercentage] = useState<string>('10');
  
  const [result, setResult] = useState<MaterialResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Material specifications
  const materials = {
    tiles: {
      name: 'Dlažba/obklady',
      unit: 'm²',
      coverage: 1, // 1 m² per m²
      defaultWaste: 10,
      icon: <Package className="w-6 h-6" />
    },
    paint: {
      name: 'Barva',
      unit: 'l',
      coverage: 10, // 10 m² per liter
      defaultWaste: 5,
      icon: <Palette className="w-6 h-6" />
    },
    concrete: {
      name: 'Beton',
      unit: 'm³',
      coverage: 100, // 100 m² per m³ (for 10cm thickness)
      defaultWaste: 5,
      icon: <Truck className="w-6 h-6" />
    },
    flooring: {
      name: 'Podlahové krytiny',
      unit: 'm²',
      coverage: 1,
      defaultWaste: 8,
      icon: <Package className="w-6 h-6" />
    },
    wallpaper: {
      name: 'Tapety',
      unit: 'role',
      coverage: 5, // 5 m² per roll
      defaultWaste: 15,
      icon: <Package className="w-6 h-6" />
    },
    insulation: {
      name: 'Izolace',
      unit: 'm²',
      coverage: 1,
      defaultWaste: 5,
      icon: <Package className="w-6 h-6" />
    }
  };

  // Format quantity
  const formatQuantity = (quantity: number, unit: string): string => {
    return quantity.toLocaleString('cs-CZ', {
      minimumFractionDigits: unit === 'l' || unit === 'm³' ? 1 : 0,
      maximumFractionDigits: unit === 'l' || unit === 'm³' ? 1 : 0
    }) + ' ' + unit;
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ' Kč';
  };

  // Validation function
  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    const areaNum = parseFloat(area);
    const priceNum = parseFloat(unitPrice);
    const wasteNum = parseFloat(wastePercentage);

    if (!area || isNaN(areaNum) || areaNum <= 0) {
      newErrors.area = 'Zadejte platnou plochu';
    } else if (areaNum > 10000) {
      newErrors.area = 'Maximální plocha je 10 000 m²';
    }

    if (!unitPrice || isNaN(priceNum) || priceNum < 0) {
      newErrors.unitPrice = 'Zadejte platnou cenu';
    }

    if (!wastePercentage || isNaN(wasteNum) || wasteNum < 0 || wasteNum > 50) {
      newErrors.wastePercentage = 'Zadejte procenta odpadu (0-50%)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate material needs
  const calculateMaterial = (
    areaValue: number,
    material: typeof materials[keyof typeof materials],
    pricePerUnit: number,
    waste: number
  ): MaterialResult => {
    // Calculate base quantity needed
    let baseQuantity: number;
    
    if (material.unit === 'l') {
      // Paint: area / coverage per liter
      baseQuantity = areaValue / material.coverage;
    } else if (material.unit === 'm³') {
      // Concrete: area / coverage per m³
      baseQuantity = areaValue / material.coverage;
    } else if (material.unit === 'role') {
      // Wallpaper: area / coverage per roll
      baseQuantity = Math.ceil(areaValue / material.coverage);
    } else {
      // Tiles, flooring, insulation: 1:1 ratio
      baseQuantity = areaValue;
    }

    // Add waste
    const quantityWithWaste = baseQuantity * (1 + waste / 100);
    
    // Round up for discrete items
    const finalQuantity = material.unit === 'role' ? Math.ceil(quantityWithWaste) : quantityWithWaste;
    
    // Calculate cost
    const totalCost = finalQuantity * pricePerUnit;

    return {
      quantity: baseQuantity,
      quantityWithWaste: finalQuantity,
      wastePercentage: waste,
      unit: material.unit,
      cost: totalCost,
      materialType: materialType,
      area: areaValue,
      isValid: true
    };
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs()) {
      const areaNum = parseFloat(area);
      const priceNum = parseFloat(unitPrice);
      const wasteNum = parseFloat(wastePercentage);
      const material = materials[materialType as keyof typeof materials];

      const calculatedResult = calculateMaterial(areaNum, material, priceNum, wasteNum);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [materialType, area, unitPrice, wastePercentage]);

  // Set default waste percentage when material changes
  useEffect(() => {
    const material = materials[materialType as keyof typeof materials];
    setWastePercentage(material.defaultWaste.toString());
  }, [materialType]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Material Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="materialType" className="text-sm font-medium">
          {t('calculators.material.material_type')}
        </Label>
        <Select value={materialType} onValueChange={setMaterialType}>
          <SelectTrigger>
            <SelectValue placeholder={t('calculators.material.select_material')} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(materials).map(([key, material]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  {material.icon}
                  <span>{material.name}</span>
                  <span className="text-gray-500 text-sm">({material.unit})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {t(`calculators.material.${materialType}`)} - {t('calculators.material.calculation_needed')}
        </p>
      </div>

      {/* Area Input */}
      <div className="space-y-2">
        <Label htmlFor="area" className="text-sm font-medium">
          {t('calculators.material.area')} (m²)
        </Label>
        <Input
          id="area"
          type="number"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="50"
          className={`${errors.area ? 'border-red-500' : ''}`}
          min="0"
          step="0.1"
        />
        {errors.area && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.area}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.material.area_hint')}
        </p>
      </div>

      {/* Unit Price Input */}
      <div className="space-y-2">
        <Label htmlFor="unitPrice" className="text-sm font-medium">
          {t('calculators.material.price_per_unit')} {materials[materialType as keyof typeof materials].unit} (Kč)
        </Label>
        <Input
          id="unitPrice"
          type="number"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          placeholder="500"
          className={`${errors.unitPrice ? 'border-red-500' : ''}`}
          min="0"
          step="1"
        />
        {errors.unitPrice && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.unitPrice}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.material.price_hint')}
        </p>
      </div>

      {/* Waste Percentage Input */}
      <div className="space-y-2">
        <Label htmlFor="wastePercentage" className="text-sm font-medium">
          {t('calculators.material.waste_reserve')} (%)
        </Label>
        <Input
          id="wastePercentage"
          type="number"
          value={wastePercentage}
          onChange={(e) => setWastePercentage(e.target.value)}
          placeholder="10"
          className={`${errors.wastePercentage ? 'border-red-500' : ''}`}
          min="0"
          max="50"
          step="1"
        />
        {errors.wastePercentage && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.wastePercentage}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.material.recommended')}: {materials[materialType as keyof typeof materials].defaultWaste}% pro {t(`calculators.material.${materialType}`).toLowerCase()}
        </p>
      </div>

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2 flex items-center justify-center gap-2">
              {materials[materialType as keyof typeof materials].icon}
              Výpočet materiálu - {t(`calculators.material.${materialType}`)}
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {area} m² • {unitPrice} Kč/{materials[materialType as keyof typeof materials].unit} • {wastePercentage}% odpad
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
              {formatQuantity(result.quantityWithWaste, result.unit)}
            </div>
            <div className="text-sm text-green-700 mt-1">
              {t('calculators.material.required_amount')} {t('calculators.material.including_waste')}
            </div>
          </div>
          <Package className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">
              {formatQuantity(result.quantity, result.unit)}
            </div>
            <div className="text-sm text-blue-700 mt-1">{t('calculators.material.basic_amount')}</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800">
              {formatQuantity(result.quantityWithWaste - result.quantity, result.unit)}
            </div>
            <div className="text-sm text-purple-700 mt-1">{t('calculators.material.waste_amount')}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-orange-800">
              {formatCurrency(result.cost)}
            </div>
            <div className="text-sm text-orange-700 mt-1">{t('calculators.material.total_price')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Calculation Details */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('common.detailed_calculation')}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>{t('calculators.material.material_type')}:</span>
                  <span className="font-mono">{t(`calculators.material.${result.materialType}`)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('calculators.material.area')}:</span>
                  <span className="font-mono">{result.area.toLocaleString('cs-CZ')} m²</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('calculators.material.basic_amount')}:</span>
                  <span className="font-mono">{formatQuantity(result.quantity, result.unit)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('calculators.material.waste_amount')} ({result.wastePercentage}%):</span>
                  <span className="font-mono">{formatQuantity(result.quantityWithWaste - result.quantity, result.unit)}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>{t('calculators.material.required_amount')}:</span>
                  <span className="font-mono">{formatQuantity(result.quantityWithWaste, result.unit)}</span>
                </div>
                <div className="flex justify-between font-semibold text-green-700">
                  <span>{t('calculators.material.total_price')}:</span>
                  <span className="font-mono">{formatCurrency(result.cost)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Material Tips */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">{t('calculators.material.installation_tips')} - {t(`calculators.material.${result.materialType}`).toLowerCase()}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {result.materialType === 'tiles' && (
              <>
                <div className="p-3 bg-green-50 rounded">
                  <div className="font-medium text-green-800 mb-1">{t('calculators.material.installation')}</div>
                  <div className="text-green-700">{t('calculators.material.installation_tip')}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium text-blue-800 mb-1">{t('calculators.material.cutting')}</div>
                  <div className="text-blue-700">{t('calculators.material.cutting_tip')}</div>
                </div>
              </>
            )}
            {result.materialType === 'paint' && (
              <>
                <div className="p-3 bg-green-50 rounded">
                  <div className="font-medium text-green-800 mb-1">{t('calculators.material.coverage')}</div>
                  <div className="text-green-700">{t('calculators.material.coverage_tip')}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium text-blue-800 mb-1">{t('calculators.material.preparation')}</div>
                  <div className="text-blue-700">{t('calculators.material.preparation_tip')}</div>
                </div>
              </>
            )}
            {result.materialType === 'concrete' && (
              <>
                <div className="p-3 bg-green-50 rounded">
                  <div className="font-medium text-green-800 mb-1">{t('calculators.material.mixing')}</div>
                  <div className="text-green-700">{t('calculators.material.mixing_tip')}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium text-blue-800 mb-1">{t('calculators.material.pouring')}</div>
                  <div className="text-blue-700">{t('calculators.material.pouring_tip')}</div>
                </div>
              </>
            )}
            {result.materialType === 'flooring' && (
              <>
                <div className="p-3 bg-green-50 rounded">
                  <div className="font-medium text-green-800 mb-1">{t('calculators.material.acclimation')}</div>
                  <div className="text-green-700">{t('calculators.material.acclimation_tip')}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium text-blue-800 mb-1">{t('calculators.material.gluing')}</div>
                  <div className="text-blue-700">{t('calculators.material.gluing_tip')}</div>
                </div>
              </>
            )}
            {result.materialType === 'wallpaper' && (
              <>
                <div className="p-3 bg-green-50 rounded">
                  <div className="font-medium text-green-800 mb-1">{t('calculators.material.gluing')}</div>
                  <div className="text-green-700">{t('calculators.material.gluing_tip')}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium text-blue-800 mb-1">{t('calculators.material.pattern')}</div>
                  <div className="text-blue-700">{t('calculators.material.pattern_tip')}</div>
                </div>
              </>
            )}
            {result.materialType === 'insulation' && (
              <>
                <div className="p-3 bg-green-50 rounded">
                  <div className="font-medium text-green-800 mb-1">{t('calculators.material.mounting')}</div>
                  <div className="text-green-700">{t('calculators.material.mounting_tip')}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium text-blue-800 mb-1">{t('calculators.material.protection')}</div>
                  <div className="text-blue-700">{t('calculators.material.protection_tip')}</div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <Hammer className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('calculators.material.enter_parameters')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('calculators.material.title')}
      description={t('calculators.material.description')}
      category={t('categories.construction')}
      seo={{
        title: "Kalkulátor materiálů - Výpočet dlažby, barvy, betonu | MathCalc",
        description: "Bezplatný kalkulátor stavebních materiálů. Vypočítejte potřebné množství dlažby, barvy, betonu, podlahovin včetně odpadu a ceny.",
        keywords: ["materiály", "dlažba", "barva", "beton", "podlahoviny", "tapety", "izolace", "stavba", "rekonstrukce", "kalkulátor materiálů"]
      }}
      formula={{
        latex: "Množství = \\frac{Plocha}{Pokrytí} \\times (1 + \\frac{Odpad}{100})",
        description: "Množství materiálu se počítá podle pokrytí na jednotku a přidává se procentuální odpad."
      }}
      examples={{
        title: "Příklady výpočtu materiálů",
        description: "Praktické použití kalkulátoru materiálů",
        scenarios: [
          {
            title: "Dlažba do koupelny",
            description: "15 m², 10% odpad = 16,5 m²",
            example: "Obklady a dlažba včetně řezání"
          },
          {
            title: "Barva na stěny",
            description: "40 m², pokrytí 10 m²/l = 4,2 l",
            example: "Malování místnosti ve 2 vrstvách"
          },
          {
            title: "Betonová deska",
            description: "100 m², tl. 10 cm = 10,5 m³",
            example: "Podlahová deska včetně rezervy"
          }
        ]
      }}
      faq={[
        {
          question: "Proč počítat s odpadem materiálu?",
          answer: "Odpad vzniká při řezání, poškození při manipulaci, nepravidelných tvarech místnosti a rezervě pro budoucí opravy."
        },
        {
          question: "Kolik procent odpadu počítat?",
          answer: "Dlažba 10-15%, barva 5%, beton 5%, podlahoviny 8%, tapety 15%, izolace 5%. Více u složitých tvarů a vzorů."
        },
        {
          question: "Jak vypočítat plochu nepravidelné místnosti?",
          answer: "Rozdělte místnost na obdélníky a trojúhelníky, vypočítejte jejich plochy a sečtěte je. Odečtěte plochu otvorů (dveře, okna)."
        },
        {
          question: "Kdy koupit více materiálu?",
          answer: "Vždy kupujte o 5-10% více než vypočteno pro budoucí opravy. U ukončovaných kolekcí kupujte větší rezervu."
        }
      ]}
      relatedCalculators={[
        {
          title: "Kalkulátor plochy",
          description: "Výpočet plochy různých tvarů",
          href: "/calculator/stavebni/plocha",
          category: "Stavební"
        },
        {
          title: "Kalkulátor objemu",
          description: "Výpočet objemu 3D těles",
          href: "/calculator/stavebni/objem",
          category: "Stavební"
        },
        {
          title: "Kalkulátor slev",
          description: "Výpočet slev a úspor",
          href: "/calculator/prakticke-vypocty/kalkulacka-2",
          category: "Praktické"
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

export default MaterialCalculator;
