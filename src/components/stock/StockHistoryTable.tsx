import React from 'react';
import { StockEntry, FarmCategory } from '../../types';
import { formatDate } from '../../utils/date';
import { getStockEntryTypeStyle } from '../../utils/styles';
import { formatNaira } from '../../utils/currency';

interface Props {
  history: StockEntry[];
  category: FarmCategory;
}

export function StockHistoryTable({ history, category }: Props) {
  console.log('StockHistoryTable - Received history:', history); // Debug log
  
  const animalType = category === 'birds' ? 'Birds' : 'Pigs';

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Time</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Quantity</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">{animalType} Cost</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Medicine</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Feeds</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Additional</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Total Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {history.map((entry) => (
            <tr key={entry.id}>
              <td className="px-4 py-2 text-sm text-gray-900">{entry.date}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{entry.time}</td>
              <td className="px-4 py-2 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockEntryTypeStyle(entry.type)}`}>
                  {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-right">
                {entry.type === 'sale' || entry.type === 'death' ? `-${entry.quantity}` : entry.quantity}
              </td>
              <td className="px-4 py-2 text-sm text-right">
                {entry.expenses?.birds ? formatNaira(entry.expenses.birds) : '-'}
              </td>
              <td className="px-4 py-2 text-sm text-right">
                {entry.expenses?.medicine ? formatNaira(entry.expenses.medicine) : '-'}
              </td>
              <td className="px-4 py-2 text-sm text-right">
                {entry.expenses?.feeds ? formatNaira(entry.expenses.feeds) : '-'}
              </td>
              <td className="px-4 py-2 text-sm text-right">
                {entry.expenses?.additionals ? formatNaira(entry.expenses.additionals) : '-'}
              </td>
              <td className="px-4 py-2 text-sm text-right">
                {entry.expenses ? formatNaira(
                  Object.values(entry.expenses).reduce((sum, value) => sum + (value || 0), 0)
                ) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}