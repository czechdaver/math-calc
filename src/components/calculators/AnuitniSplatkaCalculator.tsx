// src/components/calculators/AnuitniSplatkaCalculator.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const AnuitniSplatkaCalculator: React.FC = () => {
  const { t } = useTranslation('common');
  const [vyssiUveru, setVyssiUveru] = useState('');
  const [rocniUrokovaSazba, setRocniUrokovaSazba] = useState(''); // v %
  const [dobaSplaceni, setDobaSplaceni] = useState(''); // v letech
  const [anuitniSplatka, setAnuitniSplatka] = useState<number | null>(null);

  const calculateAnuitniSplatka = () => {
    const J = parseFloat(vyssiUveru); // Jistina
    const r = parseFloat(rocniUrokovaSazba) / 100; // Roční úroková sazba jako desetinné číslo
    const t = parseFloat(dobaSplaceni); // Doba splácení v letech

    if (!isNaN(J) && !isNaN(r) && !isNaN(t) && J > 0 && r >= 0 && t > 0) {
      // Převod roční úrokové sazby na měsíční a doby splácení na měsíce
      const mesicniUrokovaSazba = r / 12;
      const pocetSplátek = t * 12;

      if (mesicniUrokovaSaz === 0) {
         // Speciální případ pro úrokovou sazbu 0%
         setAnuitniSplatka(J / pocetSplátek);
      } else {
        // Vzorec pro anuitní splátku: M = J * [i(1 + i)^n] / [(1 + i)^n – 1]
        // Kde J = jistina, i = měsíční úroková sazba, n = počet splátek
        const M = J * (mesicniUrokovaSazba * Math.pow((1 + mesicniUrokovaSazba), pocetSplátek)) / (Math.pow((1 + mesicniUrokovaSazba), pocetSplátek) - 1);
        setAnuitniSplatka(M);
      }
    } else {
      setAnuitniSplatka(null);
    }
  };

  useEffect(() => {
    calculateAnuitniSplatka();
  }, [vyssiUveru, rocniUrokovaSazba, dobaSplaceni]);

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('anuitni_splatka_title')}</h2>
      <div className="mb-4">
        <label htmlFor="vyssiUveru" className="block text-sm font-medium text-gray-700">{t('loan_amount_label')}:</label>
        <input
          type="number"
          id="vyssiUveru"
          value={vyssiUveru}
          onChange={(e) => setVyssiUveru(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="rocniUrokovaSazba" className="block text-sm font-medium text-gray-700">{t('annual_interest_rate_label')} (%):</label>
        <input
          type="number"
          id="rocniUrokovaSazba"
          value={rocniUrokovaSazba}
          onChange={(e) => setRocniUrokovaSazba(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

       <div className="mb-4">
        <label htmlFor="dobaSplaceni" className="block text-sm font-medium text-gray-700">{t('repayment_period_label')} ({t('years_label')}):</label>
        <input
          type="number"
          id="dobaSplaceni"
          value={dobaSplaceni}
          onChange={(e) => setDobaSplaceni(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {anuitniSplatka !== null && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {t('monthly_annuity_payment_label')}: {anuitniSplatka.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default AnuitniSplatkaCalculator;
