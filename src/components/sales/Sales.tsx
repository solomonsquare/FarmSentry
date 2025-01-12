import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FarmCategory, Sale } from '../../types';
import { SalesService } from '../../services/salesService';
import { SalesHistoryTable } from './SalesHistoryTable';

interface Props {
  category: FarmCategory;
}

export function Sales({ category }: Props) {
  const { currentUser } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const salesData = await SalesService.getSalesHistory(currentUser.uid, category);
        setSales(salesData);
      } catch (err) {
        setError('Failed to fetch sales data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [currentUser, category]);

  return (
    <div>
      {/* ... other parts of the component ... */}
      
      {/* Sales History */}
      {!loading && !error && (
        <SalesHistoryTable sales={sales} category={category} />
      )}
    </div>
  );
} 