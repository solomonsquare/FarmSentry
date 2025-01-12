import React, { useState } from 'react';
import { Skull } from 'lucide-react';
import { Stock, StockEntry } from '../../../types';
import { formatDateTime } from '../../../utils/date';

interface Props {
  stock: Stock;
  onUpdate: (stock: Stock) => void;
}

export function RecordPigDeaths({ stock, onUpdate }: Props) {
  const [deathCount, setDeathCount] = useState<number>(0);

  const handleRecordDeaths = () => {
    if (deathCount <= 0 || deathCount > stock.currentBirds) return;

    const { date, time } = formatDateTime();
    const newStock = stock.currentBirds - deathCount;
    
    const newEntry: StockEntry = {
      id: Date.now().toString(),
      date,
      time,
      type: 'death',
      quantity: deathCount,
      remainingStock: newStock,
      description: `Recorded ${deathCount} pig deaths`,
      expenses: {
        birds: 0,
        medicine: 0,
        feeds: 0,
        additionals: 0
      }
    };

    onUpdate({
      ...stock,
      currentBirds: newStock,
      history: [...stock.history, newEntry],
      lastUpdated: date
    });

    setDeathCount(0);
  };

  return (
    <div className="pt-4 border-t">
      <label className="block text-sm font-medium text-gray-700">
        Record Deaths
      </label>
      <div className="mt-1 flex gap-2">
        <input
          type="number"
          value={deathCount}
          onChange={(e) => setDeathCount(Number(e.target.value))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          min="0"
          max={stock.currentBirds}
          placeholder="Enter number of deaths"
        />
        <button
          onClick={handleRecordDeaths}
          disabled={deathCount <= 0 || deathCount > stock.currentBirds}
          className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Skull className="w-4 h-4" /> Record
        </button>
      </div>
    </div>
  );
}