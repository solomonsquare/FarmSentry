import React from 'react';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Stock, Expense } from '../../types';
import { AddPigStock } from './stock/AddPigStock';
import { RecordPigDeaths } from './stock/RecordPigDeaths';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  stock: Stock;
  onUpdate: (stock: Stock, expenses?: Expense) => void;
}

export function PigStockManager({ stock, onUpdate }: Props) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  const handleStockUpdate = (updatedStock: Stock, expenses?: Expense) => {
    onUpdate(updatedStock, expenses);
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Users className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('pig.stockManagement.title')}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('pig.stockManagement.currentStock')}
          </label>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mt-1`}>
            {stock.currentBirds.toLocaleString()}
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('pig.stockManagement.lastUpdated')}: {stock.lastUpdated || t('common.never')}
          </p>
        </div>

        <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <AddPigStock stock={stock} onUpdate={handleStockUpdate} />
        </div>

        <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <RecordPigDeaths stock={stock} onUpdate={handleStockUpdate} />
        </div>
      </div>
    </div>
  );
}