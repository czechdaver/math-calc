// src/components/calculators/NeprimaUmeraCalculator.tsx
import React, { useState } from 'react';

const NeprimaUmeraCalculator: React.FC = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [vysledek, setVysledek] = useState<number | null>(null);

  const handleCalculate = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (!isNaN(numA) && !isNaN(numB) && !isNaN(numC) && numC !== 0) {
      setVysledek((numA * numB) / numC);
    } else {
      setVysledek(null);
    }
  };

  React.useEffect(() => {
    handleCalculate();
  }, [a, b, c]);

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Výpočet nepřímé úměry</h2>
      <p className="mb-4">Zadajte hodnoty pro a, b, c v rovnici a*b = c*x:</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="a" className="block text-sm font-medium text-gray-700">a</label>
          <input
            type="number"
            id="a"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="b" className="block text-sm font-medium text-gray-700">b</label>
          <input
            type="number"
            id="b"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="c" className="block text-sm font-medium text-gray-700">c</label>
          <input
            type="number"
            id="c"
            value={c}
            onChange={(e) => setC(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>

      {vysledek !== null && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Výsledek (x): {vysledek}
        </div>
      )}
    </div>
  );
};

export default NeprimaUmeraCalculator;
