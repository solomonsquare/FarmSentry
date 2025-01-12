import React, { useState } from 'react';
import { Sale, Stock, FarmCategory } from '../../types';
import { formatNaira } from '../../utils/currency';
import { calculateProfitPerBird } from '../../utils/calculations';
import { formatDateTime } from '../../utils/date';

interface Props {
  totalBirds: number;
  stockHistory: any[];
  category: FarmCategory;
  stock: Stock;
  onSubmit: (sale: Omit<Sale, 'id'>, updatedStock: Stock) => Promise<void>;
  processing?: boolean;
}

export function SaleEntry({ totalBirds, stockHistory, category, stock, onSubmit, processing = false }: Props) {
  const [quantity, setQuantity] = useState<number>(0);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const animalType = category === 'birds' ? 'bird' : 'pig';
  const animalTypePlural = category === 'birds' ? 'birds' : 'pigs';

  const handleSubmit = async () => {
    try {
      if (quantity <= 0 || pricePerUnit <= 0) {
        throw new Error(`Please enter valid quantity and price per ${animalType}`);
      }

      if (quantity > totalBirds) {
        throw new Error(`Not enough ${animalTypePlural} in stock for this sale!`);
      }

      setError(null);
      const { date, time } = formatDateTime();
      
      // Get the last stock entry with expenses to calculate cost per bird
      const lastStockEntry = [...stockHistory]
        .reverse()
        .find(entry => 
          (entry.type === 'initial' || entry.type === 'addition') && 
          entry.expenses
        );

      // Calculate cost per bird from the last batch
      const costPerBird = lastStockEntry?.expenses
        ? Object.values(lastStockEntry.expenses).reduce((sum, value) => sum + value, 0) / lastStockEntry.quantity
        : 0;

      // Calculate profits
      const profitPerBird = pricePerUnit - costPerBird;
      const totalAmount = quantity * pricePerUnit;
      const totalProfit = quantity * profitPerBird; // This will now be less than total revenue
      
      const saleEntry: Omit<Sale, 'id'> = {
        quantity,
        pricePerBird: pricePerUnit,
        costPerBird,
        date,
        time,
        profitPerBird,
        totalProfit,
        totalAmount,
        category
      };

      const newStockCount = stock.currentBirds - quantity;
      const stockEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date,
        time,
        type: 'sale' as const,
        quantity: Number(quantity),
        remainingStock: newStockCount,
        description: `Sold ${quantity} ${animalTypePlural}`,
        pricePerUnit: Number(pricePerUnit),
        costPerUnit: Number(costPerBird),
        totalAmount: Number(quantity * pricePerUnit)
      };

      const updatedStock: Stock = {
        ...stock,
        currentBirds: newStockCount,
        history: [...stock.history, stockEntry],
        lastUpdated: date
      };

      await onSubmit(saleEntry, updatedStock);

      // Reset form
      setQuantity(0);
      setPricePerUnit(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process sale');
    }
  };

  // Calculate display values
  const subtotal = quantity * pricePerUnit;
  
  // Get cost per unit for display
  const lastStockEntry = [...stockHistory]
    .reverse()
    .find(entry => 
      (entry.type === 'initial' || entry.type === 'addition') && 
      entry.expenses
    );
    
  const costPerUnit = lastStockEntry?.expenses 
    ? Object.values(lastStockEntry.expenses).reduce((sum, value) => sum + value, 0) / lastStockEntry.quantity
    : 0;

  // Calculate profit values for display
  const profitPerUnit = pricePerUnit - costPerUnit;
  const totalProfitForSale = quantity * profitPerUnit;

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Number of {animalTypePlural} to Sell
        </label>
        <input
          type="number"
          value={quantity || ''}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          min="0"
          max={totalBirds}
          disabled={processing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Price per {animalType} (₦)
        </label>
        <input
          type="number"
          value={pricePerUnit || ''}
          onChange={(e) => setPricePerUnit(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          min="0"
          disabled={processing}
        />
      </div>

      <div className="space-y-1 pt-2">
        <div className="text-sm text-gray-600">
          Cost per {animalType}: {formatNaira(costPerUnit)}
        </div>
        <div className="text-sm text-gray-600">
          Subtotal: {formatNaira(subtotal)}
        </div>
        <div className="text-sm text-gray-600">
          Profit per {animalType}: {formatNaira(profitPerUnit)}
        </div>
        <div className="text-sm font-medium text-gray-700">
          Total Profit: {formatNaira(totalProfitForSale)}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={quantity <= 0 || pricePerUnit <= 0 || quantity > totalBirds || processing}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : 'Complete Sale'}
      </button>
    </div>
  );
}