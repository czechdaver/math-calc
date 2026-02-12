import { useState, useEffect } from 'react';

type InsulationType = 'eps' | 'xps' | 'mineralWool' | 'polyurethane' | 'woodFiber';
type ApplicationType = 'wall' | 'roof' | 'floor' | 'ceiling';

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

interface InsulationMaterial {
  name: string;
  lambda: number;
  use: string;
}

interface ApplicationArea {
  name: string;
  currentUTypical: number;
  targetURequired: number;
}

export function useInsulationCalculator() {
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
  const insulationMaterials: Record<InsulationType, InsulationMaterial> = {
    eps: { name: 'Polystyren (EPS)', lambda: 0.04, use: 'Fasády, podlahy' },
    xps: { name: 'Extrudovaný polystyren (XPS)', lambda: 0.035, use: 'Vlhké prostředí, sokly' },
    mineralWool: { name: 'Minerální vata', lambda: 0.045, use: 'Střechy, stěny, akustika' },
    polyurethane: { name: 'Polyuretanová pěna (PUR)', lambda: 0.025, use: 'Vysoké nároky na izolaci' },
    woodFiber: { name: 'Dřevovláknité desky', lambda: 0.05, use: 'Ekologické stavby' }
  };

  // Application areas
  const applicationAreas: Record<ApplicationType, ApplicationArea> = {
    wall: { name: 'Obvodové stěny', currentUTypical: 1.2, targetURequired: 0.3 },
    roof: { name: 'Střecha', currentUTypical: 1.5, targetURequired: 0.24 },
    floor: { name: 'Podlaha', currentUTypical: 1.0, targetURequired: 0.45 },
    ceiling: { name: 'Strop', currentUTypical: 1.8, targetURequired: 0.3 }
  };

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
    material: InsulationMaterial,
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
      const material = insulationMaterials[insulationType as InsulationType];

      const calculatedResult = calculateInsulation(areaNum, currentUNum, targetUNum, material, priceNum, energyPriceNum);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [applicationType, insulationType, area, currentUValue, targetUValue, pricePerM2, energyPrice]);

  // Set typical values when application type changes
  useEffect(() => {
    const appArea = applicationAreas[applicationType as ApplicationType];
    if (appArea) {
      setCurrentUValue(appArea.currentUTypical.toString());
      setTargetUValue(appArea.targetURequired.toString());
    }
  }, [applicationType]);

  return {
    applicationType,
    setApplicationType,
    insulationType,
    setInsulationType,
    area,
    setArea,
    currentUValue,
    setCurrentUValue,
    targetUValue,
    setTargetUValue,
    pricePerM2,
    setPricePerM2,
    energyPrice,
    setEnergyPrice,
    result,
    errors,
    insulationMaterials,
    applicationAreas
  };
}
