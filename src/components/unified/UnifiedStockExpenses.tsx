import React from 'react';
import { Stock, Expense } from '../../types';
import { StockSection } from './StockSection';
import { ExpenseSection } from './ExpenseSection';

interface Props {
  stock: Stock;
  expenses: Expense;
  onUpdateStock: (stock: Stock) => void;
  onUpdateExpenses: (expenses: Expense) => void;
}

export function UnifiedStockExpenses({ stock, expenses, onUpdateStock, onUpdateExpenses }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockSection stock={stock} onUpdate={onUpdateStock} />
        <ExpenseSection 
          expenses={expenses} 
          onUpdate={onUpdateExpenses}
          totalBirds={stock.currentBirds}
        />
      </div>
    </div>
  );
}