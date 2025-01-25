import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stock, FarmCategory } from '../../types';

interface Props {
  stock: Stock;
  category: FarmCategory;
}

export function StockDisplay({ stock, category }: Props) {
  const { t } = useTranslation();
  const animal = category === 'birds' ? t('farm.birds') : t('farm.pigs');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('stock.currentStock', { animal })}
      </label>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
        {stock.currentBirds.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t('stock.lastUpdated')}: {stock.lastUpdated || t('common.never')}
      </p>
    </div>
  );
}