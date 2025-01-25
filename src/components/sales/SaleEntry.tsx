import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sale, Stock, StockEntry, FarmCategory } from '../../types';
import { formatNaira } from '../../utils/currency';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  totalBirds: number;
  stockHistory: StockEntry[];
  category: FarmCategory;
  stock: Stock;
  onSubmit: (sale: Omit<Sale, 'id'>, updatedStock: Stock) => Promise<void>;
  processing: boolean;
}

export function SaleEntry({ totalBirds, stockHistory, category, stock, onSubmit, processing }: Props) {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [quantity, setQuantity] = useState<number>(0);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);

  const animalType = category === 'birds' ? t('farm.birds') : t('farm.pigs');
  const costPerUnit = stockHistory.length > 0 
    ? stockHistory[stockHistory.length - 1].expenses?.birds || 0 
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || quantity <= 0 || pricePerUnit <= 0) return;

    const updatedStock = {
      ...stock,
      currentBirds: stock.currentBirds - quantity,
      history: [
        ...stock.history,
        {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
          type: 'sale' as const,
          quantity,
          remainingStock: stock.currentBirds - quantity,
          description: t('stock.actions.addedDescription', { quantity })
        }
      ]
    };

    const sale: Omit<Sale, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      quantity,
      pricePerBird: pricePerUnit,
      costPerBird: costPerUnit,
      totalAmount: quantity * pricePerUnit,
      profitPerBird: pricePerUnit - costPerUnit,
      totalProfit: quantity * (pricePerUnit - costPerUnit),
      category,
      userId: currentUser.uid,
      createdAt: new Date()
    };

    await onSubmit(sale, updatedStock);
    setQuantity(0);
    setPricePerUnit(0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('sales.newSale.quantity', { animal: animalType })}
        </label>
        <input
          type="number"
          min="1"
          max={totalBirds}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('sales.newSale.pricePerUnit', { unit: animalType })}
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={pricePerUnit}
          onChange={(e) => setPricePerUnit(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

      <div className="space-y-2 text-sm">
        <p className="text-gray-600">
          {t('sales.newSale.costPerUnit', { unit: animalType })}: {formatNaira(costPerUnit)}
        </p>
        <p className="text-gray-600">
          {t('sales.newSale.subtotal')}: {formatNaira(quantity * pricePerUnit)}
        </p>
        <p className="text-gray-600">
          {t('sales.newSale.profitPerUnit', { unit: animalType })}: {formatNaira(pricePerUnit - costPerUnit)}
        </p>
        <p className="text-gray-600">
          {t('sales.newSale.totalProfit')}: {formatNaira(quantity * (pricePerUnit - costPerUnit))}
        </p>
      </div>

      <button
        type="submit"
        disabled={processing || quantity <= 0 || pricePerUnit <= 0}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        {processing ? t('common.loading') : t('sales.newSale.complete')}
      </button>
    </form>
  );
}