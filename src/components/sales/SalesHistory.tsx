import React, { useState, useEffect } from 'react';
import { History } from 'lucide-react';
import { Sale, FarmCategory } from '../../types';
import { formatNaira } from '../../utils/currency';
import { PaginationContainer } from '../common/PaginationContainer';

interface Props {
  sales: Sale[];
  category: FarmCategory;
}

export function SalesHistory({ sales, category }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedSales, setPaginatedSales] = useState<Sale[]>([]);
  const recordsPerPage = 5;

  const totalPages = Math.ceil(sales.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;

  useEffect(() => {
    // Update paginatedSales whenever currentPage changes
    setPaginatedSales(sales.slice(startIndex, startIndex + recordsPerPage));
  }, [currentPage, sales]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + sale.totalProfit, 0);
  const animalType = category === 'birds' ? 'Poultry' : 'Pig';
  const animalTypeLower = category === 'birds' ? 'bird' : 'pig';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-semibold">{animalType} Sales History</h2>
      </div>

      <div className="space-y-4">
        {sales.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No sales recorded yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Time</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Price/{animalTypeLower}</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Profit/{animalTypeLower}</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Total Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedSales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300">{sale.date}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300">{sale.time}</td>
                      <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-gray-300">{sale.quantity}</td>
                      <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-gray-300">
                        {formatNaira(sale.pricePerBird)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-gray-300">
                        {formatNaira(sale.totalAmount)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-gray-300">
                        {formatNaira(sale.profitPerBird)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-gray-300">
                        {formatNaira(sale.totalProfit)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <td colSpan={4} className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Totals
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-right text-gray-900 dark:text-gray-300">
                      {formatNaira(totalRevenue)}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-right text-gray-900 dark:text-gray-300"></td>
                    <td className="px-4 py-2 text-sm font-medium text-right text-gray-900 dark:text-gray-300">
                      {formatNaira(totalProfit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {sales.length > recordsPerPage && (
              <PaginationContainer
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}