// src/components/calculators/ZlomkyCalculator.tsx
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

const ZlomkyCalculator: React.FC = () => {
  const { t } = useTranslation('common');
  const [operace, setOperace] = useState('');

  const handleOperaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOperace(event.target.value);
  };

  const renderOperationForm = () => {
    switch (operace) {
      case 'scitani':
        return <p>{t('zlomky_form_scitani')}</p>;
      case 'odcitani':
        return <p>{t('zlomky_form_odcitani')}</p>;
      case 'nasobeni':
        return <p>{t('zlomky_form_nasobeni')}</p>;
      case 'deleni':
        return <p>{t}('zlomky_form_deleni')</p>;
      case 'zkracovani':
        return <p>{t('zlomky_form_zkracovani')}</p>;
      case 'prevod':
        return <p>{t('zlomky_form_prevod')}</p>;
      default:
        return <p>{t('zlomky_select_operation')}</p>;
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('zlomky_calculator_title')}</h2>
      <div className="mb-4">
        <label htmlFor="operace" className="block text-sm font-medium text-gray-700">{t('zlomky_select_operation_label')}:</label>
        <select
          id="operace"
          value={operace}
          onChange={handleOperaceChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">{t('select_option_default')}</option>
          <option value="scitani">{t('zlomky_operation_scitani')}</option>
          <option value="odcitani">{t('zlomky_operation_odcitani')}</option>
          <option value="nasobeni">{t('zlomky_operation_nasobeni')}</option>
          <option value="deleni">{t('zlomky_operation_deleni')}</option>
          <option value="zkracovani">{t('zlomky_operation_zkracovani')}</option>
          <option value="prevod">{t('zlomky_operation_prevod')}</option>
        </select>
      </div>

      <div className="mt-4">
        {renderOperationForm()}
      </div>
    </div>
  );
};

export default ZlomkyCalculator;
