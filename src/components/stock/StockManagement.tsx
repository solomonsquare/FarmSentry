import React, { useState, useEffect } from 'react';
import { FarmCategory, Stock, StockEntry } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { StockService } from '../../services/stockService';
import { StockHistoryTable } from './StockHistoryTable';
import { RecordsPagination } from '../common/RecordsPagination';

interface Props {
  category: FarmCategory;
  stock: Stock;
  onUpdate: (stock: Stock) => void;
}

export function StockManagement({ category, stock, onUpdate }: Props) {
  const { currentUser } = useAuth();
  const [stockHistory, setStockHistory] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    const fetchStockHistory = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const history = await StockService.getStockHistory(currentUser.uid, category);
        setStockHistory(history);
      } catch (err) {
        setError('Failed to fetch stock history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockHistory();
  }, [currentUser, category]);

  // Calculate pagination based on stockHistory
  const totalPages = Math.ceil(stockHistory.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = Math.min(startIndex + recordsPerPage, stockHistory.length);
  const displayedHistory = stockHistory.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* ... other parts of the component ... */}

      {/* Stock History */}
      {!loading && !error && (
        <>
          <StockHistoryTable history={displayedHistory} category={category} />
          {stockHistory.length > recordsPerPage && (
            <div className="mt-4">
              <RecordsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
} 