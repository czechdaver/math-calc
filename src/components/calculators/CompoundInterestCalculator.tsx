// src/components/calculators/CompoundInterestCalculator.tsx
import React, { useState, useEffect } from 'react';

const CompoundInterestCalculator: React.FC = () => {
  const [jistina, setJistina] = useState('');
  const [urokovaSazba, setUrokovaSazba] = useState(''); // v %
  const [cetnostUroceni, setCetnostUroceni] = useState('rocne'); // rocne, mesicne, atd.
  const [dobaInvestice, setDobaInvestice] = useState(''); // v letech
  const [budouciHodnota, setBudouciHodnota] = useState<number | null>(null);

  const calculateCompoundInterest = () => {
    const P = parseFloat(jistina);
    const r = parseFloat(urokovaSazba) / 100; // převod na desetinné číslo
    const t = parseFloat(dobaInvestice);
    let n = 1; // četnost úročení ročně

    if (cetnostUroceni === 'mesicne') {
      n = 12;
    } else if (cetnostUroceni === 'ctvrtletne') {
        n = 4;
    } else if (cetnostUroceni === 'pololetne') {
        n = 2;
    } else if (cetnostUroceni === 'denne') {
        n = 365; // zjednodušeno bez ohledu na přestupné roky
    }

    if (!isNaN(P) && !isNaN(r) && !isNaN(t) && P >= 0 && r >= 0 && t >= 0 && n > 0) {
      // Vzorec pro složené úročení: A = P(1 + r/n)^(nt)
      const A = P * Math.pow((1 + r / n), (n * t));
      setBudouciHodnota(A);
    } else {
      setBudouciHodnota(null);
    }
  };

  useEffect(() => {
    calculateCompoundInterest();
  }, [jistina, urokovaSazba, cetnostUroceni, dobaInvestice]);

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Zadejte údaje pro výpočet:</h2>
      <div className="mb-4">
        <label htmlFor="jistina" className="block text-sm font-medium text-gray-700">Jistina:</label>
        <input
          type="number"
          id="jistina"
          value={jistina}
          onChange={(e) => setJistina(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="urokovaSazba" className="block text-sm font-medium text-gray-700">Roční úroková sazba (%):</label>
        <input
          type="number"
          id="urokovaSazba"
          value={urokovaSazba}
          onChange={(e) => setUrokovaSazba(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="cetnostUroceni" className="block text-sm font-medium text-gray-700">Četnost úročení:</label>
        <select
          id="cetnostUroceni"
          value={cetnostUroceni}
          onChange={(e) => setCetnostUroceni(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="rocne">Ročně</option>
          <option value="pololetne">Pololetně</option>
          <option value="ctvrtletne">Čtvrtletně</option>
          <option value="mesicne">Měsíčně</option>
          <option value="denne">Denně</option>
        </select>
      </div>

       <div className="mb-4">
        <label htmlFor="dobaInvestice" className="block text-sm font-medium text-gray-700">Doba investice (roky):</label>
        <input
          type="number"
          id="dobaInvestice"
          value={dobaInvestice}
          onChange={(e) => setDobaInvestice(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {budouciHodnota !== null && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Budoucí hodnota investice: {budouciHodnota.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default CompoundInterestCalculator;
