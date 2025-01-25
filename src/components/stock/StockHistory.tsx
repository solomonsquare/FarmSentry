import React from 'react';
import { History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StockEntry, FarmCategory } from '../../types';
import { StockHistoryTable } from './StockHistoryTable';

interface Props {
  history: StockEntry[];
  category: FarmCategory;
}

export function StockHistory({ history, category }: Props) {
  const { t } = useTranslation();
  const farmType = category === 'birds' ? t('farm.poultryFarm') : t('farm.pigFarm');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">{t('stock.history.title', { farm: farmType })}</h2>
      </div>
      
      <div className="space-y-4">
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-4">{t('stock.history.noRecords')}</p>
        ) : (
          <StockHistoryTable history={history} category={category} />
        )}
      </div>
    </div>
  );
}