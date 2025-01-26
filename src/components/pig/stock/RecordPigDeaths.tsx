import React, { useState } from 'react';
import { Skull } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Stock, StockEntry } from '../../../types';
import { formatDateTime } from '../../../utils/date';
import { useTheme } from '../../../contexts/ThemeContext';

interface Props {
  stock: Stock;
  onUpdate: (stock: Stock) => void;
}

export function RecordPigDeaths({ stock, onUpdate }: Props) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
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

  const inputClasses = `block w-full rounded-md shadow-sm ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-red-400 focus:border-red-400' 
      : 'border-gray-300 text-gray-900 focus:ring-red-500 focus:border-red-500'
  }`;

  return (
    <div className="pt-4 border-t">
      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {t('pig.stockManagement.form.recordDeaths')}
      </label>
      <div className="mt-1 flex gap-2">
        <input
          type="number"
          value={deathCount}
          onChange={(e) => setDeathCount(Number(e.target.value))}
          className={inputClasses}
          min="0"
          max={stock.currentBirds}
          placeholder="Enter number of deaths"
        />
        <button
          onClick={handleRecordDeaths}
          disabled={deathCount <= 0 || deathCount > stock.currentBirds}
          className={`flex items-center gap-1 px-4 py-2 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${
            isDarkMode 
              ? 'bg-red-500 hover:bg-red-600 focus:ring-red-400 focus:ring-offset-gray-800' 
              : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
          }`}
        >
          <Skull className="w-4 h-4" /> {t('pig.stockManagement.form.record')}
        </button>
      </div>
    </div>
  );
}