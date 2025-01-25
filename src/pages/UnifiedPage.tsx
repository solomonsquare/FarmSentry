import React from 'react';
import { Stock, Expense, FarmCategory } from '../types';
import { StockSection } from '../components/unified/StockSection';
import { useTranslation } from 'react-i18next';

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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {category === 'birds' ? t('stock.poultryTitle') : t('stock.pigTitle')}
      </h1>
      <StockSection 
        stock={stock} 
        category={category}
        onUpdate={onUpdateStock} 
      />
    </div>
  );
}