import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { WeightRecord } from '../../../types/poultry';
import { RecordsPagination } from '../../common/RecordsPagination';
import { formatDate } from '../../../utils/date';
import { PaginationContainer } from '../../common/PaginationContainer';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';

interface Props {
  weightRecords: WeightRecord[];
  totalBirds: number;
  onUpdate: (records: WeightRecord[]) => void;
}

export function WeightTracker({ weightRecords, totalBirds, onUpdate }: Props) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5; // Hard cap at 5 records
  
  // Calculate pagination
  const totalPages = Math.ceil(weightRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = Math.min(startIndex + recordsPerPage, weightRecords.length);
  const displayedRecords = weightRecords.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
      <div className="flex items-center gap-2 mb-6">
        <Scale className="w-5 h-5 text-indigo-400" />
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('analytics.weightTracking.weightRecords')}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className={`px-4 py-2 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('common.date')}
              </th>
              <th className={`px-4 py-2 text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('analytics.weightTracking.sampleSize')}
              </th>
              <th className={`px-4 py-2 text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('analytics.weightTracking.averageWeight')}
              </th>
              <th className={`px-4 py-2 text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('analytics.weightTracking.targetWeight')}
              </th>
              <th className={`px-4 py-2 text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('analytics.weightTracking.belowTarget')}
              </th>
              <th className={`px-4 py-2 text-right text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('analytics.weightTracking.aboveTarget')}
              </th>
              <th className={`px-4 py-2 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('analytics.weightTracking.notes')}
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {displayedRecords.map((record) => (
              <tr key={record.id}>
                <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {formatDate(record.date)}
                </td>
                <td className={`px-4 py-2 text-sm text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {record.sampleSize}
                </td>
                <td className={`px-4 py-2 text-sm text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {record.weights.average.toFixed(2)} kg
                </td>
                <td className={`px-4 py-2 text-sm text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {record.weights.target.toFixed(2)} kg
                </td>
                <td className={`px-4 py-2 text-sm text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {record.weights.below} ({((record.weights.below / record.sampleSize) * 100).toFixed(1)}%)
                </td>
                <td className={`px-4 py-2 text-sm text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {record.weights.above} ({((record.weights.above / record.sampleSize) * 100).toFixed(1)}%)
                </td>
                <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {record.notes || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show pagination only if we have more than 5 records */}
      {weightRecords.length > recordsPerPage && (
        <PaginationContainer
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
} 