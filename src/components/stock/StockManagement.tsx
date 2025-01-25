import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FarmCategory, Stock, StockEntry } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { StockService } from '../../services/stockService';
import { StockHistoryTable } from './StockHistoryTable';
import { RecordsPagination } from '../common/RecordsPagination';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

interface Props {
  category: FarmCategory;
  stock: Stock;
  onUpdate: (stock: Stock) => void;
}

export function StockManagement({ category, stock, onUpdate }: Props) {
  const { t } = useTranslation();
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
        setError(t('stock.errors.fetchHistoryFailed'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockHistory();
  }, [currentUser, category, t]);

  // Calculate pagination based on stockHistory
  const totalPages = Math.ceil(stockHistory.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = Math.min(startIndex + recordsPerPage, stockHistory.length);
  const displayedHistory = stockHistory.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('stock.overview')}
        </h2>
        
        {/* Stock History */}
        {stockHistory.length > 0 ? (
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
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            {t('stock.noHistoryRecorded')}
          </p>
        )}
      </div>
    </div>
  );
} 