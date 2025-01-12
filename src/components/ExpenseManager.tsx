import React from 'react';
import { DollarSign } from 'lucide-react';
import { Expense } from '../types';
import { calculateTotalExpenses } from '../utils/calculations';
import { formatNaira, calculatePerBirdCost } from '../utils/currency';

interface Props {
  expenses: Expense;
  onUpdate: (expenses: Expense) => void;
  totalBirds: number;
}

export function ExpenseManager({ expenses, onUpdate, totalBirds }: Props) {
  const handleChange = (field: keyof Expense, value: number) => {
    onUpdate({ ...expenses, [field]: value });
  };

  const totalExpense = calculateTotalExpenses(expenses);
  const perBirdCost = calculatePerBirdCost(totalExpense, totalBirds);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-red-600" />
        <h2 className="text-xl font-semibold">Expense Categories</h2>
      </div>
      <div className="space-y-4">
        {[
          { key: 'birds', label: 'Birds Cost', tooltip: 'Cost of purchasing chicks' },
          { key: 'medicine', label: 'Medicine', tooltip: 'Vaccinations, antibiotics, etc.' },
          { key: 'feeds', label: 'Feeds', tooltip: 'Starter, grower, and finisher feeds' },
          { key: 'additionals', label: 'Additional Costs', tooltip: 'Labor, electricity, misc. expenses' },
        ].map(({ key, label, tooltip }) => {
          const value = expenses[key as keyof Expense];
          const perBird = calculatePerBirdCost(value, totalBirds);
          
          return (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700" title={tooltip}>
                {label}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleChange(key as keyof Expense, Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                min="0"
              />
              <p className="mt-1 text-sm text-gray-500">
                Per bird: {formatNaira(perBird)}
              </p>
            </div>
          );
        })}
        <div className="pt-4 border-t space-y-2">
          <div className="text-lg font-semibold">
            Total Expenses: {formatNaira(totalExpense)}
          </div>
          <div className="text-sm text-gray-600">
            Cost per bird: {formatNaira(perBirdCost)}
          </div>
        </div>
      </div>
    </div>
  );
}