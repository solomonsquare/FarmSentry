import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FarmCategory } from '../types';
import { getDashboardStats } from '../services/sales/salesQueries';

export function useDashboardStats(category: FarmCategory) {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalSold: 0,
    totalRevenue: 0,
    totalProfit: 0,
    lastSaleDate: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const dashboardStats = await getDashboardStats(currentUser.uid, category);
      setStats(dashboardStats);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, [currentUser, category]);

  // Load stats on mount and when category changes
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refresh: loadStats
  };
}