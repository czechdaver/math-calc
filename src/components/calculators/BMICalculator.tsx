// src/components/calculators/BMICalculator.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const BMICalculator: React.FC = () => {
  const { t } = useTranslation('common');
  const [vyska, setVyska] = useState(''); // v cm
  const [vaha, setVaha] = useState(''); // v kg
  const [bmi, setBmi] = useState<number | null>(null);
  const [kategorie, setKategorie] = useState<string | null>(null);

  const calculateBMI = () => {
    const vyskaM = parseFloat(vyska) / 100; // převod na metry
    const vahaKg = parseFloat(vaha);

    if (!isNaN(vyskaM) && !isNaN(vahaKg) && vyskaM > 0) {
      const bmiValue = vahaKg / (vyskaM * vyskaM);
      setBmi(bmiValue);

      // Kategorizace BMI
      if (bmiValue < 18.5) {
        setKategorie(t('bmi_category_underweight'));
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setKategorie(t('bmi_category_normal'));
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setKategorie(t('bmi_category_overweight'));
      } else {
        setKategorie(t('bmi_category_obese'));
      }

    } else {
      setBmi(null);
      setKategorie(null);
    }
  };

  useEffect(() => {
    calculateBMI();
  }, [vyska, vaha]);

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('bmi_calculator_title')}</h2>
      <div className="mb-4">
        <label htmlFor="vyska" className="block text-sm font-medium text-gray-700">{t('height_label')} (cm)</label>
        <input
          type="number"
          id="vyska"
          value={vyska}
          onChange={(e) => setVyska(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="vaha" className="block text-sm font-medium text-gray-700">{t}('weight_label') (kg)</label>
        <input
          type="number"
          id="vaha"
          value={vaha}
          onChange={(e) => setVaha(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {bmi !== null && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>{t('your_bmi_label')}: {bmi.toFixed(2)}</p>
          <p>{t('category_label')}: {kategorie}</p>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
