import React from 'react';
import { Users } from 'lucide-react';
import { Stock, Expense } from '../../types';
import { AddPigStock } from './stock/AddPigStock';
import { RecordPigDeaths } from './stock/RecordPigDeaths';

interface Props {
  stock: Stock;
  onUpdate: (stock: Stock, expenses?: Expense) => void;
}

export function PigStockManager({ stock, onUpdate }: Props) {
  const handleStockUpdate = (updatedStock: Stock, expenses?: Expense) => {
    onUpdate(updatedStock, expenses);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Pig Stock Management</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Pigs in Stock
          </label>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {stock.currentBirds.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {stock.lastUpdated || 'Never'}
          </p>
        </div>

        <div className="pt-4 border-t">
          <AddPigStock stock={stock} onUpdate={handleStockUpdate} />
        </div>

        <div className="pt-4 border-t">
          <RecordPigDeaths stock={stock} onUpdate={handleStockUpdate} />
        </div>
      </div>
    </div>
  );
}