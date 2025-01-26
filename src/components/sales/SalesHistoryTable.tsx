import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sale, FarmCategory } from '../../types';
import { formatDate } from '../../utils/date';
import { formatNaira } from '../../utils/currency';
import { RecordsPagination } from '../common/RecordsPagination';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  sales: Sale[];
  category: FarmCategory;
}

export function SalesHistoryTable({ sales, category }: Props) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedSales, setDisplayedSales] = useState<Sale[]>([]);
  const recordsPerPage = 5;

  const totalPages = Math.ceil(sales.length / recordsPerPage);

  useEffect(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, sales.length);
    setDisplayedSales(sales.slice(startIndex, endIndex));
  }, [currentPage, sales]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const animalType = category === 'birds' ? t('farm.birds') : t('farm.pigs');

  if (sales.length === 0) {
    return (
      <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {t('sales.history.noRecords')}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'} rounded-lg`}>
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('common.date')}
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('common.time')}
              </th>
              <th className={`px-4 py-3 text-right text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('common.quantity')}
              </th>
              <th className={`px-4 py-3 text-right text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('sales.history.table.pricePerUnit', { unit: animalType })}
              </th>
              <th className={`px-4 py-3 text-right text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('sales.summary.revenue')}
              </th>
              <th className={`px-4 py-3 text-right text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('sales.summary.profit')}
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {displayedSales.map((sale) => (
              <tr key={sale.id} className={isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                <td className={`px-4 py-3 text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {formatDate(sale.date)}
                </td>
                <td className={`px-4 py-3 text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {sale.time}
                </td>
                <td className={`px-4 py-3 text-sm text-right whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {sale.quantity}
                </td>
                <td className={`px-4 py-3 text-sm text-right whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {formatNaira(sale.pricePerBird)}
                </td>
                <td className={`px-4 py-3 text-sm text-right whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {formatNaira(sale.totalAmount)}
                </td>
                <td className={`px-4 py-3 text-sm text-right whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {formatNaira(sale.totalProfit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sales.length > recordsPerPage && (
        <div className="mt-4">
          <RecordsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}