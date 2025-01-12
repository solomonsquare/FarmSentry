import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FarmCategory, StockEntry, Sale } from '../../types';

interface DashboardStats {
  currentStock: number;
  deathCount: number;
  totalSold: number;
  totalExpenses: number;
  totalRevenue: number;
  profit: number;
  expenses: {
    birds: number;
    medicine: number;
    feeds: number;
    additionals: number;
  };
  stockHistory: StockEntry[];
}

export function useDashboardStats(category: FarmCategory) {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
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
    stockHistory: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Subscribe to farm document for stock and expenses
    const farmRef = doc(db, 'farms', currentUser.uid);
    const salesRef = collection(db, 'sales');
    
    // Create query for sales
    const salesQuery = query(
      salesRef,
      where('userId', '==', currentUser.uid),
      where('category', '==', category)
    );

    // Set up multiple subscriptions
    const unsubscribeFarm = onSnapshot(farmRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const categoryData = data[category] || {};
        
        const stock = categoryData.stock || { currentBirds: 0, history: [] };
        const expenses = categoryData.expenses || { birds: 0, medicine: 0, feeds: 0, additionals: 0 };

        // Calculate current stock and death count
        const currentStock = stock.history.reduce((total, entry) => {
          if (entry.type === 'initial' || entry.type === 'addition') {
            return total + entry.quantity;
          } else if (entry.type === 'death' || entry.type === 'sale') {
            return total - entry.quantity;
          }
          return total;
        }, 0);

        const deathCount = stock.history.reduce((count, entry) => 
          entry.type === 'death' ? count + entry.quantity : count, 0);

        // Update farm-related stats
        setStats(prev => ({
          ...prev,
          currentStock,
          deathCount,
          totalExpenses: expenses.birds + expenses.medicine + expenses.feeds + expenses.additionals,
          expenses,
          stockHistory: stock.history
        }));
      }
    });

    // Subscribe to sales collection
    const unsubscribeSales = onSnapshot(salesQuery, (querySnapshot) => {
      const salesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Ensure totalAmount is calculated if not present
        const quantity = Number(data.quantity);
        const pricePerBird = Number(data.pricePerBird);
        const totalAmount = data.totalAmount ? Number(data.totalAmount) : quantity * pricePerBird;
        
        return {
          id: doc.id,
          ...data,
          totalAmount, // Ensure totalAmount is included
          createdAt: data.createdAt?.toDate()
        };
      }) as Sale[];

      // Calculate sales totals with explicit number conversions
      const totalSold = salesData.reduce((sum, sale) => sum + Number(sale.quantity), 0);
      const totalRevenue = salesData.reduce((sum, sale) => sum + sale.totalAmount, 0);
      const totalProfit = salesData.reduce((sum, sale) => sum + Number(sale.totalProfit), 0);

      // Update sales-related stats
      setStats(prev => ({
        ...prev,
        totalSold,
        totalRevenue,
        profit: totalProfit
      }));

      setLoading(false);
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeFarm();
      unsubscribeSales();
    };
  }, [currentUser, category]);

  return { stats, loading, error };
} 