import React from 'react';
import { Expense } from '../types';
import { ExpenseManager } from '../components/ExpenseManager';
import { ExpenseHistory } from '../components/expenses/ExpenseHistory';

interface Props {
  expenses: Expense;
  totalBirds: number;
  onUpdate: (expenses: Expense) => void;
}

export function ExpensesPage({ expenses, totalBirds, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
      <ExpenseManager expenses={expenses} onUpdate={onUpdate} totalBirds={totalBirds} />
      <ExpenseHistory expenses={expenses} totalBirds={totalBirds} />
    </div>
  );
}