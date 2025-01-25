import React, { useState, useEffect } from 'react';
import { WeightRecord } from '../../../types/poultry';
import { RecordsPagination } from '../../common/RecordsPagination';
import { useTranslation } from 'react-i18next';

interface WeightRecordsListProps {
  records: WeightRecord[];
}

export function WeightRecordsList({ records }: WeightRecordsListProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedRecords, setPaginatedRecords] = useState<WeightRecord[]>([]);
  const recordsPerPage = 5;

  const totalPages = Math.ceil(records.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;

  useEffect(() => {
    // Update paginatedRecords whenever currentPage changes
    setPaginatedRecords(records.slice(startIndex, startIndex + recordsPerPage));
  }, [currentPage, records]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">{t('common.date')}</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">{t('analytics.weightTracking.sampleSize')}</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">{t('analytics.weightTracking.averageWeight')}</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">{t('analytics.weightTracking.targetWeight')}</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">{t('analytics.weightTracking.belowTarget')}</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">{t('analytics.weightTracking.aboveTarget')}</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">{t('analytics.weightTracking.notes')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-4 py-2 text-sm text-gray-900">{record.date}</td>
                <td className="px-4 py-2 text-sm text-right">{record.sampleSize}</td>
                <td className="px-4 py-2 text-sm text-right">{record.weights.average.toFixed(3)}</td>
                <td className="px-4 py-2 text-sm text-right">{record.weights.target.toFixed(3)}</td>
                <td className="px-4 py-2 text-sm text-right">
                  {record.weights.below} ({((record.weights.below / record.sampleSize) * 100).toFixed(1)}%)
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {record.weights.above} ({((record.weights.above / record.sampleSize) * 100).toFixed(1)}%)
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">{record.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {records.length > recordsPerPage && (
        <RecordsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}