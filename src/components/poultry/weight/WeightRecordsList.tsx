import React, { useState, useEffect } from 'react';
import { WeightRecord } from '../../../types';
import { RecordsPagination } from '../../common/RecordsPagination';

interface WeightRecordsListProps {
  records: WeightRecord[];
}

export function WeightRecordsList({ records }: WeightRecordsListProps) {
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
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Sample Size</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Avg Weight (kg)</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Target (kg)</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Below Target</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Above Target</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-4 py-2 text-sm text-gray-900">{record.date}</td>
                <td className="px-4 py-2 text-sm text-right">{record.sampleSize}</td>
                <td className="px-4 py-2 text-sm text-right">{record.averageWeight.toFixed(3)}</td>
                <td className="px-4 py-2 text-sm text-right">{record.targetWeight.toFixed(3)}</td>
                <td className="px-4 py-2 text-sm text-right">
                  {record.belowTarget} ({((record.belowTarget / record.sampleSize) * 100).toFixed(1)}%)
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {record.aboveTarget} ({((record.aboveTarget / record.sampleSize) * 100).toFixed(1)}%)
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