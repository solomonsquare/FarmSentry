import React, { useState, useEffect } from 'react';
import { FarmCategory, Stock, StockEntry, Expense } from '../types';
import { StockManager } from '../components/stock/StockManager';
import { useStockData } from '../hooks/useStockData';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';
import { StockService } from '../services/stockService';

interface Props {
  category: FarmCategory;
  stock: Stock;
  onUpdate: (stock: Stock) => void;
}

export function StockPage({ category, stock, onUpdate }: Props) {
  const { currentUser } = useAuth();
  const { stock: currentStock, loading, error } = useStockData(category);
  const [stockHistory, setStockHistory] = useState<StockEntry[]>([]);

  const fetchStockHistory = async () => {
    if (!currentUser) return;

    try {
      const history = await StockService.getStockHistory(currentUser.uid, category);
      console.log('StockPage - Fetched history:', history);
      setStockHistory(history);
    } catch (err) {
      console.error('Failed to fetch stock history:', err);
    }
  };

  useEffect(() => {
    fetchStockHistory();
  }, [currentUser, category]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const farmTypeDisplay = {
    birds: 'Poultry',
    pigs: 'Pig'
  };

  return (
    <div className="space-y-6 text-black dark:text-white">
      <h1 className="text-[3.5rem] font-bold mb-8">
        {farmTypeDisplay[category]} Stock Management
      </h1>
      <StockManager
        category={category}
        stock={stock}
        stockHistory={stockHistory}
        onUpdate={async (updatedStock, expenses) => {
          await onUpdate(updatedStock);
          await fetchStockHistory();
        }}
      />
    </div>
  );
}