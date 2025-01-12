import React from 'react';
import { BadgeDollarSign, TrendingUp } from 'lucide-react';
import { formatNaira } from '../../utils/currency';

interface Props {
  totalRevenue: number;
  totalProfit: number;
}

export function SalesSummary({ totalRevenue, totalProfit }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <BadgeDollarSign className="w-5 h-5 text-green-600" />
          <h3 className="text-sm font-medium text-green-700">Total Revenue</h3>
        </div>
        <p className="text-2xl font-bold text-green-700">{formatNaira(totalRevenue)}</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-medium text-blue-700">Total Profit</h3>
        </div>
        <p className="text-2xl font-bold text-blue-700">{formatNaira(totalProfit)}</p>
      </div>
    </div>
  );
}