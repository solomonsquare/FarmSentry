import { useState, useEffect, useCallback } from 'react';
import { CategoryFarmData, FarmCategory, FarmData } from '../types';
import { FarmFactory } from '../services/farmFactory';
import { DatabaseService } from '../services/database';
import { useAuth } from '../contexts/AuthContext';

export function useFarmData(category: FarmCategory) {
  const { currentUser } = useAuth();
  const [data, setData] = useState<FarmData>(() => FarmFactory.createInitialFarmData(category));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const farmData = await DatabaseService.getFarmData(currentUser.uid, category);
      if (farmData) {
        setData(farmData);
      }
    } catch (error) {
      console.error('Error loading farm data:', error);
      setError('Failed to load farm data');
    } finally {
      setLoading(false);
    }
  }, [currentUser, category]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateStock = async (stock: any, expenses?: any) => {
    if (!currentUser) return;

    try {
      const updatedData = {
        ...data,
        stock,
        expenses: expenses ? {
          birds: (data.expenses?.birds || 0) + (expenses.birds || 0),
          medicine: (data.expenses?.medicine || 0) + (expenses.medicine || 0),
          feeds: (data.expenses?.feeds || 0) + (expenses.feeds || 0),
          additionals: (data.expenses?.additionals || 0) + (expenses.additionals || 0),
        } : data.expenses
      };

      await DatabaseService.updateFarmData(currentUser.uid, category, updatedData);
      setData(updatedData);
      await loadData(); // Reload data to get updated stats
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  };

  const updateSales = async (sales: any[], updatedStock: any) => {
    if (!currentUser) return;

    try {
      const updatedData = {
        ...data,
        sales,
        stock: updatedStock,
        lastUpdated: new Date().toISOString(),
      };

      // Update the database with the new sales data
      await DatabaseService.updateFarmData(
        currentUser.uid,
        category,
        updatedData
      );

      // Update the local state
      setData(updatedData);
    } catch (error) {
      console.error('Error updating sales:', error);
      throw error;
    }
  };

  return {
    data,
    loading,
    error,
    updateStock,
    updateSales,
    refresh: loadData
  };
}