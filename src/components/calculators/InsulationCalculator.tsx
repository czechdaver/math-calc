// src/components/calculators/InsulationCalculator.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calculator as CalcIcon, Thermometer, Shield, Snowflake } from 'lucide-react';
import { getRelatedCalculators } from '@/lib/calculatorDataUtils';
import { useInsulationCalculator } from '@/hooks/useInsulationCalculator';

const InsulationCalculator: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  const {
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
  } = useInsulationCalculator();

  // Format functions
  const fmt = {
    area: (n: number) => n.toLocaleString(locale) + ' m²',
    thickness: (n: number) => (n * 1000).toLocaleString(locale, { maximumFractionDigits: 0 }) + ' mm',
    volume: (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 2 }) + ' m³',
    uValue: (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 2 }) + ' W/m²K',
    resistance: (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 2 }) + ' m²K/W',
    currency: (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 0 }) + ' Kč'
  };
  const relatedCalculators = getRelatedCalculators('insulation', locale, t);

  // Calculator input form
  const calculatorForm = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="applicationType" className="text-sm font-medium">{t('insulation_application_type_label')}</Label>
        <Select value={applicationType} onValueChange={setApplicationType}>
          <SelectTrigger><SelectValue placeholder={t('insulation_select_area')} /></SelectTrigger>
          <SelectContent>
            {Object.entries(applicationAreas).map(([key, area]) => (
              <SelectItem key={key} value={key}>{t(`insulation_area_${key}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="insulationType" className="text-sm font-medium">{t('insulation_type_label')}</Label>
        <Select value={insulationType} onValueChange={setInsulationType}>
          <SelectTrigger><SelectValue placeholder={t('insulation_select_material')} /></SelectTrigger>
          <SelectContent>
            {Object.entries(insulationMaterials).map(([key, material]) => (
              <SelectItem key={key} value={key}>
                <div className="flex flex-col">
                  <span>{t(`insulation_material_${key}`)}</span>
                  <span className="text-xs text-gray-500">λ = {material.lambda} W/mK</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="area" className="text-sm font-medium">{t('insulation_area_input_label')}</Label>
        <Input id="area" type="number" value={area} onChange={(e) => setArea(e.target.value)}
          placeholder="100" className={errors.area ? 'border-red-500' : ''} min="0" step="1" />
        {errors.area && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.area}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentUValue" className="text-sm font-medium">{t('insulation_current_u_label')}</Label>
          <Input id="currentUValue" type="number" value={currentUValue} onChange={(e) => setCurrentUValue(e.target.value)}
            placeholder="1.2" className={errors.currentUValue ? 'border-red-500' : ''} min="0" step="0.1" />
          {errors.currentUValue && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.currentUValue}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetUValue" className="text-sm font-medium">{t('insulation_target_u_label')}</Label>
          <Input id="targetUValue" type="number" value={targetUValue} onChange={(e) => setTargetUValue(e.target.value)}
            placeholder="0.3" className={errors.targetUValue ? 'border-red-500' : ''} min="0" step="0.01" />
          {errors.targetUValue && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.targetUValue}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pricePerM2" className="text-sm font-medium">{t('insulation_price_per_m2_label')}</Label>
          <Input id="pricePerM2" type="number" value={pricePerM2} onChange={(e) => setPricePerM2(e.target.value)}
            placeholder="250" className={errors.pricePerM2 ? 'border-red-500' : ''} min="0" step="1" />
          {errors.pricePerM2 && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.pricePerM2}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="energyPrice" className="text-sm font-medium">{t('insulation_energy_price_label')}</Label>
          <Input id="energyPrice" type="number" value={energyPrice} onChange={(e) => setEnergyPrice(e.target.value)}
            placeholder="6" className={errors.energyPrice ? 'border-red-500' : ''} min="0" step="0.1" />
          {errors.energyPrice && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.energyPrice}</p>}
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800 mb-2 flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />{t('insulation_calculation_summary')} - {t(`insulation_area_${applicationType}`)}
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {t(`insulation_material_${insulationType}`)} • {area} m²
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Results section
  const resultsSection = result ? (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-6 bg-green-50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">{fmt.thickness(result.thickness)}</div>
            <div className="text-sm text-green-700 mt-1">{t('insulation_required_thickness')}</div>
            <div className="text-xs text-green-600 mt-1">{t(`insulation_material_${result.insulationType}`)}</div>
          </div>
          <Thermometer className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-800">{fmt.area(result.area)}</div>
            <div className="text-sm text-blue-700 mt-1">{t('insulation_area')}</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-800">{fmt.volume(result.volume)}</div>
            <div className="text-sm text-purple-700 mt-1">{t('insulation_volume')}</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-orange-800">{fmt.uValue(result.uValue)}</div>
            <div className="text-sm text-orange-700 mt-1">{t('insulation_target_u')}</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-green-800">{fmt.resistance(result.thermalResistance)}</div>
            <div className="text-sm text-green-700 mt-1">{t('insulation_thermal_resistance')}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-900 mb-2">{fmt.currency(result.cost)}</div>
            <div className="text-sm text-red-700">{t('insulation_investment_cost')}</div>
            <div className="text-xs text-red-600 mt-1">{t('insulation_material_installation')}</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-900 mb-2">{fmt.currency(result.energySavings)}</div>
            <div className="text-sm text-green-700">{t('insulation_annual_savings')}</div>
            <div className="text-xs text-green-600 mt-1">
              {t('insulation_payback')}: {Math.round(result.cost / result.energySavings)} {t('insulation_years')}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalcIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('insulation_detailed_calculation')}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>{t('insulation_application_area')}:</span>
                  <span className="font-mono">{t(`insulation_area_${result.applicationArea}`)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('insulation_material')}:</span>
                  <span className="font-mono">{t(`insulation_material_${result.insulationType}`)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('insulation_thermal_conductivity')}:</span>
                  <span className="font-mono">{insulationMaterials[result.insulationType as keyof typeof insulationMaterials].lambda} W/mK</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>{t('insulation_required_thickness')}:</span>
                  <span className="font-mono">{fmt.thickness(result.thickness)}</span>
                </div>
                <div className="flex justify-between font-semibold text-green-700">
                  <span>{t('insulation_annual_savings')}:</span>
                  <span className="font-mono">{fmt.currency(result.energySavings)}</span>
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
      <p>{t('insulation_enter_parameters')}</p>
    </div>
  );

  const examples = {
    title: t('insulation_examples_title'), description: t('insulation_examples_description'),
    scenarios: [1, 2, 3].map(i => ({
      title: t(`insulation_example_${i}_title`),
      description: t(`insulation_example_${i}_description`),
      example: t(`insulation_example_${i}_example`)
    }))
  };
  const faq = [1, 2, 3, 4].map(i => ({
    question: t(`insulation_faq_${i}_question`),
    answer: t(`insulation_faq_${i}_answer`)
  }));

  return (
    <SimpleCalculatorLayout
      title={t('insulation_calculator_title')} description={t('insulation_calculator_description')}
      category="construction" calculatorId="insulation"
      seo={{ title: t('insulation_seo_title'), description: t('insulation_seo_description'),
        keywords: ['izolace', 'zateplení', 'polystyren', 'minerální vata', 'U-hodnota', 'tepelný odpor', 'úspora energie', 'kalkulátor izolace'] }}
      formula={{ latex: String.raw`d = R \times \lambda \quad R = \frac{1}{U_{cíl}} - \frac{1}{U_{součas}}`, description: t('insulation_formula_description') }}
      examples={examples} faq={faq} relatedCalculators={relatedCalculators}
      schemaData={{ applicationCategory: "UtilitiesApplication", operatingSystem: "Any" }} resultSection={resultsSection}
    >
      {calculatorForm}
    </SimpleCalculatorLayout>
  );
};

export default InsulationCalculator;
