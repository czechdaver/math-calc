// src/components/calculators/YJeXKolikJeStoCalculator.tsx
import React, { useState } from 'react';

const YJeXKolikJeStoCalculator: React.FC = () => {
  const [y, setY] = useState('');
  const [x, setX] = useState('');
  const [vysledek, setVysledek] = useState<number | null>(null);

  const handleCalculate = () => {
    const numY = parseFloat(y);
    const numX = parseFloat(x);

    if (!isNaN(numY) && !isNaN(numX) && numX !== 0) {
      setVysledek((numY / numX) * 100);
    } else {
      setVysledek(null);
    }
  };

  React.useEffect(() => {
    handleCalculate();
  }, [y, x]);

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Y je X%, kolik je 100%?</h2>
      <div className="mb-4">
        <label htmlFor="y" className="block text-sm font-medium text-gray-700">Y</label>
        <input
          type="number"
          id="y"
          value={y}
          onChange={(e) => setY(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="x" className="block text-sm font-medium text-gray-700">X (%)</label>
        <input
          type="number"
          id="x"
          value={x}
          onChange={(e) => setX(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {vysledek !== null && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Výsledek (100%): {vysledek}
        </div>
      )}
    </div>
  );
};

export default YJeXKolikJeStoCalculator;
