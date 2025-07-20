// src/components/calculators/DPHCalculator.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const DPHCalculator: React.FC = () => {
  const { t } = useTranslation('common');
  const [zeme, setZeme] = useState('cr');
  const [castka, setCastka] = useState('');
  const [smer, setSmer] = useState('zaklad-celkem'); // 'zaklad-celkem' nebo 'celkem-zaklad'
  const [vysledek, setVysledek] = useState<number | null>(null);
  const [dphCastka, setDphCastka] = useState<number | null>(null);

  const sazA = zeme === 'cr' ? 0.21 : 0.20; // 21% pro ČR, 20% pro SK

  const calculateDPH = () => {
    const numCastka = parseFloat(castka);

    if (!isNaN(numCastka)) {
      if (smer === 'zaklad-celkem') {
        const celkem = numCastka * (1 + sazA);
        setVysledek(celkem);
        setDphCastka(celkem - numCastka);
      } else {
        const zaklad = numCastka / (1 + sazA);
        setVysledek(zaklad);
        setDphCastka(numCastka - zaklad);
      }
    } else {
      setVysledek(null);
      setDphCastka(null);
    }
  };

  useEffect(() => {
    calculateDPH();
  }, [castka, zeme, smer]);

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('dph_calculator_title')}</h2>
      <div className="mb-4">
        <label htmlFor="zeme" className="block text-sm font-medium text-gray-700">{t('country_label')}:</label>
        <select
          id="zeme"
          value={zeme}
          onChange={(e) => setZeme(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="cr">{t('country_cr')}</option>
          <option value="sk">{t('country_sk')}</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="smer" className="block text-sm font-medium text-gray-700">{t('calculation_direction_label')}:</label>
        <select
          id="smer"
          value={smer}
          onChange={(e) => setSmer(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="zaklad-celkem">{t('direction_base_to_total')}</option>
          <option value="celkem-zaklad">{t('direction_total_to_base')}</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="castka" className="block text-sm font-medium text-gray-700">{t('amount_label')} ({smer === 'zaklad-celkem' ? t('base_label') : t('total_label')}):</label>
        <input
          type="number"
          id="castka"
          value={castka}
          onChange={(e) => setCastka(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {vysledek !== null && (dphCastka !== null) && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>{smer === 'zaklad-celkem' ? t('total_with_dph_label') : t('base_label')}: {vysledek.toFixed(2)} {zeme === 'cr' ? 'Kč' : '€'}</p>
          <p>{t('dph_amount_label')}: {dphCastka.toFixed(2)} {zeme === 'cr' ? 'Kč' : '€'}</p>
        </div>
      )}
    </div>
  );
};

export default DPHCalculator;
