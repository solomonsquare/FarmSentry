import React, { useState } from 'react';
import { Plus, Skull } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Stock, Expense, StockEntry, FarmCategory } from '../../types';
import { formatDateTime } from '../../utils/date';

interface Props {
  stock: Stock;
  onUpdate: (stock: Stock, newExpenses?: Expense) => void;
  category: FarmCategory;
}

export function StockActions({ stock, onUpdate, category }: Props) {
  const { t } = useTranslation();
  const [addQuantity, setAddQuantity] = useState<number>(0);
  const [deathCount, setDeathCount] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense>({
    birds: 0,
    medicine: 0,
    feeds: 0,
    additionals: 0
  });

  const farmType = category === 'birds' ? t('farm.poultryFarm') : t('farm.pigFarm');

  const handleAddStock = () => {
    if (addQuantity <= 0) return;

    const { date, time } = formatDateTime();
    const newStock = stock.currentBirds + addQuantity;
    
    const newEntry: StockEntry = {
      id: Date.now().toString(),
      date,
      time,
      type: stock.history.length === 0 ? 'initial' as const : 'addition' as const,
      quantity: addQuantity,
      remainingStock: newStock,
      description: t('stock.actions.addedDescription', { quantity: addQuantity, farm: farmType }),
      expenses
    };

    onUpdate({
      currentBirds: newStock,
      history: [...stock.history, newEntry],
      lastUpdated: date
    }, expenses);

    // Reset form
    setAddQuantity(0);
    setExpenses({
      birds: 0,
      medicine: 0,
      feeds: 0,
      additionals: 0
    });
  };

  const handleRecordDeaths = () => {
    if (deathCount <= 0 || deathCount > stock.currentBirds) return;

    const { date, time } = formatDateTime();
    const newStock = stock.currentBirds - deathCount;
    
    const newEntry: StockEntry = {
      id: Date.now().toString(),
      date,
      time,
      type: 'death' as const,
      quantity: deathCount,
      remainingStock: newStock,
      description: t('stock.actions.deathDescription', { quantity: deathCount, farm: farmType })
    };

    onUpdate({
      currentBirds: newStock,
      history: [...stock.history, newEntry],
      lastUpdated: date
    });

    setDeathCount(0);
  };

  return (
    <div className="space-y-4">
      <div className="pt-4 border-t space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('stock.actions.addNewStock', { farm: farmType })}
          </label>
          <input
            type="number"
            value={addQuantity}
            onChange={(e) => setAddQuantity(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            min="0"
            placeholder={t('stock.actions.enterQuantity')}
          />
        </div>

        {addQuantity > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">{t('stock.actions.stockExpenses')}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('stock.table.costs')}</label>
              <input
                type="number"
                value={expenses.birds || ''}
                onChange={(e) => setExpenses(prev => ({
                  ...prev,
                  birds: Number(e.target.value)
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                placeholder={t('stock.actions.enterCost')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('stock.table.medicine')}</label>
              <input
                type="number"
                value={expenses.medicine || ''}
                onChange={(e) => setExpenses(prev => ({
                  ...prev,
                  medicine: Number(e.target.value)
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                placeholder={t('stock.actions.enterMedicineCost')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('stock.table.feed')}</label>
              <input
                type="number"
                value={expenses.feeds || ''}
                onChange={(e) => setExpenses(prev => ({
                  ...prev,
                  feeds: Number(e.target.value)
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                placeholder={t('stock.actions.enterFeedCost')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('stock.table.additional')}</label>
              <input
                type="number"
                value={expenses.additionals || ''}
                onChange={(e) => setExpenses(prev => ({
                  ...prev,
                  additionals: Number(e.target.value)
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                placeholder={t('stock.actions.enterAdditionalCosts')}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleAddStock}
          disabled={addQuantity <= 0}
          className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" /> {t('stock.actions.addStockWithExpenses')}
        </button>
      </div>

      <div className="pt-4 border-t">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('stock.actions.recordDeaths')}
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            value={deathCount}
            onChange={(e) => setDeathCount(Number(e.target.value))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            min="0"
            max={stock.currentBirds}
            placeholder={t('stock.actions.enterDeathCount')}
          />
          <button
            onClick={handleRecordDeaths}
            disabled={deathCount <= 0 || deathCount > stock.currentBirds}
            className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Skull className="w-4 h-4" /> {t('stock.actions.record')}
          </button>
        </div>
      </div>
    </div>
  );
}