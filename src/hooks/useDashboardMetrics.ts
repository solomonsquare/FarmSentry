import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FarmCategory } from '../types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

interface DashboardMetrics {
  totalSold: number;
  totalRevenue: number;
  totalProfit: number;
  lastUpdated?: string;
}

export function useDashboardMetrics(category: FarmCategory) {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSold: 0,
    totalRevenue: 0,
    totalProfit: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const farmRef = doc(db, 'farms', currentUser.uid);
    
    const unsubscribe = onSnapshot(
      farmRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const categoryData = data[category];
          
          if (categoryData) {
            // Calculate metrics from sales data
            const sales = categoryData.sales || [];
            const totalSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);
            const totalRevenue = sales.reduce((sum, sale) => sum + (sale.quantity * sale.pricePerBird), 0);
            const totalProfit = sales.reduce((sum, sale) => sum + sale.totalProfit, 0);

            setMetrics({
              totalSold,
              totalRevenue,
              totalProfit,
              lastUpdated: categoryData.lastUpdated
            });
          }
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching dashboard metrics:', err);
        setError('Failed to load dashboard metrics');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, category]);

  return { 
    metrics, 
    loading, 
    error
  };
}