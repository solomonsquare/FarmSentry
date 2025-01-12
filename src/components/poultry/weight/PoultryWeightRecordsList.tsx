import React, { useState, useEffect } from 'react';
import { WeightRecord } from '../../../types';
import { RecordsPagination } from '../../common/RecordsPagination';
import { formatDate } from '../../../utils/date';

interface Props {
  records: WeightRecord[];
}

export function PoultryWeightRecordsList({ records }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedRecords, setDisplayedRecords] = useState<WeightRecord[]>([]);
  const recordsPerPage = 5;

  const totalPages = Math.ceil(records.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;

  useEffect(() => {
    setDisplayedRecords(records.slice(startIndex, startIndex + recordsPerPage));
  }, [currentPage, records, startIndex]);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Time</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Sample Size</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Average Weight</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Target Weight</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Below Target</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Above Target</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-4 py-2 text-sm text-gray-900">{formatDate(record.date)}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{record.time ?? '-'}</td>
                <td className="px-4 py-2 text-sm text-right">{record.sampleSize}</td>
                <td className="px-4 py-2 text-sm text-right">
                  {record.weights.average.toFixed(2)} kg
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {record.weights.target.toFixed(2)} kg
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {record.weights.below} ({((record.weights.below / record.sampleSize) * 100).toFixed(1)}%)
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {record.weights.above} ({((record.weights.above / record.sampleSize) * 100).toFixed(1)}%)
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {record.notes || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {records.length > recordsPerPage && (
        <RecordsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
} 