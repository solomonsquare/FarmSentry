import React from 'react';
import { Stock } from '../../types';

interface Props {
  stock: Stock;
}

export function StockDisplay({ stock }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Current Birds in Stock
      </label>
      <p className="text-2xl font-bold text-gray-900 mt-1">
        {stock.currentBirds.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500">
        Last updated: {stock.lastUpdated || 'Never'}
      </p>
    </div>
  );
}