import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import { FeedConversionRecord } from '../../../types/pig';
import { formatDate } from '../../../utils/date';
import { PaginationContainer } from '../../common/PaginationContainer';
import { Plus } from 'lucide-react';
import { FeedConversionForm } from './FeedConversionForm';

interface Props {
  feedConversion: FeedConversionRecord[];
  currentPage: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onUpdate: (records: FeedConversionRecord[]) => void;
}

export function FeedConversionAnalytics({ 
  feedConversion, 
  currentPage, 
  recordsPerPage,
  onPageChange, 
  onUpdate 
}: Props) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [showForm, setShowForm] = useState(false);

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = feedConversion.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('analytics.feedConversion.title')}
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          {t('analytics.feedConversion.form.addRecord')}
        </button>
      </div>

      {showForm && (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <FeedConversionForm
            records={feedConversion}
            onSubmit={(updatedRecords) => {
              onUpdate(updatedRecords);
              setShowForm(false);
            }}
          />
        </div>
      )}

      <div className={`overflow-x-auto rounded-lg border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('analytics.feedConversion.table.dateRange')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('analytics.feedConversion.table.phase')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('analytics.feedConversion.table.initialWeight')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('analytics.feedConversion.table.finalWeight')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('analytics.feedConversion.table.feedConsumed')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('analytics.feedConversion.table.fcr')}
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {currentRecords.map((record) => (
              <tr 
                key={record.id}
                className={isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}
              >
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {formatDate(record.startDate)} - {formatDate(record.endDate)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {t(`analytics.feedConversion.phases.${record.phase.toLowerCase()}`)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {record.initialWeight} kg
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {record.finalWeight} kg
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {record.feedConsumed} kg
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {record.fcr.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {feedConversion.length > recordsPerPage && (
        <PaginationContainer
          currentPage={currentPage}
          totalPages={Math.ceil(feedConversion.length / recordsPerPage)}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
} 