import React from 'react';
import { Sale, FarmCategory } from '../../../types';
import { formatNaira } from '../../../utils/currency';

interface Props {
  sales: Sale[];
  category: FarmCategory;
}

export function SalesTable({ sales, category }: Props) {
  const animalType = category === 'birds' ? 'bird' : 'pig';

  if (sales.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No sales records found. Complete a sale to see it here.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price/{animalType}
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Revenue
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Profit
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sales.map((sale) => {
            const uniqueKey = `${sale.id}-${sale.date}-${sale.time}-${sale.quantity}`;
            return (
              <tr key={uniqueKey} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{sale.date}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{sale.time}</td>
                <td className="px-4 py-3 text-sm text-right font-medium">{sale.quantity}</td>
                <td className="px-4 py-3 text-sm text-right">{formatNaira(sale.pricePerBird)}</td>
                <td className="px-4 py-3 text-sm text-right">{formatNaira(sale.quantity * sale.pricePerBird)}</td>
                <td className="px-4 py-3 text-sm text-right">{formatNaira(sale.totalProfit)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan={4} className="px-4 py-3 text-sm font-medium text-gray-900">
              Totals
            </td>
            <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
              {formatNaira(sales.reduce((sum, sale) => sum + (sale.quantity * sale.pricePerBird), 0))}
            </td>
            <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
              {formatNaira(sales.reduce((sum, sale) => sum + sale.totalProfit, 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}