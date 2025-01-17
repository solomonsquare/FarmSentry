import React from 'react';
import { Sale, Stock, FarmCategory } from '../types';
import { RevenueManager } from '../components/RevenueManager';
import { SalesHistorySection } from '../components/sales/SalesHistorySection';
import { useSalesData } from '../hooks/sales/useSalesData';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';
import { processSaleTransaction } from '../services/sales/salesProcessor';

interface Props {
  totalBirds: number;
  stock: Stock;
  category: FarmCategory;
  onUpdateStock: (updatedStock: Stock) => Promise<void>;
}

export function SalesPage({ totalBirds, stock, category, onUpdateStock }: Props) {
  const { currentUser } = useAuth();
  const { 
    sales, 
    loading, 
    error,
    totalRevenue,
    totalProfit,
    refresh
  } = useSalesData(category);

  const handleSaleComplete = async (sale: Sale, updatedStock: Stock) => {
    if (!currentUser) return;
    
    try {
      await processSaleTransaction(currentUser.uid, category, sale, updatedStock);
      await onUpdateStock(updatedStock);
      await refresh();
    } catch (error) {
      console.error('Error completing sale:', error);
    }
  };

  const handleSalesReset = async (updatedSales: Sale[]) => {
    if (!currentUser) return;
    try {
      await refresh();
    } catch (error) {
      console.error('Error resetting sales:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {category === 'birds' ? 'Poultry' : 'Pig'} Sales Management
      </h1>
      
      <RevenueManager
        totalBirds={totalBirds}
        stock={stock}
        category={category}
        onSaleComplete={handleSaleComplete}
      />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <SalesHistorySection 
          category={category} 
          onUpdateSales={handleSalesReset}
        />
      </div>
    </div>
  );
}