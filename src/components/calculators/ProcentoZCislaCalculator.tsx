// src/components/calculators/ProcentoZCislaCalculator.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const ProcentoZCislaCalculator: React.FC = () => {
  const { t } = useTranslation('common');
  const [procenta, setProcenta] = useState('');
  const [cislo, setCislo] = useState('');
  const [vysledek, setVysledek] = useState<number | null>(null);

  const handleCalculate = () => {
    const p = parseFloat(procenta);
    const c = parseFloat(cislo);

    if (!isNaN(p) && !isNaN(c)) {
      setVysledek((p / 100) * c);
    } else {
      setVysledek(null);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [procenta, cislo]);

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('procento_z_cisla_title')}</h2>
      <div className="mb-4">
        <label htmlFor="procenta" className="block text-sm font-medium text-gray-700">{t('procenta_label')} (%)</label>
        <input
          type="number"
          id="procenta"
          value={procenta}
          onChange={(e) => setProcenta(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="cislo" className="block text-sm font-medium text-gray-700">{t('cislo_label')}</label>
        <input
          type="number"
          id="cislo"
          value={cislo}
          onChange={(e) => setCislo(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {vysledek !== null && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {t('vysledek_label')}: {vysledek}
        </div>
      )}
    </div>
  );
};

export default ProcentoZCislaCalculator;
