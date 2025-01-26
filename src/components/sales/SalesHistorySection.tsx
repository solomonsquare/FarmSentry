import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FarmCategory, Sale } from '../../types';
import { useSalesData } from '../../hooks/sales/useSalesData';
import { SalesHistoryTable } from './SalesHistoryTable';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { formatNaira } from '../../utils/currency';
import { History, Download, Trash2, TrendingUp, DollarSign } from 'lucide-react';
import { PaginationContainer } from '../common/PaginationContainer';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  category: FarmCategory;
  onUpdateSales: (sales: Sale[]) => Promise<void>;
}

export function SalesHistorySection({ category, onUpdateSales }: Props) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { 
    sales, 
    loading, 
    error,
    totalRevenue,
    totalProfit,
    filters,
    setFilters,
    handleExport,
    refresh 
  } = useSalesData(category);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(sales.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = Math.min(startIndex + recordsPerPage, sales.length);
  const paginatedSales = sales.slice(startIndex, endIndex);

  const handleClearHistory = async () => {
    if (window.confirm(t('sales.history.clearConfirm'))) {
      await onUpdateSales([]);
      await refresh();
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const inputClasses = `px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-green-400 focus:border-green-400' 
      : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500'
  }`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {t('sales.history.title')}
          </h2>
        </div>
        <button
          onClick={handleExport}
          className={`inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors
            ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
        >
          <Download className="w-4 h-4" />
          {t('sales.history.export')}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
            <DollarSign className="w-4 h-4" />
            <h3 className="text-sm font-medium">{t('sales.summary.revenue')}</h3>
          </div>
          <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
            {formatNaira(totalRevenue)}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            <TrendingUp className="w-4 h-4" />
            <h3 className="text-sm font-medium">{t('sales.summary.profit')}</h3>
          </div>
          <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            {formatNaira(totalProfit)}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder={t('sales.history.search')}
          className={`flex-1 border ${inputClasses}`}
          value={filters.searchTerm}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        />
        <select
          className={`border ${inputClasses}`}
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as 'date' | 'amount' })}
        >
          <option value="date">{t('sales.history.sort.byDate')}</option>
          <option value="amount">{t('sales.history.sort.byAmount')}</option>
        </select>
        <select
          className={`border ${inputClasses}`}
          value={filters.sortOrder}
          onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}
        >
          <option value="desc">{t('sales.history.sort.newest')}</option>
          <option value="asc">{t('sales.history.sort.oldest')}</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('sales.history.title')}
        </h3>
        {sales.length > 0 && (
          <button
            onClick={handleClearHistory}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
              ${isDarkMode 
                ? 'text-red-400 border-red-600 hover:bg-red-900/20' 
                : 'text-red-600 border border-red-100 hover:bg-red-50'}`}
          >
            <Trash2 className="w-4 h-4" />
            {t('sales.history.clear')}
          </button>
        )}
      </div>

      <SalesHistoryTable sales={paginatedSales} category={category} />

      {sales.length > recordsPerPage && (
        <PaginationContainer
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}