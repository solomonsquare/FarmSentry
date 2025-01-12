import React from 'react';
import { Users } from 'lucide-react';
import { Stock } from '../types';
import { StockDisplay } from './stock/StockDisplay';
import { StockActions } from './stock/StockActions';
import { StockHistory } from './stock/StockHistory';

interface Props {
  stock: Stock;
  onUpdate: (stock: Stock) => void;
}

export function StockManager({ stock, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Poultry Stock Management</h2>
        </div>
        
        <div className="space-y-4">
          <StockDisplay stock={stock} />
          <StockActions stock={stock} onUpdate={onUpdate} />
        </div>
      </div>

      <StockHistory history={stock.history} />
    </div>
  );
}