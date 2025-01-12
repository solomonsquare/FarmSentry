import React from 'react';
import { History, Download } from 'lucide-react';
import { SalesSummary } from '../SalesSummary';

interface Props {
  totalRevenue: number;
  totalProfit: number;
  onExport: () => void;
  hasData: boolean;
}

export function SalesHeader({ totalRevenue, totalProfit, onExport, hasData }: Props) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-semibold">Sales History</h2>
        </div>
        {hasData && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>
      <SalesSummary totalRevenue={totalRevenue} totalProfit={totalProfit} />
    </div>
  );
}