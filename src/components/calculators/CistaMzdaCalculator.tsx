// src/components/calculators/CistaMzdaCalculator.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const CistaMzdaCalculator: React.FC = () => {
  const { t } = useTranslation('common');
  const [hrubaMzda, setHrubaMzda] = useState('');
  const [zeme, setZeme] = useState('cr');
  const [cistaMzda, setCistaMzda] = useState<number | null>(null);
  const [srazkyDetail, setSrazkyDetail] = useState<{
    socialni: number | null;
    zdravotni: number | null;
    dan: number | null;
  } | null>(null);

  const calculateCistaMzda = () => {
    const numHrubaMzda = parseFloat(hrubaMzda);
    let socialniSazbaZamestnanec = 0;
    let zdravotniSazbaZamestnanec = 0;
    let danovaSazba = 0;

    if (zeme === 'cr') {
      socialniSazbaZamestnanec = 0.065; // zjednodušeno
      zdravotniSazbaZamestnanec = 0.045; // zjednodušeno
      danovaSazba = 0.15; // zjednodušeno, superhrubá mzda atd. nejsou zohledněny
    } else if (zeme === 'sk') {
      socialniSazbaZamestnanec = 0.094; // zjednodušeno
      zdravotniSazbaZamestnanec = 0.04; // zjednodušeno
      danovaSazba = 0.19; // zjednodušeno
    }

    if (!isNaN(numHrubaMzda) && numHrubaMzda >= 0) {
      const socialniSrazka = numHrubaMzda * socialniSazbaZamestnanec;
      const zdravotniSrazka = numHrubaMzda * zdravotniSazbaZamestnanec;

      // Zjednodušený výpočet daně - nebere v úvahu slevy na poplatníka atd.
      const zakladProDan = numHrubaMzda - socialniSrazka - zdravotniSrazka;
      const danSrazka = zakladProDan > 0 ? zakladProDan * danovaSazba : 0;

      const cista = numHrubaMzda - socialniSrazka - zdravotniSrazka - danSrazka;

      setCistaMzda(cista);
      setSrazkyDetail({
        socialni: socialniSrazka,
        zdravotni: zdravotniSrazka,
        dan: danSrazka,
      });

    } else {
      setCistaMzda(null);
      setSrazkyDetail(null);
    }
  };

  useEffect(() => {
    calculateCistaMzda();
  }, [hrubaMzda, zeme]);

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('cista_mzda_calculator_title')}</h2>
      <div className="mb-4">
        <label htmlFor="hrubaMzda" className="block text-sm font-medium text-gray-700">{t('gross_salary_label')}:</label>
        <input
          type="number"
          id="hrubaMzda"
          value={hrubaMzda}
          onChange={(e) => setHrubaMzda(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

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

      {cistaMzda !== null && srazkyDetail !== null && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="text-lg font-semibold mb-2">{t('result_label')}:</h3>
          <p>{t('net_salary_label')}: {cistaMzda.toFixed(2)} {zeme === 'cr' ? 'Kč' : '€'}</p>
          <h4 className="mt-2 font-semibold">{t('deductions_detail_label')}:</h4>
          <p>{t('social_insurance_label')}: {srazkyDetail.socialni?.toFixed(2)} {zeme === 'cr' ? 'Kč' : '€'}</p>
          <p>{t('health_insurance_label')}: {srazkyDetail.zdravotni?.toFixed(2)} {zeme === 'cr' ? 'Kč' : '€'}</p>
          <p>{t('income_tax_label')}: {srazkyDetail.dan?.toFixed(2)} {zeme === 'cr' ? 'Kč' : '€'}</p>
           <p className="mt-2 text-sm text-gray-600">{t('cista_mzda_disclaimer')}</p>
        </div>
      )}
    </div>
  );
};

export default CistaMzdaCalculator;
