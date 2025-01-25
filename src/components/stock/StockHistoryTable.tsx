import React from 'react';
import { useTranslation } from 'react-i18next';
import { StockEntry, FarmCategory } from '../../types';
import { formatDate } from '../../utils/date';
import { getStockEntryTypeStyle } from '../../utils/styles';
import { formatNaira } from '../../utils/currency';

interface Props {
  history: StockEntry[];
  category: FarmCategory;
}

export function StockHistoryTable({ history, category }: Props) {
  const { t } = useTranslation();
  const farmType = category === 'birds' ? t('farm.poultryFarm') : t('farm.pigFarm');

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">{t('common.date')}</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">{t('common.time')}</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">{t('stock.table.type')}</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">{t('common.quantity')}</th>
            {category === 'pigs' && (
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">{t('stock.table.breed')}</th>
            )}
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
              {t('stock.table.costs', { farm: farmType })}
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">{t('stock.table.medicine')}</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">{t('stock.table.feed')}</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">{t('stock.table.additional')}</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">{t('stock.table.total')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {history.map((entry) => (
            <tr key={entry.id} className="text-gray-900 dark:text-gray-100">
              <td className="px-4 py-2 text-sm">{entry.date}</td>
              <td className="px-4 py-2 text-sm">{entry.time}</td>
              <td className="px-4 py-2 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockEntryTypeStyle(entry.type)}`}>
                  {t(`stock.entryTypes.${entry.type}`, { farm: farmType })}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-right">
                {entry.type === 'sale' || entry.type === 'death' ? `-${entry.quantity}` : entry.quantity}
              </td>
              {category === 'pigs' && (
                <td className="px-4 py-2 text-sm">{entry.breed?.name || '-'}</td>
              )}
              <td className="px-4 py-2 text-sm text-right">
                {entry.expenses?.birds ? formatNaira(entry.expenses.birds) : '-'}
              </td>
              <td className="px-4 py-2 text-sm text-right">
                {entry.expenses?.medicine ? formatNaira(entry.expenses.medicine) : '-'}
              </td>
              <td className="px-4 py-2 text-sm text-right">
                {entry.expenses?.feeds ? formatNaira(entry.expenses.feeds) : '-'}
              </td>
              <td className="px-4 py-2 text-sm text-right">
                {entry.expenses?.additionals ? formatNaira(entry.expenses.additionals) : '-'}
              </td>
              <td className="px-4 py-2 text-sm text-right">
                {entry.expenses ? formatNaira(
                  Object.values(entry.expenses).reduce((sum, value) => sum + (value || 0), 0)
                ) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}