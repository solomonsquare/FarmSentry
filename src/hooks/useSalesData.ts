import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sale, FarmCategory } from '../types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useSalesData(category: FarmCategory) {
  const { currentUser } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    sortBy: 'date' as const,
    sortOrder: 'desc' as const
  });

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const farmRef = doc(db, 'farms', currentUser.uid);
    
    // Set up real-time listener for sales data
    const unsubscribe = onSnapshot(
      farmRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const salesData = data[category]?.sales || [];
          setSales(salesData.sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`).getTime();
            const dateB = new Date(`${b.date} ${b.time}`).getTime();
            return dateB - dateA; // Sort by most recent first
          }));
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching sales:', err);
        setError('Failed to load sales data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, category]);

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
    handleExport
  };
}