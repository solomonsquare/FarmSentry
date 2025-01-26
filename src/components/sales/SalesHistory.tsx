import React, { useState, useEffect } from 'react';
import { History } from 'lucide-react';
import { Sale, FarmCategory } from '../../types';
import { formatNaira } from '../../utils/currency';
import { PaginationContainer } from '../common/PaginationContainer';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  sales: Sale[];
  category: FarmCategory;
}

export function SalesHistory({ sales, category }: Props) {
  const { isDarkMode } = useTheme();
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
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <div className="flex items-center gap-2 mb-4">
        <History className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {animalType} Sales History
        </h2>
      </div>

      <div className="space-y-4">
        {sales.length === 0 ? (
          <p className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No sales recorded yet.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <thead>
                  <tr>
                    <th className={`px-4 py-2 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Date
                    </th>
                    <th className={`px-4 py-2 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Time
                    </th>
                    <th className={`px-4 py-2 text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Quantity
                    </th>
                    <th className={`px-4 py-2 text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Price/{animalTypeLower}
                    </th>
                    <th className={`px-4 py-2 text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total Amount
                    </th>
                    <th className={`px-4 py-2 text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Profit/{animalTypeLower}
                    </th>
                    <th className={`px-4 py-2 text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total Profit
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {paginatedSales.map((sale) => (
                    <tr key={sale.id}>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {sale.date}
                      </td>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {sale.time}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {sale.quantity}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {formatNaira(sale.pricePerBird)}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {formatNaira(sale.totalAmount)}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {formatNaira(sale.profitPerBird)}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {formatNaira(sale.totalProfit)}
                      </td>
                    </tr>
                  ))}
                  <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <td colSpan={4} className={`px-4 py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      Totals
                    </td>
                    <td className={`px-4 py-2 text-sm font-medium text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {formatNaira(totalRevenue)}
                    </td>
                    <td className={`px-4 py-2 text-sm font-medium text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    </td>
                    <td className={`px-4 py-2 text-sm font-medium text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
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