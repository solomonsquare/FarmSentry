import React from 'react';
import { Stock, FarmCategory } from '../../types';
import { formatNaira } from '../../utils/currency';

interface Props {
  stock: Stock;
  searchTerm: string;
  category: FarmCategory;
}

export function UnifiedHistory({ stock, searchTerm, category }: Props) {
  const animalType = category === 'birds' ? 'Birds' : 'Pigs';
  const animalTypeSingular = category === 'birds' ? 'bird' : 'pig';

  const filteredHistory = stock.history.filter(entry =>
    entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Time</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Quantity</th>
            {category === 'pigs' && (
              <>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Breed</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Weight (kg)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Purpose</th>
              </>
            )}
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">{animalType} Cost</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Medicine</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Feeds</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Additional</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Cost/{animalTypeSingular}</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Total Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredHistory.map((entry) => {
            const totalCost = entry.expenses
              ? Object.values(entry.expenses).reduce((sum, cost) => sum + cost, 0)
              : 0;
            const costPerAnimal = entry.quantity > 0 ? totalCost / entry.quantity : 0;

            return (
              <tr key={entry.id}>
                <td className="px-4 py-2 text-sm text-gray-900">{entry.date}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{entry.time}</td>
                <td className="px-4 py-2 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    entry.type === 'initial' || entry.type === 'addition'
                      ? 'bg-green-100 text-green-800'
                      : entry.type === 'death'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {entry.type === 'death' ? `-${entry.quantity}` : entry.quantity}
                </td>
                {category === 'pigs' && (
                  <>
                    <td className="px-4 py-2 text-sm text-gray-900">{entry.breed?.name || '-'}</td>
                    <td className="px-4 py-2 text-sm text-right">{entry.currentWeight || '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {entry.purpose ? entry.purpose.charAt(0).toUpperCase() + entry.purpose.slice(1) : '-'}
                    </td>
                  </>
                )}
                <td className="px-4 py-2 text-sm text-right">
                  {entry.expenses ? formatNaira(entry.expenses.birds) : '-'}
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {entry.expenses ? formatNaira(entry.expenses.medicine) : '-'}
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {entry.expenses ? formatNaira(entry.expenses.feeds) : '-'}
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {entry.expenses ? formatNaira(entry.expenses.additionals) : '-'}
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {entry.expenses ? formatNaira(costPerAnimal) : '-'}
                </td>
                <td className="px-4 py-2 text-sm text-right font-medium">
                  {entry.expenses ? formatNaira(totalCost) : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}