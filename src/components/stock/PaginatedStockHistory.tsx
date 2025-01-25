import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FarmCategory, StockEntry } from '../../types';
import { StockHistoryTable } from './StockHistoryTable';
import { PaginationContainer } from '../common/PaginationContainer';
import { useStockData } from '../../hooks/useStockData';

interface Props {
  history: StockEntry[];
  category: FarmCategory;
}

export function PaginatedStockHistory({ history, category }: Props) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const recordsPerPage = 5;
  const { handleExport } = useStockData(category);

  // Reset page when history changes
  useEffect(() => {
    setCurrentPage(1);
  }, [history.length]);

  // Filter history based on search term
  const filteredHistory = history.filter(entry =>
    entry.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort history by date and time in descending order
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare === 0) {
      return b.time.localeCompare(a.time);
    }
    return dateCompare;
  });

  const totalPages = Math.max(1, Math.ceil(sortedHistory.length / recordsPerPage));
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = Math.min(startIndex + recordsPerPage, sortedHistory.length);
  const displayedHistory = sortedHistory.slice(startIndex, endIndex);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {category === 'birds' ? t('stock.poultryHistory') : t('stock.pigHistory')}
        </h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder={t('stock.searchByType')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {history.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              {t('stock.exportCSV')}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg">
        <div className="overflow-x-auto">
          <StockHistoryTable 
            history={displayedHistory} 
            category={category} 
          />
        </div>
        
        {sortedHistory.length > recordsPerPage && (
          <PaginationContainer
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
} 