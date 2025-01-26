import React from 'react';
import { BadgeDollarSign, TrendingUp } from 'lucide-react';
import { formatNaira } from '../../utils/currency';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  totalRevenue: number;
  totalProfit: number;
}

export function SalesSummary({ totalRevenue, totalProfit }: Props) {
  const { isDarkMode } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
        <div className="flex items-center gap-2 mb-1">
          <BadgeDollarSign className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
            Total Revenue
          </h3>
        </div>
        <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
          {formatNaira(totalRevenue)}
        </p>
      </div>
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            Total Profit
          </h3>
        </div>
        <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
          {formatNaira(totalProfit)}
        </p>
      </div>
    </div>
  );
}