import React from 'react';
import { History } from 'lucide-react';
import { Expense } from '../../types';
import { calculateTotalExpenses } from '../../utils/calculations';
import { formatNaira, calculatePerBirdCost } from '../../utils/currency';
import { EXPENSE_CATEGORIES } from '../../constants/expenses';

interface Props {
  expenses: Expense;
  totalBirds: number;
}

export function ExpenseHistory({ expenses, totalBirds }: Props) {
  const totalExpense = calculateTotalExpenses(expenses);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-red-600" />
        <h2 className="text-xl font-semibold">Expense Summary</h2>
      </div>

      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Amount</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Cost/Bird</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {EXPENSE_CATEGORIES.map(({ key, label }) => (
                <tr key={key}>
                  <td className="px-4 py-2 text-sm text-gray-900">{label}</td>
                  <td className="px-4 py-2 text-sm text-right">
                    {formatNaira(expenses[key as keyof Expense])}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    {formatNaira(calculatePerBirdCost(expenses[key as keyof Expense], totalBirds))}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="px-4 py-2 text-sm font-medium text-gray-900">Total Expenses</td>
                <td className="px-4 py-2 text-sm text-right font-bold text-red-600">
                  {formatNaira(totalExpense)}
                </td>
                <td className="px-4 py-2 text-sm text-right font-bold text-red-600">
                  {formatNaira(calculatePerBirdCost(totalExpense, totalBirds))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}