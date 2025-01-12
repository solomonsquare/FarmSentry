import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StockService } from '../services/StockService';
import { formatErrorMessage } from '../utils/formatErrorMessage';

export function useStockData(category: FarmCategory) {
  const { currentUser } = useAuth();
  const [stock, setStock] = useState<Stock>({
    currentBirds: 0,
    history: [],
    lastUpdated: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStock = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedStock = await StockService.getStock(currentUser.uid, category);
      setStock(fetchedStock);
    } catch (err) {
      console.error('Error loading stock:', err);
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [currentUser, category]);

  useEffect(() => {
    loadStock();
  }, [loadStock]);

  return {
    stock,
    history: stock.history,
    loading,
    error,
    refresh: loadStock
  };
} 