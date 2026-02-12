import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import { getRelatedCalculators } from '@/lib/calculatorDataUtils';
import { useUnitConverter, UnitType } from '@/hooks/useUnitConverter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import Tabs from '@/components/ui/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Info, ArrowRightLeft } from 'lucide-react';

const UnitConverter: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const {
    unitType, inputValue, setInputValue,
    fromUnit, setFromUnit, toUnit, setToUnit,
    result, currentUnits, handleUnitTypeChange,
    swapUnits, formatResult, convertValue
  } = useUnitConverter();

  const relatedCalculators = getRelatedCalculators('unit-converter', locale, t);

  const unitTypeLabels: Record<UnitType, string> = {
    length: t('unit_converter_length'),
    weight: t('unit_converter_weight'),
    volume: t('unit_converter_volume'),
    temperature: t('unit_converter_temperature')
  };

  return (
    <SimpleCalculatorLayout
      title={t('unit_converter_title')}
      description={t('unit_converter_description')}
      category="utility"
      calculatorId="unit-converter"
      seo={{
        title: t('unit_converter_seo_title'),
        description: t('unit_converter_seo_description'),
        keywords: [
          t('unit_converter_keyword_1'),
          t('unit_converter_keyword_2'),
          t('unit_converter_keyword_3'),
          t('unit_converter_keyword_4'),
          t('unit_converter_keyword_5'),
          t('unit_converter_keyword_6'),
          t('unit_converter_keyword_7'),
          t('unit_converter_keyword_8')
        ]
      }}
      formula={{
        latex: String.raw`°F = °C \times \frac{9}{5} + 32 \qquad °C = (°F - 32) \times \frac{5}{9} \qquad K = °C + 273{,}15`,
        description: t('unit_converter_formula_temp_desc')
      }}
      examples={{
        title: t('unit_converter_examples_title'),
        description: t('unit_converter_examples_desc'),
        scenarios: [
          { title: t('unit_converter_example_1_title'), description: t('unit_converter_example_1_desc'), example: t('unit_converter_example_1_calc') },
          { title: t('unit_converter_example_2_title'), description: t('unit_converter_example_2_desc'), example: t('unit_converter_example_2_calc') },
          { title: t('unit_converter_example_3_title'), description: t('unit_converter_example_3_desc'), example: t('unit_converter_example_3_calc') },
          { title: t('unit_converter_example_4_title'), description: t('unit_converter_example_4_desc'), example: t('unit_converter_example_4_calc') },
          { title: t('unit_converter_example_5_title'), description: t('unit_converter_example_5_desc'), example: t('unit_converter_example_5_calc') }
        ]
      }}
      faq={[
        { question: t('unit_converter_faq_1_q'), answer: t('unit_converter_faq_1_a') },
        { question: t('unit_converter_faq_2_q'), answer: t('unit_converter_faq_2_a') },
        { question: t('unit_converter_faq_3_q'), answer: t('unit_converter_faq_3_a') },
        { question: t('unit_converter_faq_4_q'), answer: t('unit_converter_faq_4_a') },
        { question: t('unit_converter_faq_5_q'), answer: t('unit_converter_faq_5_a') },
        { question: t('unit_converter_faq_6_q'), answer: t('unit_converter_faq_6_a') },
        { question: t('unit_converter_faq_7_q'), answer: t('unit_converter_faq_7_a') }
      ]}
      relatedCalculators={relatedCalculators}
      schemaData={{ applicationCategory: "UtilityApplication", operatingSystem: "Any" }}
      resultSection={inputValue && !isNaN(parseFloat(inputValue)) && result !== null ? (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
            <div className="text-2xl font-bold text-center">
              {formatResult(parseFloat(inputValue))} {fromUnit} = {formatResult(result)} {toUnit}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">{t('unit_converter_quick_conversions')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(currentUnits as readonly string[]).slice(0, 6).map((unit) => (
                unit !== fromUnit && (
                  <button
                    key={`quick-${unit}`}
                    onClick={() => setToUnit(unit)}
                    className="text-left p-3 rounded-md border hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium">
                      1 {fromUnit} = {formatResult(convertValue(1, fromUnit, unit))} {unit}
                    </div>
                  </button>
                )
              ))}
            </div>
          </div>
        </div>
      ) : undefined}
    >
      <div className="space-y-6">
        <Tabs
          activeTab={unitType}
          onChange={(tabId) => handleUnitTypeChange(tabId as UnitType)}
          variant="segmented"
          fullWidth
          className="w-full"
        >
          {(Object.keys(unitTypeLabels) as UnitType[]).map((type) => (
            <Tabs.Item key={type} label={unitTypeLabels[type]} _id={type}>
              <div className="sr-only">{type}</div>
            </Tabs.Item>
          ))}
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 w-full">
            <Label htmlFor="inputValue">{t('unit_converter_value_label')}</Label>
            <Input
              id="inputValue"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('unit_converter_enter_value')}
              className="mt-1"
            />
          </div>

          <div className="w-full sm:w-auto">
            <Label>{t('unit_converter_from_label')}</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="w-full sm:w-[180px] mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(currentUnits as readonly string[]).map((unit) => (
                  <SelectItem key={`from-${unit}`} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={swapUnits}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label={t('unit_converter_swap')}
            title={t('unit_converter_swap')}
          >
            <ArrowRightLeft className="h-5 w-5" />
          </button>

          <div className="w-full sm:w-auto">
            <Label>{t('unit_converter_to_label')}</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="w-full sm:w-[180px] mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(currentUnits as readonly string[]).map((unit) => (
                  <SelectItem key={`to-${unit}`} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </SimpleCalculatorLayout>
  );
};

export default UnitConverter;
