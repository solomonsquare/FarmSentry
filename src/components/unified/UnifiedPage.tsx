import React from 'react';
import { Stock, Expense, FarmCategory } from '../../types';
import { StockSection } from './StockSection';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';

interface Props {
  stock: Stock;
  expenses: Expense;
  category: FarmCategory;
  onUpdateStock: (stock: Stock, expenses?: Expense) => void;
  onUpdateExpenses: (expenses: Expense) => void;
}

export function UnifiedPage({ stock, expenses, category, onUpdateStock, onUpdateExpenses }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {category === 'birds' ? t('stock.poultryTitle') : t('stock.pigTitle')}
          </h1>
        </div>
      </div>
      
      <StockSection 
        stock={stock} 
        category={category}
        onUpdate={onUpdateStock} 
      />
    </div>
  );
}