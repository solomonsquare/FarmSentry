import React from 'react';
import { Users } from 'lucide-react';
import { Stock, FarmCategory } from '../types';
import { StockDisplay } from './stock/StockDisplay';
import { StockActions } from './stock/StockActions';
import { StockHistory } from './stock/StockHistory';
import { useTranslation } from 'react-i18next';

interface Props {
  stock: Stock;
  onUpdate: (stock: Stock) => void;
  category: FarmCategory;
}

export function StockManager({ stock, onUpdate, category }: Props) {
  const { t } = useTranslation();
  const farmType = category === 'birds' ? t('farm.poultryFarm') : t('farm.pigFarm');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">{t('stock.title', { farm: farmType })}</h2>
        </div>
        
        <div className="space-y-4">
          <StockDisplay stock={stock} category={category} />
          <StockActions stock={stock} onUpdate={onUpdate} category={category} />
        </div>
      </div>

      <StockHistory history={stock.history} category={category} />
    </div>
  );
}