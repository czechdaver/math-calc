'use client';

import { useTranslations } from 'next-intl';

export default function TestPage() {
  const t = useTranslations('common');
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Translation Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Basic Translations</h2>
          <p><strong>Percentage:</strong> {t('percentages_label')}</p>
          <p><strong>Number:</strong> {t('cislo_label')}</p>
          <p><strong>Result:</strong> {t('vysledek_label')}</p>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Unit Conversion</h2>
          <p><strong>Unit Converter:</strong> {t('unit_converter_title')}</p>
          <p><strong>Length:</strong> {t('unit_type_length')}</p>
          <p><strong>Weight:</strong> {t('unit_type_weight')}</p>
          <p><strong>Volume:</strong> {t('unit_type_volume')}</p>
          <p><strong>Temperature:</strong> {t('unit_type_temperature')}</p>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">BMI Calculator</h2>
          <p><strong>Title:</strong> {t('bmi_calculator_title')}</p>
          <p><strong>Height:</strong> {t('height_label')}</p>
          <p><strong>Weight:</strong> {t('weight_label')}</p>
          <p><strong>Your BMI:</strong> {t('your_bmi_label')}</p>
          <p><strong>Category:</strong> {t('category_label')}</p>
          <div className="mt-2 space-y-1">
            <p><strong>Categories:</strong></p>
            <ul className="list-disc pl-5">
              <li>{t('bmi_category_underweight')}</li>
              <li>{t('bmi_category_normal')}</li>
              <li>{t('bmi_category_overweight')}</li>
              <li>{t('bmi_category_obese')}</li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Formulas</h2>
          <div className="space-y-2">
            <p><strong>BMI Formula:</strong> {t('bmi_formula')}</p>
            <p><strong>VAT Formula (Base to Total):</strong> {t('vat_formula_base_to_total')}</p>
            <p><strong>VAT Formula (Total to Base):</strong> {t('vat_formula_total_to_base')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
