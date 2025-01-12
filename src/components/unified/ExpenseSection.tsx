import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { Expense, FarmCategory } from '../../types';
import { formatNaira } from '../../utils/currency';

interface Props {
  expenses: Expense;
  totalBirds: number;
  category: FarmCategory;
  onUpdate: (expenses: Expense) => void;
}

export function ExpenseSection({ expenses, totalBirds, category, onUpdate }: Props) {
  const [newExpenses, setNewExpenses] = useState<Expense>({
    birds: 0,
    medicine: 0,
    feeds: 0,
    additionals: 0,
  });

  const animalType = category === 'birds' ? 'Birds' : 'Pigs';
  const animalTypeSingular = category === 'birds' ? 'bird' : 'pig';

  const handleInputChange = (category: keyof Expense, value: number) => {
    setNewExpenses(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = () => {
    const hasValues = Object.values(newExpenses).some(value => value > 0);
    if (!hasValues) {
      alert('Please enter at least one expense value');
      return;
    }

    onUpdate({
      birds: expenses.birds + newExpenses.birds,
      medicine: expenses.medicine + newExpenses.medicine,
      feeds: expenses.feeds + newExpenses.feeds,
      additionals: expenses.additionals + newExpenses.additionals,
    });

    // Clear form
    setNewExpenses({
      birds: 0,
      medicine: 0,
      feeds: 0,
      additionals: 0,
    });
  };

  const expenseCategories = [
    { key: 'birds', label: `${animalType} Cost`, tooltip: `Cost of purchasing ${animalType.toLowerCase()}` },
    { key: 'medicine', label: 'Medicine', tooltip: 'Vaccinations, antibiotics, etc.' },
    { key: 'feeds', label: 'Feeds', tooltip: 'Feed costs' },
    { key: 'additionals', label: 'Additional Costs', tooltip: 'Labor, electricity, misc. expenses' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-red-600" />
        <h2 className="text-xl font-semibold">Expenses</h2>
      </div>

      <div className="space-y-4">
        {expenseCategories.map(({ key, label, tooltip }) => {
          const currentValue = expenses[key as keyof Expense];
          const newValue = newExpenses[key as keyof Expense];
          const perAnimal = totalBirds > 0 ? currentValue / totalBirds : 0;
          
          return (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" title={tooltip}>
                {label} (₦)
              </label>
              <input
                type="number"
                value={newValue || ''}
                onChange={(e) => handleInputChange(key as keyof Expense, Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                min="0"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Current total: {formatNaira(currentValue)}</span>
                <span>Cost per {animalTypeSingular}: {formatNaira(perAnimal)}</span>
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t space-y-4">
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Submit All Expenses
          </button>

          <div className="text-lg font-semibold">
            Total Expenses: {formatNaira(Object.values(expenses).reduce((a, b) => a + b, 0))}
          </div>
          <div className="text-sm text-gray-600">
            Total cost per {animalTypeSingular}: {formatNaira(totalBirds > 0 ? Object.values(expenses).reduce((a, b) => a + b, 0) / totalBirds : 0)}
          </div>
        </div>
      </div>
    </div>
  );
}