"use client"; // Added directive

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Changed import
import { type CalculatorData } from '@/types/calculator'; // Import CalculatorData type

interface CistaMzdaCalculatorProps { // Defined props interface
  calculatorData: CalculatorData; // Data for this calculator
  locale: string; // Current locale
}

const CistaMzdaCalculator: React.FC<CistaMzdaCalculatorProps> = ({ calculatorData, locale }) => { // Updated component signature

  // Access data from calculatorData if needed (e.g., calculatorData.name, calculatorData.inputs)
  // const { name, inputs, output, explanation } = calculatorData;

  // Apply the workaround for useTranslation
  const { t } = useTranslation(locale, 'netSalaryCalculator' as any); // Initialized useTranslation with locale and specific namespace

  const [hrubaMzda, setHrubaMzda] = useState('');
  const [zeme, setZeme] = useState('cr');
  const [cistaMzda, setCistaMzda] = useState<number | null>(null);
  const [srazkyDetail, setSrazkyDetail] = useState<{
    socialni: number | null;
    zdravotni: number | null;
    dan: number | null;
  } | null>(null);

  // Tax and insurance rates - currently hardcoded, ideally from calculatorData
  const socialniSazbaZamestnanec = zeme === 'cr' ? 0.065 : 0.094; // zjednodušeno
  const zdravotniSazbaZamestnanec = zeme === 'cr' ? 0.045 : 0.04; // zjednodušeno
  const danovaSazba = zeme === 'cr' ? 0.15 : 0.19; // zjednodušeno, superhrubá mzda atd. nejsou zohledněny


  const calculateCistaMzda = () => {
    const numHrubaMzda = parseFloat(hrubaMzda);

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

  // Included t in the dependency array
  useEffect(() => {
    calculateCistaMzda();
  }, [hrubaMzda, zeme, socialniSazbaZamestnanec, zdravotniSazbaZamestnanec, danovaSazba, t]); // Added rates and t to dependencies

   // Determine currency symbol based on selected country
   const currencySymbol = zeme === 'cr' ? 'Kč' : '€';


  return (
    <div className="p-4 border rounded shadow-md">
      {/* Use calculatorData.name if available, otherwise use translation */}
      <h2 className="text-xl font-semibold mb-4">{t('net_salary_calculator_title')}</h2> {/* Using translation for title */}
      <div className="mb-4">
        <label htmlFor="hrubaMzda" className="block text-sm font-medium text-gray-700">{t('netSalary.gross_salary_label')}:</label> {/* Updated translation key */}
        <input
          type="number"
          id="hrubaMzda"
          value={hrubaMzda}
          onChange={(e) => setHrubaMzda(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="zeme" className="block text-sm font-medium text-gray-700">{t('netSalary.country_label')}:</label> {/* Updated translation key */}
        <select
          id="zeme"
          value={zeme}
          onChange={(e) => setZeme(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="cr">{t('netSalary.country_cr')}</option> {/* Updated translation key */}
          <option value="sk">{t('netSalary.country_sk')}</option> {/* Updated translation key */}
        </select>
      </div>

      {cistaMzda !== null && srazkyDetail !== null && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="text-lg font-semibold mb-2">{t('netSalary.result_label')}:</h3> {/* Updated translation key */}
          <p>{t('netSalary.net_salary_label')}: {cistaMzda.toFixed(2)} {currencySymbol}</p> {/* Updated translation key and currency symbol */}
          <h4 className="mt-2 font-semibold">{t('netSalary.deductions_detail_label')}:</h4> {/* Updated translation key */}
          <p>{t('netSalary.social_insurance_label')}: {srazkyDetail.socialni?.toFixed(2)} {currencySymbol}</p> {/* Updated translation key and currency symbol */}
          <p>{t('netSalary.health_insurance_label')}: {srazkyDetail.zdravotni?.toFixed(2)} {currencySymbol}</p> {/* Updated translation key and currency symbol */}
          <p>{t('netSalary.income_tax_label')}: {srazkyDetail.dan?.toFixed(2)} {currencySymbol}</p> {/* Updated translation key and currency symbol */}
           <p className="mt-2 text-sm text-gray-600">{t('netSalary.disclaimer')}</p> {/* Updated translation key */}
        </div>
      )}
       {/* You would also render explanation, examples, etc. using calculatorData */}
       {/* <div className="mt-4">
         <h4>{t('common.explanation')}</h4>
         <p>{calculatorData.explanation}</p>
       </div> */}
    </div>
  );
};

export default CistaMzdaCalculator;
