// src/components/calculators/unitConverters/TemperatureConverter.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const temperatureUnits = ['°C', '°F', 'K'];

const TemperatureConverter: React.FC = () => {
  const { t } = useTranslation('common');
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState('°C');
  const [outputUnit, setOutputUnit] = useState('°F');
  const [outputValue, setOutputValue] = useState<number | null>(null);

  const convertTemperature = (value: number, fromUnit: string, toUnit: string): number => {
    if (fromUnit === toUnit) return value;

    // Převod na Kelvin pro jednotnou základnu
    let valueInKelvin: number;
    if (fromUnit === '°C') {
      valueInKelvin = value + 273.15;
    } else if (fromUnit === '°F') {
      valueInKelvin = (value - 32) * 5/9 + 273.15;
    } else if (fromUnit === 'K') {
      valueInKelvin = value;
    } else {
      throw new Error(t('unknown_input_temperature_unit_error')); // Použití lokalizačního klíče
    }

    // Převod z Kelvinu na cílovou jednotku
    if (toUnit === '°C') {
      return valueInKelvin - 273.15;
    } else if (toUnit === '°F') {
      return (valueInKelvin - 273.15) * 9/5 + 32;
    } else if (toUnit === 'K') {
      return valueInKelvin;
    } else {
      throw new Error(t('unknown_output_temperature_unit_error')); // Použití lokalizačního klíče
    }
  };

  const handleConversion = () => {
    const numInputValue = parseFloat(inputValue);

    if (!isNaN(numInputValue)) {
      try {
        const convertedValue = convertTemperature(numInputValue, inputUnit, outputUnit);
        setOutputValue(convertedValue);
      } catch (error) {
        console.error(error);
        setOutputValue(null);
      }
    } else {
      setOutputValue(null);
    }
  };

  useEffect(() => {
    handleConversion();
  }, [inputValue, inputUnit, outputUnit]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{t('temperature_converter_title')}</h3>
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
            {temperatureUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
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
            {temperatureUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
          </select>
        </div>
      </div>

      {outputValue !== null && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {t('vysledek_label')}: {outputValue.toFixed(2)} {outputUnit}
        </div>
      )}
    </div>
  );
};

export default TemperatureConverter;
