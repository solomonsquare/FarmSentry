import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Sale, Stock, FarmCategory } from '../../types';
import { processSaleTransaction } from '../../services/sales/salesProcessor';

export function useSaleProcessor() {
  const { currentUser } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processSale = async (
    category: FarmCategory,
    sale: Sale,
    updatedStock: Stock
  ): Promise<boolean> => {
    if (!currentUser) {
      setError('User not authenticated');
      return false;
    }

    try {
      setProcessing(true);
      setError(null);
      
      await processSaleTransaction(currentUser.uid, category, sale, updatedStock);
      return true;
    } catch (err) {
      console.error('Error processing sale:', err);
      setError('Failed to process sale. Please try again.');
      return false;
    } finally {
      setProcessing(false);
    }
  };

  return {
    processSale,
    processing,
    error,
    clearError: () => setError(null)
  };
}