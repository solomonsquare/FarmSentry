import { useState, useEffect } from 'react';
import { Sale, FarmCategory } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { SalesService } from '../services/salesService';

export function useSalesHistory(category: FarmCategory) {
  const { currentUser } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadSales = async () => {
      try {
        setLoading(true);
        setError(null);
        const salesHistory = await SalesService.getSalesHistory(currentUser.uid, category);
        setSales(salesHistory);
      } catch (err) {
        console.error('Error loading sales:', err);
        setError('Failed to load sales history');
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, [currentUser, category]);

  return { sales, loading, error };
}