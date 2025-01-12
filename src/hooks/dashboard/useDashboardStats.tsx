import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FarmCategory, StockEntry, Sale } from '../../types';

export function useDashboardStats(category: FarmCategory) {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    currentStock: 0,
    deathCount: 0,
    totalSold: 0,
    totalExpenses: 0,
    totalRevenue: 0,
    profit: 0,
    expenses: {
      birds: 0,
      medicine: 0,
      feeds: 0,
      additionals: 0
    },
    stockHistory: [] as StockEntry[]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const farmRef = doc(db, 'farms', currentUser.uid);
    const salesRef = collection(db, 'sales');
    
    // Match exact structure from Firestore
    const salesQuery = query(
      salesRef,
      where('userId', '==', currentUser.uid),
      where('category', '==', category)
    );

    // Subscribe to farm document for stock and expenses
    const unsubscribeFarm = onSnapshot(farmRef, (docSnapshot) => {
      if (!docSnapshot.exists()) return;

      const data = docSnapshot.data();
      const categoryData = data[category] || {};
      
      const stock = categoryData.stock || { currentBirds: 0, history: [] };
      const expenses = categoryData.expenses || { birds: 0, medicine: 0, feeds: 0, additionals: 0 };

      // Calculate current stock
      const currentStock = stock.history.reduce((total, entry) => {
        if (entry.type === 'initial' || entry.type === 'addition') {
          return total + entry.quantity;
        } else if (entry.type === 'death' || entry.type === 'sale') {
          return total - entry.quantity;
        }
        return total;
      }, 0);

      // Calculate death count
      const deathCount = stock.history.reduce(
        (count, entry) => (entry.type === 'death' ? count + entry.quantity : count),
        0
      );

      // Calculate total expenses
      const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + Number(value), 0);

      // Update farm-related stats
      setStats(prev => ({
        ...prev,
        currentStock,
        deathCount,
        totalExpenses,
        expenses,
        stockHistory: stock.history
      }));
    });

    // Subscribe to sales collection for revenue and profit
    const unsubscribeSales = onSnapshot(salesQuery, (querySnapshot) => {
      try {
        const sales = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log('Raw sales data:', sales);

        // Calculate totals from sales documents
        const salesTotals = sales.reduce((acc, sale) => {
          // Match exact field names from your Firestore screenshot
          const quantity = Number(sale.quantity || 0);
          const totalAmount = Number(sale.totalAmount || 0);
          const totalProfit = Number(sale.totalProfit || 0);

          return {
            totalSold: acc.totalSold + quantity,
            totalRevenue: acc.totalRevenue + totalAmount,
            totalProfit: acc.totalProfit + totalProfit
          };
        }, {
          totalSold: 0,
          totalRevenue: 0,
          totalProfit: 0
        });

        console.log('Calculated sales totals:', salesTotals);

        // Update sales-related stats
        setStats(prev => ({
          ...prev,
          totalSold: salesTotals.totalSold,
          totalRevenue: salesTotals.totalRevenue,
          profit: salesTotals.totalProfit
        }));
      } catch (err) {
        console.error('Error processing sales:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeFarm();
      unsubscribeSales();
    };
  }, [currentUser, category]);

  return { stats, loading, error };
} 