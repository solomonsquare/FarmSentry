import React, { useState, useEffect } from 'react';
import { Sale, FarmCategory } from '../../types';
import { formatDate } from '../../utils/date';
import { formatNaira } from '../../utils/currency';
import { RecordsPagination } from '../common/RecordsPagination';

interface Props {
  sales: Sale[];
  category: FarmCategory;
}

export function SalesHistoryTable({ sales, category }: Props) {
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

  const animalType = category === 'birds' ? 'BIRD' : 'PIG';

  const getPricePerUnit = (sale: Sale) => {
    if (category === 'birds') return sale.pricePerBird;
    return sale.pricePerPig || sale.pricePerBird;
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">DATE</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">TIME</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-400">QUANTITY</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-400">PRICE/{animalType}</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-400">TOTAL REVENUE</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-400">TOTAL PROFIT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedSales.map((sale) => (
              <tr key={sale.id}>
                <td className="px-4 py-2 text-sm text-gray-900">{sale.date}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{sale.time}</td>
                <td className="px-4 py-2 text-sm text-right">{sale.quantity}</td>
                <td className="px-4 py-2 text-sm text-right">
                  {formatNaira(getPricePerUnit(sale))}
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {formatNaira(sale.quantity * getPricePerUnit(sale))}
                </td>
                <td className="px-4 py-2 text-sm text-right">{formatNaira(sale.totalProfit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sales.length > recordsPerPage && (
        <RecordsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}