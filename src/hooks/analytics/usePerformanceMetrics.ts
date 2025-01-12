import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PerformanceMetric, FarmCategory } from '../../types';
import { savePerformanceMetric, getPerformanceMetrics } from '../../services/performance/performanceService';

export function usePerformanceMetrics(category: FarmCategory) {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Load initial metrics
  useEffect(() => {
    let mounted = true;

    const loadMetrics = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const result = await getPerformanceMetrics(currentUser.uid, category, currentPage);
        if (mounted) {
          setMetrics(result.metrics);
        }
      } catch (err) {
        console.error('Error loading performance metrics:', err);
        if (mounted) {
          setError('Failed to load performance metrics');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadMetrics();

    return () => {
      mounted = false;
    };
  }, [currentUser, category, currentPage]);

  const addMetric = async (metric: Omit<PerformanceMetric, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    try {
      const newMetric: PerformanceMetric = {
        ...metric,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedMetrics = await savePerformanceMetric(currentUser.uid, newMetric);
      setMetrics(updatedMetrics);
      return updatedMetrics;
    } catch (err) {
      console.error('Error adding performance metric:', err);
      setError('Failed to add performance metric');
      throw err;
    }
  };

  return {
    metrics,
    loading,
    error,
    currentPage,
    setCurrentPage,
    addMetric
  };
} 