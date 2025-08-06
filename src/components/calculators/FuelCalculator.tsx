// src/components/calculators/FuelCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Car, Fuel, MapPin, DollarSign } from 'lucide-react';

interface FuelResult {
  fuelConsumption: number;
  totalCost: number;
  costPerKm: number;
  distance: number;
  fuelPrice: number;
  calculationType: string;
  isValid: boolean;
}

const FuelCalculator: React.FC = () => {
  const t = useTranslations();
  const [calculationType, setCalculationType] = useState<string>('consumption');
  
  // Common inputs
  const [distance, setDistance] = useState<string>('100');
  const [fuelPrice, setFuelPrice] = useState<string>('35.50');
  
  // For consumption calculation
  const [fuelUsed, setFuelUsed] = useState<string>('7.5');
  
  // For cost calculation
  const [consumption, setConsumption] = useState<string>('7.5');
  
  // For trip planning
  const [tripDistance, setTripDistance] = useState<string>('500');
  const [carConsumption, setCarConsumption] = useState<string>('7.5');
  
  const [result, setResult] = useState<FuelResult | null>(null);
  const [errors, setErrors] = useState<{ 
    distance?: string; fuelPrice?: string; fuelUsed?: string; 
    consumption?: string; tripDistance?: string; carConsumption?: string;
  }>({});

  // Format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('cs-CZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' Kč';
  };

  // Format fuel amount
  const formatFuel = (amount: number): string => {
    return amount.toLocaleString('cs-CZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' l';
  };

  // Format consumption
  const formatConsumption = (amount: number): string => {
    return amount.toLocaleString('cs-CZ', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }) + ' l/100km';
  };

  // Validation function
  const validateInputs = (type: string) => {
    const newErrors: { 
      distance?: string; fuelPrice?: string; fuelUsed?: string; 
      consumption?: string; tripDistance?: string; carConsumption?: string;
    } = {};
    
    const priceNum = parseFloat(fuelPrice);
    if (!fuelPrice || isNaN(priceNum) || priceNum <= 0) {
      newErrors.fuelPrice = 'Zadejte platnou cenu paliva';
    }

    if (type === 'consumption') {
      const distanceNum = parseFloat(distance);
      const fuelNum = parseFloat(fuelUsed);
      
      if (!distance || isNaN(distanceNum) || distanceNum <= 0) {
        newErrors.distance = 'Zadejte platnou vzdálenost';
      }
      if (!fuelUsed || isNaN(fuelNum) || fuelNum <= 0) {
        newErrors.fuelUsed = 'Zadejte platné množství paliva';
      }
    } else if (type === 'cost') {
      const distanceNum = parseFloat(distance);
      const consumptionNum = parseFloat(consumption);
      
      if (!distance || isNaN(distanceNum) || distanceNum <= 0) {
        newErrors.distance = 'Zadejte platnou vzdálenost';
      }
      if (!consumption || isNaN(consumptionNum) || consumptionNum <= 0) {
        newErrors.consumption = 'Zadejte platnou spotřebu';
      }
    } else if (type === 'trip') {
      const tripDistanceNum = parseFloat(tripDistance);
      const carConsumptionNum = parseFloat(carConsumption);
      
      if (!tripDistance || isNaN(tripDistanceNum) || tripDistanceNum <= 0) {
        newErrors.tripDistance = 'Zadejte platnou vzdálenost cesty';
      }
      if (!carConsumption || isNaN(carConsumptionNum) || carConsumptionNum <= 0) {
        newErrors.carConsumption = 'Zadejte platnou spotřebu vozidla';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate fuel consumption
  const calculateConsumption = (
    distanceKm: number,
    fuelLiters: number,
    pricePerLiter: number
  ): FuelResult => {
    const consumptionPer100km = (fuelLiters / distanceKm) * 100;
    const totalCost = fuelLiters * pricePerLiter;
    const costPerKm = totalCost / distanceKm;

    return {
      fuelConsumption: consumptionPer100km,
      totalCost,
      costPerKm,
      distance: distanceKm,
      fuelPrice: pricePerLiter,
      calculationType: 'consumption',
      isValid: true
    };
  };

  // Calculate trip cost
  const calculateTripCost = (
    distanceKm: number,
    consumptionPer100km: number,
    pricePerLiter: number
  ): FuelResult => {
    const fuelNeeded = (distanceKm / 100) * consumptionPer100km;
    const totalCost = fuelNeeded * pricePerLiter;
    const costPerKm = totalCost / distanceKm;

    return {
      fuelConsumption: fuelNeeded,
      totalCost,
      costPerKm,
      distance: distanceKm,
      fuelPrice: pricePerLiter,
      calculationType: 'cost',
      isValid: true
    };
  };

  // Calculate trip planning
  const calculateTripPlanning = (
    distanceKm: number,
    consumptionPer100km: number,
    pricePerLiter: number
  ): FuelResult => {
    const fuelNeeded = (distanceKm / 100) * consumptionPer100km;
    const totalCost = fuelNeeded * pricePerLiter;
    const costPerKm = totalCost / distanceKm;

    return {
      fuelConsumption: fuelNeeded,
      totalCost,
      costPerKm,
      distance: distanceKm,
      fuelPrice: pricePerLiter,
      calculationType: 'trip',
      isValid: true
    };
  };

  // Get calculation type description
  const getCalculationDescription = (type: string): string => {
    switch (type) {
      case 'consumption': return 'Výpočet spotřeby paliva';
      case 'cost': return 'Výpočet nákladů na cestu';
      case 'trip': return 'Plánování cesty';
      default: return 'Výpočet spotřeby paliva';
    }
  };

  // Effect for real-time calculation
  useEffect(() => {
    if (validateInputs(calculationType)) {
      const priceNum = parseFloat(fuelPrice);
      let calculatedResult: FuelResult;

      if (calculationType === 'consumption') {
        const distanceNum = parseFloat(distance);
        const fuelNum = parseFloat(fuelUsed);
        calculatedResult = calculateConsumption(distanceNum, fuelNum, priceNum);
      } else if (calculationType === 'cost') {
        const distanceNum = parseFloat(distance);
        const consumptionNum = parseFloat(consumption);
        calculatedResult = calculateTripCost(distanceNum, consumptionNum, priceNum);
      } else {
        const tripDistanceNum = parseFloat(tripDistance);
        const carConsumptionNum = parseFloat(carConsumption);
        calculatedResult = calculateTripPlanning(tripDistanceNum, carConsumptionNum, priceNum);
      }

      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [calculationType, distance, fuelPrice, fuelUsed, consumption, tripDistance, carConsumption]);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      {/* Calculation Type */}
      <div className="space-y-2">
        <Label htmlFor="calculationType" className="text-sm font-medium">
          {t('calculators.fuel.calculation_type')}
        </Label>
        <Select value={calculationType} onValueChange={setCalculationType}>
          <SelectTrigger>
            <SelectValue placeholder={t('common.select_option')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consumption">{t('calculators.fuel.consumption_calc')}</SelectItem>
            <SelectItem value="cost">{t('calculators.fuel.cost_calc')}</SelectItem>
            <SelectItem value="trip">{t('calculators.fuel.trip_planning')}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-gray-500 text-xs">
          {getCalculationDescription(calculationType)}
        </p>
      </div>

      {/* Fuel Price - Common for all types */}
      <div className="space-y-2">
        <Label htmlFor="fuelPrice" className="text-sm font-medium">
          {t('calculators.fuel.fuel_price')} (Kč/l)
        </Label>
        <Input
          id="fuelPrice"
          type="number"
          value={fuelPrice}
          onChange={(e) => setFuelPrice(e.target.value)}
          placeholder="35.50"
          className={`${errors.fuelPrice ? 'border-red-500' : ''}`}
          min="0"
          step="0.01"
        />
        {errors.fuelPrice && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.fuelPrice}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {t('calculators.fuel.fuel_price_hint')}
        </p>
      </div>

      {/* Consumption Calculation Inputs */}
      {calculationType === 'consumption' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="distance" className="text-sm font-medium">
              {t('calculators.fuel.distance')} (km)
            </Label>
            <Input
              id="distance"
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="100"
              className={`${errors.distance ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.distance && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.distance}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelUsed" className="text-sm font-medium">
              {t('calculators.fuel.fuel_used')} (l)
            </Label>
            <Input
              id="fuelUsed"
              type="number"
              value={fuelUsed}
              onChange={(e) => setFuelUsed(e.target.value)}
              placeholder="7.5"
              className={`${errors.fuelUsed ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.fuelUsed && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.fuelUsed}
              </p>
            )}
          </div>
        </>
      )}

      {/* Cost Calculation Inputs */}
      {calculationType === 'cost' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="distance" className="text-sm font-medium">
              {t('calculators.fuel.distance')} (km)
            </Label>
            <Input
              id="distance"
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="100"
              className={`${errors.distance ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.distance && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.distance}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="consumption" className="text-sm font-medium">
              {t('calculators.fuel.consumption')} (l/100km)
            </Label>
            <Input
              id="consumption"
              type="number"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
              placeholder="7.5"
              className={`${errors.consumption ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.consumption && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.consumption}
              </p>
            )}
          </div>
        </>
      )}

      {/* Trip Planning Inputs */}
      {calculationType === 'trip' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="tripDistance" className="text-sm font-medium">
              {t('calculators.fuel.trip_distance')} (km)
            </Label>
            <Input
              id="tripDistance"
              type="number"
              value={tripDistance}
              onChange={(e) => setTripDistance(e.target.value)}
              placeholder="500"
              className={`${errors.tripDistance ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.tripDistance && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.tripDistance}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="carConsumption" className="text-sm font-medium">
              {t('calculators.fuel.car_consumption')} (l/100km)
            </Label>
            <Input
              id="carConsumption"
              type="number"
              value={carConsumption}
              onChange={(e) => setCarConsumption(e.target.value)}
              placeholder="7.5"
              className={`${errors.carConsumption ? 'border-red-500' : ''}`}
              min="0"
              step="0.1"
            />
            {errors.carConsumption && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.carConsumption}
              </p>
            )}
          </div>
        </>
      )}

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2">
              {getCalculationDescription(calculationType)}
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {calculationType === 'consumption' && `${distance} km • ${fuelUsed} l • ${fuelPrice} Kč/l`}
              {calculationType === 'cost' && `${distance} km • ${consumption} l/100km • ${fuelPrice} Kč/l`}
              {calculationType === 'trip' && `${tripDistance} km • ${carConsumption} l/100km • ${fuelPrice} Kč/l`}
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
            {result.calculationType === 'consumption' ? (
              <>
                <div className="text-3xl font-bold text-green-900">
                  {formatConsumption(result.fuelConsumption)}
                </div>
                <div className="text-sm text-green-700 mt-1">
                  {t('calculators.fuel.fuel_consumption')}
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-green-900">
                  {formatCurrency(result.totalCost)}
                </div>
                <div className="text-sm text-green-700 mt-1">
                  {t('calculators.fuel.total_cost')}
                </div>
              </>
            )}
          </div>
          <Car className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Fuel className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-blue-800">
              {result.calculationType === 'consumption' 
                ? formatConsumption(result.fuelConsumption)
                : formatFuel(result.fuelConsumption)
              }
            </div>
            <div className="text-sm text-blue-700 mt-1">
              {result.calculationType === 'consumption' ? t('calculators.fuel.consumption') : t('calculators.fuel.fuel_needed')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-purple-800">
              {formatCurrency(result.totalCost)}
            </div>
            <div className="text-sm text-purple-700 mt-1">{t('calculators.fuel.total_cost')}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <MapPin className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-orange-800">
              {result.costPerKm.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kč/km
            </div>
            <div className="text-sm text-orange-700 mt-1">{t('calculators.fuel.cost_per_km')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Calculation Details */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('calculators.fuel.detailed_calculation')}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>{t('calculators.fuel.distance')}:</span>
                  <span className="font-mono">{result.distance.toLocaleString('cs-CZ')} km</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('calculators.fuel.fuel_price')}:</span>
                  <span className="font-mono">{result.fuelPrice.toLocaleString('cs-CZ', { minimumFractionDigits: 2 })} Kč/l</span>
                </div>
                {result.calculationType === 'consumption' ? (
                  <>
                    <div className="flex justify-between">
                      <span>{t('calculators.fuel.fuel_used_consumed')}:</span>
                      <span className="font-mono">{formatFuel(result.fuelConsumption)}</span>
                    </div>
                    <div className="border-t pt-1 flex justify-between font-semibold">
                      <span>{t('calculators.fuel.consumption_per_100km')}:</span>
                      <span className="font-mono">{formatConsumption(result.fuelConsumption)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span>{t('calculators.fuel.fuel_needed')}:</span>
                      <span className="font-mono">{formatFuel(result.fuelConsumption)}</span>
                    </div>
                    <div className="border-t pt-1 flex justify-between font-semibold">
                      <span>{t('calculators.fuel.total_cost')}:</span>
                      <span className="font-mono">{formatCurrency(result.totalCost)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fuel Efficiency Tips */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">{t('calculators.fuel.fuel_efficiency_tips')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-green-50 rounded">
              <div className="font-medium text-green-800 mb-1">{t('calculators.fuel.city_driving')}</div>
              <div className="text-green-700">{t('calculators.fuel.city_tip')}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <div className="font-medium text-blue-800 mb-1">{t('calculators.fuel.highway_driving')}</div>
              <div className="text-blue-700">{t('calculators.fuel.highway_tip')}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <div className="font-medium text-purple-800 mb-1">{t('calculators.fuel.vehicle_maintenance')}</div>
              <div className="text-purple-700">{t('calculators.fuel.maintenance_tip')}</div>
            </div>
            <div className="p-3 bg-orange-50 rounded">
              <div className="font-medium text-orange-800 mb-1">{t('calculators.fuel.trip_planning_tips')}</div>
              <div className="text-orange-700">{t('calculators.fuel.planning_tip')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <Fuel className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{t('calculators.fuel.enter_values')}</p>
    </div>
  );

  return (
    <SimpleCalculatorLayout
      title={t('calculators.fuel.title')}
      description={t('calculators.fuel.description')}
      category={t('categories.practical')}
      seo={{
        title: t('calculators.fuel.seo.title'),
        description: t('calculators.fuel.seo.description'),
        keywords: t('calculators.fuel.seo.keywords').split(',')
      }}
      formula={{
        latex: t('calculators.fuel.formula.latex'),
        description: t('calculators.fuel.formula.description')
      }}
      examples={{
        title: t('calculators.fuel.examples.title'),
        description: t('calculators.fuel.examples.description'),
        scenarios: [
          {
            title: t('calculators.fuel.examples.scenario1.title'),
            description: t('calculators.fuel.examples.scenario1.description'),
            example: t('calculators.fuel.examples.scenario1.example')
          },
          {
            title: t('calculators.fuel.examples.scenario2.title'),
            description: t('calculators.fuel.examples.scenario2.description'),
            example: t('calculators.fuel.examples.scenario2.example')
          },
          {
            title: t('calculators.fuel.examples.scenario3.title'),
            description: t('calculators.fuel.examples.scenario3.description'),
            example: t('calculators.fuel.examples.scenario3.example')
          }
        ]
      }}
      faq={[
        {
          question: t('calculators.fuel.faq.q1.question'),
          answer: t('calculators.fuel.faq.q1.answer')
        },
        {
          question: t('calculators.fuel.faq.q2.question'),
          answer: t('calculators.fuel.faq.q2.answer')
        },
        {
          question: t('calculators.fuel.faq.q3.question'),
          answer: t('calculators.fuel.faq.q3.answer')
        },
        {
          question: t('calculators.fuel.faq.q4.question'),
          answer: t('calculators.fuel.faq.q4.answer')
        }
      ]}
      relatedCalculators={[
        {
          title: t('calculators.fuel.related.age.title'),
          description: t('calculators.fuel.related.age.description'),
          href: "/calculator/prakticke-vypocty/kalkulacka-3",
          category: t('categories.practical')
        },
        {
          title: t('calculators.fuel.related.time.title'),
          description: t('calculators.fuel.related.time.description'),
          href: "/calculator/prakticke-vypocty/kalkulacka-4",
          category: t('categories.practical')
        },
        {
          title: t('calculators.fuel.related.currency.title'),
          description: t('calculators.fuel.related.currency.description'),
          href: "/calculator/prakticke-vypocty/kalkulacka-5",
          category: t('categories.practical')
        },
        {
          title: t('calculators.fuel.related.unit_converter.title'),
          description: t('calculators.fuel.related.unit_converter.description'),
          href: "/calculator/prevodnik-jednotek",
          category: t('categories.practical')
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

export default FuelCalculator;
