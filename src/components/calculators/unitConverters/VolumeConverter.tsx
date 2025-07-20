// src/components/calculators/unitConverters/VolumeConverter.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const volumeUnits = ['ml', 'l'];

const VolumeConverter: React.FC = () => {
  const { t } = useTranslation('common');
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState('l');
  const [outputUnit, setOutputUnit] = useState('ml');
  const [outputValue, setOutputValue] = useState<number | null>(null);

  const conversionFactors: { [key: string]: number } = {
    ml: 0.001,
    l: 1,
  };

  const handleConversion = () => {
    const numInputValue = parseFloat(inputValue);

    if (!isNaN(numInputValue)) {
      const valueInLiters = numInputValue * conversionFactors[inputUnit];
      const convertedValue = valueInLiters / conversionFactors[outputUnit];
      setOutputValue(convertedValue);
    } else {
      setOutputValue(null);
    }
  };

  useEffect(() => {
    handleConversion();
  }, [inputValue, inputUnit, outputUnit]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{t('volume_converter_title')}</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700">{t('value_label')}</label>
          <input
            type="number"
            id="inputValue"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="inputUnit" className="block text-sm font-medium text-gray-700">{t('from_unit_label')}</label>
          <select
            id="inputUnit"
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            {volumeUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="outputUnit" className="block text-sm font-medium text-gray-700">{t('to_unit_label')}</label>
          <select
            id="outputUnit"
            value={outputUnit}
            onChange={(e) => setOutputUnit(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            {volumeUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
          </select>
        </div>
      </div>

      {outputValue !== null && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {t('vysledek_label')}: {outputValue.toFixed(4)} {outputUnit}
        </div>
      )}
    </div>
  );
};

export default VolumeConverter;
