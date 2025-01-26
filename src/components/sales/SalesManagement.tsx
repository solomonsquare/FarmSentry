import React from 'react';
import { Trash2 } from 'lucide-react';
import { Sale, FarmCategory } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { SalesService } from '../../services/sales/salesService';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  category: FarmCategory;
  onUpdateSales: (updatedSales: Sale[]) => Promise<void>;
}

export function SalesManagement({ category, onUpdateSales }: Props) {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();

  const handleReset = async () => {
    if (!currentUser) return;
    if (window.confirm('Are you sure you want to clear all sales history? This action cannot be undone.')) {
      try {
        console.log('Clearing sales history...');
        await SalesService.deleteAllSales(currentUser.uid, category);
        await onUpdateSales([]);
        console.log('Sales history cleared');
      } catch (error) {
        console.error('Error clearing sales history:', error);
        alert('Failed to clear sales history. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-between items-center">
      <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        Sales History
      </h2>
      <button
        onClick={handleReset}
        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 
          ${isDarkMode 
            ? 'border-red-600 text-red-400 bg-gray-800 hover:bg-red-900/20 focus:ring-red-500' 
            : 'border border-red-300 text-red-700 bg-white hover:bg-red-50 focus:ring-red-500'
          }`}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Clear History
      </button>
    </div>
  );
} 