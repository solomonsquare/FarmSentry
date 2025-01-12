import { useState, useEffect, useCallback } from 'react';
import { Sale, FarmCategory } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { SalesService } from '../../services/sales/salesService';
import { formatErrorMessage } from '../../utils/data';

export function useSalesHistory(category: FarmCategory) {
  const { currentUser } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSales = useCallback(async () => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const salesHistory = await SalesService.getSalesHistory(
        currentUser.uid,
        category
      );
      setSales(salesHistory);
    } catch (err) {
      console.error('Error loading sales:', err);
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, category]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  return { 
    sales, 
    loading, 
    error,
    refresh: loadSales 
  };
}