import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { FarmCategory, StockEntry, Stock, Expense } from '../../types';
import { PaginatedStockHistory } from './PaginatedStockHistory';
import { PoultryStockManager } from '../poultry/PoultryStockManager';
import { PigStockManager } from '../pig/PigStockManager';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface Props {
  category: FarmCategory;
  stock: Stock;
  stockHistory: StockEntry[];
  onUpdate: (stock: Stock, expenses?: Expense) => void;
}

export function StockManager({ category, stock, stockHistory, onUpdate }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Stock Management Section */}
      <Suspense fallback={<LoadingSpinner />}>
        {category === 'birds' ? (
          <PoultryStockManager 
            stock={stock} 
            category={category} 
            onUpdate={onUpdate} 
          />
        ) : (
          <PigStockManager 
            stock={stock} 
            category={category} 
            onUpdate={onUpdate} 
          />
        )}
      </Suspense>

      {/* Stock History Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Suspense fallback={<LoadingSpinner />}>
          <PaginatedStockHistory 
            history={stockHistory} 
            category={category} 
          />
        </Suspense>
      </div>
    </div>
  );
}