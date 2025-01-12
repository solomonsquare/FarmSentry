import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { WeightRecord } from '../../../types';
import { RecordsPagination } from '../../common/RecordsPagination';
import { formatDate } from '../../../utils/date';
import { PaginationContainer } from '../../common/PaginationContainer';

interface Props {
  weightRecords: WeightRecord[];
  totalBirds: number;
  onUpdate: (records: WeightRecord[]) => void;
}

export function WeightTracker({ weightRecords, totalBirds, onUpdate }: Props) {
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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold">Weight Tracking</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
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
                <td className="px-4 py-2 text-sm text-right">{record.sampleSize}</td>
                <td className="px-4 py-2 text-sm text-right">{record.averageWeight.toFixed(2)} kg</td>
                <td className="px-4 py-2 text-sm text-right">{record.targetWeight.toFixed(2)} kg</td>
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

      {/* Show pagination only if we have more than 5 records */}
      {weightRecords.length > recordsPerPage && (
        <PaginationContainer
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
} 