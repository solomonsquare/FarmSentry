import React from 'react';
import { Stock, Expense, FarmCategory } from '../../types';
import { StockDisplay } from '../stock/StockDisplay';
import { StockActions } from '../stock/StockActions';

interface Props {
  stock: Stock;
  category: FarmCategory;
  onUpdate: (stock: Stock, expenses?: Expense) => void;
}

export function PoultryStockManager({ stock, category, onUpdate }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <StockDisplay stock={stock} category={category} />
        <StockActions stock={stock} onUpdate={onUpdate} />
      </div>
    </div>
  );
}