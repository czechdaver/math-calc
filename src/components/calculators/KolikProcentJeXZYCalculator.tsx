// src/components/calculators/KolikProcentJeXZYCalculator.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const KolikProcentJeXZYCalculator: React.FC = () => {
  const { t } = useTranslation('common');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [vysledek, setVysledek] = useState<number | null>(null);

  const handleCalculate = () => {
    const numX = parseFloat(x);
    const numY = parseFloat(y);

    if (!isNaN(numX) && !isNaN(numY) && numY !== 0) {
      setVysledek((numX / numY) * 100);
    } else {
      setVysledek(null);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [x, y]);

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('kolik_procent_je_x_z_y_title')}</h2>
      <div className="mb-4">
        <label htmlFor="x" className="block text-sm font-medium text-gray-700">{t('hodnota_x_label')}</label>
        <input
          type="number"
          id="x"
          value={x}
          onChange={(e) => setX(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="y" className="block text-sm font-medium text-gray-700">{t('hodnota_y_label')}</label>
        <input
          type="number"
          id="y"
          value={y}
          onChange={(e) => setY(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {vysledek !== null && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {t('vysledek_label')}: {vysledek} %
        </div>
      )}
    </div>
  );
};

export default KolikProcentJeXZYCalculator;
