import React from 'react';
import { Stock, Expense, FarmCategory } from '../../types';
import { StockManager } from '../stock/StockManager';

interface Props {
  stock: Stock;
  category: FarmCategory;
  onUpdate: (stock: Stock, expenses?: Expense) => void;
}

export function StockSection({ stock, category, onUpdate }: Props) {
  return (
    <StockManager 
      stock={stock}
      category={category}
      stockHistory={stock.history}
      onUpdate={onUpdate}
    />
  );
}