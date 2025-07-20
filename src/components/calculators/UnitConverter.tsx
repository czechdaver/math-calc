// src/components/calculators/UnitConverter.tsx
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import LengthConverter from './unitConverters/LengthConverter';
import WeightConverter from './unitConverters/WeightConverter';
import VolumeConverter from './unitConverters/VolumeConverter';
import TemperatureConverter from './unitConverters/TemperatureConverter';

const UnitConverter: React.FC = () => {
  const { t } = useTranslation('common');
  const [unitType, setUnitType] = useState('');

  const handleUnitTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUnitType(event.target.value);
  };

  const renderConverter = () => {
    switch (unitType) {
      case 'length':
        return <LengthConverter />;
      case 'weight':
        return <WeightConverter />;
      case 'volume':
        return <VolumeConverter />;
      case 'temperature':
        return <TemperatureConverter />;
      default:
        return <p>{t('unit_converter_select_type')}</p>;
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('unit_converter_title')}</h2>
      <div className="mb-4">
        <label htmlFor="unitType" className="block text-sm font-medium text-gray-700">{t('unit_converter_select_label')}</label>
        <select
          id="unitType"
          value={unitType}
          onChange={handleUnitTypeChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">{t('select_option_default')}</option>
          <option value="length">{t('unit_type_length')}</option>
          <option value="weight">{t('unit_type_weight')}</option>
          <option value="volume">{t}('unit_type_volume')</option>
          <option value="temperature">{t('unit_type_temperature')}</option>
          {/* Zde budou další možnosti pro budoucí rozšíření */}
        </select>
      </div>

      <div className="mt-4">
        {renderConverter()}
      </div>
    </div>
  );
};

export default UnitConverter;
