import React from 'react';
import { FarmCategory, StockEntry, Stock, Expense } from '../../types';
import { PaginatedStockHistory } from './PaginatedStockHistory';
import { PoultryStockManager } from '../poultry/PoultryStockManager';
import { PigStockManager } from '../pig/PigStockManager';

interface Props {
  category: FarmCategory;
  stock: Stock;
  stockHistory: StockEntry[];
  onUpdate: (stock: Stock, expenses?: Expense) => void;
}

export function StockManager({ category, stock, stockHistory, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      {/* Stock Management Section */}
      {category === 'birds' ? (
        <PoultryStockManager stock={stock} onUpdate={onUpdate} />
      ) : (
        <PigStockManager stock={stock} onUpdate={onUpdate} />
      )}

      {/* Stock History Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <PaginatedStockHistory 
          history={stockHistory} 
          category={category} 
        />
      </div>
    </div>
  );
}