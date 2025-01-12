import React, { useState } from 'react';
import { FarmCategory, Sale } from '../../types';
import { useSalesData } from '../../hooks/sales/useSalesData';
import { SalesHistoryTable } from './SalesHistoryTable';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { formatNaira } from '../../utils/currency';
import { History, Download, Trash2, TrendingUp, DollarSign } from 'lucide-react';
import { PaginationContainer } from '../common/PaginationContainer';

interface Props {
  category: FarmCategory;
  onUpdateSales: (sales: Sale[]) => Promise<void>;
}

export function SalesHistorySection({ category, onUpdateSales }: Props) {
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
    if (window.confirm('Are you sure you want to clear the sales history? This action cannot be undone.')) {
      await onUpdateSales([]);
      await refresh();
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-500" />
          <h2 className="text-2xl font-semibold">Sales History</h2>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-green-600">
            <DollarSign className="w-4 h-4" />
            <h3 className="text-sm font-medium">Total Revenue</h3>
          </div>
          <p className="text-2xl font-bold text-green-700 mt-1">{formatNaira(totalRevenue)}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600">
            <TrendingUp className="w-4 h-4" />
            <h3 className="text-sm font-medium">Total Profit</h3>
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-1">{formatNaira(totalProfit)}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search sales..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={filters.searchTerm}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as 'date' | 'amount' })}
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          value={filters.sortOrder}
          onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sales History</h3>
        {sales.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="inline-flex items-center gap-2 px-4 py-2 text-red-600 border border-red-100 rounded-lg text-sm font-medium hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
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