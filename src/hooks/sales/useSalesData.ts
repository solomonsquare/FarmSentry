import { useState, useEffect, useCallback } from 'react';
import { Sale, FarmCategory } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { formatErrorMessage } from '../../utils/data';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { SalesService } from '../../services/sales/salesService';

interface SalesFilters {
  searchTerm: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

export function useSalesData(category: FarmCategory) {
  const { currentUser } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SalesFilters>({
    searchTerm: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

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

      const filteredSales = salesHistory
        .filter(sale => {
          if (!filters.searchTerm) return true;
          const searchTerm = filters.searchTerm.toLowerCase();
          return (
            sale.date.toLowerCase().includes(searchTerm) ||
            sale.quantity.toString().includes(searchTerm)
          );
        })
        .sort((a, b) => {
          if (filters.sortBy === 'date') {
            const dateA = new Date(`${a.date} ${a.time}`).getTime();
            const dateB = new Date(`${b.date} ${b.time}`).getTime();
            return filters.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
          }
          const amountA = a.quantity * a.pricePerBird;
          const amountB = b.quantity * b.pricePerBird;
          return filters.sortOrder === 'desc' ? amountB - amountA : amountA - amountB;
        });

      setSales(filteredSales);
    } catch (err) {
      console.error('Error loading sales:', err);
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, category, filters]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.quantity * sale.pricePerBird), 0);
  const totalProfit = sales.reduce((sum, sale) => sum + sale.totalProfit, 0);

  const handleExport = () => {
    const headers = ['Date', 'Time', 'Quantity', 'Price/Unit', 'Total Revenue', 'Total Profit'];
    const csvData = [
      headers,
      ...sales.map(sale => [
        sale.date,
        sale.time,
        sale.quantity,
        sale.pricePerBird,
        sale.quantity * sale.pricePerBird,
        sale.totalProfit
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_history_${category}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    sales,
    loading,
    error,
    filters,
    setFilters,
    handleExport,
    totalRevenue,
    totalProfit,
    refresh: loadSales
  };
}