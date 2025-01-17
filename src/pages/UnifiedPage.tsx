import React from 'react';
import { Stock, Expense, FarmCategory } from '../types';
import { StockSection } from '../components/unified/StockSection';

interface Props {
  stock: Stock;
  expenses: Expense;
  category: FarmCategory;
  onUpdateStock: (stock: Stock, expenses?: Expense) => void;
  onUpdateExpenses: (expenses: Expense) => void;
}

export function UnifiedPage({ stock, expenses, category, onUpdateStock, onUpdateExpenses }: Props) {
  return (
    <div className="space-y-6">
      <StockSection 
        stock={stock} 
        category={category}
        onUpdate={onUpdateStock} 
      />
    </div>
  );
}