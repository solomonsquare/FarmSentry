import React from 'react';
import { History } from 'lucide-react';
import { StockEntry } from '../../types';
import { StockHistoryTable } from './StockHistoryTable';

interface Props {
  history: StockEntry[];
}

export function StockHistory({ history }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Stock History</h2>
      </div>
      
      <div className="space-y-4">
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No stock changes recorded yet.</p>
        ) : (
          <StockHistoryTable history={history} />
        )}
      </div>
    </div>
  );
}