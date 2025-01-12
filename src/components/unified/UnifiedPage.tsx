import React from 'react';
import { Stock, Expense, FarmCategory } from '../../types';
import { StockSection } from './StockSection';

interface Props {
  stock: Stock;
  expenses: Expense;
  category: FarmCategory;
  onUpdateStock: (stock: Stock, expenses?: Expense) => void;
  onUpdateExpenses: (expenses: Expense) => void;
}

export function UnifiedPage({ stock, expenses, category, onUpdateStock, onUpdateExpenses }: Props) {
  const animalType = category === 'birds' ? 'Poultry' : 'Pig';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{animalType} Stock Management</h1>
      
      <StockSection 
        stock={stock} 
        category={category}
        onUpdate={onUpdateStock} 
      />
    </div>
  );
}