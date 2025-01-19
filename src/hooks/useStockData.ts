import { useState, useEffect, useCallback } from 'react';
import { FarmCategory, Stock, StockEntry } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { StockService } from '../services/stockService';
import { exportToCSV } from '../utils/export';

export function useStockData(category: FarmCategory) {
  const { currentUser } = useAuth();
  const [stock, setStock] = useState<Stock | null>(null);
  const [stockHistory, setStockHistory] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStock = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      const history = await StockService.getStockHistory(currentUser.uid, category);
      setStockHistory(history);
      setStock(history[0]?.stock || null);
    } catch (err) {
      setError('Failed to fetch stock data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, category]);

  useEffect(() => {
    loadStock();
  }, [loadStock]);

  const handleExport = () => {
    const animalType = category === 'birds' ? 'Birds' : 'Pigs';
    const headers = [
      'Date',
      'Time',
      'Type',
      'Quantity',
      ...(category === 'pigs' ? ['Breed'] : []),
      `${animalType} Cost`,
      'Medicine',
      'Feeds',
      'Additional',
      'Total Cost'
    ];

    const data = stockHistory.map(entry => {
      const totalCost = entry.expenses
        ? Object.values(entry.expenses).reduce((sum: number, value) => sum + (value || 0), 0)
        : 0;

      const baseRow = [
        entry.date,
        entry.time,
        entry.type.charAt(0).toUpperCase() + entry.type.slice(1),
        entry.type === 'sale' || entry.type === 'death' ? `-${entry.quantity}` : entry.quantity,
        ...(category === 'pigs' ? [entry.breed?.name || '-'] : []),
        entry.expenses?.birds || '-',
        entry.expenses?.medicine || '-',
        entry.expenses?.feeds || '-',
        entry.expenses?.additionals || '-',
        totalCost || '-'
      ];

      return baseRow;
    });

    exportToCSV(headers, data, `stock_history_${category}`);
  };

  return {
    stock,
    stockHistory,
    loading,
    error,
    handleExport,
    refresh: loadStock
  };
} 