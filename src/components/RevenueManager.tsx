import React, { useState } from 'react';
import { BadgeDollarSign } from 'lucide-react';
import { Sale, Expense, Stock, FarmCategory } from '../types';
import { SaleEntry } from './sales/SaleEntry';
import { useAuth } from '../contexts/AuthContext';
import { processSaleTransaction } from '../services/salesProcessor';
import { ErrorMessage } from './common/ErrorMessage';

interface Props {
  totalBirds: number;
  stock: Stock;
  category: FarmCategory;
  onSaleComplete: (sale: Sale, updatedStock: Stock) => Promise<void>;
}

export function RevenueManager({ totalBirds, stock, category, onSaleComplete }: Props) {
  const { currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (saleData: Omit<Sale, 'id'>, updatedStock: Stock) => {
    if (!currentUser) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      setProcessing(true);

      const newSale: Sale = {
        ...saleData,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: currentUser.uid,
        category,
        createdAt: new Date()
      };

      // Calculate profit
      const totalAmount = newSale.quantity * newSale.pricePerBird;
      const profitPerBird = newSale.pricePerBird - (newSale.costPerBird || 0);
      const totalProfit = profitPerBird * newSale.quantity;

      // Update the sale object with profit calculations
      const saleWithProfit = {
        ...newSale,
        totalAmount,
        profitPerBird,
        totalProfit
      };

      await onSaleComplete(saleWithProfit, updatedStock);
    } catch (error) {
      console.error('Error processing sale:', error);
      setError('Failed to process sale. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <BadgeDollarSign className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-semibold">New Sale</h2>
      </div>

      {error && <ErrorMessage message={error} />}

      <SaleEntry
        totalBirds={totalBirds}
        stockHistory={stock.history}
        category={category}
        stock={stock}
        onSubmit={handleSubmit}
        processing={processing}
      />
    </div>
  );
}