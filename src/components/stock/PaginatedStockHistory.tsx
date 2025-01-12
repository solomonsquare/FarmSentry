import React, { useState, useEffect } from 'react';
import { FarmCategory, StockEntry } from '../../types';
import { StockHistoryTable } from './StockHistoryTable';
import { PaginationContainer } from '../common/PaginationContainer';

interface Props {
  history: StockEntry[];
  category: FarmCategory;
}

export function PaginatedStockHistory({ history, category }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const recordsPerPage = 5;

  // Reset page when history changes
  useEffect(() => {
    setCurrentPage(1);
  }, [history.length]);

  // Filter history based on search term
  const filteredHistory = history.filter(entry =>
    entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <h2 className="text-xl font-semibold">
          {category === 'birds' ? 'Poultry' : 'Pig'} Stock History
        </h2>
        <input
          type="text"
          placeholder="Search history..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg">
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